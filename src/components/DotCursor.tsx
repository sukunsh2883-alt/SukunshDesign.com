import { useEffect, useRef } from "react";

export default function DotCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches || !dotRef.current) return;

    let frame = 0;
    let x = -24;
    let y = -24;

    const render = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      frame = 0;
    };

    const move = (event: PointerEvent) => {
      x = event.clientX - 5;
      y = event.clientY - 5;
      dotRef.current?.classList.add("is-visible");
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={dotRef} className="dot-cursor" aria-hidden="true" />;
}
