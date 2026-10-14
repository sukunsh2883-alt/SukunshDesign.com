import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { VideoCard } from "../portfolioData";
import { isReducedMotion } from "../motion";
import { Play } from "lucide-react";

interface ReelShowcaseProps {
  videos: VideoCard[];
  onSelectVideo: (video: VideoCard) => void;
  onOpenExplorer?: () => void;
}

export default function ReelShowcase({ videos, onSelectVideo, onOpenExplorer }: ReelShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stripWrapperRef = useRef<HTMLDivElement | null>(null);
  const stripTrackRef = useRef<HTMLDivElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

    const section = sectionRef.current;
    const wrapper = stripWrapperRef.current;
    const track = stripTrackRef.current;
    const progressLine = progressLineRef.current;
    if (!section || !wrapper || !track) return;

    const cards = track.querySelectorAll<HTMLElement>("[data-reel-card]");

    // 1. Tiles frameReveal with 0.08s stagger from the left
    if (!isReducedMotion()) {
      gsap.set(cards, { clipPath: "inset(100% 0 0 0)", opacity: 1 });
      cards.forEach((card) => {
        const media = card.querySelector<HTMLElement>("[data-reel-media]");
        if (media) gsap.set(media, { scale: 1.15 });
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.3,
            ease: "power4.inOut",
            stagger: 0.08,
          });
          cards.forEach((card, idx) => {
            const media = card.querySelector<HTMLElement>("[data-reel-media]");
            if (media) {
              gsap.to(media, {
                scale: 1,
                duration: 1.6,
                ease: "expo.out",
                delay: idx * 0.08,
              });
            }
          });
        },
      });
    }

    // 2. Desktop Draggable strip with InertiaPlugin
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    let draggableInstance: Draggable[] | null = null;

    if (!isTouch && Draggable) {
      const minX = () => wrapper.clientWidth - track.scrollWidth;

      draggableInstance = Draggable.create(track, {
        type: "x",
        bounds: { minX: minX(), maxX: 0 },
        inertia: true,
        edgeResistance: 0.65,
        cursor: "grab",
        activeCursor: "grabbing",
        onDrag: updateProgress,
        onThrowUpdate: updateProgress,
      });

      function updateProgress() {
        if (!progressLine) return;
        const currentX = gsap.getProperty(track, "x") as number;
        const total = minX();
        const ratio = total !== 0 ? Math.max(0, Math.min(1, currentX / total)) : 0;
        gsap.set(progressLine, { scaleX: ratio, transformOrigin: "left center" });
      }

      const onResize = () => {
        if (draggableInstance && draggableInstance[0]) {
          draggableInstance[0].applyBounds({ minX: minX(), maxX: 0 });
          updateProgress();
        }
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        if (draggableInstance && draggableInstance[0]) {
          draggableInstance[0].kill();
        }
      };
    }
  }, [videos]);

  // Touch scroll sync with progress hairline
  const handleTouchScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!progressLineRef.current) return;
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    const ratio = maxScroll > 0 ? target.scrollLeft / maxScroll : 0;
    gsap.set(progressLineRef.current, { scaleX: ratio, transformOrigin: "left center" });
  };

  return (
    <section
      ref={sectionRef}
      id="reels"
      data-cursor-tag="Reels"
      className="relative w-full bg-neutral-900 text-white py-16 sm:py-24 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto mb-8 sm:mb-12 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-neutral-400 block mb-2">
            Selected Works
          </span>
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-5xl font-bold tracking-tight text-white leading-none">
            Motion Reels
          </h2>
        </div>

        {onOpenExplorer && (
          <button
            type="button"
            onClick={onOpenExplorer}
            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <span>See All Reels</span>
          </button>
        )}
      </div>

      {/* Draggable Strip Container (Desktop: Draggable+Inertia, Touch: scroll-snap) */}
      <div
        ref={stripWrapperRef}
        onScroll={handleTouchScroll}
        className="w-full overflow-x-auto md:overflow-hidden touch-pan-x snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        <div
          ref={stripTrackRef}
          className="flex gap-4 sm:gap-6 will-change-transform pb-4 pr-12 w-max"
        >
          {videos.map((reel) => {
            const isHovered = hoveredId === reel.id;
            const isSibling = hoveredId !== null && !isHovered;

            return (
              <div
                key={reel.id}
                data-reel-card="true"
                tabIndex={0}
                role="button"
                onClick={() => onSelectVideo(reel)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectVideo(reel);
                  }
                }}
                onMouseEnter={() => setHoveredId(reel.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative w-[240px] sm:w-[320px] md:w-[360px] aspect-[9/14] bg-neutral-950 border border-white/10 shrink-0 cursor-pointer overflow-hidden rounded-none transition-opacity duration-300 snap-center outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isSibling ? "opacity-40" : "opacity-100"
                }`}
                aria-label={`Watch ${reel.title}`}
              >
                {/* Media Container with scale 1.04 on hover */}
                <div
                  data-reel-media="true"
                  className="w-full h-full overflow-hidden relative transition-transform duration-700 ease-out"
                  style={{
                    transform: isHovered ? "scale(1.04)" : "scale(1.0)",
                  }}
                >
                  {isHovered && reel.videoUrl ? (
                    <video
                      src={reel.videoUrl}
                      poster={reel.thumbnail}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Overlay Metadata: Title and Runtime on every reel */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end">
                  <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 mb-1">
                    <span className="uppercase tracking-wider text-[#3B4DF7] font-semibold">{reel.type || "Reel"}</span>
                    <span className="tabular-nums font-bold text-white">{reel.duration || "00:45"}</span>
                  </div>
                  <h3 className="font-sans text-sm sm:text-base font-bold text-white tracking-tight truncate">
                    {reel.title}
                  </h3>
                </div>

                {/* Quick Play Indicator */}
                <div
                  className={`absolute top-4 right-4 w-9 h-9 bg-white text-neutral-950 flex items-center justify-center transition-opacity rounded-none ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thin progress hairline under the strip */}
      <div className="max-w-[1400px] mx-auto mt-6 w-full h-[2px] bg-white/10 relative overflow-hidden">
        <div
          ref={progressLineRef}
          className="h-full bg-[#3B4DF7] w-full origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
