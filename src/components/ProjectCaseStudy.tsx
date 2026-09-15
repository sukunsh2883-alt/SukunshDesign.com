import { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import Lenis from "lenis";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import { DesignProject } from "../portfolioData";

interface ProjectCaseStudyProps {
  project: DesignProject;
  allProjects?: DesignProject[];
  onClose: () => void;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1600&auto=format&fit=crop",
];

// Open and unlimited image resolution - includes all uploaded and curated images
const getAllProjectImages = (project: DesignProject): string[] => {
  const list: string[] = [];
  if (project.image) {
    list.push(project.image);
  }
  if (project.galleryImages && Array.isArray(project.galleryImages)) {
    project.galleryImages.forEach((img) => {
      if (img && !list.includes(img)) {
        list.push(img);
      }
    });
  }
  return list.length > 0 ? list : FALLBACK_IMAGES;
};

export default function ProjectCaseStudy({
  project,
  allProjects = [],
  onClose,
}: ProjectCaseStudyProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const galleryImages = useMemo(() => getAllProjectImages(project), [project]);
  const projectIndex = Math.max(0, allProjects.findIndex((item) => item.id === project.id));
  const displayIndex = String(projectIndex + 1).padStart(2, "0");

  // Keyboard shortcut: Escape to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll and reset scroll position
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    window.scrollTo({ top: 0 });

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [project.id]);

  // Lenis smooth scrolling setup (matching continuous smooth scroll with zero jerk)
  useEffect(() => {
    const wrapper = scrollerRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    wrapper.scrollTop = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [project.id]);

  const scrollToGallery = () => {
    const gallery = document.getElementById("project-gallery");
    if (!gallery) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(gallery, { offset: -30, duration: 1.0 });
    } else if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: gallery.offsetTop - 30,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      ref={scrollerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="project-case-study fixed inset-0 z-[200] overflow-x-hidden overflow-y-scroll overscroll-y-contain bg-[#181818] text-neutral-950 select-text"
    >
      <div ref={contentRef} className="w-full bg-[#181818]">
        <article className="mx-auto min-h-screen w-full max-w-[1440px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
          
          {/* Header & Hero Presentation */}
          <section className="grid min-h-[100svh] grid-cols-1 gap-10 px-5 pb-12 pt-6 sm:px-8 md:grid-cols-[0.72fr_1.45fr] md:items-center md:gap-12 md:px-12 md:py-10 lg:px-16">
            <div className="flex h-full flex-col justify-between gap-12 md:min-h-[78vh]">
              
              {/* Top Navigation */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Back to projects"
                  className="sticky top-5 z-40 inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white/95 px-4 py-2 text-[12px] font-medium text-neutral-900 shadow-xs hover:border-neutral-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              </div>

              {/* Title & Details */}
              <div className="max-w-[360px] pb-4">
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-400">
                  Project {displayIndex}
                </p>
                <h1 className="text-[clamp(2.4rem,5vw,5.5rem)] font-sans font-medium leading-[0.92] tracking-normal text-neutral-950">
                  {project.title}
                </h1>
                <p className="mt-6 border-b border-neutral-300 pb-5 text-[14px] leading-relaxed text-neutral-600">
                  {project.description || project.aboutProject}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-5 text-left">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Category</p>
                    <p className="mt-1 text-[12px] font-medium text-neutral-950">{project.type}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Year</p>
                    <p className="mt-1 text-[12px] font-medium text-neutral-950">{project.year}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={scrollToGallery}
                    className="inline-flex items-center gap-2 text-[12px] font-medium text-neutral-950 hover:text-[#FF6A00] transition-colors cursor-pointer"
                  >
                    <span>Scroll to Gallery</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Visual Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center"
            >
              <div className="aspect-[1.35] w-full overflow-hidden bg-neutral-100 rounded-[2px] shadow-sm">
                <img
                  src={galleryImages[0]}
                  alt={`${project.title} cover`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </section>

          {/* Smooth Artwork Stream: ZERO JERK, continuous flowing images */}
          <section
            id="project-gallery"
            className="bg-white px-3 py-4 sm:px-5 sm:py-6"
          >
            <div className="mx-auto flex max-w-[1360px] flex-col gap-0 leading-none">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image.slice(0, 40)}-${index}`}
                  className="w-full flex justify-center bg-white p-0 m-0 border-0 outline-0 leading-none"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <img
                    src={image}
                    alt={`${project.title} artwork ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block m-0 p-0 border-0 outline-0 shadow-none select-none align-bottom object-contain"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Footer & Navigation Outro */}
          <section className="flex min-h-[38vh] flex-col justify-between gap-10 bg-[#111] px-6 py-10 text-white sm:px-10 md:flex-row md:items-end md:px-16 md:py-14">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">End of case study</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-medium leading-none">More work awaits.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm transition-colors hover:bg-white hover:text-black cursor-pointer"
                >
                  View on Behance <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm transition-colors hover:bg-white hover:text-black cursor-pointer"
              >
                Back to projects <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          </section>
        </article>
      </div>
    </motion.div>
  );
}
