import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause, Volume2, VolumeX, Maximize, Upload, RefreshCw, Film } from "lucide-react";
import { isReducedMotion } from "../motion";

export interface FilmConfig {
  src: string;
  poster: string;
  title: string;
  year: string;
  duration: string;
}

interface FilmScreenProps {
  initialFilm?: FilmConfig;
  onOpenExplorer?: () => void;
}

const DEFAULT_FILM: FilmConfig = {
  src: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4",
  poster: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780259813/RIVR_AD_Flim_ln2lz9.jpg",
  title: "RIVR - Commercial Direction",
  year: "2026",
  duration: "00:45",
};

export default function FilmScreen({ initialFilm = DEFAULT_FILM, onOpenExplorer }: FilmScreenProps) {
  const [film, setFilm] = useState<FilmConfig>(initialFilm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubBarRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<any>(null);
  const objectUrlRef = useRef<string | null>(null);
  const headerContentRef = useRef<HTMLDivElement | null>(null);

  const isYouTube = film.src.includes("youtube.com") || film.src.includes("youtu.be");
  const isVimeo = film.src.includes("vimeo.com");

  // Phase 2 Motion: Letterbox open on scroll trigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const frame = frameRef.current;
    const section = sectionRef.current;
    if (!frame || !section) return;

    if (isReducedMotion()) {
      gsap.set(frame, { clipPath: "inset(0% 0 0 0)", opacity: 1 });
      return;
    }

    // Frame goes from clip-path inset(50% 0 50% 0) to inset(0) in 1.2s expo.inOut
    gsap.set(frame, { clipPath: "inset(50% 0 50% 0)", opacity: 1 });

    const trigger = ScrollTrigger.create({
      trigger: frame,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(frame, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "expo.inOut",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  // Pause when scrolled out of view
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || isYouTube || isVimeo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isYouTube, isVimeo]);

  // While playing: rest of section dims to 0.35 opacity; restore on pause
  useEffect(() => {
    const header = headerContentRef.current;
    if (!header) return;

    if (isPlaying) {
      gsap.to(header, { opacity: 0.35, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    } else {
      gsap.to(header, { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    }
  }, [isPlaying]);

  // Controls auto-hide after 2.5s idle while playing
  const resetIdleTimer = useCallback(() => {
    setControlsVisible(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    if (isPlaying) {
      idleTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2500);
    }
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setHasError(false);
      }).catch((err) => {
        console.warn("[FilmScreen] Play error:", err);
        setHasError(true);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (frame.requestFullscreen) {
      frame.requestFullscreen().catch(() => {});
    } else if (video && (video as any).webkitEnterFullscreen) {
      // iOS / Safari fallback
      (video as any).webkitEnterFullscreen();
    }
  }, []);

  const seekRelative = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
  }, []);

  // Keyboard navigation: Space/K (play/pause), Arrow Left/Right (seek 5s), M (mute), F (fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const code = e.code;
      if (code === "Space" || code === "KeyK") {
        e.preventDefault();
        togglePlay();
        resetIdleTimer();
      } else if (code === "ArrowLeft") {
        e.preventDefault();
        seekRelative(-5);
        resetIdleTimer();
      } else if (code === "ArrowRight") {
        e.preventDefault();
        seekRelative(5);
        resetIdleTimer();
      } else if (code === "KeyM") {
        e.preventDefault();
        toggleMute();
      } else if (code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, seekRelative, toggleMute, toggleFullscreen, resetIdleTimer]);

  // Video timeupdate handler
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const curr = video.currentTime;
    const dur = video.duration || 1;
    setCurrentTime(curr);
    setDuration(dur);
    const ratio = Math.max(0, Math.min(1, curr / dur));
    setProgressRatio(ratio);

    // Phase 2: Scrub bar uses scaleX, not width
    if (scrubBarRef.current) {
      gsap.set(scrubBarRef.current, { scaleX: ratio, transformOrigin: "left center" });
    }
  };

  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = ratio * video.duration;
      setProgressRatio(ratio);
      if (scrubBarRef.current) {
        gsap.set(scrubBarRef.current, { scaleX: ratio, transformOrigin: "left center" });
      }
    }
  };

  // Local File Upload / Drag & Drop with URL.createObjectURL and revoking previous URL
  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith("video/")) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const newUrl = URL.createObjectURL(file);
    objectUrlRef.current = newUrl;

    setFilm({
      src: newUrl,
      poster: "",
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      year: new Date().getFullYear().toString(),
      duration: "Local File",
    });

    setHasError(false);
    setIsPlaying(false);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <section
      ref={sectionRef}
      id="film"
      data-cursor-tag="Film"
      className="relative w-full bg-neutral-950 text-white py-16 sm:py-24 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header and Title */}
        <div ref={headerContentRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12 transition-opacity">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-[0.24em] text-neutral-400">
              <Film className="w-3.5 h-3.5 text-[#3B4DF7]" />
              <span>Cinematic Direction</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-none">
              Film Screen
            </h2>
          </div>

          {/* Add Film button & explorer trigger */}
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-neutral-900 text-xs font-mono uppercase tracking-wider text-white hover:border-white transition-colors cursor-pointer rounded-none">
              <Upload className="w-3.5 h-3.5" />
              <span>Add Film</span>
              <input
                type="file"
                accept="video/*"
                onChange={onFileInputChange}
                className="hidden"
                aria-label="Upload film file"
              />
            </label>

            {onOpenExplorer && (
              <button
                type="button"
                onClick={onOpenExplorer}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/20 bg-neutral-900 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white hover:border-white transition-colors rounded-none"
              >
                <span>Browse Vault</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Canvas Container (Letterbox Frame with Locked 16:9 Aspect Ratio) */}
        <div
          ref={frameRef}
          onMouseMove={resetIdleTimer}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={onDrop}
          className={`relative w-full aspect-video bg-black border border-white/10 overflow-hidden rounded-none shadow-2xl ${
            isDraggingFile ? "ring-2 ring-[#3B4DF7]" : ""
          }`}
        >
          {/* Direct HTML5 Video Player */}
          {!isYouTube && !isVimeo && (
            <video
              ref={videoRef}
              src={film.src}
              poster={film.poster}
              muted={isMuted}
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              onClick={togglePlay}
              className="w-full h-full object-contain bg-black cursor-pointer"
            />
          )}

          {/* YouTube/Vimeo Embed Support */}
          {isYouTube && (
            <iframe
              src={film.src.replace("watch?v=", "embed/")}
              title={film.title}
              allow="autoplay; fullscreen"
              className="w-full h-full border-0"
            />
          )}

          {/* Drag & Drop Overlay Feedback */}
          {isDraggingFile && (
            <div className="absolute inset-0 bg-[#3B4DF7]/20 border-2 border-dashed border-[#3B4DF7] flex flex-col items-center justify-center pointer-events-none z-30">
              <Upload className="w-10 h-10 text-white mb-2 animate-bounce" />
              <p className="font-mono text-sm uppercase tracking-wider text-white">
                Drop your film file here to test locally
              </p>
            </div>
          )}

          {/* Error State with Retry Button */}
          {hasError && (
            <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
              <p className="font-mono text-xs uppercase tracking-widest text-red-400 mb-2">Video Unavailable</p>
              <p className="text-sm text-neutral-300 max-w-sm mb-4">
                The specified video URL or file could not be decoded. You can choose another file or retry.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  videoRef.current?.load();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/30 text-xs font-mono uppercase tracking-wider text-white hover:bg-white hover:text-black rounded-none"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Center Square Play Button (scales 0.9 to 1 while fading in per Phase 2) */}
          {!isPlaying && !hasError && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play film"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-white text-neutral-950 border border-neutral-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer z-10 rounded-none"
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
            </button>
          )}

          {/* Bottom Video Controls Overlay (auto-hides after 2.5s idle) */}
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 transition-opacity duration-300 z-20 ${
              controlsVisible || !isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Scrub bar container: uses scaleX per Phase 2 */}
            <div
              onClick={handleScrubClick}
              className="w-full h-2 bg-white/20 hover:h-2.5 transition-all mb-3 cursor-pointer relative origin-left"
              aria-label="Seek film"
            >
              <div
                ref={scrubBarRef}
                className="h-full bg-[#3B4DF7] origin-left w-full"
                style={{ transform: `scaleX(${progressRatio})` }}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between font-mono text-xs text-white">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="hover:text-[#3B4DF7] transition-colors cursor-pointer"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-[#3B4DF7] transition-colors cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="tabular-nums text-neutral-400">
                  {formatSeconds(currentTime)} / {formatSeconds(duration)}
                </span>
              </div>

              {/* Title and Credits */}
              <div className="hidden sm:flex items-center gap-3 text-neutral-400">
                <span className="font-semibold text-white">{film.title}</span>
                <span>•</span>
                <span>{film.year}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
