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
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const show = () => dotRef.current?.classList.add("is-visible");
    const hide = () => dotRef.current?.classList.remove("is-visible");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerenter", show);
    window.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerenter", show);
      window.removeEventListener("pointerleave", hide);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={dotRef} className="dot-cursor" aria-hidden="true" />;
}
