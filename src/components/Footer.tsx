import { ArrowUp, ArrowUpRight, Compass, Linkedin, Mail } from "lucide-react";
import { DEFAULT_LOGO_FONT, getLogoFontStyle } from "../localFonts";

interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  const logoFontFamily = profile?.logoFontFamily || DEFAULT_LOGO_FONT;
  const logoFontStyle = getLogoFontStyle(logoFontFamily);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#f7f8f6] px-4 py-20 text-neutral-900 sm:px-6 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[40px] border border-neutral-950 bg-neutral-950 text-white shadow-[0_36px_120px_rgba(15,15,15,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 md:p-10 lg:p-12">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[12px] font-medium text-emerald-200">available for UX/UI and visual design roles</span>
              </div>

              <h2 className="max-w-4xl text-[44px] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                let&apos;s build a portfolio-worthy product story.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
                Open to UX/UI design, visual design, AI film, motion, brand systems, and creative direction work.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition-all hover:bg-[#FF6A00] hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  <span>email me</span>
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-neutral-950"
                >
                  <Linkedin className="h-4 w-4 text-[#FF6A00]" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={profile.behance}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-neutral-950"
                >
                  <Compass className="h-4 w-4 text-[#FF6A00]" />
                  <span>Behance</span>
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.04] p-6 md:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="flex h-full flex-col justify-between gap-14">
                <div>
                  <p className="text-[12px] font-medium text-white/45">identity</p>
                  <div className="mt-4 text-[56px] leading-none text-white sm:text-[78px]" style={logoFontStyle}>
                    Sukunsh.
                  </div>
                  <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
                    {profile.fullName} creates visual systems across UX/UI, motion graphics, AI-assisted creative workflows, typography, and cinematic storytelling.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-[12px] font-medium text-white/45">email</p>
                    <a href={`mailto:${profile.email}`} className="mt-1 inline-flex break-all text-lg font-semibold text-white hover:text-[#FF6A00]">
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[12px] font-medium text-white/45">
                    <span>&copy; 2026 Sukunsh / Suraj Kumar Sharma</span>
                    <button onClick={handleScrollTop} className="group inline-flex items-center gap-2 text-white/60 hover:text-white">
                      <span>top</span>
                      <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 px-2 text-sm font-medium text-neutral-500">
          <span>UX/UI portfolio, visual systems, AI films, motion reels.</span>
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-neutral-950">
            start a conversation <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
