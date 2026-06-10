import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AIFilm, VideoCard } from "../portfolioData";

interface ShowreelProps {
  videos: VideoCard[];
  films: AIFilm[];
  onSelectVideo: (video: VideoCard) => void;
  onSelectFilm: (film: AIFilm) => void;
  onOpenExplorer: () => void;
}

export default function Showreel({ videos, films, onSelectVideo, onSelectFilm, onOpenExplorer }: ShowreelProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const items = [
    ...videos.map((video) => ({ id: video.id, title: video.title, kind: "video" as const, source: video, image: video.thumbnail, videoUrl: video.videoUrl, meta: `${video.duration} / ${video.type}` })),
    ...films.map((film) => ({ id: film.id, title: film.title, kind: "film" as const, source: film, image: film.thumbnail, videoUrl: film.videoUrl, meta: `${film.year} / ${film.category}` })),
  ].slice(0, 8);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const title = titleRef.current;
    if (!section || !track || !title) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let removeDriftHover: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".ai-film-card");

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          end: "bottom 50%",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: "power2.out",
        },
      });

      revealTl
        .fromTo(title, {
          y: 52,
          opacity: 0,
          filter: "blur(12px)",
        }, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.28,
        }, 0)
        .fromTo(cards, {
          y: (index) => 110 + (index % 3) * 24,
          x: (index) => (index % 2 === 0 ? -28 : 28),
          rotation: (index) => (index % 2 === 0 ? -5 : 5),
          scale: 0.9,
          opacity: 0,
        }, {
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          stagger: 0.045,
          duration: 0.72,
        }, 0.08);

      if (!reduceMotion) {
        const drift = gsap.to(track, {
          xPercent: -12,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        const slowDrift = () => gsap.to(drift, { timeScale: 0.25, duration: 0.5, ease: "power2.out" });
        const resumeDrift = () => gsap.to(drift, { timeScale: 1, duration: 0.5, ease: "power2.out" });

        section.addEventListener("mouseenter", slowDrift);
        section.addEventListener("mouseleave", resumeDrift);
        removeDriftHover = () => {
          section.removeEventListener("mouseenter", slowDrift);
          section.removeEventListener("mouseleave", resumeDrift);
        };
      }
    }, section);

    return () => {
      removeDriftHover?.();
      ctx.revert();
    };
  }, []);

  const openItem = (item: (typeof items)[number]) => {
    if (item.kind === "video") onSelectVideo(item.source);
    else onSelectFilm(item.source);
  };

  const scroll = (amount: number) => {
    rowRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="showreel" className="bg-[#0b0a08] px-6 py-16 text-[#f4f1e8] md:px-8 md:py-24">
      <div className="mx-auto max-w-[1520px]">
        <div className="section-title mb-8 flex items-end justify-between gap-6">
          <h2 ref={titleRef} className="text-3xl font-semibold tracking-normal text-[#f4f1e8] md:text-5xl">AI films</h2>
          <button type="button" onClick={onOpenExplorer} className="relative z-10 text-xs font-medium tracking-normal text-[#f4f1e8]/70 transition-colors hover:text-[#f4f1e8]">
            See more
          </button>
        </div>

        <div ref={rowRef} className="flex gap-4 overflow-x-auto pb-6 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <div ref={trackRef} className="ai-films-track flex gap-4 will-change-transform">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item)}
                className="ai-film-card group w-[175px] shrink-0 text-left md:w-[320px]"
              >
                <div className="aspect-[0.82] overflow-hidden border border-[#f4f1e8]/10 bg-[#171512] transition duration-700 group-hover:scale-[1.03] group-hover:border-[#f4f1e8]/22 group-hover:brightness-110">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.image}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover grayscale-[0.1] transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-700 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <h3 className="mt-4 text-center text-[10px] font-semibold tracking-normal text-[#f4f1e8] md:text-sm">
                  {item.title}
                </h3>
                <p className="mt-1 text-center text-[7px] font-medium text-[#f4f1e8]/55 md:text-[10px]">
                  {item.meta}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button onClick={() => scroll(-360)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f4f1e8]/25 text-[#f4f1e8] hover:border-[#f4f1e8]" aria-label="Scroll left">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(360)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f4f1e8]/25 text-[#f4f1e8] hover:border-[#f4f1e8]" aria-label="Scroll right">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
