import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject, aiFilms } from "../portfolioData";
import ShapeGrid from "./ShapeGrid";
import CurvedLoop from "./CurvedLoop";
import Lanyard from "./Lanyard";

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
  const aiFilmHeadingRef = useRef<HTMLDivElement | null>(null);
  const aiFilmDetailsRef = useRef<HTMLDivElement | null>(null);
  const [filmIndex, setFilmIndex] = useState(0);
  const selectedProjects = (designs.length ? designs : []).slice(0, 3);
  const rollingProjects = [...selectedProjects, ...selectedProjects];
  const film = aiFilms[filmIndex % aiFilms.length];
  const reelItems = Array.from({ length: 10 }, (_, index) => aiFilms[index % aiFilms.length]);
  const portraitImage =
    "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png";

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".folio-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
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

      const media = gsap.matchMedia();

      media.add("(min-width: 768px)", () => {
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
                if (!track || !section) return "+=1100";
                return `+=${Math.max(track.scrollWidth - section.clientWidth + window.innerWidth * 0.65, 1100)}`;
              },
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      const filmTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: aiFilmSectionRef.current || ".ai-film-section",
          start: "top top",
          end: "+=180%",
          scrub: 1.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      filmTimeline
        .to(
          aiFilmCardRef.current,
          {
            width: "100vw",
            height: "100svh",
            borderRadius: 0,
            transformOrigin: "center center",
            duration: 0.18,
            ease: "none",
          },
          0,
        )
        .to(
          aiFilmCardRef.current,
          {
            width: () => (window.innerWidth < 768 ? window.innerWidth - 20 : Math.min(1240, window.innerWidth - 48)),
            height: () => (window.innerWidth < 768 ? window.innerHeight * 0.7 : Math.min(window.innerHeight * 0.78, 780)),
            borderRadius: () => (window.innerWidth < 768 ? 16 : 28),
            duration: 0.82,
            ease: "none",
          },
          0.18,
        )
        .fromTo(
          [aiFilmHeadingRef.current, aiFilmDetailsRef.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.22, ease: "none" },
          0.76,
        );

      return () => media.revert();
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

      <section id="about" className="relative min-h-screen overflow-hidden border-b border-neutral-100 bg-white px-5 py-16 sm:px-8 md:px-14 md:py-20">
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
              I'm a Delhi-based
              <br />
              Visual Designer.
            </h2>
            <p className="max-w-xl text-base font-normal leading-relaxed text-neutral-600 sm:text-lg md:text-[21px]">
              Rooted in Bihar's rich cultural heritage,
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
            className="folio-reveal relative h-[560px] min-h-[70vh] w-full touch-none lg:absolute lg:inset-0 lg:z-20 lg:h-full lg:min-h-0"
            aria-label="Interactive Sukunsh identity card"
          >
            <Lanyard
              position={[0, 0, 13.5]}
              gravity={[0, -40, 0]}
              fov={22}
              frontImage={portraitImage}
              backImage={portraitImage}
              imageFit="cover"
              lanyardWidth={0.56}
              strapLength={0.74}
              springStrength={0.86}
              damping={2.8}
              cardWeight={0.68}
              cardScale={1.16}
            />
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

        <div ref={projectTrackRef} className="project-roll-track flex w-max max-w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-5 will-change-transform md:max-w-none md:overflow-visible">
          {rollingProjects.map((project, index) => {
            const item = getProject(index % Math.max(selectedProjects.length, 1));
            return (
              <article key={`${project?.id || "fallback"}-${index}`} className="folio-reveal group w-[82vw] max-w-[360px] shrink-0 snap-start md:w-[420px] md:max-w-none">
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

      <section ref={aiFilmSectionRef} className="ai-film-section relative min-h-screen overflow-hidden bg-white">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div ref={aiFilmHeadingRef} className="pointer-events-none absolute left-5 top-6 z-20 opacity-0 sm:left-8 md:left-14">
            <div className="h-px w-36 bg-neutral-700" />
            <div className="mt-2 flex items-center gap-1.5 text-3xl font-normal text-[#1f1f1e]">
              <span>AI Film</span>
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>

          <div className="flex min-h-screen w-full items-center justify-center">
            <button
              ref={aiFilmCardRef}
              type="button"
              onClick={openFilm}
              className="ai-film-card group relative block h-[100svh] w-[100vw] shrink-0 overflow-hidden rounded-none bg-neutral-200"
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
                className="h-full w-full object-cover opacity-100 transition-opacity group-hover:opacity-100"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-500 bg-white/25">
                  <Play className="h-5 w-5 fill-neutral-600 text-neutral-600" />
                </span>
              </span>
            </button>
          </div>

          <div ref={aiFilmDetailsRef} className="relative z-20 flex w-full flex-col gap-5 bg-white px-5 py-8 opacity-0 sm:px-8 md:flex-row md:items-end md:justify-between md:px-14 md:py-10">
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
                className="h-full w-full object-cover opacity-100 transition-opacity group-hover:opacity-100"
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



