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
  const aiFilms = films.slice(0, 5).map<ReelItem>((film) => ({
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
    duration: "AI FILM",
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
  const reelItems = [...aiFilms, ...motionReels];

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: direction === "left" ? -520 : 520,
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
    <section id="showreel" className="relative overflow-hidden border-t border-neutral-200 bg-white py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-8 md:mb-14 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              <Sparkles className="h-3.5 w-3.5 text-[#FF6A00]" />
              AI Films + Motion Archive
            </div>
            <h2 className="font-sans text-4xl font-black uppercase leading-[0.95] tracking-tight text-neutral-950 md:text-6xl lg:text-7xl">
              Motion Reels
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-500 md:text-base">
              A combined reel wall for AI films, product ads, cinematic tests, and short motion studies. Tap any frame to open the player.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden overflow-hidden rounded-full border border-neutral-200 text-[10px] font-bold uppercase tracking-widest text-neutral-500 sm:grid sm:grid-cols-2">
              <span className="bg-neutral-950 px-4 py-2 text-white">{films.length} AI Films</span>
              <span className="bg-white px-4 py-2">{videos.length} Reels</span>
            </div>
            <button
              onClick={() => scroll("left")}
              className="cursor-pointer rounded-full border border-neutral-200 bg-white p-3.5 text-neutral-800 transition-all hover:bg-neutral-950 hover:text-white active:scale-95"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="cursor-pointer rounded-full border border-neutral-200 bg-white p-3.5 text-neutral-800 transition-all hover:bg-neutral-950 hover:text-white active:scale-95"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="hidden snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-8 scrollbar-none md:flex"
          style={{ scrollbarWidth: "none" }}
        >
          {reelItems.map((item, index) => {
            const isVerticalReel = item.format === "9:16";
            const isFeatured = index === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.35) }}
                onClick={() => openItem(item)}
                className={`group relative flex-shrink-0 snap-start cursor-pointer overflow-hidden rounded-[1.4rem] border border-neutral-200 bg-neutral-950 ${
                  isFeatured ? "aspect-[16/9] w-[560px]" : isVerticalReel ? "aspect-[9/16] w-[260px]" : "aspect-video w-[420px]"
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
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/35 to-black/5" />
                <div className="absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-black/50 to-transparent" />

                <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-white px-2.5 py-1 font-sans text-[8px] font-bold uppercase tracking-widest text-black">
                    {item.kind === "film" ? "AI Film" : "Motion Reel"}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest text-white/80">
                    {item.type}
                  </span>
                </div>

                <div className="absolute right-4 top-4 z-20">
                  <span className="rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[9px] text-white/80">
                    {item.duration}
                  </span>
                </div>

                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="rounded-full bg-white p-4 text-black opacity-0 scale-90 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <Play className="h-5 w-5 translate-x-0.5 fill-black" />
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                  <div className="flex items-end justify-between gap-5">
                    <div className="min-w-0 space-y-2">
                      <span className="inline-flex items-center gap-1.5 font-sans text-[8px] font-bold uppercase tracking-widest text-neutral-300">
                        {item.isAI !== false ? <Sparkles className="h-3 w-3 text-[#FF6A00]" /> : <Film className="h-3 w-3" />}
                        {isVerticalReel ? "Vertical" : "Cinema"} / {item.year}
                      </span>
                      <h3 className="truncate font-sans text-lg font-black leading-tight text-white transition-colors group-hover:text-[#FF6A00] md:text-xl">
                        {item.title}
                      </h3>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors group-hover:bg-white group-hover:text-black">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-2 hidden justify-center md:flex">
          <button
            onClick={onOpenExplorer}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 font-sans text-[10px] font-black uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
          >
            <span>See More</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
          {reelItems.map((item) => {
            const isVerticalReel = item.format === "9:16";

            return (
              <div
                key={`${item.id}-mobile`}
                onClick={() => openItem(item)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 ${
                  isVerticalReel ? "aspect-[9/16]" : "aspect-video"
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
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/25 to-transparent" />

                <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1">
                  <span className="rounded-full bg-white px-2 py-1 font-sans text-[8px] font-bold uppercase tracking-widest text-black">
                    {item.kind === "film" ? "AI Film" : "Reel"}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/60 px-2 py-1 font-mono text-[8px] uppercase tracking-widest text-white/80">
                    {item.duration}
                  </span>
                </div>

                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="rounded-full bg-white p-3.5 text-black">
                    <Play className="h-4 w-4 translate-x-0.5 fill-black" />
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-20 p-4">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-300">{item.type}</span>
                  <h3 className="mt-1 font-sans text-base font-black leading-tight text-white">{item.title}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <button
            onClick={onOpenExplorer}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-950 bg-neutral-950 px-6 py-3 font-sans text-[10px] font-black uppercase tracking-widest text-white"
          >
            <span>See More</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
