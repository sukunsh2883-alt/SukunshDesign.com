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
  const characterRef = useRef<HTMLImageElement | null>(null);
  const heroImageUrl = "/artwork/Hero.svg";
  const flowerLayers = [
    { src: "/artwork/flower1.svg", className: "left-[13%] bottom-[12%] w-[7.5%] rotate-[-9deg]" },
    { src: "/artwork/flower2.svg", className: "left-[20%] bottom-[3%] w-[6.4%] rotate-[8deg]" },
    { src: "/artwork/flower3.svg", className: "left-[30%] bottom-[10%] w-[5.8%] rotate-[-4deg]" },
    { src: "/artwork/flower5.svg", className: "right-[25%] bottom-[8%] w-[6.2%] rotate-[9deg]" },
    { src: "/artwork/flower6.svg", className: "right-[18%] bottom-[15%] w-[5.8%] rotate-[-11deg]" },
    { src: "/artwork/flower7.svg", className: "right-[11%] bottom-[5%] w-[7%] rotate-[5deg]" },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const artworkWrap = artworkWrapRef.current;
    const character = characterRef.current;

    if (!section || !artworkWrap || !character) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flowers = gsap.utils.toArray<HTMLElement>(".hero-flower");
    const leaves = gsap.utils.toArray<HTMLElement>(".hero-leaf");

    if (reduceMotion) {
      gsap.set([artworkWrap, character, ...flowers, ...leaves], { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [character, ...flowers, ...leaves],
        { opacity: 0, y: 34, scale: 0.965 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.055,
        }
      );

      gsap.to(artworkWrap, {
        y: -42,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(character, {
        scale: 1.012,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(character, {
        rotate: 0.28,
        x: 3,
        duration: 4.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      leaves.forEach((leaf, index) => {
        gsap.to(leaf, {
          x: index % 2 === 0 ? 9 : -7,
          y: index % 2 === 0 ? -8 : 6,
          rotate: index % 2 === 0 ? 1.8 : -1.5,
          duration: 4.8 + index * 0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      flowers.forEach((flower, index) => {
        gsap.to(flower, {
          x: gsap.utils.random(-8, 8),
          y: gsap.utils.random(-13, 9),
          rotate: gsap.utils.random(-7, 7),
          scale: gsap.utils.random(0.97, 1.04),
          duration: gsap.utils.random(4.6, 7.2),
          delay: index * 0.16,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
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

        <div ref={artworkWrapRef} className="relative z-20 mt-8 h-[92vh] max-h-[980px] w-[min(92vw,980px)] md:mt-10">
          <img
            className="hero-leaf absolute bottom-[-2%] left-[-3%] z-10 w-[68%] object-contain"
            src="/artwork/leafs.svg"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <img
            className="hero-leaf absolute bottom-[-3%] right-[-2%] z-10 w-[62%] -scale-x-100 object-contain"
            src="/artwork/leafs.svg"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          {flowerLayers.map((flower) => (
            <img
              key={flower.src}
              className={`hero-flower absolute z-30 object-contain ${flower.className}`}
              src={flower.src}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          ))}
          <img
            ref={characterRef}
            src={heroImageUrl}
            alt="Sukunsh artwork"
            onError={(event) => {
              event.currentTarget.src = "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1780406091/qq_fakbfs.png";
            }}
            className="relative z-20 mx-auto h-full w-auto object-contain"
            referrerPolicy="no-referrer"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
}
