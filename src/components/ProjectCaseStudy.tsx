import { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import { DesignProject } from "../portfolioData";

interface ProjectCaseStudyProps {
  project: DesignProject;
  allProjects?: DesignProject[];
  onClose: () => void;
  onUpdateProject?: (updated: DesignProject) => void;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1600&auto=format&fit=crop",
];

const buildFiveImages = (project: DesignProject) => {
  const sourceImages = [
    project.image,
    ...(project.galleryImages || []),
    ...FALLBACK_IMAGES,
  ].filter(Boolean);

  const uniqueImages = Array.from(new Set(sourceImages));
  return Array.from({ length: 5 }, (_, index) => uniqueImages[index % uniqueImages.length]);
};

export default function ProjectCaseStudy({ project, allProjects = [], onClose }: ProjectCaseStudyProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const galleryImages = useMemo(() => buildFiveImages(project), [project]);
  const projectIndex = Math.max(0, allProjects.findIndex((item) => item.id === project.id));
  const displayIndex = String(projectIndex + 1).padStart(2, "0");

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

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    let targetScroll = scroller.scrollTop;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      targetScroll = Math.min(maxScroll, Math.max(0, targetScroll + event.deltaY * 1.15));

      gsap.to(scroller, {
        scrollTop: targetScroll,
        duration: 0.82,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const syncTarget = () => {
      if (!gsap.isTweening(scroller)) targetScroll = scroller.scrollTop;
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    scroller.addEventListener("scroll", syncTarget, { passive: true });

    return () => {
      gsap.killTweensOf(scroller);
      scroller.removeEventListener("wheel", handleWheel);
      scroller.removeEventListener("scroll", syncTarget);
    };
  }, [project.id]);

  const scrollToGallery = () => {
    const scroller = scrollerRef.current;
    const gallery = scroller?.querySelector<HTMLElement>("#project-gallery");
    if (!scroller || !gallery) return;

    gsap.to(scroller, {
      scrollTop: gallery.offsetTop,
      duration: 1.15,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  return (
    <motion.div
      ref={scrollerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="project-case-study fixed inset-0 z-[200] overflow-x-hidden overflow-y-scroll overscroll-y-contain bg-[#181818] text-neutral-950"
    >
      <article className="mx-auto min-h-screen w-full max-w-[1440px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
        <section className="grid min-h-[100svh] grid-cols-1 gap-10 px-5 pb-12 pt-6 sm:px-8 md:grid-cols-[0.72fr_1.45fr] md:items-center md:gap-12 md:px-12 md:py-10 lg:px-16">
          <div className="flex h-full flex-col justify-between gap-12 md:min-h-[78vh]">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to projects"
              className="sticky top-5 z-40 inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-[12px] font-medium text-neutral-900 backdrop-blur-md transition-colors hover:border-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

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

              <button
                type="button"
                onClick={scrollToGallery}
                className="mt-8 inline-flex items-center gap-2 text-[12px] font-medium text-neutral-950 transition-colors hover:text-[#FF6A00]"
              >
                <span>Explore case study</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center"
          >
            <div className="aspect-[1.35] w-full overflow-hidden bg-neutral-200">
              <img
                src={galleryImages[0]}
                alt={`${project.title} cover`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        <section id="project-gallery" className="bg-white px-3 pb-3 sm:px-5 sm:pb-5">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-2 sm:gap-3">
            {galleryImages.map((image, index) => (
              <motion.figure
                key={`${image}-${index}`}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="w-full overflow-hidden bg-neutral-200"
              >
                <img
                  src={image}
                  alt={`${project.title} case study image ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-auto w-full object-cover"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </motion.figure>
            ))}
          </div>
        </section>

        <section className="flex min-h-[38vh] flex-col justify-between gap-10 bg-[#111] px-6 py-10 text-white sm:px-10 md:flex-row md:items-end md:px-16 md:py-14">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">End of case study</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,4rem)] font-medium leading-none">More work awaits.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm transition-colors hover:bg-white hover:text-black">
                View on Behance <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm transition-colors hover:bg-white hover:text-black">
              Back to projects <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </section>
      </article>
    </motion.div>
  );
}
