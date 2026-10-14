import React, { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
  isHeroReady?: boolean;
}

export default function LoadingScreen({ onComplete, isHeroReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const hasFinishedRef = useRef(false);

  const finishLoading = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    const container = containerRef.current;
    const counter = counterRef.current;

    // Phase 2: At 100 the counter slides out and the panel collapses upward (clip-path inset(0 0 100% 0), 1 s expo.inOut)
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    if (counter) {
      tl.to(counter, {
        y: -24,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      }, 0);
    }

    if (container) {
      tl.to(container, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.0,
        ease: "expo.inOut",
      }, 0.2);
    } else {
      onComplete();
    }
  }, [onComplete]);

  // Real asset loading listener with hard cap of 4000ms
  useEffect(() => {
    let currentProgress = 5;
    let animFrame: number;
    const startTime = Date.now();
    const HARD_CAP_MS = 4000;

    let fontLoaded = false;
    let artworkLoaded = false;
    let windowLoaded = document.readyState === "complete";

    // 1. Font readiness
    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontLoaded = true;
      }).catch(() => {
        fontLoaded = true;
      });
    } else {
      fontLoaded = true;
    }

    // 2. Critical artwork preload
    fetch("/artwork/main artwork.svg")
      .then(() => {
        artworkLoaded = true;
      })
      .catch(() => {
        artworkLoaded = true;
      });

    // 3. Window load
    const onLoad = () => {
      windowLoaded = true;
    };
    if (!windowLoaded) {
      window.addEventListener("load", onLoad, { once: true });
    }

    const step = () => {
      const elapsed = Date.now() - startTime;
      let targetProgress = 10;

      if (fontLoaded) targetProgress += 30;
      if (artworkLoaded) targetProgress += 30;
      if (windowLoaded || isHeroReady) targetProgress += 30;

      // Ensure time-based steady progress toward hard cap
      const timeRatio = Math.min(1, elapsed / (HARD_CAP_MS - 400));
      const minProgressForTime = Math.floor(timeRatio * 95);
      targetProgress = Math.max(targetProgress, minProgressForTime);

      if (elapsed >= HARD_CAP_MS) {
        targetProgress = 100;
      }

      // Smooth lerp toward targetProgress
      currentProgress += (targetProgress - currentProgress) * 0.14;
      const displayVal = Math.min(100, Math.floor(currentProgress));
      setProgress(displayVal);

      if (displayVal >= 100 || elapsed >= HARD_CAP_MS) {
        setProgress(100);
        setTimeout(finishLoading, 200);
      } else {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("load", onLoad);
    };
  }, [isHeroReady, finishLoading]);

  // Space / Enter / Escape to bypass preloader
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "Escape") {
        e.preventDefault();
        finishLoading();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finishLoading]);

  const formattedCount = String(progress).padStart(3, "0");

  return (
    <div
      ref={containerRef}
      id="custom-loading-screen"
      className="fixed inset-0 z-[99999] bg-white text-neutral-900 flex flex-col justify-between p-6 sm:p-12 md:p-16 select-none overflow-hidden"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading portfolio"
    >
      {/* Top Header metadata */}
      <div className="flex items-center justify-between w-full font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-500">
        <span className="font-semibold text-neutral-900">Sukunsh</span>
        <span>Portfolio 2026</span>
      </div>

      {/* Center Designer Identity */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-950 leading-none">
          Suraj Kumar Sharma
        </h1>
        <p className="mt-4 font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-neutral-500">
          Visual Designer &amp; Art Director
        </p>
      </div>

      {/* Bottom Progress Bar & Tabular Counter (000 to 100) */}
      <div ref={counterRef} className="w-full flex flex-col gap-4">
        {/* Thin progress hairline (scaleX, left aligned, rectilinear) */}
        <div className="w-full h-[1.5px] bg-neutral-100 overflow-hidden relative">
          <div
            ref={progressLineRef}
            className="h-full bg-neutral-950 transition-all duration-75 ease-out origin-left"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between font-mono text-xs sm:text-sm text-neutral-500">
          <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs">
            Loading Assets
          </span>
          {/* Tabular counter 000 to 100 */}
          <span className="tabular-nums font-bold text-neutral-950 text-base sm:text-lg tracking-tight">
            {formattedCount}
          </span>
        </div>
      </div>
    </div>
  );
}
