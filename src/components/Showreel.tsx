import { useRef } from "react";
import { ArrowLeft, ArrowRight, Film, Play, Sparkles } from "lucide-react";
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
      isAI?: boolean;
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
      isAI?: boolean;
      source: VideoCard;
      format: "16:9" | "9:16";
      duration: string;
    };

export default function Showreel({ videos, films, onSelectVideo, onSelectFilm, onOpenExplorer }: ShowreelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const aiFilms = films.slice(0, 4).map<ReelItem>((film) => ({
    kind: "film",
    id: `film-${film.id}`,
    title: film.title,
    type: film.category,
    thumbnail: film.thumbnail,
    videoUrl: film.videoUrl,
    year: film.year,
    isAI: film.isAI !== false,
    source: film,
    format: "16:9",
    duration: "AI film",
  }));
  const motionReels = videos.map<ReelItem>((video) => ({
    kind: "reel",
    id: `reel-${video.id}`,
    title: video.title,
    type: video.type,
    thumbnail: video.thumbnail,
    videoUrl: video.videoUrl,
    year: video.year,
    isAI: video.isAI,
    source: video,
    format: video.format,
    duration: video.duration,
  }));
  const reelItems = [...motionReels, ...aiFilms];

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: direction === "left" ? -460 : 460,
      behavior: "smooth",
    });
  };

  const openItem = (item: ReelItem) => {
    if (item.kind === "film") {
      onSelectFilm(item.source);
    } else {
      onSelectVideo(item.source);
    }
  };

  return (
    <section id="showreel" className="relative overflow-hidden bg-neutral-950 px-4 py-20 text-white sm:px-6 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,106,0,0.22),transparent_25%),radial-gradient(circle_at_78%_10%,rgba(255,255,255,0.11),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:auto,auto,34px_34px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-white/60 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-[#FF6A00]" />
              AI films and motion reels
            </div>
            <h2 className="max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              motion work that feels alive.
            </h2>
          </div>

          <div className="max-w-2xl lg:ml-auto">
            <p className="text-base leading-8 text-white/60">
              Short AI films, product ad reels, cinematic tests, and motion experiments. This keeps the energy, but frames it like a professional media archive.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="grid grid-cols-2 overflow-hidden rounded-full border border-white/10 text-[12px] font-semibold text-white/60">
                <span className="bg-white px-4 py-2 text-neutral-950">{films.length} films</span>
                <span className="px-4 py-2">{videos.length} reels</span>
              </div>
              <button
                onClick={() => scroll("left")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white hover:text-neutral-950"
                aria-label="Scroll left"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white hover:text-neutral-950"
                aria-label="Scroll right"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-8 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {reelItems.map((item, index) => {
            const isVertical = item.format === "9:16";
            const widthClass = isVertical ? "w-[240px] sm:w-[280px]" : "w-[340px] sm:w-[460px]";

            return (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.28), ease: [0.16, 1, 0.3, 1] }}
                onClick={() => openItem(item)}
                className={`group relative shrink-0 snap-start overflow-hidden rounded-[32px] border border-white/10 bg-white/5 text-left shadow-[0_28px_90px_rgba(0,0,0,0.28)] ${widthClass} ${
                  isVertical ? "aspect-[9/16]" : "aspect-video"
                }`}
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
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/92 via-black/28 to-black/5" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-neutral-950">
                    {item.kind === "film" ? "AI film" : "AI reel"}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white/75 backdrop-blur-md">
                    {item.duration}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <Play className="h-5 w-5 translate-x-0.5 fill-neutral-950" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/55">
                    {item.isAI !== false ? <Sparkles className="h-3.5 w-3.5 text-[#FF6A00]" /> : <Film className="h-3.5 w-3.5" />}
                    {item.type} / {item.year}
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                    {item.title}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-2 flex justify-center">
          <button
            onClick={onOpenExplorer}
            className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-[#FF6A00] hover:text-white active:translate-y-0"
          >
            <span>open AI archive</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
