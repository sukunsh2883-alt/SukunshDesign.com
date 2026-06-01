import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
}

const WORDS = ["Design", "Film", "AI", "Motion", "Create"];

export default function LoadingScreen({ onComplete, profile }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  // Counter animation using requestAnimationFrame
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1500;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min((progress / duration) * 100, 100);

      setCount(Math.floor(percentage));

      if (progress < duration) {
        requestAnimationFrame(animateCount);
      } else {
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    };

    const animFrame = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animFrame);
  }, [onComplete]);

  // Word cycler based on count intervals
  useEffect(() => {
    // Cycle word every 500ms
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#0a0a0a] p-8 md:p-16 select-none"
    >
      {/* Top Left Indicator */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#999999] font-medium">
          Sukunsh / Portfolio
        </span>
      </div>

      {/* Center Word Cycler */}
      <div className="flex flex-col items-start justify-center flex-grow py-12">
        <div className="text-xs uppercase font-sans tracking-widest text-[#666] mb-3">
          Specializing In
        </div>
        <div className="h-24 md:h-32 flex items-center justify-start overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={wordIndex}
              initial={{ y: 40, opacity: 0, scaleY: 0.9 }}
              animate={{ y: 0, opacity: 0.8, scaleY: 1 }}
              exit={{ y: -40, opacity: 0, scaleY: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-white tracking-wide font-normal"
            >
              {WORDS[wordIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Counter & Glowing Progress Bar */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="text-[10px] font-sans tracking-[0.2em] text-[#666] uppercase">
            {(profile?.fullName || "Suraj Kumar Sharma")} &copy; 2026
          </div>
          <div className="text-5xl md:text-6xl lg:text-7xl font-sans tracking-tighter text-white font-light tabular-nums select-none leading-none">
            {String(count).padStart(3, "0")}
          </div>
        </div>

        {/* Progress frame */}
        <div className="h-[2px] w-full bg-neutral-900 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 bottom-0 accent-gradient origin-left"
            style={{ width: `${count}%` }}
            animate={{ boxShadow: "0 0 12px rgba(137, 170, 204, 0.45)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
