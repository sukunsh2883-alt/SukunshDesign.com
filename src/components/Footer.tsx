import { ArrowUp, ArrowUpRight } from "lucide-react";
import { DEFAULT_LOGO_FONT, getLogoFontStyle } from "../localFonts";

interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  const logoFontStyle = getLogoFontStyle(profile?.logoFontFamily || DEFAULT_LOGO_FONT);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-[#fbfbf8] px-4 py-20 text-neutral-950 md:px-6">
      <div className="mx-auto max-w-7xl border-y border-neutral-950 py-10">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-sm font-medium text-[#FF6A00]">contact</p>
            <h2 className="max-w-4xl text-[42px] font-medium leading-none tracking-[-0.04em] md:text-7xl">
              available for UX/UI and visual design work.
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-[#FF6A00] hover:border-[#FF6A00]"
            >
              email me <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="flex flex-col justify-between gap-10 border-t border-neutral-200 pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <div className="text-[58px] leading-none md:text-[76px]" style={logoFontStyle}>
                Sukunsh.
              </div>
              <p className="mt-5 max-w-sm text-base leading-7 text-neutral-600">
                {profile.fullName} / UX/UI, motion, AI films, visual systems.
              </p>
            </div>
            <div className="space-y-3 text-sm text-neutral-600">
              <a href={`mailto:${profile.email}`} className="block hover:text-neutral-950">{profile.email}</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-neutral-950">LinkedIn</a>
              <a href={profile.behance} target="_blank" rel="noreferrer" className="block hover:text-neutral-950">Behance</a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-5 text-sm text-neutral-500">
          <span>© 2026 Sukunsh</span>
          <button onClick={handleScrollTop} className="inline-flex items-center gap-2 hover:text-neutral-950">
            top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
