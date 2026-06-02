import { useRef } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { AIFilm, VideoCard } from "../portfolioData";

interface ShowreelProps {
  videos: VideoCard[];
  films: AIFilm[];
  onSelectVideo: (video: VideoCard) => void;
  onSelectFilm: (film: AIFilm) => void;
  onOpenExplorer: () => void;
}

type ReelItem =
  | {
      kind: "film";
      id: string;
      title: string;
      type: string;
      thumbnail: string;
      videoUrl: string;
      year: string;
      source: AIFilm;
      format: "16:9";
      duration: string;
    }
  | {
      kind: "reel";
      id: string;
      title: string;
      type: string;
      thumbnail: string;
      videoUrl: string;
      year: string;
      source: VideoCard;
      format: "16:9" | "9:16";
      duration: string;
    };

export default function Showreel({ videos, films, onSelectVideo, onSelectFilm, onOpenExplorer }: ShowreelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reelItems: ReelItem[] = [
    ...videos.map((video) => ({
      kind: "reel" as const,
      id: `reel-${video.id}`,
      title: video.title,
      type: video.type,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      year: video.year,
      source: video,
      format: video.format,
      duration: video.duration,
    })),
    ...films.slice(0, 4).map((film) => ({
      kind: "film" as const,
      id: `film-${film.id}`,
      title: film.title,
      type: film.category,
      thumbnail: film.thumbnail,
      videoUrl: film.videoUrl,
      year: film.year,
      source: film,
      format: "16:9" as const,
      duration: "AI film",
    })),
  ];

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  };

  const openItem = (item: ReelItem) => {
    if (item.kind === "film") onSelectFilm(item.source);
    else onSelectVideo(item.source);
  };

  return (
    <section id="showreel" className="bg-neutral-950 px-4 py-20 text-white md:px-6">
      <div className="mx-auto max-w-7xl border-b border-white/15 pb-14">
        <div className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-3 text-sm font-medium text-[#FF6A00]">AI films / reels</p>
            <h2 className="text-[42px] font-medium leading-none tracking-[-0.04em] md:text-7xl">
              motion
            </h2>
          </div>
          <div className="max-w-xl md:ml-auto">
            <p className="text-base leading-7 text-white/60">
              AI films, product ads, cinematic tests.
            </p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => scroll("left")} className="border border-white/20 p-3 text-white hover:bg-white hover:text-neutral-950" aria-label="Scroll left">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scroll("right")} className="border border-white/20 p-3 text-white hover:bg-white hover:text-neutral-950" aria-label="Scroll right">
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={onOpenExplorer} className="border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white hover:text-neutral-950">
                archive
              </button>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="flex gap-3 overflow-x-auto pb-6 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {reelItems.map((item, index) => {
            const isVertical = item.format === "9:16";
            return (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.18) }}
                onClick={() => openItem(item)}
                className={`group relative shrink-0 overflow-hidden border border-white/15 bg-black text-left ${isVertical ? "aspect-[9/16] w-[230px]" : "aspect-video w-[380px]"}`}
              >
                <video
                  src={item.videoUrl}
                  poster={item.thumbnail}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={item.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent p-4 pt-16">
                  <p className="mb-2 text-xs text-white/55">{item.kind === "film" ? "AI film" : "AI reel"} / {item.year}</p>
                  <h3 className="text-lg font-medium tracking-[-0.02em]">{item.title}</h3>
                </div>
                <span className="absolute right-4 top-4 border border-white/25 bg-black/40 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-4 w-4 fill-white" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
