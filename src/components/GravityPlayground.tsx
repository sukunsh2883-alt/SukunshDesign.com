import { PointerEvent, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export default function GravityPlayground() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const assetRefs = useRef<HTMLButtonElement[]>([]);
  const dragState = useRef<{
    element: HTMLButtonElement;
    pointerId: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

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
        x: 2 + ((index * 6.4) % 96),
        lift: 8 + ((index * 17) % 82),
        width: 44 + ((index * 13) % 70),
        rotate: -16 + ((index * 11) % 32),
      })),
      ...organicAssets.map((name, index) => ({
        id: name,
        src: `/SVG for bottom gravity/SVG/${name}.svg`,
        x: 5 + ((index * 8.7) % 90),
        lift: 28 + ((index * 23) % 90),
        width: 88 + ((index * 17) % 92),
        rotate: -18 + ((index * 9) % 36),
      })),
    ];
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const assets = assetRefs.current.filter(Boolean);
    if (!stage || assets.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(assets, { opacity: 1, transformOrigin: "50% 100%" });
    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        assets,
        { opacity: 0, y: -160, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.45,
          ease: "bounce.out",
          stagger: { each: 0.008, from: "random" },
        },
      );

      assets.forEach((asset, index) => {
        gsap.to(asset, {
          y: `-=${3 + (index % 5)}`,
          rotate: `+=${index % 2 ? 2.5 : -2.5}`,
          duration: 2.6 + (index % 6) * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (index % 9) * 0.07,
        });
      });
    }, stage);

    return () => context.revert();
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    const element = assetRefs.current[index];
    if (!element || !stageRef.current) return;

    element.setPointerCapture(event.pointerId);
    gsap.killTweensOf(element);
    const currentX = Number(gsap.getProperty(element, "x")) || 0;
    const currentY = Number(gsap.getProperty(element, "y")) || 0;

    dragState.current = {
      element,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: currentX,
      baseY: currentY,
    };

    gsap.to(element, { scale: 1.12, rotate: 0, duration: 0.18, ease: "power2.out" });
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    const x = state.baseX + event.clientX - state.startX;
    const y = state.baseY + event.clientY - state.startY;
    gsap.set(state.element, { x, y, zIndex: 300 });
  };

  const dropAsset = (event: PointerEvent<HTMLButtonElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    try {
      state.element.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }

    const currentX = Number(gsap.getProperty(state.element, "x")) || 0;
    const currentY = Number(gsap.getProperty(state.element, "y")) || 0;
    const floorY = Math.min(0, currentY);

    gsap.to(state.element, {
      x: currentX * 0.82,
      y: floorY,
      scale: 1,
      rotate: -10 + Math.random() * 20,
      duration: 0.9,
      ease: "bounce.out",
      zIndex: 120,
      overwrite: true,
    });

    dragState.current = null;
  };

  return (
    <section id="gravity-playground" className="relative overflow-hidden bg-[#050505] pt-14 text-white md:pt-20">
      <div className="mx-auto max-w-[1680px] px-4 md:px-8">
        <div
          ref={stageRef}
          className="relative h-[430px] cursor-grab overflow-hidden active:cursor-grabbing md:h-[540px]"
          aria-label="Interactive falling artwork assets"
        >
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[#8277e7] md:h-36" />
          <div className="absolute inset-x-0 bottom-28 h-px bg-white/15 md:bottom-36" />

          {gravityAssets.map((asset, index) => (
            <button
              key={asset.id}
              ref={(node) => {
                if (node) assetRefs.current[index] = node;
              }}
              type="button"
              onPointerDown={(event) => onPointerDown(event, index)}
              onPointerMove={onPointerMove}
              onPointerUp={dropAsset}
              onPointerCancel={dropAsset}
              className="absolute bottom-28 touch-none select-none bg-transparent p-0 outline-none md:bottom-36"
              style={{
                left: `${asset.x}%`,
                marginBottom: `${asset.lift}px`,
                width: `${asset.width}px`,
                rotate: `${asset.rotate}deg`,
                zIndex: 20 + Math.round(asset.lift),
              }}
              aria-label="Move artwork asset"
            >
              <img src={asset.src} alt="" draggable={false} className="h-auto w-full select-none object-contain" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
