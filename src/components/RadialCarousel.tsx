import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export interface RadialCarouselItem {
  id: string | number;
  title: string;
  subtitle?: string;
  duration?: string;
  image: string;
  category?: string;
  link?: string;
}

export interface RadialCarouselProps {
  items?: RadialCarouselItem[];
  title?: string;
  description?: string;
  onSelectProject?: (item: RadialCarouselItem) => void;
  className?: string;
}

const DEFAULT_AI_REELS: RadialCarouselItem[] = [
  {
    id: 'reel-1',
    title: 'RIVE — AI Short Film',
    subtitle: 'Runway Gen-3 Alpha',
    duration: '0:45',
    image: 'https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png',
    category: 'AI Cinematic Reel',
  },
  {
    id: 'reel-2',
    title: 'Cyberpunk Monolith',
    subtitle: 'Sora Generative Video',
    duration: '0:30',
    image: 'https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_44_cmxx0z.png',
    category: 'Motion AI Reel',
  },
  {
    id: 'reel-3',
    title: 'Atmospheric Dreams',
    subtitle: 'Luma Dream Machine',
    duration: '0:25',
    image: 'https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_41_knefoc.png',
    category: 'Visual Loop Reel',
  },
  {
    id: 'reel-4',
    title: 'Neural Odyssey',
    subtitle: 'Kling 1.5 Synthesis',
    duration: '1:10',
    image: 'https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056274/image_36_hyojxm.png',
    category: 'AI Short Reel',
  },
  {
    id: 'reel-5',
    title: 'Kinetic Motion Poem',
    subtitle: 'Pika Labs 2.0',
    duration: '0:40',
    image: 'https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png',
    category: 'Experimental Reel',
  },
  {
    id: 'reel-6',
    title: 'Synthesized Reality',
    subtitle: 'Midjourney + Mid2Video',
    duration: '0:55',
    image: 'https://i.pinimg.com/736x/1a/3a/5a/1a3a5a4aa505042bcf531eb8b1b204e7.jpg',
    category: '3D AI World',
  },
  {
    id: 'reel-7',
    title: 'Echoes of Eternity',
    subtitle: 'Stable Video Diffusion',
    duration: '0:35',
    image: 'https://i.pinimg.com/736x/11/6e/98/116e9875f720a25a50c4aac456f50bdd.jpg',
    category: 'Sci-Fi AI Reel',
  },
];

export const RadialCarousel: React.FC<RadialCarouselProps> = ({
  items = DEFAULT_AI_REELS,
  title,
  description,
  onSelectProject,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(Math.floor(items.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);

  const move = useCallback(
    (dir: number) => {
      setCurrentIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return 0;
        if (next >= items.length) return items.length - 1;
        return next;
      });
    },
    [items.length]
  );

  // Wheel listener
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 300) return;
      if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;

      lastWheelTime.current = now;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      move(delta > 0 ? 1 : -1);
    },
    [move]
  );

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      move(diff > 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  const currentItem = items[currentIndex] || items[0];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`radial-carousel-stage relative w-full py-10 md:py-16 flex flex-col justify-between items-center overflow-hidden bg-black text-white select-none ${className}`}
    >
      {/* Title Header (Only if title or description provided) */}
      {(title || description) && (
        <div className="relative z-20 text-center max-w-xl px-6 mb-2">
          {title && (
            <h2 className="text-2xl md:text-4xl font-sans tracking-tight text-white font-semibold mb-1">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xs md:text-sm text-neutral-400 font-sans tracking-wide">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Smooth Non-Overlapping Carousel Track */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] my-4 flex items-center justify-center">
        <div className="relative w-full max-w-[1200px] h-full flex items-center justify-center">
          {items.map((item, i) => {
            const distance = i - currentIndex;
            const absDistance = Math.abs(distance);
            const isActive = i === currentIndex;

            // Compute exact horizontal offset so cards sit close together without overlapping
            // Card widths: 170px (mobile), 200px (sm), 230px (md)
            // Card spacing step = card width + 16px gap
            const spacing = typeof window !== 'undefined' && window.innerWidth < 640 ? 186 : 246;
            const translateX = distance * spacing;
            const translateY = Math.pow(absDistance, 1.4) * 6; // Subtle gentle arch
            const scale = isActive ? 1.04 : Math.max(0.85, 0.95 - absDistance * 0.04);

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isActive && onSelectProject) {
                    onSelectProject(item);
                  } else {
                    setCurrentIndex(i);
                  }
                }}
                className={`card absolute w-[170px] sm:w-[200px] md:w-[230px] h-[240px] sm:h-[290px] md:h-[330px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border ${
                  isActive
                    ? 'border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                    : 'border-white/15 hover:border-white/40 shadow-lg'
                }`}
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                  filter: isActive
                    ? 'brightness(1.0) contrast(1.05)'
                    : `brightness(${Math.max(0.3, 0.65 - absDistance * 0.12)}) contrast(0.95)`,
                  opacity: absDistance > 3 ? 0 : 1,
                  pointerEvents: absDistance > 3 ? 'none' : 'auto',
                  zIndex: isActive ? 30 : 20 - absDistance,
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50" />

                {/* Play Button Icon Only — No text on cards */}
                <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}>
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimal Clean Controls */}
      <div className="relative z-20 text-center max-w-sm px-6 flex flex-col items-center gap-3">
        {/* Active Title */}
        <div className="min-h-[24px] flex items-center justify-center">
          <p className="text-xs md:text-sm font-medium text-white tracking-tight">
            {currentItem?.title}
            {currentItem?.subtitle && (
              <span className="text-neutral-400 text-xs font-mono ml-2">({currentItem.subtitle})</span>
            )}
          </p>
        </div>

        {/* Arrow Navigation & Dots */}
        <div className="nav flex items-center justify-center gap-3">
          <button
            onClick={() => move(-1)}
            disabled={currentIndex === 0}
            type="button"
            className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 active:scale-95 disabled:opacity-20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-md"
            aria-label="Previous reel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to reel ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => move(1)}
            disabled={currentIndex === items.length - 1}
            type="button"
            className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 active:scale-95 disabled:opacity-20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-md"
            aria-label="Next reel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadialCarousel;

