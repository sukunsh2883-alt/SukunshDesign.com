import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, Maximize, Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
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
  onOpenDesignShowcase?: () => void;
  profile?: any;
}

// Sukunsh's AI Promotion Reel Videos - strictly user-provided Cloudinary assets only
const AI_PROMOTION_REEL_VIDEOS = [
  {
    id: "promo-kenerate-1",
    title: "Kenerate Commercial",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1780264091/kenerate-ad-1779833779917_w0ndh7.mp4",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264091/kenerate-ad-1779833779917_w0ndh7.jpg",
  },
  {
    id: "promo-kenerate-2",
    title: "Kenerate Motion Ad",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1780260451/kenerate-ad-1779796765745_1_njywwd.mp4",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260451/kenerate-ad-1779796765745_1_njywwd.jpg",
  },
  {
    id: "promo-seq-5",
    title: "Sequence 01 Film 05",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1780260423/Sequence_01_5_ktappc.mp4",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260423/Sequence_01_5_ktappc.jpg",
  },
  {
    id: "promo-seq-6",
    title: "Sequence 01 Film 06",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1780260408/Sequence_01_6_c32bs3.mp4",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260408/Sequence_01_6_c32bs3.jpg",
  },
  {
    id: "promo-exp-1",
    title: "AI Visual Experiment 01",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1789469510/1779188840357_o77qqi_emmrp5.mp4",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469510/1779188840357_o77qqi_emmrp5.jpg",
  },
  {
    id: "promo-exp-2",
    title: "AI Visual Experiment 02",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1789469385/1779095774772_lmmytk_hnbcwi.mp4",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469385/1779095774772_lmmytk_hnbcwi.jpg",
  },
  {
    id: "promo-exp-3",
    title: "AI Visual Experiment 03",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1789469345/1779197811307_n2mlxu_zz5t4u.mp4",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469345/1779197811307_n2mlxu_zz5t4u.jpg",
  },
];

export default function ScrollShowcase({
  onClose,
  isInline = false,
  designs = [],
  onOpenProjects,
  onOpenAIWork,
  onOpenVideo,
  onSelectProject,
  onOpenDesignShowcase,
  profile,
}: ScrollShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const aboutStageRef = useRef<HTMLDivElement | null>(null);
  const aiSectionRef = useRef<HTMLElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoFrameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [filmIndex, setFilmIndex] = useState(0);
  const [isPlayingInline, setIsPlayingInline] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reelTweenRef = useRef<gsap.core.Tween | null>(null);

  const allProjects = designs && designs.length > 0 ? designs : designProjects;

  const film = aiFilms[filmIndex % aiFilms.length];
  // 14 items (repeating the 7 user Cloudinary videos twice) for seamless continuous infinite reel stream with zero random images
  const reelItems = Array.from({ length: 14 }, (_, index) => AI_PROMOTION_REEL_VIDEOS[index % AI_PROMOTION_REEL_VIDEOS.length]);
  const portraitImage =
    "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png";

  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("/embed/")) {
      // Ensure enablejsapi=1 & autoplay/mute flags if needed
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}enablejsapi=1&rel=0`;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0` : url;
  };

  const isCurrentYouTube = isYouTubeUrl(film?.videoUrl);
  const currentYouTubeEmbedUrl = isCurrentYouTube ? getYouTubeEmbedUrl(film?.videoUrl) : "";

  const togglePlayInline = () => {
    if (isCurrentYouTube) return;
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

  // Ensure fullscreen cleanly clears GSAP scale transforms
  useEffect(() => {
    if (isFullscreen && videoFrameRef.current) {
      gsap.set(videoFrameRef.current, { clearProps: "scale,borderRadius,boxShadow,transform" });
    } else if (!isFullscreen) {
      ScrollTrigger.refresh();
    }
  }, [isFullscreen]);

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
      const reelTween = gsap.to(".seamless-reel-track", {
        xPercent: -50,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
      reelTweenRef.current = reelTween;

      const trackEl = document.querySelector(".seamless-reel-track");
      if (trackEl) {
        trackEl.addEventListener("mouseenter", () => reelTween.pause());
        trackEl.addEventListener("mouseleave", () => reelTween.play());
      }

      // Scroll-driven animation for AI Film video frame:
      // When scrolling down, appears small -> grows large and fits to screen -> sets back to actual frame size
      if (videoFrameRef.current) {
        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth < 1024;
        const startScale = isMobile ? 0.88 : 0.82;
        const peakScale = isMobile ? 1.05 : isTablet ? 1.08 : 1.10;

        const videoTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: videoFrameRef.current,
            start: "top 95%",      // When entering from bottom of viewport
            end: "top 20%",        // When settling in view
            scrub: 0.8,            // Fluidly responsive to scroll speed
            invalidateOnRefresh: true,
          },
        });

        videoTimeline
          .fromTo(
            videoFrameRef.current,
            {
              scale: startScale,
              borderRadius: isMobile ? "20px" : "28px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              transformOrigin: "center center",
            },
            {
              scale: peakScale,
              borderRadius: isMobile ? "8px" : "12px",
              boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.35)",
              duration: 1,
              ease: "power2.out",
            }
          )
          .to(
            videoFrameRef.current,
            {
              scale: peakScale,
              borderRadius: isMobile ? "8px" : "12px",
              duration: 0.25, // Holds at screen-fit during peak viewing
              ease: "none",
            }
          )
          .to(
            videoFrameRef.current,
            {
              scale: 1.0,
              borderRadius: isMobile ? "12px" : "16px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              duration: 0.9,
              ease: "power2.inOut",
            }
          );
      }

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
        onOpenDesignShowcase={onOpenDesignShowcase}
        profile={profile}
      />

      {/* 3. AI FILM BIG SCREEN SECTION */}
      <section
        id="ai-work"
        ref={aiSectionRef}
        data-cursor-tag="AI Works"
        className="relative w-full bg-white px-5 py-12 sm:px-8 sm:py-16 md:px-14 md:py-20 border-t border-neutral-100"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Section Header: AI Film ↙ */}
          <div className="folio-reveal mb-6 sm:mb-8 flex items-center justify-between">
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
              ref={videoFrameRef}
              onClick={togglePlayInline}
              role={isCurrentYouTube ? undefined : "button"}
              tabIndex={isCurrentYouTube ? undefined : 0}
              onKeyDown={(e) => !isCurrentYouTube && (e.key === "Enter" || e.key === " ") && togglePlayInline()}
              style={{
                willChange: "transform",
                transformOrigin: "center center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className={`group relative block w-full bg-black ${isCurrentYouTube ? "" : "cursor-pointer"} text-left outline-none ${
                isFullscreen
                  ? "h-full w-full flex items-center justify-center rounded-none shadow-none"
                  : "aspect-[16/8] sm:aspect-[16/7.5] md:aspect-[2.2/1] min-h-[260px] sm:min-h-[380px] md:min-h-[480px] lg:min-h-[540px] overflow-hidden rounded-[8px] sm:rounded-[12px] md:rounded-[16px] shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-neutral-950"
              }`}
            >
              {isCurrentYouTube ? (
                <iframe
                  key={film?.id}
                  src={currentYouTubeEmbedUrl}
                  title={film?.title || "AI Film"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className={`w-full h-full border-0 ${
                    isFullscreen
                      ? "max-h-screen object-contain"
                      : "object-cover"
                  }`}
                />
              ) : (
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
              )}

              {/* Top Title Overlay in Fullscreen */}
              {isFullscreen && film && (
                <div
                  className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 pointer-events-auto"
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

              {/* Center Play/Pause Indicator for HTML5 video */}
              {!isCurrentYouTube && (
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
              )}

              {/* Bottom Right Controls: Fullscreen button & Mute (for HTML5 video) */}
              <div
                className={`absolute z-30 flex items-center gap-2.5 ${
                  isFullscreen ? "bottom-6 right-6" : "bottom-4 right-4"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {!isCurrentYouTube && (
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute audio (m)" : "Mute audio (m)"}
                    title={isMuted ? "Unmute (m)" : "Mute (m)"}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 transition-all hover:bg-black/90 hover:scale-105 cursor-pointer shadow-md"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                )}

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
                className="inline-flex items-center gap-2.5 rounded-full border border-neutral-900 bg-white px-7 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-medium tracking-normal text-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer select-none shadow-xs group"
              >
                <span>See all AI Films</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
              I am a Delhi based
              <br />
              visual designer.
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
