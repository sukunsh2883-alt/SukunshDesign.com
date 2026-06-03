import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { AIFilm, VideoCard } from "../portfolioData";

interface ShowreelProps {
  videos: VideoCard[];
  films: AIFilm[];
  onSelectVideo: (video: VideoCard) => void;
  onSelectFilm: (film: AIFilm) => void;
  onOpenExplorer: () => void;
}

export default function Showreel({ videos, films, onSelectVideo, onSelectFilm, onOpenExplorer }: ShowreelProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const assetRefs = useRef<HTMLButtonElement[]>([]);
  const innerRefs = useRef<HTMLImageElement[]>([]);
  const items = [
    ...videos.map((video) => ({ id: video.id, title: video.title, kind: "video" as const, source: video, image: video.thumbnail, meta: `${video.duration} / ${video.type}` })),
    ...films.map((film) => ({ id: film.id, title: film.title, kind: "film" as const, source: film, image: film.thumbnail, meta: `${film.year} / ${film.category}` })),
  ].slice(0, 8);

  const gravityAssets = useMemo(() => {
    const assetNumbers = Array.from({ length: 159 }, (_, index) => index + 12).filter((number) => number !== 59);
    const organicAssets = [
      "flower_1",
      "flower_2",
      "flower_3",
      "flower_5",
      "flower_6",
      "flower_7",
      "flower_8",
      "flower_9",
      "leaf_1",
      "leaf_1_1",
      "leaf_2",
    ];

    return [
      ...assetNumbers.map((number, index) => ({
        id: `asset-${number}`,
        src: `/SVG for bottom gravity/SVG/Asset ${number}.svg`,
        x: 3 + ((index * 7.3) % 94),
        y: 22 + ((index * 19) % 70),
        width: 30 + ((index * 11) % 52),
        rotate: -18 + ((index * 13) % 36),
      })),
      ...organicAssets.map((name, index) => ({
        id: name,
        src: `/SVG for bottom gravity/SVG/${name}.svg`,
        x: 7 + ((index * 9.5) % 86),
        y: 3 + ((index * 17) % 38),
        width: 56 + ((index * 13) % 72),
        rotate: -14 + ((index * 9) % 28),
      })),
    ];
  }, []);

  const openLoopItem = (index: number) => {
    const item = items[index % items.length];
    if (!item) {
      onOpenExplorer();
      return;
    }

    if (item.kind === "video") onSelectVideo(item.source);
    else onSelectFilm(item.source);
  };

  useEffect(() => {
    const stage = stageRef.current;
    const assets = assetRefs.current.filter(Boolean);
    const inners = innerRefs.current.filter(Boolean);
    if (!stage || assets.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(assets, { opacity: 1, x: 0, y: 0, transformOrigin: "50% 100%" });
    gsap.set(inners, { transformOrigin: "50% 100%" });

    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        assets,
        { opacity: 0, y: -90, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "bounce.out",
          stagger: { each: 0.01, from: "random" },
        },
      );

      inners.forEach((inner, index) => {
        gsap.to(inner, {
          y: -4 - (index % 5),
          rotate: `+=${index % 2 ? 5 : -5}`,
          duration: 2.8 + (index % 7) * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (index % 11) * 0.08,
        });
      });

      const onPointerMove = (event: PointerEvent) => {
        const rect = stage.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;

        assets.forEach((asset, index) => {
          const assetRect = asset.getBoundingClientRect();
          const assetX = assetRect.left - rect.left + assetRect.width / 2;
          const assetY = assetRect.top - rect.top + assetRect.height / 2;
          const deltaX = assetX - pointerX;
          const deltaY = assetY - pointerY;
          const distance = Math.hypot(deltaX, deltaY);
          const force = Math.max(0, 1 - distance / 240);

          gsap.to(asset, {
            x: deltaX * force * 0.18,
            y: Math.min(0, deltaY * force * 0.12) - force * 16,
            rotate: (index % 2 ? 1 : -1) * force * 16,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      const onPointerLeave = () => {
        gsap.to(assets, {
          x: 0,
          y: 0,
          rotate: 0,
          duration: 1,
          ease: "elastic.out(1, 0.55)",
          stagger: { each: 0.003, from: "random" },
          overwrite: "auto",
        });
      };

      stage.addEventListener("pointermove", onPointerMove);
      stage.addEventListener("pointerleave", onPointerLeave);

      return () => {
        stage.removeEventListener("pointermove", onPointerMove);
        stage.removeEventListener("pointerleave", onPointerLeave);
      };
    }, stage);

    return () => context.revert();
  }, []);

  return (
    <section id="showreel" className="relative overflow-hidden bg-[#050505] text-white">
      <div className="mx-auto max-w-[1680px] px-6 pt-14 md:px-8 md:pt-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold tracking-[-0.06em] text-white md:text-5xl">AI films</h2>
          <button onClick={onOpenExplorer} className="text-xs font-medium tracking-[-0.02em] text-white/60 transition-colors hover:text-white">
            See more
          </button>
        </div>

        <div
          ref={stageRef}
          className="relative h-[330px] overflow-hidden md:h-[460px]"
          aria-label="Interactive AI films artwork floor"
        >
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[#7f78e6] md:h-32" />
          <div className="absolute inset-x-0 bottom-24 h-px bg-white/12 md:bottom-32" />

          {gravityAssets.map((asset, index) => (
            <button
              key={asset.id}
              ref={(node) => {
                if (node) assetRefs.current[index] = node;
              }}
              type="button"
              onClick={() => openLoopItem(index)}
              className="absolute bottom-24 flex cursor-pointer items-end justify-center bg-transparent p-0 outline-none md:bottom-32"
              style={{
                left: `${asset.x}%`,
                marginBottom: `${asset.y}px`,
                width: `${asset.width}px`,
                rotate: `${asset.rotate}deg`,
                zIndex: Math.round(asset.y),
              }}
              aria-label="Open AI film"
            >
              <img
                ref={(node) => {
                  if (node) innerRefs.current[index] = node;
                }}
                src={asset.src}
                alt=""
                draggable={false}
                className="h-auto w-full select-none object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
