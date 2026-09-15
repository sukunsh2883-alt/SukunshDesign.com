import { useEffect, useRef, useCallback } from "react";

interface ContinuousLoopVideoProps {
  src?: string;
  fallbackSrc?: string;
  poster?: string;
  alt?: string;
  className?: string;
}

export default function ContinuousLoopVideo({
  src = "/design-illustration-loop.mp4",
  fallbackSrc = "https://res.cloudinary.com/dylv5m3jk/video/upload/v1789396420/MacBook_Pro_16-_-_1_4_f7ttaj.mp4",
  poster = "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
  alt = "Design & Illustration Showcase",
  className = "w-full h-full block object-contain select-none",
}: ContinuousLoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isPlayPendingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Failsafe play function that handles browser promise collisions gracefully
  const safePlay = useCallback(() => {
    if (!isMountedRef.current) return;
    const vid = videoRef.current;
    if (!vid) return;

    // If already playing smoothly, don't interrupt
    if (!vid.paused && !vid.ended && vid.readyState >= 2) {
      return;
    }

    if (isPlayPendingRef.current) return;

    vid.muted = true;
    vid.defaultMuted = true;
    isPlayPendingRef.current = true;

    try {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlayPendingRef.current = false;
          })
          .catch(() => {
            isPlayPendingRef.current = false;
            // Transient interruption (e.g., rapid scroll or power saving).
            // Watchdog and intersection observer will retry seamlessly.
          });
      } else {
        isPlayPendingRef.current = false;
      }
    } catch {
      isPlayPendingRef.current = false;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const vid = videoRef.current;
    if (!vid) return;

    // Force muted attributes and hardware-friendly properties
    vid.muted = true;
    vid.defaultMuted = true;
    vid.volume = 0;

    // 1. Initial play attempt
    safePlay();

    // 2. Resume on pause: If browser ever pauses the video (e.g. offscreen), resume immediately
    const handlePause = () => {
      if (isMountedRef.current) {
        setTimeout(safePlay, 50);
      }
    };
    vid.addEventListener("pause", handlePause);

    // 3. Seamless loop handling on ended or near end
    const handleEnded = () => {
      if (!isMountedRef.current) return;
      vid.currentTime = 0;
      safePlay();
    };
    vid.addEventListener("ended", handleEnded);

    const handleTimeUpdate = () => {
      if (!isMountedRef.current) return;
      // Loop seamlessly before the last frame can freeze
      if (vid.duration > 0 && vid.currentTime >= vid.duration - 0.05) {
        vid.currentTime = 0;
        safePlay();
      }
    };
    vid.addEventListener("timeupdate", handleTimeUpdate);

    // 4. IntersectionObserver: triggers whenever anywhere near the viewport
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              safePlay();
            }
          });
        },
        { rootMargin: "300px", threshold: [0, 0.1, 0.5, 1.0] }
      );
      observer.observe(vid);
    } catch {
      // Fallback if IntersectionObserver not available
    }

    // 5. Scroll listener: guarantees playback resumes when scrolling back up or down
    let scrollTimeout: any = null;
    const handleScroll = () => {
      safePlay();
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          scrollTimeout = null;
          safePlay();
        }, 150);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 6. Tab visibility change & window focus
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        safePlay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", safePlay);
    window.addEventListener("pageshow", safePlay);

    // 7. Global user interaction listener to bypass any strict autoplay policies
    const handleUserGesture = () => {
      safePlay();
    };
    window.addEventListener("pointerdown", handleUserGesture, { passive: true });
    window.addEventListener("touchstart", handleUserGesture, { passive: true });
    window.addEventListener("wheel", handleUserGesture, { passive: true });

    // 8. Periodic watchdog timer: checks every 350ms to ensure video is NEVER stopped
    const watchdogInterval = setInterval(() => {
      if (!isMountedRef.current) return;
      if (vid.paused || vid.ended) {
        safePlay();
      }
    }, 350);

    return () => {
      isMountedRef.current = false;
      clearInterval(watchdogInterval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      vid.removeEventListener("pause", handlePause);
      vid.removeEventListener("ended", handleEnded);
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", safePlay);
      window.removeEventListener("pageshow", safePlay);
      window.removeEventListener("pointerdown", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
      window.removeEventListener("wheel", handleUserGesture);
    };
  }, [safePlay]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-label={alt}
      poster={poster}
      style={{
        pointerEvents: "none",
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      className={className}
    >
      <source src={src} type="video/mp4" />
      {fallbackSrc && fallbackSrc !== src && (
        <source src={fallbackSrc} type="video/mp4" />
      )}
      <img
        src={poster}
        alt={alt}
        className="w-full h-full block object-contain"
        loading="eager"
      />
    </video>
  );
}
