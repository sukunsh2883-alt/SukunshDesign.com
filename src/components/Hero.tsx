import { ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

export default function Hero({ onWatchShowreel, onOpenProjects, onOpenAIWork }: HeroProps) {
  const heroImageUrl = "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1780333002/Untitled-2_copy_urce7l.png";

  return (
    <section id="home" className="bg-[#080808] px-3 pt-11 text-white md:px-4">
      <div className="relative mx-auto h-[185px] max-w-5xl overflow-hidden border-b border-white/10 md:h-[520px]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute left-[9%] top-7 z-20 text-[10px] font-medium text-white/70 md:top-16 md:text-sm"
        >
          Delhi Based Multidiscipline Designer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="absolute left-[8%] top-[55px] z-10 text-[58px] font-semibold leading-none tracking-[-0.075em] text-white sm:text-[88px] md:top-[132px] md:text-[190px]"
        >
          SUKUNSH
        </motion.h1>

        <motion.img
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          src={heroImageUrl}
          alt="Sukunsh artwork"
          className="absolute bottom-0 right-[2%] z-20 h-[165px] w-auto object-contain md:h-[500px]"
          referrerPolicy="no-referrer"
        />

        <div className="absolute bottom-3 left-4 z-30 flex gap-2 md:bottom-7 md:left-8">
          <button
            onClick={onOpenProjects}
            className="inline-flex items-center gap-1 border border-white/25 px-3 py-1.5 text-[10px] font-medium text-white hover:border-white md:px-4 md:py-2 md:text-xs"
          >
            Work <ArrowRight className="h-3 w-3" />
          </button>
          <button
            onClick={onWatchShowreel}
            className="inline-flex items-center gap-1 border border-white/25 px-3 py-1.5 text-[10px] font-medium text-white hover:border-white md:px-4 md:py-2 md:text-xs"
          >
            <Play className="h-3 w-3 fill-white" /> Reel
          </button>
          <button
            onClick={onOpenAIWork}
            className="hidden border border-white/25 px-4 py-2 text-xs font-medium text-white hover:border-white md:block"
          >
            AI Archive
          </button>
        </div>
      </div>
    </section>
  );
}
