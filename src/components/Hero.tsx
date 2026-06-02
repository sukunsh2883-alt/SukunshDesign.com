import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DEFAULT_LOGO_FONT, getLogoFontStyle } from "../localFonts";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}



export default function Hero({ onWatchShowreel, profile, onOpenProjects, onOpenAIWork }: HeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const roles = [
    "Visual Designer",
    "AI Creative",
    "Motion Designer",
    "Storyboard Artist",
    "FilmMaker"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setIsAnimating(true);
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const prefix = roles[roleIndex].toLowerCase().startsWith("ai") ? "An" : "A";
  const heroImageUrl = "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1780333002/Untitled-2_copy_urce7l.png";
  const logoFontFamily = profile?.logoFontFamily || DEFAULT_LOGO_FONT;
  const logoFontStyle = getLogoFontStyle(logoFontFamily);

  // GSAP Entrance Animations for cinematic feel
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Name reveal animation
      gsap.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.2 }
      );

      // Blur in staggering elements
      gsap.fromTo(
        ".blur-in",
        { opacity: 0, y: 25, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.6,
        }
      );

      // Scroll indicator fade in
      gsap.fromTo(
        ".scroll-indicator-fade",
        { opacity: 0, y: 10 },
        { opacity: 0.6, y: 0, duration: 1.2, delay: 1.5, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range: -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const handleScrollToWork = () => {
    const el = document.getElementById("ai-work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-neutral-950 text-white select-none"
    >
      {/* Matte black texture base */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 20%, rgba(255,255,255,0.08), transparent 28%), radial-gradient(circle at 80% 30%, rgba(10,132,255,0.12), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.055) 0 1px, transparent 1px), linear-gradient(45deg, #050505 0%, #111111 48%, #050505 100%)",
          backgroundSize: "auto, auto, 9px 9px, auto",
        }}
      />

      {/* Background Image with elegant parallax hover effect */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none transition-transform duration-700 ease-out bg-no-repeat bg-cover bg-[position:42%_center] sm:bg-[position:54%_center] lg:bg-[position:64%_center]"
        style={{
          backgroundImage: `url("${heroImageUrl}")`,
          opacity: 1,
          transform: isHovered 
            ? `scale(1.05) translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)` 
            : "scale(1) translate(0, 0)",
        }}
      />

      {/* Gentle left vignette to guarantee high legibility for the left-aligned text, while leaving the majority of the artwork 100% uncovered */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[55%] lg:w-[48%] z-[2] bg-gradient-to-r from-black/95 via-black/80 to-transparent pointer-events-none" />

      {/* Bottom Blur Fade Overlays for seamless blending */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-[3] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.75) 42%, rgba(5,5,5,0) 100%)",
        }}
      />

      {/* Hero Content - Beautifully Left-aligned & restricted to maintain artwork visibility (z-10 for interactivity) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 text-left flex flex-col items-start justify-center mt-12">
        <div className="max-w-[34rem] lg:max-w-[42vw] xl:max-w-[38rem]">
          {/* "Hi, I'm" above the logo */}
          <p className="name-reveal text-sm sm:text-base font-sans font-semibold tracking-[0.25em] text-neutral-400 mb-2 uppercase select-none">
            Hi, I&apos;m
          </p>

          {/* Center Massive SUKUNSH Text Logo with trailing dot (Left-aligned) */}
          <div className="name-reveal w-full flex justify-start items-center mb-6 select-none">
            <h1
              className="text-[72px] sm:text-[6.7rem] md:text-[132px] lg:text-[150px] xl:text-[168px] leading-[0.82] font-normal text-white select-none drop-shadow-[0_14px_35px_rgba(0,0,0,0.45)] origin-left"
              style={logoFontStyle}
            >
              Sukunsh.
            </h1>
          </div>

          {/* Dynamic Tagline with grey rounded capsule backdrop on rolling roles */}
          <div className="blur-in text-xs xs:text-sm sm:text-base md:text-[21px] text-neutral-100 drop-shadow-sm font-sans tracking-wide leading-relaxed font-light mb-8 select-none min-h-[44px] flex items-center justify-start flex-wrap gap-y-2">
            <span className="transition-all duration-300 font-light">{prefix}</span>
            <span className={`px-4.5 py-1.5 bg-white/22 text-white backdrop-blur-md rounded-full text-xs xs:text-sm sm:text-base inline-block mx-1.5 font-serif font-semibold italic tracking-wide select-none shadow-xs border border-white/20 transition-all duration-300 transform ${
              isAnimating ? "opacity-100 translate-y-0 filter blur-0 scale-100" : "opacity-0 translate-y-2 filter blur-sm scale-95"
            }`}>
              {roles[roleIndex]}
            </span>
            <span className="font-light">Creating Cinematic Digital Worlds.</span>
          </div>

          {/* Solid Center Buttons (Left-aligned) */}
          <div className="blur-in flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 justify-start w-full select-none mt-2">
            <button
              onClick={onOpenProjects || handleScrollToProjects}
              className="px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-sans font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 z-20 cursor-pointer shadow-md shadow-black/30 whitespace-nowrap max-w-max"
            >
              VIEW PROJECTS
            </button>

            <button
              onClick={onOpenAIWork || handleScrollToWork}
              className="text-neutral-400 hover:text-white font-sans font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 z-20 cursor-pointer whitespace-nowrap text-left max-w-max"
            >
              AI ARCHIVE
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="scroll-indicator-fade absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase font-sans font-medium">
          Scroll
        </span>
        <button
          onClick={handleScrollToProjects}
          className="relative w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1 cursor-pointer hover:border-white/40 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)" }}
          aria-label="Scroll to work"
        >
          <div className="w-1 h-2 rounded-full bg-[#FF6A00] animate-scroll-down" />
        </button>
      </div>
    </section>
  );
}
