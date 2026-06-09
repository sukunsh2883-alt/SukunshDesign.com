import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
}

const WORDS = ["Design", "Film", "AI", "Motion", "Create"];

export default function LoadingScreen({ onComplete, profile }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const statementRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const statement = statementRef.current;
    if (!statement) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".loader-word",
        { y: 34, opacity: 0, filter: "blur(14px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.075,
          ease: "power3.out",
        },
      );
    }, statement);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#080807] p-8 md:p-16 select-none"
    >
      {/* Top Left Indicator */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#999999] font-medium">
          Sukunsh / Portfolio
        </span>
      </div>

      {/* Center Word Cycler */}
      <div ref={statementRef} className="flex flex-col items-center justify-center flex-grow py-12 text-center">
        <p className="mb-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-2xl font-medium leading-[1.05] tracking-[-0.02em] text-[#f3efe5] md:text-6xl">
          {["Hello", "I'm", "Delhi", "Based", "Multidisciplinary", "Designer."].map((word) => (
            <span key={word} className="loader-word inline-block">
              {word}
            </span>
          ))}
        </p>
        <div className="text-xs uppercase font-sans tracking-[0.18em] text-[#8b887f] mb-3">
          Portfolio loading
        </div>
        <div className="h-20 md:h-28 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={wordIndex}
              initial={{ y: 40, opacity: 0, scaleY: 0.9 }}
              animate={{ y: 0, opacity: 0.8, scaleY: 1 }}
              exit={{ y: -40, opacity: 0, scaleY: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#f3efe5] tracking-normal font-normal"
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
          <div className="text-5xl md:text-6xl lg:text-7xl font-sans tracking-[-0.02em] text-[#f3efe5] font-light tabular-nums select-none leading-none">
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
