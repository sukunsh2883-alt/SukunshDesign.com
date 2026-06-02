import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    ...videos.map((video) => ({ id: video.id, title: video.title, kind: "video" as const, source: video })),
    ...films.slice(0, 3).map((film) => ({ id: film.id, title: film.title, kind: "film" as const, source: film })),
  ].slice(0, 5);

  const openItem = (item: (typeof items)[number]) => {
    if (item.kind === "video") onSelectVideo(item.source);
    else onSelectFilm(item.source);
  };

  const scroll = (amount: number) => {
    rowRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="showreel" className="bg-[#080808] px-3 py-5 text-white md:px-4 md:py-12">
      <div className="mx-auto max-w-5xl border-b border-white/10 pb-8 md:pb-14">
        <h2 className="mb-5 px-4 text-[21px] font-semibold tracking-[-0.04em] md:px-8 md:text-5xl">
          AI films
        </h2>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => scroll(-260)} className="px-1 text-white hover:text-[#FF6A00]" aria-label="Scroll left">
            <ChevronLeft className="h-5 w-5 md:h-7 md:w-7" />
          </button>

          <div ref={rowRef} className="flex flex-1 items-end gap-1.5 overflow-x-auto scrollbar-none md:gap-3" style={{ scrollbarWidth: "none" }}>
            {items.map((item, index) => {
              const isCenter = index === 2;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openItem(item)}
                  className={`${isCenter ? "h-[92px] w-[58px] md:h-[260px] md:w-[150px]" : "h-[74px] w-[47px] md:h-[210px] md:w-[122px]"} shrink-0 bg-[#d9d9d9] transition-colors hover:bg-[#FF6A00]`}
                  aria-label={item.title}
                />
              );
            })}
          </div>

          <button onClick={() => scroll(260)} className="px-1 text-white hover:text-[#FF6A00]" aria-label="Scroll right">
            <ChevronRight className="h-5 w-5 md:h-7 md:w-7" />
          </button>
        </div>

        <div className="mt-3 text-center">
          <button onClick={onOpenExplorer} className="text-[9px] text-white/70 hover:text-white md:text-xs">
            See More
          </button>
        </div>
      </div>
    </section>
  );
}
