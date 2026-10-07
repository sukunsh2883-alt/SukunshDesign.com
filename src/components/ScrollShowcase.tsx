import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, Maximize, Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject, designProjects, AIFilm, aiFilms } from "../portfolioData";
import ShapeGrid from "./ShapeGrid";
import CurvedLoop from "./CurvedLoop";
import Lanyard from "./Lanyard";
import CinematicEditorialScroll from "./CinematicEditorialScroll";
import EditorialProjects from "./EditorialProjects";
import LetsTalk from "./LetsTalk";
import FlexCarousel, { FlexCarouselItem } from "./FlexCarousel";

gsap.registerPlugin(ScrollTrigger);

interface ScrollShowcaseProps {
  onClose?: () => void;
  isInline?: boolean;
  designs?: DesignProject[];
  films?: AIFilm[];
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
  films,
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
  const [filmIndex, setFilmIndex] = useState(0);
  const reelTweenRef = useRef<gsap.core.Tween | null>(null);

  const allProjects = useMemo(() => {
    const list = designs && designs.length > 0 ? designs : designProjects;
    const initialClaro = designProjects.find((p) => p.id === "claro-ai-information-intelligence");
    const initialWoko = designProjects.find((p) => p.id === "woko-noodle-brand-identity");
    const initialNou = designProjects.find((p) => p.id === "nou-visual-identity");

    const rest = list.filter(
      (p) => p && p.id !== "claro-ai-information-intelligence" && p.id !== "woko-noodle-brand-identity" && p.id !== "nou-visual-identity"
    );

    const topThree: DesignProject[] = [];
    if (initialClaro) topThree.push(initialClaro);
    if (initialWoko) topThree.push(initialWoko);
    if (initialNou) topThree.push(initialNou);

    return [...topThree, ...rest];
  }, [designs]);

  const activeFilms = useMemo(() => {
    const source = films && films.length > 0 ? films : aiFilms;
    const list = source.filter(
      (f) => !f.videoUrl.includes("youtube.com") && !f.videoUrl.includes("youtu.be")
    );
    return list.length > 0 ? list : source;
  }, [films]);

  const allAIFilms = useMemo(() => {
    const list = [...activeFilms];
    AI_PROMOTION_REEL_VIDEOS.forEach((reel) => {
      if (!list.some((f) => f.videoUrl === reel.videoUrl)) {
        list.push({
          id: reel.id,
          title: reel.title,
          category: "AI Reel",
          description: "AI-powered creative experiment.",
          videoUrl: reel.videoUrl,
          thumbnail: reel.thumbnail,
          year: "2026",
          tags: ["AI", "Promotion Reel"],
        });
      }
    });
    return list;
  }, [activeFilms]);

  const carouselItems = useMemo<FlexCarouselItem[]>(() => {
    return allAIFilms.map((f, idx) => ({
      src: f.thumbnail,
      video: f.videoUrl,
      alt: f.title,
      title: f.title,
      subtitle: f.category || "AI Film",
      film: f,
      index: idx,
    }));
  }, [allAIFilms]);

  const film = allAIFilms[filmIndex % allAIFilms.length];
  // 14 items (repeating the 7 user Cloudinary videos twice) for seamless continuous infinite reel stream with zero random images
  const reelItems = Array.from({ length: 14 }, (_, index) => AI_PROMOTION_REEL_VIDEOS[index % AI_PROMOTION_REEL_VIDEOS.length]);
  const portraitImage =
    "https://res.cloudinary.com/dylv5m3jk/image/upload/v1791301958/Frame_2_jvfa4i.png";

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

      // Seamless left-to-right straight horizontal track motion for AI Reel cards (loops uninterrupted without pausing)
      const reelTween = gsap.to(".seamless-reel-track", {
        xPercent: -50,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
      reelTweenRef.current = reelTween;

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [allProjects]);

  const openFilm = () => {
    if (film) onOpenVideo?.(film.videoUrl, film.title);
  };

  return (
    <div ref={containerRef} className="scroll-showcase w-full bg-[#050505] text-white select-none">
      {!isInline && onClose && (
        <nav className="fixed left-5 right-5 top-5 z-[120] flex items-center justify-between rounded-full border border-white/10 bg-neutral-950/90 px-5 py-3 shadow-md backdrop-blur-md">
          <span className="text-xs font-medium text-white">Sukunsh.</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white hover:border-white cursor-pointer"
          >
            <span>Close</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </nav>
      )}

      {/* 1. CINEMATIC SCROLL EDITORIAL SECTION (REFERENCE-INSPIRED EXPANDING VIDEO) */}
      <CinematicEditorialScroll
        line1Text="PLEASE DON'T ASK WHAT"
        line2Prefix="LAYER 82"
        line2Suffix="DOES."
        videoSrc="/design-illustration-loop.mp4"
        onExploreClick={onOpenDesignShowcase}
      />

      {/* 2. PROJECTS SECTION */}
      <EditorialProjects
        projects={allProjects}
        onSelectProject={onSelectProject}
        onOpenProjectsExplorer={onOpenProjects}
        onOpenAIWork={onOpenAIWork}
        onOpenDesignShowcase={onOpenDesignShowcase}
        profile={profile}
      />

      {/* 3. ALL AI FILMS SECTION (Minimalist, borderless, continuous looping video carousel) */}
      <section
        id="ai-work"
        ref={aiSectionRef}
        data-cursor-tag="AI Films"
        className="relative w-full bg-[#050505] text-white px-2 sm:px-4 md:px-8 py-10 sm:py-16 select-none"
      >
        <div className="mx-auto w-full max-w-[1540px]">
          {/* Section Header: Minimalist AI Films ↙ aligned to H2 standard 36–48px */}
          <div className="folio-reveal mb-2 sm:mb-4 flex items-center justify-between px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[clamp(2.25rem,4vw,3rem)] font-bold tracking-[-0.035em] text-white leading-none select-none">
                AI Films
              </h2>
              <span className="inline-flex items-center text-white transform translate-y-0.5">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 stroke-current stroke-[2.2] fill-none"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 5L5 19M5 19H17M5 19V7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenAIWork}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-black px-5 py-2.5 text-[14px] font-medium text-white shadow-xs transition-all cursor-pointer"
              >
                <span>Explore Vault</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Pure Minimalist Liquid Video Carousel (ZERO white borders, looping continuous videos) */}
          <div className="relative w-full h-[540px] sm:h-[620px] md:h-[680px] overflow-hidden bg-transparent my-0 border-0 outline-none">
            <FlexCarousel
              items={carouselItems}
              preset="liquid"
              intro="rise"
              cardHeight={0.65}
              gap={18}
              radius={10}
              squeeze={0.2}
              focusOnClick={true}
              captions={false}
              captureWheel={false}
              onChange={(index) => {
                setFilmIndex(index);
              }}
              onSelect={(index, item) => {
                const selected = item?.film || allAIFilms[index];
                if (selected) {
                  onOpenVideo?.(selected.videoUrl, selected.title);
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* 4. ABOUT ME SECTION (Directly following AI Films) */}
      <section id="about" className="relative min-h-screen overflow-visible bg-[#050505] text-white px-5 py-16 sm:px-8 md:px-14 md:py-24 z-20">
        <div className="absolute inset-x-6 top-14 bottom-14 z-0 hidden md:block overflow-hidden pointer-events-none">
          <ShapeGrid
            direction="diagonal"
            speed={0.35}
            squareSize={34}
            borderColor="rgba(255, 255, 255, 0.06)"
            hoverFillColor="rgba(255, 255, 255, 0.08)"
            shape="square"
            hoverTrailAmount={8}
          />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="folio-reveal flex flex-col justify-center space-y-8 sm:space-y-10 md:space-y-12 lg:col-span-7">
            <div>
              <div className="mb-2.5 h-[1.5px] w-12 bg-white" />
              <div className="inline-flex items-center gap-1 text-[13px] font-semibold tracking-wide text-white">
                <span>About me</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2] text-white" />
              </div>
            </div>
            {/* H2 standard 36–48px */}
            <h2 className="select-none text-[34px] sm:text-[40px] md:text-[44px] lg:text-[48px] font-normal leading-[1.12] tracking-normal text-white">
              I am a Delhi based
              <br />
              visual designer.
            </h2>
            {/* Body text standard 16–18px */}
            <p className="max-w-xl text-[16px] sm:text-[17px] md:text-[18px] font-normal leading-relaxed text-neutral-400">
              Crafting evocative visual stories through motion, typography, and creative precision.
            </p>

            <div className="pt-2">
              <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-stretch sm:gap-0">
                <div className="flex-1 sm:pr-8 md:pr-10">
                  {/* Labels / metadata standard 12–14px */}
                  <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
                    EDUCATION
                  </div>
                  <div className="mb-5 mt-1.5 h-[1.5px] w-6 bg-white" />
                  <div className="space-y-5">
                    <div>
                      <div className="text-[15px] sm:text-[16px] font-semibold leading-snug text-white">
                        M.Des - IDC School of Design
                      </div>
                      <div className="mt-0.5 text-[13px] sm:text-[14px] font-normal text-neutral-400">
                        IIT Bombay
                      </div>
                    </div>
                    <div className="h-px w-full bg-neutral-800" />
                    <div>
                      <div className="text-[15px] sm:text-[16px] font-semibold leading-snug text-white">
                        BFA, Visual Communication
                      </div>
                      <div className="mt-0.5 text-[13px] sm:text-[14px] font-normal text-neutral-400">
                        College of Art, Delhi
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative hidden w-px shrink-0 flex-col items-center justify-center self-stretch bg-neutral-800 sm:flex">
                  <div className="absolute top-1/2 -left-[2.5px] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#FF6A00]" />
                </div>
                <div className="flex-1 sm:pl-8 md:pl-10">
                  {/* Labels / metadata standard 12–14px */}
                  <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
                    EXPERIENCE
                  </div>
                  <div className="mb-5 mt-1.5 h-[1.5px] w-6 bg-white" />
                  <div>
                    <div className="text-[15px] sm:text-[16px] font-semibold leading-snug text-white">
                      Visual Designer
                    </div>
                    <div className="mt-0.5 text-[13px] sm:text-[14px] font-normal text-neutral-400">
                      ShareChat
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={aboutStageRef}
            className="folio-reveal flex flex-col items-center justify-center lg:col-span-5 relative w-full h-[750px] sm:h-[860px] md:h-[960px] lg:h-[1000px] overflow-visible"
            aria-label="Sooraj Kumar Sharma identity card"
          >
            <Lanyard
              position={[0, 0, 22]}
              fov={22}
              gravity={[0, -40, 0]}
              frontImage={portraitImage}
              backImage={portraitImage}
              imageFit="fill"
              transparent={true}
            />
          </div>
        </div>
        <div className="folio-reveal relative mx-auto mt-8 w-full max-w-[1380px]">
          <CurvedLoop
            marqueeText="VISUAL ART ✦ MOTION DESIGN ✦ IDENTITY ✦ DIRECTION ✦ "
            speed={1.45}
            curveAmount={0}
            direction="left"
            interactive={true}
            className="fill-white font-sans text-[32px] font-bold uppercase tracking-[0.18em]"
          />
        </div>
      </section>

      {/* 5. LET'S TALK CONTACT SECTION */}
      <LetsTalk profile={profile} />
    </div>
  );
}
