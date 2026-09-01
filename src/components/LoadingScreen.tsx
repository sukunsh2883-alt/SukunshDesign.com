import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
}

export default function LoadingScreen({ onComplete, profile }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasFinishedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());

  const brandName = profile?.brandName || "SUKUNSH";

  const finishLoading = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      onComplete();
    }, 650);
  }, [onComplete]);

  // Keyboard shortcut to skip (Spacebar or Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        finishLoading();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishLoading]);

  // Smooth realistic progress animation
  useEffect(() => {
    let animationFrame: number;
    const duration = 1800; // 1.8 seconds - crisp, modern and responsive

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Smooth custom easing
      const eased = Math.min(
        100,
        Math.floor(
          rawProgress < 0.6
            ? 60 * Math.pow(rawProgress / 0.6, 1.1)
            : 60 + 40 * Math.pow((rawProgress - 0.6) / 0.4, 0.9)
        )
      );

      setProgress(eased);

      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          finishLoading();
        }, 150);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [finishLoading]);

  const letters = brandName.split("");

  return (
    <div
      ref={containerRef}
      id="custom-loading-screen"
      className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-[#0A0A0C] text-[#EDEDED] select-none font-sans px-8 py-8 sm:px-14 sm:py-12"
      onClick={finishLoading}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Top Header: Pure Minimalist Editorial Details */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
          <span>PORTFOLIO — 2026</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            finishLoading();
          }}
        >
          SKIP [SPACE]
        </motion.div>
      </div>

      {/* Center: Hero Typography & Minimal Counter */}
      <div className="mx-auto w-full max-w-5xl my-auto">
        <div className="overflow-hidden">
          <h1 className="flex items-baseline justify-between text-[clamp(2.5rem,8.5vw,7.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
            <span className="flex">
              {letters.map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.65,
                    delay: 0.05 + index * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                  style={{
                    fontFamily:
                      '"Clash Display Local", "Clash Display", system-ui, sans-serif',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>

            {/* Micro Monospace Counter aligned with baseline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="font-mono text-base sm:text-2xl font-light tracking-tight text-neutral-400 self-end mb-2 sm:mb-4"
            >
              {String(progress).padStart(3, "0")}
            </motion.span>
          </h1>
        </div>

        {/* Minimalist Sub-discipline Rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Visual Design</span>
            <span className="text-neutral-600">/</span>
            <span>AI Creative</span>
            <span className="text-neutral-600">/</span>
            <span>Motion Direction</span>
          </div>

          <div className="text-neutral-500">
            LOADING EXPERIENCE
          </div>
        </motion.div>

        {/* Hairline Progress Rule */}
        <div className="relative mt-8 h-[1px] w-full bg-white/15 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.05 }}
          />
        </div>
      </div>

      {/* Bottom Footer: Minimalist Coordinates & System Status */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          DELHI, IN
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          © 2026 ALL RIGHTS RESERVED
        </motion.span>
      </div>

      {/* Smooth Minimalist Curtain Reveal */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-0 z-50 bg-[#0A0A0C]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
