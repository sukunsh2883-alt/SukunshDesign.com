import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const artworkWrapRef = useRef<HTMLDivElement | null>(null);
  const artworkRef = useRef<HTMLImageElement | null>(null);
  const heroImageUrl = "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1780406091/qq_fakbfs.png";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const artworkWrap = artworkWrapRef.current;
    const artwork = artworkRef.current;

    if (!section || !artworkWrap || !artwork) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([artworkWrap, artwork], { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        artworkWrap,
        { opacity: 0, y: 34, scale: 0.965 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
        }
      );

      gsap.to(artwork, {
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(artwork, {
        scale: 1.012,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(artwork, {
        rotate: 0.28,
        x: 3,
        duration: 4.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, section);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(artworkWrap, {
        x: x * 14,
        y: y * 10,
        duration: 1.2,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handlePointerLeave = () => {
      gsap.to(artworkWrap, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen overflow-hidden bg-[#050505] px-6 pt-14 text-white md:px-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1520px] items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute left-[7%] top-[14%] z-30 text-base font-light text-white md:text-xl"
        >
          Delhi Based Multipipeline Designer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.04 }}
          className="absolute left-1/2 top-[25%] z-10 -translate-x-1/2 whitespace-nowrap text-[24vw] font-semibold leading-none tracking-[-0.095em] text-white md:top-[20%] md:text-[16vw]"
        >
          SUKUNSH
        </motion.h1>

        <div ref={artworkWrapRef} className="relative z-20 mt-8 h-[92vh] max-h-[980px] w-auto md:mt-10">
          <img
            ref={artworkRef}
            src={heroImageUrl}
            alt="Sukunsh artwork"
            onError={(event) => {
              event.currentTarget.src = "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1780333002/Untitled-2_copy_urce7l.png";
            }}
            className="h-full w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}
