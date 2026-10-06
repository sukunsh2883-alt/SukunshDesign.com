import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import CreativeLoadingArtwork from "./CreativeLoadingArtwork";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
  isHeroReady?: boolean;
}

export default function LoadingScreen({ onComplete, profile, isHeroReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasFinishedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const isHeroReadyRef = useRef(isHeroReady ?? false);

  useEffect(() => {
    if (isHeroReady !== undefined) {
      isHeroReadyRef.current = isHeroReady;
    }
  }, [isHeroReady]);

  const brandName = profile?.brandName || "Suraj";

  const finishLoading = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
  }, []);

  // Quick exit as soon as progress completes and hero is ready
  useEffect(() => {
    if (progress >= 100 && isHeroReady && !hasFinishedRef.current) {
      const timer = setTimeout(finishLoading, 40);
      return () => clearTimeout(timer);
    }
  }, [isHeroReady, progress, finishLoading]);

  // Keyboard shortcut to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "Escape") {
        e.preventDefault();
        finishLoading();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishLoading]);

  // Snappy, featherweight progress animation (~750ms total)
  useEffect(() => {
    let animationFrame: number;
    let fallbackTimer: NodeJS.Timeout | null = null;
    const duration = 750;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const raw = Math.min(elapsed / duration, 1);

      // Smooth easeOut curve
      const eased = Math.min(100, Math.floor(100 * (1 - Math.pow(1 - raw, 3))));
      setProgress(eased);

      if (raw < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        fallbackTimer = setTimeout(finishLoading, 80);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [finishLoading]);

  return (
    <div
      ref={containerRef}
      id="custom-loading-screen"
      className="fixed inset-0 z-[99999] overflow-hidden select-none cursor-pointer touch-none pointer-events-auto bg-white"
      onClick={finishLoading}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* TOP GATE PANEL: Slides vertically up from center */}
      <motion.div
        initial={{ y: "0%" }}
        animate={isExiting ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 w-full h-1/2 bg-white z-20 border-b border-neutral-200/80 shadow-md"
      />

      {/* BOTTOM GATE PANEL: Slides vertically down from center */}
      <motion.div
        initial={{ y: "0%" }}
        animate={isExiting ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (isExiting) {
            onComplete();
          }
        }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-white z-20 border-t border-neutral-200/80 shadow-md"
      />

      {/* Central Minimalist Featherweight Loading Content */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={isExiting ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none"
      >
        <CreativeLoadingArtwork isExiting={isExiting} />

        <div className="flex flex-col items-center text-center max-w-xs w-full">
          {/* Creator Brand Name */}
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-950 mb-1.5"
            style={{
              fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {brandName}
            <span className="text-[#FF6A00]">.</span>
          </h1>

          <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-neutral-500 mb-5">
            Visual Designer • 2026
          </p>

          {/* Minimal Progress Hairline */}
          <div className="w-40 sm:w-52 h-[2px] bg-neutral-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-neutral-950 rounded-full transition-[width] duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Digital Counter */}
          <span className="font-mono text-xs text-neutral-500 tabular-nums tracking-widest">
            {progress < 10 ? `0${progress}` : progress}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
