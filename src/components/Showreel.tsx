import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AIFilm, VideoCard } from "../portfolioData";

interface ShowreelProps {
  videos: VideoCard[];
  films: AIFilm[];
  onSelectVideo: (video: VideoCard) => void;
  onSelectFilm: (film: AIFilm) => void;
  onOpenExplorer: () => void;
}

export default function Showreel({ videos, films, onSelectVideo, onSelectFilm, onOpenExplorer }: ShowreelProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const items = [
    ...videos.map((video) => ({ id: video.id, title: video.title, kind: "video" as const, source: video, image: video.thumbnail, meta: `${video.duration} / ${video.type}` })),
    ...films.map((film) => ({ id: film.id, title: film.title, kind: "film" as const, source: film, image: film.thumbnail, meta: `${film.year} / ${film.category}` })),
  ].slice(0, 8);

  const openItem = (item: (typeof items)[number]) => {
    if (item.kind === "video") onSelectVideo(item.source);
    else onSelectFilm(item.source);
  };

  const scroll = (amount: number) => {
    rowRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="showreel" className="bg-[#050505] px-6 py-16 text-white md:px-8 md:py-24">
      <div className="mx-auto max-w-[1520px]">
        <div ref={rowRef} className="flex gap-4 overflow-x-auto pb-6 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openItem(item)}
              className="group w-[175px] shrink-0 text-left md:w-[320px]"
            >
              <div className="aspect-[0.82] overflow-hidden bg-[#d9d9d9]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-500 group-hover:scale-[1.04]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[-0.04em] text-white md:text-sm">
                {item.title}
              </h3>
              <p className="mt-1 text-center text-[7px] font-medium uppercase text-white/55 md:text-[10px]">
                {item.meta}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={onOpenExplorer} className="text-xs text-white/55 hover:text-white">
            See More
          </button>
          <div className="flex gap-3">
            <button onClick={() => scroll(-360)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white hover:border-white" aria-label="Scroll left">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scroll(360)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white hover:border-white" aria-label="Scroll right">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
