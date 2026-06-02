import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Play, Sparkles } from "lucide-react";
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
  const logoFontFamily = profile?.logoFontFamily || DEFAULT_LOGO_FONT;
  const logoFontStyle = getLogoFontStyle(logoFontFamily);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [roles.length]);

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden bg-[#f7f8f6] px-4 pt-28 text-neutral-900 sm:px-6 md:pt-32"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(255,106,0,0.14),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.12),transparent_22%),linear-gradient(135deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:auto,auto,34px_34px]" />
      <div className="absolute left-1/2 top-28 -z-10 h-[420px] w-[70vw] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 pb-14 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-[12px] font-medium text-neutral-600 shadow-[0_10px_30px_rgba(15,15,15,0.05)]">
              Delhi based visual artist
            </span>
            <span className="rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-4 py-2 text-[12px] font-semibold text-[#C44D00]">
              available for UX/UI roles
            </span>
          </div>

          <p className="mb-2 text-sm font-medium tracking-[0.28em] text-neutral-400">
            hi, i&apos;m
          </p>
          <h1 className="mb-8 text-[72px] leading-[0.82] text-neutral-950 sm:text-[108px] md:text-[128px] lg:text-[140px]" style={logoFontStyle}>
            Sukunsh.
          </h1>

          <div className="max-w-3xl">
            <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-6xl lg:text-[78px]">
              designing interfaces, visual systems, and cinematic digital stories.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-600 md:text-lg">
              I blend Fine Art, UX/UI design, brand systems, motion, and AI-assisted production to create digital work that feels clear, emotional, and memorable.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onOpenProjects || scrollToProjects}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#FF6A00] active:translate-y-0"
            >
              <span>view projects</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onWatchShowreel}
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white/80 px-6 py-4 text-sm font-semibold text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white active:translate-y-0"
            >
              <Play className="h-4 w-4 fill-[#FF6A00] text-[#FF6A00]" />
              <span>watch reels</span>
            </button>
            <button
              onClick={onOpenAIWork}
              className="inline-flex items-center justify-center gap-2 rounded-full px-2 py-4 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-950"
            >
              <span>AI archive</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-2 rounded-[28px] border border-white bg-white/70 p-2 shadow-[0_24px_90px_rgba(15,15,15,0.08)] backdrop-blur-xl">
            {[
              ["3+", "core media"],
              ["2026", "portfolio"],
              ["M.Des", "IIT Bombay"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[22px] border border-neutral-100 bg-white px-4 py-4">
                <p className="text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>
                <p className="mt-1 text-[11px] font-medium text-neutral-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[520px] lg:min-h-[680px]"
        >
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-[46px] bg-[#FF6A00] opacity-90" />
          <div className="absolute inset-x-4 bottom-6 top-0 overflow-hidden rounded-[46px] border border-white/80 bg-neutral-950 shadow-[0_35px_120px_rgba(15,15,15,0.18)]">
            <img
              src={heroImageUrl}
              alt="Sukunsh artwork"
              className="h-full w-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-white/15 bg-black/35 p-5 text-white backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.2em] text-white/55">current focus</p>
                  <motion.p
                    key={roles[roleIndex]}
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.45 }}
                    className="mt-2 text-2xl font-semibold tracking-tight"
                  >
                    {roles[roleIndex]}
                  </motion.p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950">
                  <Sparkles className="h-5 w-5 text-[#FF6A00]" />
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -left-1 bottom-24 hidden max-w-[230px] rounded-[26px] border border-white/80 bg-white/85 p-5 text-sm leading-6 text-neutral-600 shadow-[0_22px_70px_rgba(15,15,15,0.1)] backdrop-blur-xl md:block">
            rooted in Bihar&apos;s cultural heritage, shaped by Fine Art, Design, and cinema.
          </div>
        </motion.div>
      </div>

      <button
        onClick={scrollToProjects}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-xs font-medium text-neutral-500 backdrop-blur-xl transition-colors hover:text-neutral-950 md:flex"
      >
        <ArrowDown className="h-3.5 w-3.5" />
        <span>scroll</span>
      </button>
    </section>
  );
}
