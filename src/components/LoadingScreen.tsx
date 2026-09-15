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

  const brandName = (profile?.brandName || "SUKUNSH").toUpperCase();

  const finishLoading = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      onComplete();
    }, 550);
  }, [onComplete]);

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

  // Smooth realistic progress animation (~1.5s)
  useEffect(() => {
    let animationFrame: number;
    const duration = 1500;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const raw = Math.min(elapsed / duration, 1);

      // Smooth futuristic logarithmic-to-linear curve
      const eased = Math.min(
        100,
        Math.floor(
          raw < 0.65
            ? 70 * Math.pow(raw / 0.65, 0.95)
            : 70 + 30 * Math.pow((raw - 0.65) / 0.35, 1.1)
        )
      );

      setProgress(eased);

      if (raw < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          finishLoading();
        }, 120);
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
      className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-[#030305] text-[#EDEDED] select-none px-6 py-6 sm:px-12 sm:py-10 cursor-pointer"
      onClick={finishLoading}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        fontFamily: '"Clash Display Local", "Clash Display", sans-serif',
      }}
    >
      {/* Subtle Futuristic Radial Background Accent */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 106, 0, 0.07) 0%, transparent 60%)",
        }}
      />

      {/* Minimal HUD Corner Crosshairs */}
      <div className="pointer-events-none absolute top-4 left-4 sm:top-8 sm:left-8 font-mono text-[11px] text-white/20 select-none">
        +
      </div>
      <div className="pointer-events-none absolute top-4 right-4 sm:top-8 sm:right-8 font-mono text-[11px] text-white/20 select-none">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-8 sm:left-8 font-mono text-[11px] text-white/20 select-none">
        +
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-8 sm:right-8 font-mono text-[11px] text-white/20 select-none">
        +
      </div>

      {/* Top Bar: Ultra Minimalist Status */}
      <div className="relative z-10 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
          <span>INIT</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            finishLoading();
          }}
        >
          [ SKIP ]
        </motion.div>
      </div>

      {/* Center: Futuristic Brand Title + Precision Telemetry */}
      <div className="relative z-10 mx-auto w-full max-w-4xl my-auto">
        <div className="overflow-hidden">
          <h1 
            className="flex items-baseline justify-center text-[clamp(2.75rem,10vw,8rem)] font-bold uppercase tracking-[-0.03em] text-white leading-none"
            style={{
              fontFamily: '"Clash Display Local", "Clash Display", sans-serif',
            }}
          >
            <span className="flex">
              {letters.map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.04 + index * 0.035,
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
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-[#FF6A00] ml-0.5"
              >
                .
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Futuristic Laser Progress Line with Glow */}
        <div className="relative mt-8 sm:mt-10 h-[2px] w-full bg-white/10 overflow-visible rounded-full">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white rounded-full"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 12px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 106, 0, 0.5)",
            }}
          />
          {/* Laser Head Beam */}
          {progress > 0 && progress < 100 && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#FF6A00]"
              style={{
                left: `calc(${progress}% - 5px)`,
                boxShadow: "0 0 16px #FF6A00, 0 0 24px #FF6A00",
              }}
            />
          )}
        </div>

        {/* Minimal HUD Counter Readout */}
        <div className="mt-4 flex items-center justify-between text-xs sm:text-sm font-mono tracking-widest text-neutral-400">
          <span className="text-[11px] text-neutral-600 tracking-[0.2em]">
            SYSTEM.READY
          </span>
          <span className="text-white font-semibold tabular-nums text-sm sm:text-base">
            {String(progress).padStart(3, "0")}%
          </span>
        </div>
      </div>

      {/* Bottom Minimal HUD Grid Markers */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.25em] text-neutral-600 uppercase">
        <span>EST. 2026</span>
        <span>TOUCH / SPACE TO ENTER</span>
      </div>

      {/* Futuristic Clean Exit Wipe */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ transformOrigin: "top" }}
            className="absolute inset-0 z-50 bg-[#030305]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
