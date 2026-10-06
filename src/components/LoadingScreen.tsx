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
      className="fixed inset-0 z-[99999] overflow-hidden select-none cursor-pointer touch-none pointer-events-auto bg-transparent"
      onClick={finishLoading}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* TOP PIECE: covers top 50% (0 to 50vh), splits vertically UP (-100%) */}
      <motion.div
        initial={{ y: "0%" }}
        animate={isExiting ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#050505] z-20 border-b border-neutral-850 flex flex-col justify-end items-center overflow-hidden"
      >
        {/* Top half: Clean Minimalist Brand Typography */}
        <motion.div
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center pb-3 sm:pb-4 px-4 pointer-events-none"
        >
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-1">
            {brandName}
          </h1>
          <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-neutral-500">
            Portfolio
          </span>
        </motion.div>
      </motion.div>

      {/* BOTTOM PIECE: covers bottom 50% (50vh to 100vh), splits vertically DOWN (+100%) */}
      <motion.div
        initial={{ y: "0%" }}
        animate={isExiting ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
        onAnimationComplete={() => {
          if (isExiting) {
            onComplete();
          }
        }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#050505] z-20 border-t border-neutral-850 flex flex-col justify-start items-center overflow-hidden"
      >
        {/* Bottom half: Clean 1px Progress Hairline and Percentage Counter */}
        <motion.div
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center pt-3 sm:pt-4 px-4 pointer-events-none max-w-xs w-full"
        >
          <div className="w-28 sm:w-36 h-[1px] bg-neutral-800 mb-2 overflow-hidden">
            <div
              className="h-full bg-white transition-[width] duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400 tabular-nums tracking-widest">
            {progress < 10 ? `0${progress}` : progress}%
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
