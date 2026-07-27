function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  for (const cookie of cookieHeader.split(';')) {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) list[name] = decodeURIComponent(parts.join('='));
  }
  return list;
}

function clearGithubCookie() {
  return 'github_oauth_token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0';
}

function githubCookie(token) {
  return `github_oauth_token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=2592000`;
}

function githubRedirectUri(request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}/auth/callback`;
}

function html(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

async function githubFetch(path, token) {
  return fetch(`https://api.github.com${path}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'user-agent': 'Sukunsh-Portfolio-App',
    },
  });
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const token = cookies.github_oauth_token;

  if (url.pathname === '/api/github/config') {
    return json({
      configured: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
      authenticated: Boolean(token),
      clientId: env.GITHUB_CLIENT_ID || null,
    });
  }

  if (url.pathname === '/api/auth/github/url') {
    if (!env.GITHUB_CLIENT_ID) {
      return json({error: 'GITHUB_CLIENT_ID is not configured in environment variables.'}, {status: 400});
    }

    const githubUrl = new URL('https://github.com/login/oauth/authorize');
    githubUrl.search = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: githubRedirectUri(request),
      scope: 'repo,read:user',
      response_type: 'code',
    }).toString();

    return json({url: githubUrl.toString()});
  }

  if (url.pathname === '/api/auth/github/logout' && request.method === 'POST') {
    return json({success: true}, {headers: {'set-cookie': clearGithubCookie()}});
  }

  if (!token) {
    return json({error: 'Unauthorized. Please connect your GitHub account.'}, {status: 401});
  }

  if (url.pathname === '/api/github/profile') {
    const response = await githubFetch('/user', token);
    if (response.status === 401) {
      return json({error: 'Session expired. Token cleared.'}, {status: 401, headers: {'set-cookie': clearGithubCookie()}});
    }
    if (!response.ok) return json({error: `GitHub API error: ${await response.text()}`}, {status: response.status});
    return json(await response.json());
  }

  if (url.pathname === '/api/github/repos') {
    const response = await githubFetch('/user/repos?sort=updated&per_page=50&direction=desc', token);
    if (!response.ok) return json({error: `GitHub API error: ${await response.text()}`}, {status: response.status});
    return json(await response.json());
  }

  const commitMatch = url.pathname.match(/^\/api\/github\/repos\/([^/]+)\/([^/]+)\/commits$/);
  if (commitMatch) {
    const [, owner, repo] = commitMatch.map(decodeURIComponent);
    const response = await githubFetch(`/repos/${owner}/${repo}/commits?per_page=10`, token);
    if (!response.ok) return json({error: `GitHub API error: ${await response.text()}`}, {status: response.status});
    return json(await response.json());
  }

  const languageMatch = url.pathname.match(/^\/api\/github\/repos\/([^/]+)\/([^/]+)\/languages$/);
  if (languageMatch) {
    const [, owner, repo] = languageMatch.map(decodeURIComponent);
    const response = await githubFetch(`/repos/${owner}/${repo}/languages`, token);
    if (!response.ok) return json({error: 'Failed to fetch repository languages.'}, {status: response.status});
    return json(await response.json());
  }

  return json({error: 'Not found'}, {status: 404});
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return html('<script>window.opener?.postMessage({ type: "OAUTH_AUTH_ERROR", error: "No code provided from GitHub" }, "*"); window.close();</script><p>Authentication failed: No authorization code received.</p>');
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return html('<p>Authentication failed: Server GITHUB credentials are not configured.</p>');
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: githubRedirectUri(request),
    }),
  });

  const data = await response.json();
  if (!data.access_token) {
    const error = data.error_description || 'Failed token exchange';
    return html(`<script>window.opener?.postMessage({ type: "OAUTH_AUTH_ERROR", error: ${JSON.stringify(error)} }, "*"); window.close();</script><p>Auth failed: ${error}</p>`);
  }

  return html('<script>window.opener?.postMessage({ type: "OAUTH_AUTH_SUCCESS" }, "*"); window.close();</script><p>Authentication successful. You can close this window now.</p>', {
    headers: {'set-cookie': githubCookie(data.access_token)},
  });
}

async function serveAsset(request, env) {
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) return response;

  const url = new URL(request.url);
  if (request.method === 'GET' && !url.pathname.startsWith('/assets/')) {
    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
  }

  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return handleApi(request, env);
    if (url.pathname === '/auth/callback' || url.pathname === '/auth/callback/') return handleCallback(request, env);
    return serveAsset(request, env);
  },
};
