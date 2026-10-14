import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Copy, Check, ArrowUp, Send } from "lucide-react";
import { lineReveal, drawLine } from "../motion";

interface LetsTalkProps {
  profile?: any;
}

export default function LetsTalk({ profile }: LetsTalkProps) {
  const email = profile?.email || "sukunsh2883@gmail.com";
  const location = profile?.location || "Delhi, India";
  const linkedin = profile?.linkedin || "https://www.linkedin.com/in/sukunsh";
  const behance = profile?.behance || "https://www.behance.net/sukunshsharma";
  const instagram = profile?.instagram || "https://www.instagram.com/sukunsh_";
  const github = profile?.github || "https://github.com/surajsharma";

  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<{
    name: string;
    email: string;
    message: string;
    _gotcha: string;
  }>({
    name: "",
    email: "",
    message: "",
    _gotcha: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const footerLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        lineReveal(headingRef.current);
      }
      if (footerLineRef.current) {
        drawLine(footerLineRef.current);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Copy email with 0.3s swap feedback
  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  // Form submission with Honeypot & VITE_FORM_ENDPOINT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formState._gotcha) {
      console.warn("Spam bot detected via honeypot.");
      return;
    }

    if (!formState.email || !formState.message) {
      setStatus("error");
      setStatusMessage("Please provide your email and message.");
      return;
    }

    const endpoint = (import.meta as any).env?.VITE_FORM_ENDPOINT;

    if (!endpoint || endpoint.includes("sample")) {
      // Fallback to mailto link
      const mailtoUrl = `mailto:${email}?subject=Inquiry from ${encodeURIComponent(
        formState.name || "Portfolio Visitor"
      )}&body=${encodeURIComponent(formState.message + "\n\nFrom: " + formState.email)}`;
      window.location.href = mailtoUrl;
      setStatus("success");
      setStatusMessage("Opening your email client to send message...");
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setStatusMessage("Thank you! Your message has been sent successfully.");
        setFormState({ name: "", email: "", message: "", _gotcha: "" });
      } else {
        throw new Error("Failed to send message via form service.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Unable to send right now. Click email to send directly.");
    }
  };

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const socialLinks = [
    { name: "LinkedIn", url: linkedin },
    { name: "Behance", url: behance },
    { name: "GitHub", url: github },
    { name: "Instagram", url: instagram },
  ];

  return (
    <footer
      ref={sectionRef}
      id="contact"
      data-cursor-tag="Contact"
      className="w-full bg-[#3B4DF7] text-white pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 font-sans select-none"
    >
      <div className="w-full max-w-[1400px] mx-auto">
        
        {/* Main CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 sm:mb-24">
          
          {/* Left Column: Heading, Direct Email & Copy Action */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-white/80 block mb-4">
                GET IN TOUCH
              </span>
              <h2
                ref={headingRef}
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase tracking-[-0.035em] text-white leading-none mb-8"
              >
                LET'S TALK
              </h2>

              <p className="text-white/85 text-base sm:text-lg max-w-lg mb-8 leading-relaxed font-normal">
                Have a project in mind, seeking visual direction, or wanting to collaborate on commercial design &amp; AI films? Reach out directly.
              </p>

              {/* Big Interactive Email with Click to Copy and Text Roll */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={`mailto:${email}`}
                  className="group relative inline-flex items-center gap-3 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white hover:text-white/90 underline decoration-white/40 hover:decoration-white transition-colors"
                >
                  <span>{email}</span>
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>

                {/* Click-to-copy feedback button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-white/30 hover:border-white text-xs font-mono uppercase tracking-wider text-white hover:bg-white/10 transition-all rounded-none cursor-pointer"
                  aria-label="Copy email address to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 font-mono text-xs text-white/70">
                <span>Location: {location}</span>
              </div>
            </div>

            {/* Social Links Bar */}
            <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/20 font-mono text-xs uppercase tracking-[0.18em]">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-white/90 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>{social.name}</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Rectilinear Contact Form */}
          <div className="lg:col-span-5 bg-white text-neutral-900 p-6 sm:p-8 md:p-10 border border-white/20 rounded-none shadow-2xl">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-neutral-950 mb-2">
              Send a Message
            </h3>
            <p className="text-xs text-neutral-500 font-mono mb-6 uppercase tracking-wider">
              Direct inbox delivery
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Anti-spam Honeypot */}
              <input
                type="text"
                name="_gotcha"
                value={formState._gotcha}
                onChange={(e) => setFormState({ ...formState, _gotcha: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 focus:border-neutral-950 focus:bg-white outline-none transition-colors rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 focus:border-neutral-950 focus:bg-white outline-none transition-colors rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600 mb-1">
                  Project Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Briefly describe your vision, scope, or timeline..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 focus:border-neutral-950 focus:bg-white outline-none transition-colors rounded-none resize-none"
                />
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`text-xs font-mono p-2.5 border ${
                    status === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.99] text-xs font-mono uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-none mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{status === "submitting" ? "Sending..." : "Submit Message"}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom Bar with Hairline drawLine & Dynamic Year */}
        <div ref={footerLineRef} className="w-full h-px bg-white/20 mb-8 origin-left" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/70">
          <div>
            <span>© {new Date().getFullYear()} Suraj Kumar Sharma (Sukunsh). All rights reserved.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
