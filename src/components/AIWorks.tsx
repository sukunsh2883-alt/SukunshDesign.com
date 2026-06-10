import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AIFilm, VideoCard } from "../portfolioData";

interface AIWorksProps {
  films: AIFilm[];
  videos: VideoCard[];
  onSelectFilm: (film: AIFilm) => void;
  onSelectVideo: (video: VideoCard) => void;
  onOpenExplorer: () => void;
}

export default function AIWorks({
  films,
  videos,
  onSelectFilm,
  onSelectVideo,
  onOpenExplorer,
}: AIWorksProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Combine films and videos, prioritize AI works
  const aiWorks = [
    ...films.slice(0, 3).map((film) => ({
      id: film.id,
      title: film.title,
      category: film.category,
      thumbnail: film.thumbnail,
      videoUrl: film.videoUrl,
      type: "film" as const,
      data: film,
    })),
    ...videos.slice(0, 3).map((video) => ({
      id: video.id,
      title: video.title,
      category: video.type,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      type: "video" as const,
      data: video,
    })),
  ].slice(0, 6);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Header animation - fade up with blur
      gsap.from(".ai-works-header", {
        opacity: 0,
        y: 60,
        filter: "blur(16px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ai-works-section",
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
        },
      });

      if (!isMobile) {
        // Cards staggered entrance with curved motion
        const cards = document.querySelectorAll(".ai-work-card");
        gsap.from(cards, {
          opacity: 0,
          y: 140,
          rotation: (i: number) => (i % 2 === 0 ? -5 : 5),
          scale: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ai-works-section",
            start: "top 65%",
            end: "center center",
            scrub: 1,
          },
        });

        // Top track horizontal scroll
        gsap.to(".ai-works-track--top", {
          xPercent: -22,
          ease: "none",
          scrollTrigger: {
            trigger: ".ai-works-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Bottom track counter scroll
        gsap.fromTo(
          ".ai-works-track--bottom",
          { xPercent: -18 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".ai-works-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        // Card hover interactions
        cards.forEach((card) => {
          const video = card.querySelector("video");

          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              scale: 1.035,
              y: -8,
              duration: 0.45,
              ease: "power3.out",
            });

            if (video) {
              video.play().catch(() => {});
            }
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
            });

            if (video) {
              video.pause();
            }
          });
        });
      } else {
        // Mobile: simple fade-up + scale
        const cards = document.querySelectorAll(".ai-work-card");
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          scale: 0.95,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ai-works-section",
            start: "top 65%",
            end: "center center",
            scrub: 1,
          },
        });
      }

      ScrollTrigger.refresh();
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (work: (typeof aiWorks)[0]) => {
    if (work.type === "film") {
      onSelectFilm(work.data);
    } else {
      onSelectVideo(work.data);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="ai-works-section relative overflow-hidden bg-[#050505] min-h-[120vh] py-20 md:py-32"
      id="ai-works"
    >
      {/* Header */}
      <div className="ai-works-header w-11/12 md:w-[min(900px,90vw)] mx-auto mb-12 md:mb-16 text-center">
        <p className="text-xs md:text-sm font-mono tracking-widest text-white/50 uppercase mb-4">
          AI Works
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold text-white mb-4">
          AI Films & Experiments
        </h2>
        <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto">
          Selected AI-powered ads, films, and visual experiments.
        </p>
      </div>

      {/* Top Track */}
      <div className="ai-works-track ai-works-track--top flex gap-4 md:gap-6 px-4 md:px-12 mb-6 md:mb-8 will-change-transform">
        {aiWorks.slice(0, 3).map((work) => (
          <article
            key={work.id}
            className="ai-work-card group relative shrink-0 w-72 md:w-[560px] aspect-video overflow-hidden rounded-3xl bg-neutral-900 cursor-pointer transform-gpu will-change-transform"
            onClick={() => handleCardClick(work)}
          >
            {/* Media */}
            {work.type === "film" || (work.type === "video" && work.videoUrl.includes(".mp4")) ? (
              <video
                src={work.videoUrl}
                poster={work.thumbnail}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
            ) : (
              <img
                src={work.thumbnail}
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
              <span className="text-xs md:text-sm font-mono tracking-widest text-white/70 uppercase">
                {work.type === "film" ? "AI Film" : "AI Reel"}
              </span>
              <h3 className="mt-2 text-lg md:text-2xl font-sans font-semibold text-white leading-tight">
                {work.title}
              </h3>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Track */}
      <div className="ai-works-track ai-works-track--bottom flex gap-4 md:gap-6 px-4 md:px-12 will-change-transform">
        {aiWorks.slice(3, 6).map((work) => (
          <article
            key={work.id}
            className="ai-work-card group relative shrink-0 w-52 md:w-96 aspect-video overflow-hidden rounded-3xl bg-neutral-900 cursor-pointer transform-gpu will-change-transform"
            onClick={() => handleCardClick(work)}
          >
            {/* Media */}
            {work.type === "film" || (work.type === "video" && work.videoUrl.includes(".mp4")) ? (
              <video
                src={work.videoUrl}
                poster={work.thumbnail}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
            ) : (
              <img
                src={work.thumbnail}
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
              <span className="text-xs md:text-sm font-mono tracking-widest text-white/70 uppercase">
                {work.type === "film" ? "AI Film" : "AI Reel"}
              </span>
              <h3 className="mt-2 text-base md:text-lg font-sans font-semibold text-white leading-tight">
                {work.title}
              </h3>
            </div>
          </article>
        ))}
      </div>

      {/* Explore Button */}
      <div className="flex justify-center mt-12 md:mt-16">
        <button
          onClick={onOpenExplorer}
          className="px-8 py-3 text-xs md:text-sm font-mono tracking-widest uppercase text-white border border-white/30 hover:border-white hover:bg-white/5 transition-all rounded-full"
        >
          View All AI Works
        </button>
      </div>
    </section>
  );
}
