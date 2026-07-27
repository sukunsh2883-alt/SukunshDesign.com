import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ChevronDown } from "lucide-react";
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

  const scrollToGallery = () => {
    document.querySelector("#project-gallery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen overflow-y-auto bg-[#181818] text-neutral-950"
    >
      <div className="w-full px-4 py-5 sm:px-6 sm:py-8 md:px-10">
        <article className="mx-auto w-full max-w-[980px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
          <section className="grid min-h-[420px] grid-cols-1 gap-10 px-7 py-8 sm:px-10 md:min-h-[520px] md:grid-cols-[0.86fr_1.5fr] md:gap-14 md:px-12 md:py-12 lg:px-16">
            <div className="flex flex-col justify-between gap-10">
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to projects"
                className="inline-flex w-fit items-center gap-2 text-[12px] font-medium text-neutral-900 transition-colors hover:text-[#FF6A00]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <div className="max-w-[260px] pb-2">
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-400">
                  Project {displayIndex}
                </p>
                <h1 className="text-3xl font-sans font-medium leading-none tracking-normal text-neutral-950 sm:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-4 border-b border-neutral-400 pb-3 text-[11px] leading-relaxed text-neutral-700">
                  {project.description || project.aboutProject}
                </p>

                <div className="mt-4 space-y-3 text-left">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Category</p>
                    <p className="mt-1 text-[11px] font-medium text-neutral-950">{project.type}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Year</p>
                    <p className="mt-1 text-[11px] font-medium text-neutral-950">{project.year}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToGallery}
                  className="mt-7 inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-950 hover:text-[#FF6A00]"
                >
                  <span>Scroll Down</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full overflow-hidden bg-neutral-200 aspect-[1.52]">
                <img
                  src={galleryImages[0]}
                  alt={`${project.title} cover`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          <section id="project-gallery" className="space-y-4 px-5 pb-6 pt-5 sm:px-8 md:space-y-5 md:px-8 md:pb-8">
            {galleryImages.map((image, index) => (
              <figure key={`${image}-${index}`} className="w-full">
                <div className="w-full overflow-hidden bg-neutral-200 aspect-[1.95]">
                  <img
                    src={image}
                    alt={`${project.title} image ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </figure>
            ))}
          </section>
        </article>
      </div>
    </motion.div>
  );
}
