import { motion } from "motion/react";

interface CreativeLoadingArtworkProps {
  progress?: number;
  isExiting: boolean;
}

export default function CreativeLoadingArtwork({ isExiting }: CreativeLoadingArtworkProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isExiting ? { scale: 0.85, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-5 select-none pointer-events-none"
    >
      {/* Outer subtle rotating dashed orbit ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-neutral-700/60"
      />

      {/* Inner pulsing creative focus ring */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-2 rounded-full border border-[#FF6A00]/40"
      />

      {/* Central iconic 4-point design spark */}
      <motion.div
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="relative z-10 text-[#FF6A00] drop-shadow-[0_0_12px_rgba(255,106,0,0.5)]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
          <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
