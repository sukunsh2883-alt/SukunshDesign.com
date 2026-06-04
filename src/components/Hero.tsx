import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

const FLOATING_TAGS = ["Brand", "Motion", "AI Films", "Visual Systems"];

const FLOWERS = [
  { src: "/artwork/flower1.svg", className: "left-[2%] bottom-[16%] w-[9%]" },
  { src: "/artwork/flower2.svg", className: "left-[10%] bottom-[8%] w-[7%]" },
  { src: "/artwork/flower7.svg", className: "right-[3%] bottom-[20%] w-[8%]" },
  { src: "/artwork/white flower1.svg", className: "left-[19%] bottom-[3%] w-[10%]" },
  { src: "/artwork/white flower2.svg", className: "right-[21%] bottom-[5%] w-[6%]" },
  { src: "/artwork/white flower4.svg", className: "right-[12%] bottom-[11%] w-[7%]" },
];

export default function Hero({ profile, onOpenProjects, onOpenAIWork }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const penRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const text = textRef.current;
    const art = artRef.current;
    const character = characterRef.current;
    const pen = penRef.current;
    const lens = lensRef.current;
    const head = headRef.current;
    if (!section || !text || !art || !character || !pen || !lens || !head) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flowers = gsap.utils.toArray<HTMLElement>(".hero-flower");
    const tags = gsap.utils.toArray<HTMLElement>(".hero-tag");
    const leaves = gsap.utils.toArray<HTMLElement>(".hero-plant");

    const ANIMATION = {
      introDuration: 1.45, // edit intro speed here
      idleRange: 10, // edit floating movement range here
      cursorRange: 18, // edit mouse reaction strength here
      staggerDelay: 0.08, // edit flower/tag delay here
    };

    if (reduceMotion) {
      gsap.set([text, art, character, pen, lens, head, ...flowers, ...tags, ...leaves], {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .fromTo(text, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(
          character,
          { opacity: 0, y: 34, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: ANIMATION.introDuration },
          "-=0.45",
        )
        .fromTo(
          leaves,
          { opacity: 0, y: 36, scaleY: 0.45, transformOrigin: "50% 100%" },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.9, stagger: ANIMATION.staggerDelay },
          "-=0.7",
        )
        .fromTo(
          flowers,
          { opacity: 0, y: 18, scale: 0.2, rotate: -16 },
          { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.65, stagger: ANIMATION.staggerDelay },
          "-=0.45",
        )
        .fromTo(
          tags,
          { opacity: 0, y: 14, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.06 },
          "-=0.35",
        )
        .fromTo(pen, { opacity: 0, y: 24, rotate: -8 }, { opacity: 1, y: 0, rotate: 0, duration: 0.7 }, "-=0.55");

      gsap.to(character, {
        y: -8,
        scale: 1.012,
        duration: 3.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(pen, {
        y: -6,
        rotate: 2.4,
        duration: 2.7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(lens, {
        opacity: 0.35,
        scale: 1.12,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      flowers.forEach((flower, index) => {
        gsap.to(flower, {
          y: gsap.utils.random(-ANIMATION.idleRange, ANIMATION.idleRange),
          x: gsap.utils.random(-7, 7),
          rotate: gsap.utils.random(-6, 6),
          duration: gsap.utils.random(3.8, 6.2),
          delay: index * 0.12,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      leaves.forEach((leaf, index) => {
        gsap.to(leaf, {
          rotate: index % 2 ? 2.5 : -2.5,
          x: index % 2 ? 6 : -6,
          duration: 4 + index * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      gsap.to(tags, {
        y: -12,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });

      gsap.to(character, {
        y: -58,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(leaves, {
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });

      gsap.to(tags, {
        opacity: 0,
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "35% top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(text, {
        opacity: 0,
        y: -44,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "45% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, section);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(pen, {
        x: x * ANIMATION.cursorRange,
        y: y * ANIMATION.cursorRange,
        rotate: x * 8,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(head, {
        rotate: x * 2.2,
        x: x * 5,
        y: y * 3,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(tags, {
        x: (index: number) => x * (10 + index * 4),
        y: (index: number) => y * (8 + index * 2),
        duration: 1,
        ease: "power3.out",
        overwrite: "auto",
      });

      flowers.forEach((flower, index) => {
        const direction = index % 2 ? 1 : -1;
        gsap.to(flower, {
          x: direction * x * -18,
          rotate: direction * x * -9,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    const handlePointerLeave = () => {
      gsap.to([pen, head, ...tags, ...flowers], {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 1,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleEnter = () => {
      gsap.to(art, { scale: 1.018, duration: 0.65, ease: "power3.out" });
      gsap.to(flowers, { y: -14, scale: 1.08, duration: 0.55, ease: "back.out(2)", stagger: 0.035 });
      gsap.fromTo(lens, { opacity: 0.15, scale: 0.7 }, { opacity: 0.85, scale: 1.45, duration: 0.38, ease: "power2.out" });
      gsap.to(pen, { rotate: 7, duration: 0.45, ease: "power3.out" });
    };

    const handleLeave = () => {
      gsap.to(art, { scale: 1, duration: 0.65, ease: "power3.out" });
      gsap.to(lens, { opacity: 0.25, scale: 1, duration: 0.45, ease: "power2.out" });
      handlePointerLeave();
    };

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);
    art.addEventListener("pointerenter", handleEnter);
    art.addEventListener("pointerleave", handleLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      art.removeEventListener("pointerenter", handleEnter);
      art.removeEventListener("pointerleave", handleLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#050505] px-6 pt-24 text-white md:px-10 lg:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(255,106,0,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-[1520px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div ref={textRef} className="relative z-20 max-w-2xl">
          <p className="mb-5 text-sm font-medium tracking-[-0.02em] text-white/48">Visual Designer / Filmmaker</p>
          <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.065em] md:text-7xl lg:text-8xl">
            Designing stories that move.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed tracking-[-0.02em] text-white/64 md:text-lg">
            I&apos;m a visual designer and filmmaker creating brand identities, motion design, cinematic visuals, and AI-powered ad concepts.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onOpenProjects}
              className="bg-white px-6 py-3 text-sm font-semibold tracking-[-0.02em] text-black transition-colors hover:bg-[#f25a00] hover:text-white"
            >
              View My Work
            </button>
            <a
              href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
              className="border border-white/25 px-6 py-3 text-sm font-semibold tracking-[-0.02em] text-white transition-colors hover:border-[#f25a00] hover:text-[#f25a00]"
            >
              Let&apos;s Collaborate
            </a>
          </div>
        </div>

        <div
          ref={artRef}
          className="relative z-10 mx-auto aspect-[791/612] w-full max-w-[720px] origin-center lg:max-w-[820px]"
          aria-label="Interactive designer illustration"
        >
          <div className="hero-plant absolute bottom-[2%] left-[10%] h-[22%] w-[22%] rounded-full bg-[#7b7a4b]/20 blur-2xl" />
          <div className="hero-plant absolute bottom-[3%] right-[5%] h-[30%] w-[30%] rounded-full bg-[#8277e7]/12 blur-2xl" />

          {FLOATING_TAGS.map((tag, index) => (
            <span
              key={tag}
              className="hero-tag absolute z-30 border border-white/14 bg-white/[0.055] px-3 py-1.5 text-[10px] font-medium tracking-[-0.01em] text-white/70 backdrop-blur-sm"
              style={{
                left: `${index % 2 === 0 ? 7 + index * 3 : 72 - index * 5}%`,
                top: `${12 + index * 14}%`,
              }}
            >
              {tag}
            </span>
          ))}

          {FLOWERS.map((flower) => (
            <img
              key={flower.src}
              src={flower.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={`hero-flower pointer-events-none absolute z-30 object-contain ${flower.className}`}
            />
          ))}

          <div ref={penRef} className="pointer-events-none absolute left-[18%] top-[18%] z-40 h-[52%] w-[18%]" />
          <div ref={headRef} className="pointer-events-none absolute left-[43%] top-[6%] z-40 h-[18%] w-[15%]" />
          <div ref={lensRef} className="pointer-events-none absolute left-[43%] top-[45%] z-50 h-[9%] w-[9%] rounded-full bg-[#f25a00]/45 blur-md" />

          <img
            ref={characterRef}
            src="/artwork/Asset 197.svg"
            alt="Designer character holding creative tools"
            className="relative z-20 h-full w-full select-none object-contain"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
