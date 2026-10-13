import React, { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { DesignProject } from "../portfolioData";

interface ProjectCaseStudyProps {
  project: DesignProject;
  allProjects?: DesignProject[];
  onClose: () => void;
  onSelectProject?: (proj: DesignProject) => void;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1600&auto=format&fit=crop",
];

const getAllProjectImages = (project: DesignProject): string[] => {
  const list: string[] = [];
  if (project.image && !list.includes(project.image)) {
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
  onSelectProject,
}: ProjectCaseStudyProps) {
  const screenRef = useRef<HTMLDivElement | null>(null);

  const galleryImages = useMemo(() => getAllProjectImages(project), [project]);
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  // Keyboard navigation: Escape to exit, Left/Right for prev/next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && prevProject && onSelectProject) {
        onSelectProject(prevProject);
      } else if (e.key === "ArrowRight" && nextProject && onSelectProject) {
        onSelectProject(nextProject);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prevProject, nextProject, onSelectProject]);

  // Scroll to top of new screen when active project changes
  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [project.id]);

  return (
    <AnimatePresence>
      {/* Full-screen dedicated view on this website */}
      <motion.div
        ref={screenRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[120] bg-white text-neutral-900 overflow-y-auto select-text flex flex-col min-h-screen"
        id="project-case-study-screen"
        role="main"
        aria-label={project.title}
      >
        {/* Sticky Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 md:px-12 py-3.5 flex items-center justify-between">
          {/* Back to Projects Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-700 hover:text-black py-1.5 px-3 -ml-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Back to projects"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Projects</span>
            </button>

            {/* Breadcrumb separator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 pl-2 border-l border-neutral-200">
              <span>Project</span>
              <span>/</span>
              <span className="text-neutral-900 font-semibold truncate max-w-[240px]">
                {project.title}
              </span>
            </div>
          </div>

          {/* Right Action Controls: Quick Prev/Next + External Link + Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            {prevProject && onSelectProject && (
              <button
                type="button"
                onClick={() => onSelectProject(prevProject)}
                className="hidden md:inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black py-1 px-2.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                title={`Previous: ${prevProject.title}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            {nextProject && onSelectProject && (
              <button
                type="button"
                onClick={() => onSelectProject(nextProject)}
                className="hidden md:inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black py-1 px-2.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                title={`Next: ${nextProject.title}`}
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-black py-1.5 px-3 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <span>Behance</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project screen"
              className="inline-flex items-center justify-center p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Screen Content Container */}
        <div className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-8 md:px-12 pt-8 sm:pt-14 pb-20">
          {/* Project Title & Category Header */}
          <div className="mb-10 sm:mb-14">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              {project.type && (
                <span className="text-[11px] font-mono uppercase tracking-widest bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full font-medium">
                  {project.type}
                </span>
              )}
              {project.year && (
                <span className="text-xs font-mono text-neutral-500">
                  {project.year}
                </span>
              )}
            </div>

            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 leading-[1.08] mb-6">
              {project.title}
            </h1>

            {project.description && (
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 font-normal leading-relaxed max-w-3xl">
                {project.description}
              </p>
            )}

            {/* Metadata Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-neutral-200/80 mt-8 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  Discipline
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {project.type || "Visual Design"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  Year
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {project.year || "2024 - 2026"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  Focus
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  Brand & Direction
                </span>
              </div>
              {project.tools && project.tools.length > 0 ? (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Tools
                  </span>
                  <span className="text-sm font-semibold text-neutral-900 truncate block">
                    {project.tools.join(" • ")}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Format
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    Digital & Print
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Embedded Video Presentation (if provided) */}
          {project.video && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm mb-8 sm:mb-12">
              <video
                src={project.video}
                poster={galleryImages[0]}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-contain bg-black"
              />
            </div>
          )}

          {/* Artwork Showcase Stream */}
          <div className="flex flex-col gap-6 sm:gap-10 w-full mb-16">
            {galleryImages.map((image, index) => (
              <div
                key={`${image.slice(0, 40)}-${index}`}
                className="w-full overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-200/70 p-1 sm:p-2.5 transition-all"
              >
                <img
                  src={image}
                  alt={`${project.title} gallery artwork ${index + 1}`}
                  referrerPolicy="no-referrer"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="w-full h-auto object-contain rounded-xl select-none"
                />
              </div>
            ))}
          </div>

          {/* Bottom Screen Navigation: Browse Next / Previous Projects or Return */}
          <div className="pt-10 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              {prevProject && onSelectProject ? (
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject)}
                  className="group flex flex-col items-start text-left p-3 -ml-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Previous Project</span>
                  </span>
                  <span className="text-base font-semibold text-neutral-900 group-hover:text-black">
                    {prevProject.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-sm font-medium transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                Back to All Projects
              </button>
            </div>

            <div>
              {nextProject && onSelectProject ? (
                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject)}
                  className="group flex flex-col items-end text-right p-3 -mr-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400">
                    <span>Next Project</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-base font-semibold text-neutral-900 group-hover:text-black">
                    {nextProject.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
