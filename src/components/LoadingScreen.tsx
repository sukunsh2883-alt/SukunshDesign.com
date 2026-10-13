import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
  isHeroReady?: boolean;
}

export default function LoadingScreen({ onComplete, isHeroReady }: LoadingScreenProps) {
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

  const finishLoading = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    // Guaranteed exit safety timer
    setTimeout(() => {
      onComplete();
    }, 850);
  }, [onComplete]);

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

  // Smooth, engaging progress animation (~1400ms to allow full reading of "I'm Suraj Kumar Sharma")
  useEffect(() => {
    let animationFrame: number;
    let fallbackTimer: NodeJS.Timeout | null = null;
    const duration = 1400;

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
        fallbackTimer = setTimeout(finishLoading, 250);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [finishLoading]);

  const words = ["I'm", "Suraj", "Kumar", "Sharma"];

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
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 w-full h-1/2 bg-white z-20 border-b border-neutral-100 flex flex-col justify-end items-center overflow-hidden"
      >
        {/* Top half: Animated "I'm Suraj Kumar Sharma" typography */}
        <motion.div
          animate={isExiting ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center pb-4 sm:pb-5 px-6 pointer-events-none"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {words.map((word, idx) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.55,
                  delay: 0.12 + idx * 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`font-sans tracking-tight leading-none text-neutral-950 ${
                  word === "Sharma"
                    ? "text-3xl sm:text-4xl md:text-5xl font-black text-[#3B4DF7]"
                    : "text-3xl sm:text-4xl md:text-5xl font-bold"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.85, ease: "easeOut" }}
            className="mt-2 text-[10px] sm:text-[11px] font-mono tracking-[0.28em] uppercase text-neutral-400"
          >
            Visual & Motion Designer
          </motion.span>
        </motion.div>
      </motion.div>

      {/* BOTTOM PIECE: covers bottom 50% (50vh to 100vh), splits vertically DOWN (+100%) */}
      <motion.div
        initial={{ y: "0%" }}
        animate={isExiting ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (isExiting) {
            onComplete();
          }
        }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-white z-20 border-t border-neutral-100 flex flex-col justify-start items-center overflow-hidden"
      >
        {/* Bottom half: Clean 1px Progress Hairline and Percentage Counter */}
        <motion.div
          animate={isExiting ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center pt-4 sm:pt-5 px-6 pointer-events-none max-w-xs w-full"
        >
          <div className="w-36 sm:w-44 h-[2px] bg-neutral-100 mb-2.5 overflow-hidden rounded-full">
            <div
              className="h-full bg-neutral-900 transition-[width] duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-36 sm:w-44 text-[10px] font-mono text-neutral-400">
            <span className="tracking-widest uppercase text-[9px]">Loading</span>
            <span className="tabular-nums font-semibold text-neutral-900">
              {progress < 10 ? `0${progress}` : progress}%
            </span>
          </div>

          <span className="mt-4 text-[9px] font-mono text-neutral-300 tracking-wider">
            Click or press Space to enter
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

