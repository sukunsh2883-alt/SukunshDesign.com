import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { buildPortfolioTsContent } from "./server/portfolioSync";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Endpoint to permanently save Creator Studio data to src/portfolioData.ts and git
app.post("/api/portfolio/save", async (req, res) => {
  try {
    const body = req.body || {};
    const aiFilms = body.films || body.aiFilms || [];
    const designProjects = body.designs || body.designProjects || [];
    const videos = body.videos || [];
    const explorations = body.explorations || [];
    const profile = body.profile || {};
    const journalPosts = body.journalPosts;
    const education = body.education;
    const experience = body.experience;
    const skills = body.skills;
    const software = body.software;
    const RESUME_CATEGORIES = body.RESUME_CATEGORIES;

    const fileContent = buildPortfolioTsContent({
      aiFilms,
      designProjects,
      videos,
      explorations,
      journalPosts,
      education,
      experience,
      skills,
      software,
      RESUME_CATEGORIES,
      profile
    });

    const portfolioPath = path.join(process.cwd(), "src", "portfolioData.ts");
    const jsonPath = path.join(process.cwd(), "src", "portfolioData.json");

    fs.writeFileSync(portfolioPath, fileContent, "utf-8");
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          savedAt: new Date().toISOString(),
          aiFilms,
          designProjects,
          videos,
          explorations,
          profile,
          aiArchiveImages: body.aiArchiveImages || []
        },
        null,
        2
      ),
      "utf-8"
    );

    console.log(
      `[PortfolioSync] Permanently saved to ${portfolioPath}: ${designProjects.length} designs, ${aiFilms.length} films, ${videos.length} videos.`
    );

    res.json({
      success: true,
      message: "Projects saved directly to src/portfolioData.ts. Ready for GitHub push!",
      stats: {
        designsCount: designProjects.length,
        filmsCount: aiFilms.length,
        videosCount: videos.length,
        explorationsCount: explorations.length
      }
    });
  } catch (error: any) {
    console.error("[PortfolioSync] Error saving portfolio data:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to save portfolio data to disk." });
  }
});

// Endpoint to retrieve saved portfolio json if present
app.get("/api/portfolio/data", (req, res) => {
  try {
    const jsonPath = path.join(process.cwd(), "src", "portfolioData.json");
    if (fs.existsSync(jsonPath)) {
      const content = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      return res.json({ success: true, exists: true, data: content });
    }
    res.json({ success: true, exists: false });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lightweight cookie parsing helper
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.join("="));
    }
  });
  return list;
}

// GitHub API status and config endpoint
app.get("/api/github/config", (req, res) => {
  const hasClientId = !!process.env.GITHUB_CLIENT_ID;
  const hasClientSecret = !!process.env.GITHUB_CLIENT_SECRET;
  
  // Parse cookies to check if we are authenticated
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["github_oauth_token"];
  
  res.json({
    configured: true,
    hasOAuth: hasClientId && hasClientSecret,
    authenticated: !!token,
    clientId: process.env.GITHUB_CLIENT_ID || null,
    defaultUser: "surajsharma"
  });
});

// GET Github Auth URL
app.get("/api/auth/github/url", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(400).json({ error: "GITHUB_CLIENT_ID is not configured in environment variables." });
  }

  // Construct callback URL dynamically using origin or request host to match context
  const host = req.headers.host || "ais-dev-b4zfs4435g3gge6l5tcgbv-515409363062.asia-east1.run.app";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const redirectUri = `${protocol}://${host}/auth/callback`;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?` + new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,read:user",
    response_type: "code"
  }).toString();

  res.json({ url: githubAuthUrl });
});

// Github Auth Callback Redirect Handler
app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: "OAUTH_AUTH_ERROR", error: "No code provided from GitHub" }, "*");
              window.close();
            } else {
              window.location.href = "/";
            }
          </script>
          <p>Authentication failed: No authorization code received.</p>
        </body>
      </html>
    `);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.send(`
      <html>
        <body>
          <p>Authentication failed: Server GITHUB credentials are not configured.</p>
        </body>
      </html>
    `);
  }

  try {
    const host = req.headers.host || "ais-dev-b4zfs4435g3gge6l5tcgbv-515409363062.asia-east1.run.app";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const redirectUri = `${protocol}://${host}/auth/callback`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json() as { access_token?: string; error?: string; error_description?: string };

    if (!tokenData.access_token) {
      console.error("GitHub access token exchange error:", tokenData);
      return res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: "OAUTH_AUTH_ERROR", error: "${tokenData.error_description || "Failed token exchange"}" }, "*");
                window.close();
              }
            </script>
            <p>Auth failed: ${tokenData.error_description || "Failed to exchange code"}</p>
          </body>
        </html>
      `);
    }

    // Set secure sameSite Cookie for iframe support
    // sameSite: "none" + secure: true is absolutely required inside AI Studio's preview iframe
    res.setHeader(
      "Set-Cookie",
      `github_oauth_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=2592000`
    );

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS" }, "*");
              window.close();
            } else {
              window.location.href = "/";
            }
          </script>
          <p>Authentication successful. You can close this window now.</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("Error exchanging code for access token:", error);
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: "OAUTH_AUTH_ERROR", error: "Internal server error during exchange" }, "*");
              window.close();
            }
          </script>
          <p>Internal error during GitHub exchange.</p>
        </body>
      </html>
    `);
  }
});

// Proxy route to fetch github user profile
app.get("/api/github/profile", async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["github_oauth_token"];
  const targetUser = req.query.username || "surajsharma";

  try {
    const url = token ? "https://api.github.com/user" : `https://api.github.com/users/${encodeURIComponent(String(targetUser))}`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Suraj-Portfolio-App"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const userRes = await fetch(url, { headers });

    if (!userRes.ok) {
      if (token && userRes.status === 401) {
        // Clear stale token and retry public
        res.setHeader("Set-Cookie", "github_oauth_token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0");
        const retryRes = await fetch(`https://api.github.com/users/${encodeURIComponent(String(targetUser))}`, {
          headers: { Accept: "application/vnd.github+json", "User-Agent": "Suraj-Portfolio-App" }
        });
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          return res.json(retryData);
        }
      }
      const errText = await userRes.text();
      return res.status(userRes.status).json({ error: `GitHub API error: ${errText}` });
    }

    const userData = await userRes.json();
    res.json(userData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch GitHub profile." });
  }
});

// Proxy route to fetch repositories
app.get("/api/github/repos", async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["github_oauth_token"];
  const targetUser = req.query.username || "surajsharma";

  try {
    const url = token 
      ? "https://api.github.com/user/repos?sort=updated&per_page=50&direction=desc" 
      : `https://api.github.com/users/${encodeURIComponent(String(targetUser))}/repos?sort=updated&per_page=50&direction=desc`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Suraj-Portfolio-App"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const reposRes = await fetch(url, { headers });

    if (!reposRes.ok) {
      const errText = await reposRes.text();
      return res.status(reposRes.status).json({ error: `GitHub API error: ${errText}` });
    }

    const reposData = await reposRes.json();
    res.json(reposData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch repositories." });
  }
});

// Proxy route to fetch repository commits
app.get("/api/github/repos/:owner/:repo/commits", async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["github_oauth_token"];
  const { owner, repo } = req.params;

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Suraj-Portfolio-App"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const commitsRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=10`, {
      headers
    });

    if (!commitsRes.ok) {
      const errText = await commitsRes.text();
      return res.status(commitsRes.status).json({ error: `GitHub API error: ${errText}` });
    }

    const commitsData = await commitsRes.json();
    res.json(commitsData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch commits." });
  }
});

// Proxy route to fetch repository languages breakdown
app.get("/api/github/repos/:owner/:repo/languages", async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["github_oauth_token"];
  const { owner, repo } = req.params;

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "Suraj-Portfolio-App"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const langRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`, {
      headers
    });

    if (!langRes.ok) {
      return res.status(langRes.status).json({ error: "Failed to fetch repository languages." });
    }

    const langData = await langRes.json();
    res.json(langData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch languages." });
  }
});

// Proxy route to logout / clear cookie
app.post("/api/auth/github/logout", (req, res) => {
  res.setHeader("Set-Cookie", "github_oauth_token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0");
  res.json({ success: true });
});

// Export app instance for serverless setups (like Vercel)
export default app;

// Start listening and load Vite ONLY if we are not in a serverless environment like Vercel
if (!process.env.VERCEL) {
  async function startServer() {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        configLoader: "runner",
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*all", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  startServer();
}
