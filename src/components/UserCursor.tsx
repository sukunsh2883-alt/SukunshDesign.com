import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, animate, type SpringOptions } from "motion/react";

export type UserCursorProps = {
  name?: string;
  color?: string;
  size?: number;
  hideNativeCursor?: boolean;
  hideOnTouch?: boolean;
  zIndex?: number;
  pressScale?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const COMPONENT_DEFAULTS = {
  color: "#09090b",
  size: 26,
  pressScale: 0.88,
  hideNativeCursor: true,
  hideOnTouch: true,
  zIndex: 9999999,
};

export function UserCursor(props: UserCursorProps) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const {
    size,
    pressScale,
    hideNativeCursor,
    hideOnTouch,
    zIndex,
    children,
  } = mergedProps;

  // Client-side portal mount container
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- touch detection -----------------------------------------------------
  useEffect(() => {
    if (!hideOnTouch) {
      setIsTouchDevice(false);
      return;
    }
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsTouchDevice(!!mql.matches);
    sync();
    if (mql.addEventListener) {
      mql.addEventListener("change", sync);
      return () => mql.removeEventListener("change", sync);
    }
    const legacy = mql as MediaQueryList & {
      addListener?: (l: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (l: (e: MediaQueryListEvent) => void) => void;
    };
    legacy.addListener?.(sync);
    return () => legacy.removeListener?.(sync);
  }, [hideOnTouch]);

  // Apply cursor: none class to document when active
  useEffect(() => {
    if (hideNativeCursor && !isTouchDevice && typeof document !== "undefined") {
      document.documentElement.classList.add("custom-cursor-active");
      document.body.classList.add("custom-cursor-active");
      return () => {
        document.documentElement.classList.remove("custom-cursor-active");
        document.body.classList.remove("custom-cursor-active");
      };
    }
  }, [hideNativeCursor, isTouchDevice]);

  // Fast, responsive spring physics for cursor position
  const arrowSpring = useMemo<SpringOptions>(
    () => ({ stiffness: 600, damping: 38, mass: 0.35 }),
    []
  );

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const cursorX = useSpring(mouseX, arrowSpring);
  const cursorY = useSpring(mouseY, arrowSpring);

  // Press & hover scale
  const scaleMV = useMotionValue(1);
  useEffect(() => {
    const targetScale = pressed ? pressScale : isInteractive ? 1.14 : 1;
    const controls = animate(scaleMV, targetScale, {
      type: "spring",
      stiffness: 450,
      damping: 25,
      mass: 0.4,
    });
    return () => controls.stop();
  }, [pressed, isInteractive, pressScale, scaleMV]);

  // Check if hovering over clickable / interactive target
  const checkInteractiveTarget = useCallback((clientX: number, clientY: number) => {
    if (typeof document === "undefined") return;
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) {
      setIsInteractive(false);
      return;
    }

    const isClickable = !!el.closest(
      'a, button, [role="button"], input, select, textarea, [data-project-card], .project-card, .wave-reel-card, .ai-film-card, .interactive-target, [tabindex="0"]'
    );
    setIsInteractive(isClickable);
  }, []);

  // Global pointer listeners across the entire document & window
  useEffect(() => {
    if (isTouchDevice || typeof window === "undefined") return;

    const onMove = (e: MouseEvent | PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!hovering) setHovering(true);
      checkInteractiveTarget(e.clientX, e.clientY);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const onLeave = () => {
      setHovering(false);
      setIsInteractive(false);
    };

    const onScroll = () => {
      // Recheck element under mouse after scroll
      const currentX = mouseX.get();
      const currentY = mouseY.get();
      if (currentX >= 0 && currentY >= 0) {
        checkInteractiveTarget(currentX, currentY);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true, capture: true });
    window.addEventListener("pointermove", onMove, { passive: true, capture: true });
    window.addEventListener("mousedown", onDown, { capture: true });
    window.addEventListener("mouseup", onUp, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove, { capture: true });
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("mousedown", onDown, { capture: true });
      window.removeEventListener("mouseup", onUp, { capture: true });
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [isTouchDevice, mouseX, mouseY, hovering, checkInteractiveTarget]);

  if (isTouchDevice || !mounted) {
    return children ? <>{children}</> : null;
  }

  // Pure Minimalist Modern Cursor Portal (no tag / label, persistent across entire site)
  const cursorNode = (
    <div
      id="site-custom-cursor"
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
          scale: scaleMV,
          width: size,
          height: size,
          opacity: hovering ? 1 : 0,
          transformOrigin: "0% 0%",
          transition: "opacity 120ms ease-out",
          willChange: "transform, opacity",
          pointerEvents: "none",
        }}
      >
        {/* Sleek Minimalist Vector Arrow with Dual Contrast (visible on dark & light) */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: "block",
            overflow: "visible",
            filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45))",
          }}
        >
          <path
            d="M5 3 L23 14 L14 16 L11 24 Z"
            fill="#09090b"
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
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
