import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  const bioTitle = profile?.roles?.[0] || "Visual Designer & AI Creative Director";

  const finishLoading = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
  }, []);

  // If progress reached 100% and hero becomes ready, trigger exit
  useEffect(() => {
    if (progress >= 100 && isHeroReady && !hasFinishedRef.current) {
      const timer = setTimeout(() => {
        finishLoading();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isHeroReady, progress, finishLoading]);

  // Keyboard shortcut to skip (Space, Enter, or Escape)
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

  // Smooth realistic progress animation (~1.6s)
  useEffect(() => {
    let animationFrame: number;
    let fallbackTimer: NodeJS.Timeout | null = null;
    const duration = 1600;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const raw = Math.min(elapsed / duration, 1);

      // Smooth modern cubic-out progress curve
      const eased = Math.min(
        100,
        Math.floor(
          raw < 0.6
            ? 68 * Math.pow(raw / 0.6, 0.92)
            : 68 + 32 * Math.pow((raw - 0.6) / 0.4, 1.05)
        )
      );

      setProgress(eased);

      if (raw < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // If hero is already ready, finish promptly; otherwise set a fallback
        if (isHeroReadyRef.current) {
          setTimeout(() => {
            finishLoading();
          }, 140);
        } else {
          // Safety fallback: don't block forever if hero report had an edge-case
          fallbackTimer = setTimeout(() => {
            finishLoading();
          }, 1500);
        }
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [finishLoading]);

  // Dynamic phase text based on progress
  const getPhaseText = () => {
    if (progress < 32) return "Loading visual archives";
    if (progress < 68) return "Preparing curated works";
    if (progress < 96) return "Calibrating motion & type";
    return "Studio ready";
  };

  const letters = brandName.split("");

  return (
    <motion.div
      ref={containerRef}
      id="custom-loading-screen"
      initial={{ y: 0 }}
      animate={isExiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (isExiting) {
          onComplete();
        }
      }}
      className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-[#FAFAF9] text-neutral-900 select-none px-6 py-6 sm:px-12 sm:py-10 cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.5)] touch-none"
      onClick={finishLoading}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Subtle Warm Ambient Background Radial */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(255, 106, 0, 0.04) 0%, rgba(0, 0, 0, 0.015) 45%, transparent 75%)",
        }}
      />

      {/* Subtle Studio Architectural Crosshairs (+) */}
      <div className="pointer-events-none absolute top-4 left-4 sm:top-7 sm:left-8 font-mono text-[10px] text-neutral-300 select-none">
        +
      </div>
      <div className="pointer-events-none absolute top-4 right-4 sm:top-7 sm:right-8 font-mono text-[10px] text-neutral-300 select-none">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-7 sm:left-8 font-mono text-[10px] text-neutral-300 select-none">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-7 sm:right-8 font-mono text-[10px] text-neutral-300 select-none">
        +
      </div>

      {/* Top Header: Clean Studio Status & Skip Action */}
      <div className="relative z-10 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-neutral-500 uppercase"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]" />
          </span>
          <span>STUDIO INDEX • 2026</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="group flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-neutral-400 hover:text-neutral-900 transition-colors py-1 px-2 rounded hover:bg-neutral-200/50"
          onClick={(e) => {
            e.stopPropagation();
            finishLoading();
          }}
        >
          <span>[ SKIP ]</span>
        </motion.div>
      </div>

      {/* Center Presentation: Small, Refined, Professional Modern Design with Cool Animations */}
      <div className="relative z-10 mx-auto flex flex-col items-center justify-center text-center my-auto w-full max-w-lg px-4">
        
        {/* Kinetic Geometric Glyph Animation */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 sm:mb-5 relative flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200/80 shadow-xs"
        >
          {/* Slowly rotating asterisk / star symbol */}
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 text-neutral-900"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
          </motion.svg>
        </motion.div>

        {/* Brand Name (Medium, Refined Display Font - Not Big Font) */}
        <div className="overflow-hidden mb-1 sm:mb-1.5">
          <h1
            className="flex items-baseline justify-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-neutral-950 leading-tight"
            style={{
              fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            <span className="flex">
              {letters.map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 + index * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.28 }}
                className="text-[#FF6A00] ml-0.5 inline-block font-bold"
              >
                .
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Subtitle / Discipline Label */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="text-xs sm:text-sm text-neutral-500 font-normal tracking-normal mb-6 sm:mb-8"
        >
          {bioTitle}
        </motion.p>

        {/* Precision Modern Progress Line + Floating Tracker */}
        <div className="w-48 sm:w-60 md:w-68 flex flex-col items-center">
          <div className="relative w-full h-[2px] bg-neutral-200/90 rounded-full overflow-visible">
            {/* Dark crisp line fill */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-neutral-900 rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 0.1s ease-out",
              }}
            />
            {/* Micro Orange Accent Particle on Head */}
            {progress > 0 && progress < 100 && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF6A00] shadow-[0_0_8px_rgba(255,106,0,0.6)]"
                style={{
                  left: `calc(${progress}% - 4px)`,
                  transition: "left 0.1s ease-out",
                }}
              />
            )}
          </div>

          {/* Numbers Readout + Status Badge */}
          <div className="w-full mt-3.5 flex items-center justify-between text-neutral-600">
            {/* Dynamic Status Phase Pill with Cool Fade Transition */}
            <AnimatePresence mode="wait">
              <motion.span
                key={getPhaseText()}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] text-neutral-500 uppercase"
              >
                {getPhaseText()}
              </motion.span>
            </AnimatePresence>

            {/* Tabular Monospace Counter */}
            <span className="font-mono text-xs sm:text-sm font-semibold tabular-nums text-neutral-900 tracking-tight">
              {String(progress).padStart(3, "0")}%
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Bar: Location, Coordinates & Interactive Prompt */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
        <div className="flex items-center gap-2">
          <span>DELHI, IN</span>
          <span className="text-neutral-300">•</span>
          <span>M.DES IDC IIT BOMBAY</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
          <span>PRESS</span>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-200/70 border border-neutral-300/80 text-[8px] sm:text-[9px] text-neutral-700 font-sans font-medium shadow-2xs">
            SPACE
          </kbd>
          <span>OR CLICK TO ENTER</span>
        </div>
      </div>
    </motion.div>
  );
}
