import { motion } from "motion/react";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

export default function Hero() {
  const heroImageUrl = "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1780406091/qq_fakbfs.png";

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#050505] px-6 pt-14 text-white md:px-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1520px] items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute left-[7%] top-[14%] z-30 text-base font-light text-white md:text-xl"
        >
          Delhi Based Multipipeline Designer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.04 }}
          className="absolute left-1/2 top-[25%] z-10 -translate-x-1/2 whitespace-nowrap text-[24vw] font-semibold leading-none tracking-[-0.095em] text-white md:top-[20%] md:text-[16vw]"
        >
          SUKUNSH
        </motion.h1>

        <motion.img
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          src={heroImageUrl}
          alt="Sukunsh artwork"
          className="relative z-20 mt-12 h-[72vh] max-h-[780px] w-auto object-contain md:mt-16"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
