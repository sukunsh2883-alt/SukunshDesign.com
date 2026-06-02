import { ArrowUp, Compass, Linkedin, Mail } from "lucide-react";

interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const marqueeText = "LET'S BUILD CINEMATIC VISUALS - AI FILMS - BRAND STORIES - MOTION DESIGN - ";

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-neutral-200 bg-white py-14 md:py-20">
      <div className="border-y border-neutral-200 bg-white py-4 md:py-5">
        <div className="pause-on-hover flex overflow-hidden whitespace-nowrap">
          <div className="animate-marquee-scroll flex min-w-full gap-6 pr-6 font-mono text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 md:text-sm">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
          <div className="animate-marquee-scroll flex min-w-full gap-6 pr-6 font-mono text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 md:text-sm" aria-hidden="true">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-14 md:grid-cols-[1.3fr_0.7fr] md:px-8 md:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-700">
              Available for visual projects
            </span>
          </div>

          <h2 className="max-w-4xl font-sans text-4xl font-semibold leading-[0.95] tracking-tight text-neutral-800 sm:text-5xl md:text-7xl">
            Let&apos;s make the idea move.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-500 md:text-base">
            Film projects, AI ad visuals, brand systems, motion graphics, storyboards, and clean creative direction for fast-moving teams.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-neutral-950 bg-neutral-950 px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-950"
            >
              <Mail className="h-4 w-4" />
              <span>Say hi</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
            >
              <Linkedin className="h-4 w-4 text-[#FF6A00]" />
              <span>LinkedIn</span>
            </a>
            <a
              href={profile.behance}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
            >
              <Compass className="h-4 w-4 text-[#FF6A00]" />
              <span>Behance</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-neutral-200 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <div className="space-y-7">
            <div>
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email</p>
              <a href={`mailto:${profile.email}`} className="break-all text-sm font-semibold text-neutral-900 hover:text-[#FF6A00]">
                {profile.email}
              </a>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">Focus</p>
              <p className="text-sm leading-relaxed text-neutral-600">
                AI films, visual design, motion systems, product ads, and cinematic brand storytelling.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-6 font-mono text-[9px] font-semibold uppercase tracking-widest text-neutral-400 sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-start lg:flex-row lg:items-center">
            <span>&copy; 2026 Sukunsh / Suraj Kumar Sharma</span>
            <button
              onClick={handleScrollTop}
              className="group flex cursor-pointer items-center gap-1 text-neutral-500 transition-colors hover:text-neutral-950"
            >
              <span>Back To Top</span>
              <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
