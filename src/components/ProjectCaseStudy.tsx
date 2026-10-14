import React, { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowDown, X } from "lucide-react";
import { DesignProject } from "../portfolioData";

interface ProjectCaseStudyProps {
  project: DesignProject;
  allProjects?: DesignProject[];
  onClose: () => void;
  onSelectProject?: (proj: DesignProject) => void;
}

const FALLBACK_IMAGES = [
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1791301958/Frame_2_jvfa4i.png",
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
      {/* Full-screen dedicated view on this website with native guaranteed scrolling */}
      <motion.div
        ref={screenRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[150] bg-white text-neutral-900 overflow-y-scroll overscroll-contain select-text flex flex-col h-full w-full min-h-screen touch-pan-y"
        id="project-case-study-screen"
        role="main"
        aria-label={project.title}
        tabIndex={0}
      >
        {/* Sticky Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-8 md:px-12 py-3.5 flex items-center justify-between">
          {/* Back to Projects Button */}
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black py-1.5 px-3 -ml-2 rounded-none hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Projects</span>
          </button>

          {/* Right Action Controls: Quick Prev/Next + Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            {prevProject && onSelectProject && (
              <button
                type="button"
                onClick={() => onSelectProject(prevProject)}
                className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-black py-1.5 px-3 border border-neutral-200 hover:border-black transition-colors cursor-pointer"
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
                className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-black py-1.5 px-3 border border-neutral-200 hover:border-black transition-colors cursor-pointer"
                title={`Next: ${nextProject.title}`}
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project screen"
              className="inline-flex items-center justify-center p-2 border border-neutral-200 hover:border-black hover:bg-neutral-100 text-neutral-800 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Screen Content Container with Centered Information & Scroll Presentation */}
        <div className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-8 md:px-12 pt-10 sm:pt-16 pb-24">
          
          {/* Centered Project Header: Title, Branding Tag, & Information */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            {/* Branding Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-900 border border-neutral-200/80 mb-5">
              <span>{project.type || "Branding / Visual Design"}</span>
              {project.year && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-500">{project.year}</span>
                </>
              )}
            </div>

            {/* Project Title */}
            <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-950 leading-[1.08] mb-5">
              {project.title}
            </h1>

            {/* Concise Information */}
            {project.description && (
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 font-normal leading-relaxed mx-auto max-w-2xl">
                {project.description}
              </p>
            )}

            {/* Scroll Indicator Prompt */}
            <div className="flex justify-center items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400 mt-7">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Scroll down for visuals</span>
            </div>
          </div>

          {/* Embedded Video Presentation (if provided) */}
          {project.video && (
            <div className="w-full aspect-video overflow-hidden bg-black border border-neutral-200 mb-8 sm:mb-12">
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

          {/* Artwork Showcase Stream (Fully scrollable visual gallery) */}
          <div className="flex flex-col gap-6 sm:gap-10 w-full mb-16">
            {galleryImages.map((image, index) => (
              <div
                key={`${image.slice(0, 40)}-${index}`}
                className="w-full overflow-hidden bg-neutral-50 border border-neutral-200/80 p-1 sm:p-2"
              >
                <img
                  src={image}
                  alt={`${project.title} artwork ${index + 1}`}
                  referrerPolicy="no-referrer"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="w-full h-auto object-contain select-none"
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
                  className="group flex flex-col items-start text-left p-3 border border-neutral-200 hover:border-black transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-500">
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Previous Project</span>
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-black mt-1">
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
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-neutral-900 bg-neutral-900 text-white hover:bg-white hover:text-neutral-900 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer active:scale-95"
              >
                Back to All Projects
              </button>
            </div>

            <div>
              {nextProject && onSelectProject ? (
                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject)}
                  className="group flex flex-col items-end text-right p-3 border border-neutral-200 hover:border-black transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-500">
                    <span>Next Project</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-black mt-1">
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
