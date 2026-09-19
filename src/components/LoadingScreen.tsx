import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";

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

  const brandName = profile?.brandName || "Sukunsh";

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

  // Smooth, snappy progress animation (~1.2s)
  useEffect(() => {
    let animationFrame: number;
    let fallbackTimer: NodeJS.Timeout | null = null;
    const duration = 1200;

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
    <motion.div
      ref={containerRef}
      id="custom-loading-screen"
      initial={{ y: 0 }}
      animate={isExiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (isExiting) {
          onComplete();
        }
      }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAFAF9] text-neutral-900 select-none px-6 cursor-pointer touch-none"
      onClick={finishLoading}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Central Minimal Loading Content */}
      <div className="flex flex-col items-center text-center max-w-xs w-full">
        {/* Clean Name */}
        <h1
          className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-neutral-950 mb-4"
          style={{
            fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {brandName}
        </h1>

        {/* Minimal Progress Bar */}
        <div className="w-36 sm:w-44 h-[2px] bg-neutral-200/80 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-neutral-900 rounded-full transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Numeric Counter */}
        <span className="font-mono text-xs text-neutral-400 tabular-nums tracking-wider">
          {progress}%
        </span>
      </div>
    </motion.div>
  );
}
