import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Maximize, Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject, designProjects, aiFilms } from "../portfolioData";
import ShapeGrid from "./ShapeGrid";
import CurvedLoop from "./CurvedLoop";
import LanyardCard from "./LanyardCard";
import EditorialProjects from "./EditorialProjects";
import LetsTalk from "./LetsTalk";

gsap.registerPlugin(ScrollTrigger);

interface ScrollShowcaseProps {
  onClose?: () => void;
  isInline?: boolean;
  designs?: DesignProject[];
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
  onOpenVideo?: (videoUrl: string, title: string) => void;
  onSelectProject?: (proj: DesignProject) => void;
  profile?: any;
}

export default function ScrollShowcase({
  onClose,
  isInline = false,
  designs = [],
  onOpenProjects,
  onOpenAIWork,
  onOpenVideo,
  onSelectProject,
  profile,
}: ScrollShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const aboutStageRef = useRef<HTMLDivElement | null>(null);
  const aiSectionRef = useRef<HTMLElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [filmIndex, setFilmIndex] = useState(0);
  const [isPlayingInline, setIsPlayingInline] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const allProjects = designs && designs.length > 0 ? designs : designProjects;

  const film = aiFilms[filmIndex % aiFilms.length];
  // 12 items for seamless continuous reel stream
  const reelItems = Array.from({ length: 14 }, (_, index) => aiFilms[index % aiFilms.length]);
  const portraitImage =
    "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png";

  const togglePlayInline = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlayingInline(true);
    } else {
      videoRef.current.pause();
      setIsPlayingInline(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const elem = videoWrapperRef.current;
    if (!elem) return;

    const isNativeFs = Boolean(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    if (isFullscreen || isNativeFs) {
      // Exit fullscreen
      if (document.exitFullscreen && isNativeFs) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen && isNativeFs) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen && isNativeFs) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen && isNativeFs) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(() => {
          // If browser iframe restrictions reject native requestFullscreen, toggle CSS fullscreen
          setIsFullscreen(true);
        });
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
        setIsFullscreen(true);
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
        setIsFullscreen(true);
      } else {
        setIsFullscreen(true);
      }
    }
  };

  // Switch film reset & auto-play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlayingInline(true);
      }).catch(() => {
        setIsPlayingInline(false);
      });
    }
  }, [filmIndex]);

  // Sync with native fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    document.addEventListener("mozfullscreenchange", handleFsChange);
    document.addEventListener("MSFullscreenChange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      document.removeEventListener("mozfullscreenchange", handleFsChange);
      document.removeEventListener("MSFullscreenChange", handleFsChange);
    };
  }, []);

  // Keyboard shortcuts (f for fullscreen, Escape to exit, Space to toggle play)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Auto-stop/pause video when scrolling away from the AI Film section
  useEffect(() => {
    const target = aiSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            // In view - resume playing if it was active
            if (videoRef.current.paused && isPlayingInline) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            // Scrolled out of view - automatically pause to prevent background playback & save resources
            if (!videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlayingInline(false);
            }
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isPlayingInline]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // General section reveals
      gsap.utils.toArray<HTMLElement>(".folio-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

      // Seamless left-to-right straight horizontal track motion for AI Reel cards
      gsap.to(".seamless-reel-track", {
        xPercent: -50,
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [allProjects]);

  const openFilm = () => {
    if (film) onOpenVideo?.(film.videoUrl, film.title);
  };

  return (
    <div ref={containerRef} className="scroll-showcase w-full bg-white text-[#1d1e1e] select-none">
      {!isInline && onClose && (
        <nav className="fixed left-5 right-5 top-5 z-[120] flex items-center justify-between rounded-full border border-neutral-200 bg-white/85 px-5 py-3 backdrop-blur-md">
          <span className="text-xs font-medium">Sukunsh.</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-xs hover:border-neutral-900"
          >
            <span>Close</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </nav>
      )}

      {/* PROJECTS SECTION */}
      <EditorialProjects
        projects={allProjects}
        onSelectProject={onSelectProject}
        onOpenProjectsExplorer={onOpenProjects}
        onOpenAIWork={onOpenAIWork}
        profile={profile}
      />

      {/* 3. AI FILM BIG SCREEN SECTION */}
      <section
        id="ai-work"
        ref={aiSectionRef}
        data-cursor-tag="AI Works"
        className="folio-reveal relative w-full bg-white px-5 py-12 sm:px-8 sm:py-16 md:px-14 md:py-20 border-t border-neutral-100"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Section Header: AI Film ↙ */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold tracking-[-0.035em] text-neutral-950 leading-none select-none">
                AI Film
              </h2>
              <span className="inline-flex items-center text-neutral-950 transform translate-y-1">
                <svg
                  className="w-[clamp(1.5rem,3.5vw,2.75rem)] h-[clamp(1.5rem,3.5vw,2.75rem)] stroke-current stroke-[2.2] fill-none"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 5L5 19M5 19H17M5 19V7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            {/* Film count index indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 uppercase">
              <span className="text-neutral-950 font-bold">0{(filmIndex % aiFilms.length) + 1}</span>
              <span>/</span>
              <span>0{aiFilms.length}</span>
            </div>
          </div>

          {/* Big Screen Video Frame with in-place playback controls & Fullscreen toggle */}
          <div
            ref={videoWrapperRef}
            className={`w-full transition-all duration-300 ${
              isFullscreen
                ? "fixed inset-0 z-[9999] h-screen w-screen bg-black flex items-center justify-center p-0 m-0 rounded-none overflow-hidden"
                : "relative"
            }`}
          >
            <div
              onClick={togglePlayInline}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && togglePlayInline()}
              className={`group relative block w-full bg-black cursor-pointer text-left outline-none transition-all duration-300 ${
                isFullscreen
                  ? "h-full w-full flex items-center justify-center rounded-none shadow-none"
                  : "aspect-[16/8] sm:aspect-[16/7.5] md:aspect-[2.2/1] min-h-[260px] sm:min-h-[380px] md:min-h-[480px] lg:min-h-[540px] overflow-hidden rounded-[8px] sm:rounded-[12px] md:rounded-[16px] shadow-md focus-visible:ring-2 focus-visible:ring-neutral-950"
              }`}
            >
              <video
                ref={videoRef}
                key={film?.id}
                src={film?.videoUrl}
                poster={film?.thumbnail}
                muted={isMuted}
                loop
                playsInline
                autoPlay
                preload="auto"
                className={`w-full transition-opacity group-hover:opacity-95 ${
                  isFullscreen
                    ? "h-full max-h-screen object-contain bg-black"
                    : "h-full object-cover opacity-100"
                }`}
              />

              {/* Top Title Overlay in Fullscreen */}
              {isFullscreen && film && (
                <div
                  className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-30 transition-opacity duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-white">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">AI Film</span>
                    <h4 className="text-base sm:text-xl font-bold tracking-tight">
                      {film.id === "ai-film-rivr-ad" ? "RIVE" : film.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Exit Fullscreen"
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all border border-white/20 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Center Play/Pause Indicator (Smoothly fades when playing, appears on hover or pause) */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                  isPlayingInline ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-white/40 bg-black/40 backdrop-blur-md text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  {isPlayingInline ? (
                    <Pause className="h-6 w-6 sm:h-7 sm:w-7 fill-white text-white" />
                  ) : (
                    <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-white text-white ml-1" />
                  )}
                </span>
              </div>

              {/* Bottom Right Controls: Sound Unmute/Mute & Fullscreen Button */}
              <div
                className={`absolute z-30 flex items-center gap-2.5 ${
                  isFullscreen ? "bottom-6 right-6" : "bottom-4 right-4"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute audio (m)" : "Mute audio (m)"}
                  title={isMuted ? "Unmute (m)" : "Mute (m)"}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 transition-all hover:bg-black/90 hover:scale-105 cursor-pointer shadow-md"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit Fullscreen (f)" : "Enter Fullscreen (f)"}
                  title={isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 transition-all hover:bg-black/90 hover:scale-105 cursor-pointer shadow-md"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Details Row with Previous / Next Controls & Good Intention Captions */}
          <div className="mt-5 sm:mt-7 flex w-full flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="w-full max-w-[460px]">
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-950">
                {film?.id === "ai-film-rivr-ad" ? "RIVE" : film?.title}
              </h3>
              <p className="mt-1.5 text-sm sm:text-base leading-snug text-neutral-700 font-normal">
                {film?.description || "High-fidelity AI generated cinematography focusing on lighting, fluid physics, and visual storytelling."}
              </p>

              {/* Previous / Next film switcher controls */}
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setFilmIndex((value) => (value - 1 + aiFilms.length) % aiFilms.length)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                  <span className="border-b border-neutral-300 group-hover:border-neutral-950 pb-0.5">Previous film</span>
                </button>
                <span className="text-neutral-300 font-mono text-xs">/</span>
                <button
                  type="button"
                  onClick={() => setFilmIndex((value) => (value + 1) % aiFilms.length)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer group"
                >
                  <span className="border-b border-neutral-300 group-hover:border-neutral-950 pb-0.5">Next film</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenAIWork}
                className="border border-neutral-900 bg-white px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium tracking-normal text-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer select-none"
              >
                <span>See all AI Films</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Promotion Reels: Straight, Non-floating, Seamlessly Attached moving horizontally */}
      <section id="ai-reels" data-cursor-tag="AI Works" className="relative min-h-[65vh] overflow-hidden bg-white px-5 py-14 sm:px-8 md:px-14 md:py-20 border-t border-neutral-100">
        <div className="folio-reveal grid grid-cols-1 gap-8 md:grid-cols-[0.55fr_1fr] max-w-[1240px] mx-auto">
          <div>
            <div className="h-px w-28 bg-neutral-700" />
            <div className="mt-2 flex items-center gap-1.5 text-2xl font-normal text-[#1f1f1e]">
              <span>AI Promotion Reel</span>
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <p className="max-w-[260px] text-[13px] leading-tight text-neutral-600">
            Watch more AI-powered brand promotion reels.
          </p>
        </div>

        {/* Straight, Seamless, Non-floating Carousel Track */}
        <div className="mt-10 overflow-hidden w-full">
          <div className="seamless-reel-track flex items-center gap-4 sm:gap-6 w-max py-4">
            {reelItems.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => onOpenVideo?.(item.videoUrl, item.title)}
                className="group relative h-[280px] w-[160px] sm:h-[320px] sm:w-[185px] shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200 transition-all duration-300 hover:border-neutral-400 hover:scale-[1.02]"
              >
                <video
                  src={item.videoUrl}
                  poster={item.thumbnail}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  className="h-full w-full object-cover opacity-95 transition-opacity group-hover:opacity-100"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-400/80 bg-white/40 backdrop-blur-xs transition-transform group-hover:scale-110">
                    <Play className="h-4 w-4 fill-neutral-800 text-neutral-800" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-7 text-sm text-neutral-500">
          <ChevronLeft className="h-4 w-4 cursor-pointer hover:text-neutral-900" />
          <span className="text-xs uppercase tracking-widest font-mono">DRAG / HOVER TO EXPLORE</span>
          <ChevronRight className="h-4 w-4 cursor-pointer hover:text-neutral-900" />
        </div>
      </section>

      {/* 4. ABOUT ME SECTION (Placed after AI Reels as requested) */}
      <section id="about" className="relative min-h-screen overflow-visible border-t border-neutral-100 bg-white px-5 py-16 sm:px-8 md:px-14 md:py-24 z-20">
        <div className="absolute inset-x-6 top-14 bottom-14 z-0 hidden md:block overflow-hidden pointer-events-none">
          <ShapeGrid
            direction="diagonal"
            speed={0.35}
            squareSize={34}
            borderColor="rgba(0, 0, 0, 0.05)"
            hoverFillColor="rgba(0, 0, 0, 0.07)"
            shape="square"
            hoverTrailAmount={8}
          />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="folio-reveal flex flex-col justify-center space-y-8 sm:space-y-10 md:space-y-12 lg:col-span-7">
            <div>
              <div className="mb-2.5 h-[1.5px] w-12 bg-neutral-900" />
              <div className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-neutral-900">
                <span>About me</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2] text-neutral-900" />
              </div>
            </div>
            <h2 className="select-none text-4xl font-normal leading-[1.06] tracking-normal text-neutral-950 sm:text-6xl md:text-7xl lg:text-[76px]">
              I'm a Delhi-based
              <br />
              Web Designer.
            </h2>
            <p className="max-w-xl text-base font-normal leading-relaxed text-neutral-600 sm:text-lg md:text-[21px]">
              Blending fine art sensibilities with contemporary design,
              <br className="hidden sm:inline" />
              crafting evocative visual stories through motion,
              <br className="hidden sm:inline" />
              typography and creative precision.
            </p>

            <div className="pt-2">
              <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-stretch sm:gap-0">
                <div className="flex-1 sm:pr-8 md:pr-10">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-900 sm:text-xs">
                    EDUCATION
                  </div>
                  <div className="mb-5 mt-1.5 h-[1.5px] w-6 bg-neutral-900" />
                  <div className="space-y-5">
                    <div>
                      <div className="text-sm font-medium leading-snug text-neutral-900 sm:text-[15px]">
                        M.Des - IDC School of Design
                      </div>
                      <div className="mt-0.5 text-xs font-normal text-neutral-500 sm:text-sm">
                        IIT Bombay
                      </div>
                    </div>
                    <div className="h-px w-full bg-neutral-200/80" />
                    <div>
                      <div className="text-sm font-medium leading-snug text-neutral-900 sm:text-[15px]">
                        BFA, Visual Communication
                      </div>
                      <div className="mt-0.5 text-xs font-normal text-neutral-500 sm:text-sm">
                        College of Art, Delhi
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative hidden w-px shrink-0 flex-col items-center justify-center self-stretch bg-neutral-200 sm:flex">
                  <div className="absolute top-1/2 -left-[2.5px] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-neutral-900" />
                </div>
                <div className="flex-1 sm:pl-8 md:pl-10">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-900 sm:text-xs">
                    EXPERIENCE
                  </div>
                  <div className="mb-5 mt-1.5 h-[1.5px] w-6 bg-neutral-900" />
                  <div>
                    <div className="text-sm font-medium leading-snug text-neutral-900 sm:text-[15px]">
                      Visual Designer
                    </div>
                    <div className="mt-0.5 text-xs font-normal text-neutral-500 sm:text-sm">
                      ShareChat
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={aboutStageRef}
            className="folio-reveal flex flex-col items-center justify-center lg:col-span-5 relative"
            aria-label="Sukunsh identity card"
          >
            <LanyardCard portraitImage={portraitImage} />
          </div>
        </div>
        <div className="folio-reveal relative mx-auto mt-8 w-full max-w-[1380px]">
          <CurvedLoop
            marqueeText="VISUAL ART ✦ FINE ART ✦ RISOGRAPHY ✦ VISUAL STORYTELLING ✦ CONTEMPORARY DESIGN ✦ DELHI ✦ MOTION DESIGN ✦ CINEMATIC EXPERIMENTS ✦ "
            speed={1.45}
            curveAmount={0}
            direction="left"
            interactive={true}
            className="fill-neutral-950 font-sans text-[32px] font-bold uppercase tracking-[0.18em]"
          />
        </div>
      </section>

      {/* 5. LET'S TALK CONTACT SECTION */}
      <LetsTalk profile={profile} />
    </div>
  );
}
