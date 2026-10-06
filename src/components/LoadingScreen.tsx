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

  // If progress reached 100% and hero is ready, trigger exit
  useEffect(() => {
    if (progress >= 100 && isHeroReady && !hasFinishedRef.current) {
      const timer = setTimeout(() => {
        finishLoading();
      }, 80);
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

  // Smooth progress animation timed to allow elements to pop in rhythmically (~1.9s)
  useEffect(() => {
    let animationFrame: number;
    let fallbackTimer: NodeJS.Timeout | null = null;
    const duration = 1900;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const raw = Math.min(elapsed / duration, 1);

      // Smooth easeOut curve
      const eased = Math.min(100, Math.floor(100 * (1 - Math.pow(1 - raw, 2.5))));
      setProgress(eased);

      if (raw < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        if (isHeroReadyRef.current) {
          setTimeout(() => {
            finishLoading();
          }, 100);
        } else {
          fallbackTimer = setTimeout(() => {
            finishLoading();
          }, 800);
        }
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
      {/* TOP GATE PANEL: Slides vertically up to -100% */}
      <motion.div
        initial={{ y: "0%" }}
        animate={isExiting ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 w-full h-1/2 bg-white z-20"
      />

      {/* BOTTOM GATE PANEL: Slides vertically down to 100% */}
      <motion.div
        initial={{ y: "0%" }}
        animate={isExiting ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (isExiting) {
            onComplete();
          }
        }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-white z-20"
      />

      {/* Central Minimal Loading Content: Creative elements pop up one-by-one */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={isExiting ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none"
      >
        {/* Playful Pop-up Artwork Cluster */}
        <CreativeLoadingArtwork progress={progress} isExiting={isExiting} />

        <div className="flex flex-col items-center text-center max-w-xs w-full mt-2">
          {/* Clean Name */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-950 mb-3"
            style={{
              fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {brandName}
            <span className="text-[#FF6A00]">.</span>
          </h1>

          {/* Minimal Progress Bar */}
          <div className="w-36 sm:w-48 h-[2px] bg-neutral-200/90 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-neutral-950 rounded-full transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Numeric Counter */}
          <span className="font-mono text-xs text-neutral-500 tabular-nums tracking-widest">
            {progress}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
