import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AboutMeProps {
  profile: {
    fullName: string;
    brandName: string;
    roles: string[];
    bio: string;
    email: string;
    linkedin: string;
    behance: string;
    aboutImage?: string;
  };
  onOpenResume: () => void;
  onOpenAIWork: () => void;
  onOpenProjects: () => void;
}

export default function AboutMe({ profile, onOpenResume }: AboutMeProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const portrait =
    profile.aboutImage ||
    "https://res.cloudinary.com/dylv5m3jk/image/upload/v1780485999/Screenshot_2026-06-03_165617_seilm1.png";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about-me" className="about-section bg-[#050505] px-6 py-24 text-white md:px-[7vw] md:py-[132px]">
      <div className="mx-auto grid max-w-[980px] items-center gap-11 md:min-h-[66vh] md:grid-cols-[245px_1fr] md:gap-16">
        <figure className="about-reveal relative aspect-[0.82] w-full max-w-[230px] overflow-hidden bg-[#d8d8d8] md:max-w-[245px]">
          <img
            src={portrait}
            alt={profile.fullName}
            className="h-full w-full object-cover grayscale contrast-110"
            referrerPolicy="no-referrer"
          />
        </figure>

        <div className="about-reveal max-w-[600px]">
          <p className="mb-3 text-[11px] font-medium tracking-[-0.025em] text-white">About me</p>
          <h2 className="max-w-[500px] text-4xl font-semibold leading-[1.04] tracking-[-0.052em] text-white md:text-[44px]">
            emotional, bold,<br />
            story driven visuals.
          </h2>

          <div className="mt-6 grid gap-6 text-[11px] leading-[1.22] tracking-[-0.03em] text-white/64 md:grid-cols-2">
            <p>
              I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
            </p>
            <p>
              My work lives between art, design, and cinema, creating visuals that feel emotional, bold, and story driven.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-12 text-lg font-semibold tracking-[-0.05em] text-white">
            <a href={profile.behance} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#f25a00]">
              Behance
            </a>
            <button onClick={onOpenResume} className="transition-colors hover:text-[#f25a00]">
              Resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
