import { PointerEvent, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

const FLOWERS = [
  { src: "/artwork/flower1.svg", className: "left-[7%] bottom-[11%] w-[8%]" },
  { src: "/artwork/flower2.svg", className: "left-[16%] bottom-[4%] w-[6%]" },
  { src: "/artwork/flower7.svg", className: "right-[4%] bottom-[16%] w-[7%]" },
  { src: "/artwork/white flower1.svg", className: "left-[24%] bottom-[3%] w-[8%]" },
  { src: "/artwork/white flower2.svg", className: "right-[25%] bottom-[4%] w-[5%]" },
  { src: "/artwork/white flower4.svg", className: "right-[13%] bottom-[7%] w-[6%]" },
];

const HOTSPOTS = [
  { id: "pen", label: "Move pen", className: "left-[15%] top-[18%] h-[54%] w-[18%]", x: 18, y: 16, rotate: 9 },
  { id: "tablet", label: "Move tablet", className: "left-[46%] top-[12%] h-[27%] w-[34%]", x: -14, y: 10, rotate: -4 },
  { id: "camera", label: "Move camera", className: "left-[39%] top-[43%] h-[20%] w-[18%]", x: 11, y: -12, rotate: 5 },
  { id: "pens", label: "Move blue pink pens", className: "right-[16%] top-[15%] h-[24%] w-[10%]", x: 10, y: 18, rotate: 7 },
];

export default function Hero(_: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const floorRef = useRef<HTMLDivElement | null>(null);
  const hotspotsRef = useRef<HTMLButtonElement[]>([]);
  const dragState = useRef<{
    element: HTMLButtonElement;
    pointerId: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    const art = artRef.current;
    const character = characterRef.current;
    const floor = floorRef.current;
    if (!section || !wordmark || !art || !character || !floor) return;

    const flowers = gsap.utils.toArray<HTMLElement>(".hero-flower");
    const leaves = gsap.utils.toArray<HTMLElement>(".hero-leaf-motion");
    const hotspots = hotspotsRef.current.filter(Boolean);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ANIMATION = {
      introSpeed: 1.35, // edit intro speed here
      breathRange: 7, // edit character breathing movement here
      leafRange: 4, // edit leaf wave range here
      mouseRange: 12, // edit whole-art cursor movement here
      hotspotReturnSpeed: 0.85, // edit snap-back speed here
    };

    if (reduceMotion) {
      gsap.set([wordmark, art, character, floor, ...flowers, ...leaves, ...hotspots], {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .fromTo(wordmark, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(
          character,
          { opacity: 0, y: 46, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: ANIMATION.introSpeed },
          "-=0.35",
        )
        .fromTo(
          floor,
          { opacity: 0, scaleX: 0.76 },
          { opacity: 1, scaleX: 1, duration: 0.8 },
          "-=0.7",
        )
        .fromTo(
          leaves,
          { opacity: 0, y: 24, scaleY: 0.6, transformOrigin: "50% 100%" },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.75, stagger: 0.06 },
          "-=0.6",
        )
        .fromTo(
          flowers,
          { opacity: 0, y: 18, scale: 0.25, rotate: -12 },
          { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.6, stagger: 0.05 },
          "-=0.45",
        );

      gsap.to(character, {
        y: -ANIMATION.breathRange,
        scale: 1.008,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      leaves.forEach((leaf, index) => {
        gsap.to(leaf, {
          x: index % 2 ? ANIMATION.leafRange : -ANIMATION.leafRange,
          rotate: index % 2 ? 1.6 : -1.6,
          duration: 4.6 + index * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      flowers.forEach((flower, index) => {
        gsap.to(flower, {
          y: gsap.utils.random(-8, 7),
          x: gsap.utils.random(-5, 5),
          rotate: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(4, 6.4),
          delay: index * 0.12,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      gsap.to(art, {
        y: -44,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.15,
        },
      });

      gsap.to(wordmark, {
        opacity: 0.15,
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "35% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, section);

    const handlePointerMove = (event: PointerEvent) => {
      if (dragState.current) return;

      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(art, {
        x: x * ANIMATION.mouseRange,
        y: y * (ANIMATION.mouseRange * 0.55),
        duration: 1,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(hotspots, {
        x: (index: number) => x * HOTSPOTS[index].x * 0.35,
        y: (index: number) => y * HOTSPOTS[index].y * 0.35,
        rotate: (index: number) => x * HOTSPOTS[index].rotate * 0.35,
        duration: 0.85,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handlePointerLeave = () => {
      if (dragState.current) return;

      gsap.to([art, ...hotspots], {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.95,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleHoverIn = () => {
      gsap.to(art, { scale: 1.012, duration: 0.55, ease: "power3.out" });
      gsap.to(flowers, { y: -10, scale: 1.04, duration: 0.45, ease: "back.out(2)", stagger: 0.035 });
    };

    const handleHoverOut = () => {
      gsap.to(art, { scale: 1, duration: 0.55, ease: "power3.out" });
    };

    section.addEventListener("pointermove", handlePointerMove as EventListener);
    section.addEventListener("pointerleave", handlePointerLeave);
    art.addEventListener("pointerenter", handleHoverIn);
    art.addEventListener("pointerleave", handleHoverOut);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove as EventListener);
      section.removeEventListener("pointerleave", handlePointerLeave);
      art.removeEventListener("pointerenter", handleHoverIn);
      art.removeEventListener("pointerleave", handleHoverOut);
      ctx.revert();
    };
  }, []);

  const onHotspotDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    const element = hotspotsRef.current[index];
    if (!element) return;

    element.setPointerCapture(event.pointerId);
    gsap.killTweensOf(element);
    dragState.current = {
      element,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: Number(gsap.getProperty(element, "x")) || 0,
      baseY: Number(gsap.getProperty(element, "y")) || 0,
    };

    gsap.to(element, {
      scale: 1.08,
      rotate: HOTSPOTS[index].rotate,
      duration: 0.18,
      ease: "power2.out",
    });
  };

  const onHotspotMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    gsap.set(state.element, {
      x: state.baseX + event.clientX - state.startX,
      y: state.baseY + event.clientY - state.startY,
    });
  };

  const returnHotspot = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    try {
      state.element.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released.
    }

    gsap.to(state.element, {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 0.85, // edit snap-back speed here too
      ease: "elastic.out(1, 0.62)",
      overwrite: true,
    });

    dragState.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#050505] px-5 pt-16 text-white md:px-8"
    >
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1520px] items-end justify-center">
        <p className="absolute left-[5%] top-[12%] z-30 text-sm font-light tracking-[-0.02em] text-white/75 md:text-lg">
          Delhi Based Multidiscipline Designer
        </p>

        <h1
          ref={wordmarkRef}
          className="pointer-events-none absolute left-1/2 top-[22%] z-10 -translate-x-1/2 whitespace-nowrap text-[27vw] font-semibold leading-none tracking-[-0.105em] text-white md:top-[18%] md:text-[16vw]"
        >
          SUKUNSH
        </h1>

        <div
          ref={artRef}
          className="relative z-20 mb-[-1px] aspect-[791/612] w-[min(112vw,980px)] origin-bottom select-none md:w-[min(82vw,1030px)]"
          aria-label="Interactive designer artwork"
        >
          <div
            ref={floorRef}
            className="absolute bottom-[1.4%] left-0 right-0 z-10 h-[7%] bg-[#4a4a4a]"
            aria-hidden="true"
          />

          <div className="hero-leaf-motion pointer-events-none absolute bottom-[6%] left-[12%] z-30 h-[22%] w-[18%]" />
          <div className="hero-leaf-motion pointer-events-none absolute bottom-[6%] right-[8%] z-30 h-[30%] w-[22%]" />

          {FLOWERS.map((flower) => (
            <img
              key={flower.src}
              src={flower.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={`hero-flower pointer-events-none absolute z-40 object-contain ${flower.className}`}
            />
          ))}

          <img
            ref={characterRef}
            src="/artwork/Asset 197.svg"
            alt="Designer character holding creative tools"
            className="relative z-20 h-full w-full select-none object-contain"
            draggable={false}
          />

          {HOTSPOTS.map((hotspot, index) => (
            <button
              key={hotspot.id}
              ref={(node) => {
                if (node) hotspotsRef.current[index] = node;
              }}
              type="button"
              aria-label={hotspot.label}
              onPointerDown={(event) => onHotspotDown(event, index)}
              onPointerMove={onHotspotMove}
              onPointerUp={returnHotspot}
              onPointerCancel={returnHotspot}
              className={`absolute z-50 touch-none cursor-grab bg-white/0 outline-none active:cursor-grabbing ${hotspot.className}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
