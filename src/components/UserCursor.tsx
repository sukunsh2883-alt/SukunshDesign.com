import React, { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";

export type UserCursorProps = {
  zIndex?: number;
  children?: React.ReactNode;
};

export function UserCursor({ zIndex = 9999999, children }: UserCursorProps) {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Touch device detection (disable custom cursor on touch screens)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsTouchDevice(!!mql.matches);
    sync();
    if (mql.addEventListener) {
      mql.addEventListener("change", sync);
      return () => mql.removeEventListener("change", sync);
    }
  }, []);

  // Smooth, snappy spring physics for cursor tracking
  const springConfig = useMemo<SpringOptions>(
    () => ({ stiffness: 500, damping: 32, mass: 0.28 }),
    []
  );

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Check hovered element using high-performance event delegation (zero synchronous layout recalculations)
  const onOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) {
      setIsProject(false);
      return;
    }
    const isProjectCard = !!target.closest(
      '[data-cursor-project], [data-project-card], .project-card, [data-project-id], #projects [role="button"], #projects .group, .editorial-project-card, [data-role="project-item"]'
    );
    setIsProject(isProjectCard);
  }, []);

  // Global pointer listeners
  useEffect(() => {
    if (isTouchDevice || typeof window === "undefined") return;

    const onMove = (e: MouseEvent | PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!hovering) setHovering(true);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const onLeave = () => {
      setHovering(false);
      setIsProject(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { capture: true });
    window.addEventListener("mouseup", onUp, { capture: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown, { capture: true });
      window.removeEventListener("mouseup", onUp, { capture: true });
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [isTouchDevice, mouseX, mouseY, hovering, onOver]);

  if (isTouchDevice || !mounted) {
    return children ? <>{children}</> : null;
  }

  // Transparent without fill, small outline circle with VIEW PROJECT text
  const cursorNode = (
    <div
      id="project-hover-cursor-root"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
        initial={false}
        animate={{
          scale: isProject ? (pressed ? 0.9 : 1) : 0,
          opacity: hovering && isProject ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 460,
          damping: 28,
          mass: 0.28,
        }}
      >
        {/* Small transparent outline circle: no fill, crisp white outline, VIEW PROJECT text */}
        <div
          style={{
            transform: "translate(-50%, -50%)",
          }}
          className="w-14 h-14 sm:w-[58px] sm:h-[58px] rounded-full bg-transparent border border-white flex flex-col items-center justify-center select-none"
        >
          <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none leading-none gap-0.5">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[7.5px] font-extrabold tracking-[0.14em] uppercase text-white">
              VIEW
            </span>
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[7.5px] font-extrabold tracking-[0.14em] uppercase text-white">
              PROJECT
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      {typeof document !== "undefined" ? createPortal(cursorNode, document.body) : null}
      {children}
    </>
  );
}

export default UserCursor;
