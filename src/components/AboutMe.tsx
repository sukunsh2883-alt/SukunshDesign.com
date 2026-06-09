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
      gsap.from(".about-mist", {
        y: 44,
        opacity: 0,
        filter: "blur(18px)",
        duration: 1.05,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          scrub: 0.7,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about-me" className="about-section bg-[#080807] px-6 py-24 text-[#f3efe5] md:px-[7vw] md:py-[150px]">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 md:min-h-[78vh] md:grid-cols-[360px_1fr] md:gap-24">
        <figure className="about-mist relative aspect-[0.82] w-full max-w-[290px] overflow-hidden bg-[#1a1916] md:max-w-[360px]">
          <img
            src={portrait}
            alt={profile.fullName}
            className="h-full w-full object-cover grayscale contrast-110"
            referrerPolicy="no-referrer"
          />
        </figure>

        <div className="max-w-[780px]">
          <p className="about-mist mb-4 text-sm font-medium tracking-normal text-[#f3efe5]">About me</p>
          <h2 className="about-mist max-w-[680px] text-4xl font-medium leading-[1.04] tracking-[-0.02em] text-[#f3efe5] md:text-[62px]">
            emotional, bold,<br />
            story driven visuals.
          </h2>

          <div className="mt-8 grid gap-8 text-base leading-[1.42] tracking-normal text-[#f3efe5]/68 md:grid-cols-2">
            <p className="about-mist">
              I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
            </p>
            <p className="about-mist">
              My work lives between art, design, and cinema, creating visuals that feel emotional, bold, and story driven.
            </p>
          </div>
          <p className="about-mist mt-8 max-w-[620px] text-xl font-medium leading-[1.18] tracking-[-0.01em] text-[#f3efe5] md:text-3xl">
            Yeah, that&apos;s me, Suraj Kumar Sharma. People call me Sukunsh.
          </p>

          <div className="about-mist mt-9 flex flex-wrap gap-14 text-xl font-medium tracking-normal text-[#f3efe5]">
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
