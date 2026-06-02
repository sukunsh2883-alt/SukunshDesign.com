import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { DEFAULT_LOGO_FONT, getLogoFontStyle } from "../localFonts";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

export default function Hero({ onWatchShowreel, profile, onOpenProjects, onOpenAIWork }: HeroProps) {
  const roles = useMemo(
    () => profile?.roles || ["Visual Designer", "AI Creative Designer", "Motion Designer"],
    [profile?.roles]
  );
  const [roleIndex, setRoleIndex] = useState(0);
  const heroImageUrl = "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1780333002/Untitled-2_copy_urce7l.png";
  const logoFontStyle = getLogoFontStyle(profile?.logoFontFamily || DEFAULT_LOGO_FONT);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [roles.length]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen bg-[#fbfbf8] px-4 pt-24 text-neutral-950 md:px-6 md:pt-28">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 border-b border-neutral-200 pb-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-sm font-medium text-neutral-500">Delhi based UX/UI and visual designer</p>
          <h1 className="text-[76px] leading-[0.82] sm:text-[118px] lg:text-[156px]" style={logoFontStyle}>
            Sukunsh.
          </h1>
          <div className="mt-8 max-w-2xl">
            <h2 className="text-[38px] font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              interfaces, brands, motion, and AI film direction.
            </h2>
            <motion.p
              key={roles[roleIndex]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-5 border-l-2 border-[#FF6A00] pl-4 text-lg font-medium text-neutral-600"
            >
              {roles[roleIndex]}
            </motion.p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onOpenProjects || scrollToProjects}
              className="inline-flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6A00] hover:border-[#FF6A00]"
            >
              work <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onWatchShowreel}
              className="inline-flex items-center gap-2 border border-neutral-250 px-5 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-950"
            >
              <Play className="h-4 w-4 fill-[#FF6A00] text-[#FF6A00]" /> reels
            </button>
            <button
              onClick={onOpenAIWork}
              className="border border-transparent px-2 py-3 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
            >
              AI archive
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -left-4 top-8 h-[70%] w-10 bg-[#FF6A00]" />
          <div className="relative aspect-[4/5] overflow-hidden border border-neutral-250 bg-neutral-100">
            <img
              src={heroImageUrl}
              alt="Sukunsh artwork"
              className="h-full w-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 border-y border-neutral-200 text-sm">
            <div className="border-r border-neutral-200 py-3">
              <p className="font-medium">3+</p>
              <p className="text-neutral-500">media</p>
            </div>
            <div className="border-r border-neutral-200 px-4 py-3">
              <p className="font-medium">2026</p>
              <p className="text-neutral-500">portfolio</p>
            </div>
            <div className="px-4 py-3">
              <p className="font-medium">M.Des</p>
              <p className="text-neutral-500">IIT Bombay</p>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        onClick={scrollToProjects}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-950 md:flex"
      >
        <ArrowDown className="h-3.5 w-3.5" />
        scroll
      </button>
    </section>
  );
}
