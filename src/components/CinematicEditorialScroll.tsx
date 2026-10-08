import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CinematicEditorialScrollProps {
  line1Text?: string;
  line2Prefix?: string;
  line2Suffix?: string;
  videoSrc?: string;
  fallbackVideoSrc?: string;
  posterSrc?: string;
  onExploreClick?: () => void;
}

export default function CinematicEditorialScroll({
  line1Text = "PLEASE DON'T ASK WHAT",
  line2Prefix = "LAYER 82",
  line2Suffix = "DOES.",
  videoSrc = "/design-illustration-loop.mp4",
  fallbackVideoSrc = "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4",
  posterSrc = "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
  onExploreClick,
}: CinematicEditorialScrollProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const typographyWrapRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLDivElement | null>(null);
  const line2PrefixRef = useRef<HTMLSpanElement | null>(null);
  const line2SuffixRef = useRef<HTMLSpanElement | null>(null);
  const videoSlotRef = useRef<HTMLDivElement | null>(null);
  const videoCardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const videoCard = videoCardRef.current;
    const videoSlot = videoSlotRef.current;
    const line1 = line1Ref.current;
    const prefix = line2PrefixRef.current;
    const suffix = line2SuffixRef.current;

    if (!container || !stage || !videoCard || !videoSlot || !line1 || !prefix || !suffix) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const getGeometry = () => {
        const slotRect = videoSlot.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        const prefixRect = prefix.getBoundingClientRect();
        const suffixRect = suffix.getBoundingClientRect();

        const width = slotRect.width || 280;
        const height = slotRect.height || 175;

        // Scale factor required to fill the entire stage (window)
        const scaleX = window.innerWidth / width;
        const scaleY = window.innerHeight / height;
        const scaleFactor = Math.max(scaleX, scaleY) * 1.05;

        // Vertical offset to pull video to the dead vertical center of the viewport as it reaches fullscreen
        const slotCenterY = slotRect.top + height / 2;
        const stageCenterY = stageRect.top + stageRect.height / 2;
        const verticalOffset = slotCenterY - stageCenterY;

        // Calculate shift to bring HELLO and SUKUNSH together at the center
        const centerSlotX = slotRect.left + width / 2;
        const shiftPrefix = Math.max(20, centerSlotX - prefixRect.right - 8);
        const shiftSuffix = Math.max(20, suffixRect.left - centerSlotX - 8);

        return { scaleFactor, verticalOffset, shiftPrefix, shiftSuffix };
      };

      let geo = getGeometry();

      if (reduceMotion) {
        return;
      }

      // Start video paused initially (not playing while small)
      const vid = videoRef.current;
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }

      // INITIAL STATE:
      // 1. Text HELLO and SUKUNSH are TOGETHER.
      // 2. Video is completely NOT SHOWN before scrolling (scale: 0, opacity: 0).
      gsap.set(prefix, {
        x: geo.shiftPrefix,
        opacity: 1,
        willChange: "transform, opacity",
      });

      gsap.set(suffix, {
        x: -geo.shiftSuffix,
        opacity: 1,
        willChange: "transform, opacity",
      });

      gsap.set(line1, {
        y: 0,
        opacity: 1,
        willChange: "transform, opacity",
      });

      gsap.set(videoCard, {
        scale: 0,
        opacity: 0,
        y: 0,
        borderRadius: 8,
        transformOrigin: "center center",
        willChange: "transform, border-radius, opacity",
      });

      // Master scroll-driven timeline pinned across the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          pin: stage,
          pinSpacing: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            geo = getGeometry();
          },
          onUpdate: (self) => {
            const v = videoRef.current;
            if (!v) return;

            // "it's play after half and big, not the start with the small"
            // Before half (while small/appearing): keep paused
            // After half (when expanding and big): play
            if (self.progress >= 0.46 && self.progress < 0.98) {
              if (v.paused) {
                v.play().catch(() => {});
              }
            } else if (self.progress < 0.42) {
              if (!v.paused) {
                v.pause();
              }
            }
          },
        },
      });

      // PHASE 1: Brief scroll hold showing ONLY the joined text (0 to 0.25s)
      tl.to({}, { duration: 0.25 })

      // PHASE 2: When scrolling down, words separate and video appears very small between them (0.25s to 1.1s)
      // Note: Video remains paused here while small!
      .to(
        prefix,
        {
          x: 0,
          ease: "power2.out",
          duration: 0.85,
        },
        0.25
      )
      .to(
        suffix,
        {
          x: 0,
          ease: "power2.out",
          duration: 0.85,
        },
        0.25
      )
      .to(
        videoCard,
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          duration: 0.85,
        },
        0.25
      )

      // Brief hold showing small video nestled between separated words (1.1s to 1.35s)
      .to({}, { duration: 0.25 })

      // PHASE 3: Past half-way, video expands to fill screen and plays as it gets big (1.35s to 2.5s)
      .to(
        videoCard,
        {
          scale: () => geo.scaleFactor,
          y: () => -geo.verticalOffset,
          borderRadius: 0,
          ease: "power2.inOut",
          duration: 1.15,
        },
        1.35
      )
      .to(
        line1,
        {
          y: -140,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.85,
        },
        1.35
      )
      .to(
        prefix,
        {
          x: -180,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.85,
        },
        1.35
      )
      .to(
        suffix,
        {
          x: 180,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.85,
        },
        1.35
      )

      // PHASE 4: Fullscreen hold - pure seamless video, no text, no gradient (2.5s to 3.0s)
      .to({}, { duration: 0.5 });
    }, container);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Refresh layout calculations on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="cinematic-editorial-expand"
      data-cursor-tag="Cinematic"
      className="cinematic-scroll-section relative w-full bg-[#050505] text-white select-none"
      style={{ minHeight: "300vh" }}
    >
      {/* Pinned Stage Viewport (managed cleanly by GSAP ScrollTrigger pin) */}
      <div
        ref={stageRef}
        className="relative flex h-screen min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#050505]"
      >
        {/* Background Ambient Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255, 106, 0, 0.12) 0%, rgba(5, 5, 5, 0) 70%)",
          }}
          aria-hidden="true"
        />

        {/* 1. EDITORIAL TEXT COMPOSITION */}
        <div
          ref={typographyWrapRef}
          className="editorial-text relative z-10 mx-auto flex w-full max-w-[1500px] flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-12 text-center"
        >
          {/* Top Line: PLEASE DON'T ASK WHAT */}
          <div
            ref={line1Ref}
            className="w-full font-sans text-[clamp(2.75rem,6.5vw,5.5rem)] font-bold uppercase italic tracking-[-0.035em] text-white leading-[0.88] select-none"
            style={{ fontWeight: 700, fontStyle: "italic" }}
          >
            {line1Text}
          </div>

          {/* Bottom Line: LAYER 82 [ VIDEO SLOT ] DOES. (Symmetrically Centered) */}
          <div
            className="-mt-1 sm:-mt-2 md:-mt-3 grid grid-cols-[1fr_auto_1fr] items-center w-full font-sans text-[clamp(2.75rem,6.5vw,5.5rem)] font-bold uppercase italic tracking-[-0.035em] text-white leading-[0.88] select-none"
            style={{ fontWeight: 700, fontStyle: "italic" }}
          >
            {/* Left Word (Right-aligned to touch center video slot equally) */}
            <div className="flex justify-end pr-2 sm:pr-4 md:pr-6 overflow-visible">
              <span ref={line2PrefixRef} className="inline-block shrink-0 whitespace-nowrap font-bold italic font-sans" style={{ fontWeight: 700, fontStyle: "italic" }}>
                {line2Prefix}
              </span>
            </div>

            {/* In-flow Video Slot: Houses the video directly between HELLO and SUKUNSH */}
            <div
              ref={videoSlotRef}
              className="relative inline-flex items-center justify-center shrink-0 aspect-[16/10] w-[140px] sm:w-[210px] md:w-[280px] lg:w-[320px] max-w-[34vw] rounded-[6px] sm:rounded-[8px] overflow-visible z-30"
            >
              <div
                ref={videoCardRef}
                onClick={onExploreClick}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onExploreClick?.()}
                className="expanding-video group z-30 cursor-pointer overflow-hidden rounded-[6px] sm:rounded-[8px] bg-neutral-950 shadow-[0_20px_60px_rgba(0,0,0,0.85)] outline-none focus-visible:ring-2 focus-visible:ring-white w-full h-full"
                style={{
                  willChange: "transform, border-radius",
                  transformOrigin: "center center",
                }}
              >
                <video
                  ref={videoRef}
                  src={videoSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                >
                  <source src={videoSrc} type="video/mp4" />
                  <source src={fallbackVideoSrc} type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Right Word (Left-aligned to touch center video slot equally) */}
            <div className="flex justify-start pl-2 sm:pl-4 md:pl-6 overflow-visible">
              <span ref={line2SuffixRef} className="inline-block shrink-0 whitespace-nowrap font-bold italic font-sans" style={{ fontWeight: 700, fontStyle: "italic" }}>
                {line2Suffix}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
