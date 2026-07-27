import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject, aiFilms } from "../portfolioData";
import ShapeGrid from "./ShapeGrid";
import CurvedLoop from "./CurvedLoop";

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

const fallbackProjects = [
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_41_knefoc.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056274/image_36_hyojxm.png",
];

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
  const projectSectionRef = useRef<HTMLElement | null>(null);
  const projectTrackRef = useRef<HTMLDivElement | null>(null);
  const aiFilmSectionRef = useRef<HTMLElement | null>(null);
  const aiFilmCardRef = useRef<HTMLButtonElement | null>(null);
  const [filmIndex, setFilmIndex] = useState(0);
  const selectedProjects = (designs.length ? designs : []).slice(0, 3);
  const rollingProjects = [...selectedProjects, ...selectedProjects];
  const film = aiFilms[filmIndex % aiFilms.length];
  const reelItems = Array.from({ length: 10 }, (_, index) => aiFilms[index % aiFilms.length]);
  const portraitImage =
    profile?.aboutImageSecondary ||
    profile?.aboutImage ||
    "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_42_z0hjbd.png";

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".folio-reveal",
        { opacity: 0, y: 42 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".folio-reveal",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(".wave-reel-card", {
        y: (index) => Math.sin(index * 0.9) * 24,
        rotation: (index) => [-10, -4, 3, 8, 13, 5, -6, -12, 2, 11][index % 10],
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.12,
      });

      gsap.to(".wave-reel-track", {
        xPercent: -12,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        projectTrackRef.current,
        { x: 0 },
        {
          x: () => {
            const track = projectTrackRef.current;
            const section = projectSectionRef.current;
            if (!track || !section) return 0;
            return -(track.scrollWidth - section.clientWidth);
          },
          ease: "none",
          scrollTrigger: {
            trigger: projectSectionRef.current || ".project-roll-section",
            start: "top top",
            end: () => {
              const track = projectTrackRef.current;
              const section = projectSectionRef.current;
              if (!track || !section) return "+=1200";
              return `+=${Math.max(track.scrollWidth - section.clientWidth + window.innerWidth * 0.8, 1200)}`;
            },
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        aiFilmCardRef.current,
        { scale: 1.18, y: 0, borderRadius: 0, transformOrigin: "center center" },
        {
          scale: 1,
          y: 0,
          borderRadius: 28,
          ease: "none",
          scrollTrigger: {
            trigger: aiFilmSectionRef.current || ".ai-film-section",
            start: "top top",
            end: "+=120%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getProject = (index: number) => {
    const project = selectedProjects[index];
    return {
      project,
      title: project?.type || "Branding",
      description: project?.description || "Background in Fine Art and Design.",
      image: project?.image || fallbackProjects[index % fallbackProjects.length],
    };
  };

  const openFilm = () => {
    if (film) onOpenVideo?.(film.videoUrl, film.title);
  };

  const openBehance = () => {
    window.open(profile?.behance || "https://www.behance.net/sukunshsharma", "_blank", "noopener,noreferrer");
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

      <section className="relative min-h-screen overflow-hidden border-b border-neutral-100 bg-white px-5 py-16 sm:px-8 md:px-14 md:py-20">
        <div className="absolute inset-x-6 top-14 bottom-14 z-0 hidden md:block">
          <ShapeGrid
            direction="diagonal"
            speed={0.35}
            squareSize={34}
            borderColor="rgba(0, 0, 0, 0.065)"
            hoverFillColor="rgba(0, 0, 0, 0.08)"
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
              I’m a Delhi-based
              <br />
              Visual Designer.
            </h2>
            <p className="max-w-xl text-base font-normal leading-relaxed text-neutral-600 sm:text-lg md:text-[21px]">
              Rooted in Bihar’s rich cultural heritage,
              <br className="hidden sm:inline" />
              with a background in fine art,
              <br className="hidden sm:inline" />
              visual communication and design.
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
                        M.Des — IDC School of Design
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

          <div ref={aboutStageRef} className="folio-reveal relative flex flex-col items-center justify-start pt-6 lg:col-span-5 lg:pt-0">
            <motion.div
              className="relative flex origin-top select-none flex-col items-center"
              animate={{ rotate: [-2, 2, -2], y: [0, -8, 0] }}
              transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
              drag="y"
              dragConstraints={aboutStageRef}
              dragElastic={0.2}
              whileDrag={{ scale: 1.03 }}
            >
              <motion.div
                className="relative z-10 flex h-[clamp(11rem,34vh,18rem)] w-8 flex-col items-center justify-around overflow-hidden rounded-t-sm bg-neutral-950 py-3 shadow-sm sm:w-9"
                style={{ transformOrigin: "top center" }}
                animate={{ scaleY: [1, 1.08, 1], scaleX: [1, 1.02, 1] }}
                transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
              >
                <div className="absolute inset-y-0 left-1 w-px bg-white/10" />
                <div className="absolute inset-y-0 right-1 w-px bg-white/10" />
                <span className="text-[10px] text-white opacity-90">✿</span>
                <span className="text-[10px] text-white opacity-90">✿</span>
                <span className="text-[10px] text-white opacity-90">✿</span>
              </motion.div>
              <div className="relative z-20 -mt-0.5 flex flex-col items-center">
                <div className="flex h-4 w-8 items-center justify-center rounded-sm border border-neutral-700 bg-neutral-900 shadow-md sm:w-9">
                  <div className="h-1 w-4 rounded-full bg-neutral-800" />
                </div>
                <div className="-mt-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-neutral-900 bg-transparent">
                  <div className="h-4 w-2.5 rounded-b-sm bg-neutral-900" />
                </div>
              </div>
              <div className="relative z-10 -mt-2 flex w-[250px] flex-col items-center rounded-2xl border border-neutral-200/90 bg-white p-4 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] sm:w-[280px] sm:rounded-[22px] sm:p-5 md:w-[300px]">
                <div className="mb-3 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-neutral-300 bg-neutral-900 shadow-inner">
                  <div className="h-1 w-1 rounded-full bg-neutral-700" />
                </div>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-neutral-200/60 bg-neutral-100 shadow-sm">
                  <img
                    src={portraitImage}
                    alt="SUKANSH Portrait"
                    className="h-full w-full object-cover grayscale contrast-110"
                  />
                </div>
                <div className="mt-4 font-sans text-sm font-bold uppercase tracking-[0.25em] text-neutral-950 sm:mt-5 sm:text-base">
                  SUKUNSH
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="folio-reveal relative mx-auto mt-4 w-full max-w-[1380px]">
          <CurvedLoop
            marqueeText="VISUAL ART ✦ FINE ART ✦ RISOGRAPHY ✦ CULTURAL HERITAGE ✦ BIHAR ✦ DELHI ✦ MOTION DESIGN ✦ CINEMATIC EXPERIMENTS ✦ "
            speed={1.45}
            curveAmount={0}
            direction="left"
            interactive={true}
            className="fill-neutral-950 font-sans text-[18px] font-bold uppercase tracking-[0.18em]"
          />
        </div>
      </section>

      <section ref={projectSectionRef} className="project-roll-section min-h-screen overflow-hidden bg-white px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="folio-reveal mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-normal tracking-normal text-[#1f1f1e]">
          <span>Selected</span>
          <span className="font-semibold">Projects</span>
          <ArrowDownLeft className="h-5 w-5" />
          </div>
          <button
            type="button"
            onClick={openBehance}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2 text-sm text-[#878787] transition-colors hover:border-neutral-900 hover:text-neutral-950"
          >
            <span>View All Project</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div ref={projectTrackRef} className="project-roll-track flex w-max gap-4 will-change-transform">
          {rollingProjects.map((project, index) => {
            const item = getProject(index % Math.max(selectedProjects.length, 1));
            return (
              <article key={`${project?.id || "fallback"}-${index}`} className="folio-reveal group w-[320px] shrink-0 md:w-[420px]">
                <button
                  type="button"
                  onClick={() => item.project && onSelectProject?.(item.project)}
                  data-project-card={item.project?.id || `fallback-${index}`}
                  className="block w-full cursor-pointer text-left"
                >
                  <div className="aspect-[1.4] w-full overflow-hidden bg-neutral-200">
                    <img
                      src={item.image}
                      alt={item.project?.title || item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="mt-6 max-w-[260px]">
                    <h3 className="text-xl font-medium text-[#1f1f1e]">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-tight text-neutral-600">
                      Background in Fine Art
                      <br />
                      and Design.
                    </p>
                    <div className="mt-5 flex max-w-[230px] items-center justify-between border-t border-neutral-500 pt-2 text-sm text-[#878787]">
                      <span>see project</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section ref={aiFilmSectionRef} className="ai-film-section relative min-h-[106vh] overflow-hidden bg-white px-5 py-0 sm:px-8 md:px-14">
        <div className="sticky top-0 min-h-screen py-4 md:py-6">
          <div className="absolute left-5 top-4 z-20 sm:left-8 md:left-14 md:top-6">
            <div className="h-px w-36 bg-neutral-700" />
            <div className="mt-2 flex items-center gap-1.5 text-3xl font-normal text-[#1f1f1e]">
              <span>AI Film</span>
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>

          <div className="folio-reveal flex min-h-[72vh] items-start justify-center pt-14 md:min-h-[68vh] md:pt-16">
            <button
              ref={aiFilmCardRef}
              type="button"
              onClick={openFilm}
              className="ai-film-card group relative block h-[100svh] w-[100vw] overflow-hidden rounded-none bg-neutral-200 md:h-[calc(100svh-5rem)] md:w-[calc(100vw-7rem)] md:max-w-[1180px] md:rounded-[28px]"
            >
              <video
                key={film?.id}
                src={film?.videoUrl}
                poster={film?.thumbnail}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                className="h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-90"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-500 bg-white/25">
                  <Play className="h-5 w-5 fill-neutral-600 text-neutral-600" />
                </span>
              </span>
            </button>
          </div>

          <div className="relative z-20 mt-3 flex flex-col gap-8 pb-8 md:mt-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[250px]">
              <h3 className="text-xl font-medium text-[#1f1f1e]">{film?.id === "ai-film-rivr-ad" ? "RIVE" : film?.title}</h3>
              <p className="mt-2 text-[15px] leading-tight text-neutral-600">
                Background in Fine Art
                <br />
                and Design.
              </p>
              <button
                type="button"
                onClick={() => setFilmIndex((value) => (value + 1) % aiFilms.length)}
                className="mt-5 flex w-full items-center justify-between border-t border-neutral-500 pt-2 text-sm text-[#878787]"
              >
                <span>Next film</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenAIWork}
              className="inline-flex w-fit items-center gap-8 rounded-full border border-neutral-200 px-7 py-3 text-sm text-[#878787] hover:border-neutral-900"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="relative min-h-[72vh] overflow-hidden bg-white px-5 py-14 sm:px-8 md:px-14 md:py-20">
        <div className="folio-reveal grid grid-cols-1 gap-8 md:grid-cols-[0.55fr_1fr]">
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

        <div className="wave-reel-track mt-10 flex h-[400px] w-max items-end justify-center gap-6 md:gap-9">
          {reelItems.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              type="button"
              onClick={() => onOpenVideo?.(item.videoUrl, item.title)}
              className="wave-reel-card group relative h-[270px] w-[154px] shrink-0 overflow-hidden rounded-[28px] bg-neutral-200 shadow-sm md:h-[300px] md:w-[170px]"
              style={{
                transform: `rotate(${[-10, -4, 3, 8, 13, 5, -6, -12, 2, 11][index]}deg) translateY(${[46, -8, 18, -18, 36, 0, 28, -10, 44, 8][index]}px)`,
              }}
            >
              <video
                src={item.videoUrl}
                poster={item.thumbnail}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                className="h-full w-full object-cover opacity-65 transition-opacity group-hover:opacity-90"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-500 bg-white/30">
                  <Play className="h-4 w-4 fill-neutral-600 text-neutral-600" />
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-7 text-sm">
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
        </div>
      </section>
    </div>
  );
}
