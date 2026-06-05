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
    <section ref={sectionRef} id="about-me" className="about-section bg-[#050505] px-6 py-24 text-white md:px-[7vw] md:py-[120px]">
      <div className="mx-auto grid max-w-[1520px] gap-12 border-t border-white/15 pt-14 md:min-h-screen md:grid-cols-[280px_1fr_1.3fr] md:items-center md:gap-16">
        <figure className="about-reveal relative aspect-[0.8] w-full max-w-[250px] overflow-hidden bg-white/5 md:max-w-[280px]">
          <img
            src={portrait}
            alt={profile.fullName}
            className="h-full w-full object-cover grayscale contrast-110"
            referrerPolicy="no-referrer"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 px-4 py-3 text-[9px] font-semibold tracking-[-0.02em] text-white">
            <span>Portrait // Act.01</span>
            <span>{profile.brandName}</span>
          </figcaption>
        </figure>

        <div className="about-reveal">
          <p className="mb-4 text-sm font-medium tracking-[-0.03em] text-white/78">About Me</p>
          <h2 className="max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-white md:text-6xl">
            Emotional, bold, story-driven visuals.
          </h2>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/80">
            <a href={profile.behance} target="_blank" rel="noreferrer" className="border border-white/28 px-4 py-2 transition-colors hover:border-[#f25a00] hover:text-[#f25a00]">
              Behance
            </a>
            <button onClick={onOpenResume} className="border border-white/12 px-4 py-2 transition-colors hover:border-[#f25a00] hover:text-[#f25a00]">
              Resume
            </button>
          </div>
        </div>

        <div className="about-reveal max-w-2xl space-y-5 text-base leading-relaxed tracking-[-0.018em] text-white/70 md:text-lg">
          <p>
            I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
          </p>
          <p>
            My work lives between art, design, and cinema, creating visuals that feel emotional, bold, and story driven.
          </p>
          <p>
            I&apos;m deeply passionate about filmmaking, especially art films, where mood, culture, and human emotions become the language of storytelling.
          </p>
        </div>
      </div>
    </section>
  );
}
