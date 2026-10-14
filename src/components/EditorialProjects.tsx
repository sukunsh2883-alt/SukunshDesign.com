import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject, designProjects } from "../portfolioData";
import { lineReveal, frameReveal, fadeUp, drawLine, parallax, isReducedMotion } from "../motion";

interface EditorialProjectsProps {
  projects: DesignProject[];
  onSelectProject?: (proj: DesignProject) => void;
  onOpenProjectsExplorer?: () => void;
  onOpenAIWork?: () => void;
  onOpenDesignShowcase?: () => void;
  profile?: any;
}

export default function EditorialProjects({
  projects,
  onSelectProject,
  onOpenProjectsExplorer,
  profile,
}: EditorialProjectsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Safe project slots with designProjects as guaranteed fallback
  const p1 = projects.find((p) => p.id === "woko-noodle-brand-identity") || designProjects.find((p) => p.id === "woko-noodle-brand-identity") || projects[1];
  const p_claro = projects.find((p) => p.id === "claro-ai-information-intelligence") || designProjects.find((p) => p.id === "claro-ai-information-intelligence");
  const p2 = projects.find((p) => p.id === "design-kinetic-motion") || designProjects.find((p) => p.id === "design-kinetic-motion") || projects[3];
  const p6 = projects.find((p) => p.id === "design-character-anim") || designProjects.find((p) => p.id === "design-character-anim") || projects[6];
  const p3 = projects.find((p) => p.id === "nou-visual-identity") || designProjects.find((p) => p.id === "nou-visual-identity") || projects[2];
  const p_layer82 = projects.find((p) => p.id === "layer-82-motion-design") || designProjects.find((p) => p.id === "layer-82-motion-design");
  const p4 = projects.find((p) => p.id === "design-1") || designProjects.find((p) => p.id === "design-1") || projects[4];
  const p5 = projects.find((p) => p.id === "design-earthquake-map") || designProjects.find((p) => p.id === "design-earthquake-map") || projects[5];
  const p_mono = projects.find((p) => p.id === "design-monogram-logos") || designProjects.find((p) => p.id === "design-monogram-logos");

  // Motion integration
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Title lineReveal
      if (titleRef.current) {
        lineReveal(titleRef.current);
      }

      // 2. Each project card frameReveal & drawLine
      const frames = section.querySelectorAll<HTMLElement>("[data-motion='frame']");
      frames.forEach((frame, idx) => {
        frameReveal(frame, idx * 0.04);
      });

      // 3. Card metas fadeUp
      const metas = section.querySelectorAll<HTMLElement>("[data-motion='meta']");
      if (metas.length) {
        fadeUp(Array.from(metas));
      }

      // 4. Parallax on media (desktop only)
      const medias = section.querySelectorAll<HTMLElement>("[data-motion='media']");
      medias.forEach((media) => {
        const parentFrame = media.closest<HTMLElement>("[data-motion='frame']");
        parallax(media, parentFrame);
      });

      // 5. Section hair lines
      const lines = section.querySelectorAll<HTMLElement>("[data-motion='line']");
      lines.forEach((line) => {
        drawLine(line);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const getProjectLines = (proj?: DesignProject, defaultLine1 = "Background in Fine Art", defaultLine2 = "and Design.") => {
    if (!proj) return { line1: defaultLine1, line2: defaultLine2 };
    if (proj.description) {
      const parts = proj.description.split(/[,.]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return { line1: parts[0], line2: parts[1] };
      }
    }
    return { line1: defaultLine1, line2: defaultLine2 };
  };

  const renderCardMeta = (typeText = "Branding", line1 = "Background in Fine Art") => (
    <div data-motion="meta" className="mt-3 flex items-center justify-between text-[13px] sm:text-[14px] leading-none text-neutral-700">
      <div className="flex items-center gap-2 sm:gap-2.5 truncate">
        <span className="font-semibold text-neutral-900 whitespace-nowrap">
          {typeText}
        </span>
        <span className="inline-block w-px h-3.5 bg-neutral-300 shrink-0" />
        <span className="text-neutral-500 font-normal truncate">
          {line1}
        </span>
      </div>

      {/* Text roll on hover (desktop only) */}
      <div className="hidden sm:inline-flex overflow-hidden h-3.5 items-center font-mono text-[10px] uppercase tracking-wider text-neutral-400 group-hover:text-black transition-colors shrink-0">
        <span className="transition-transform duration-300 group-hover:-translate-y-full">VIEW</span>
      </div>
    </div>
  );

  const renderProjectCard = (
    proj: DesignProject | undefined,
    aspectClass: string,
    typeText?: string,
    customLine?: string
  ) => {
    if (!proj) return null;
    const isHovered = hoveredId === proj.id;
    const isSibling = hoveredId !== null && !isHovered;

    return (
      <div
        key={proj.id}
        onClick={() => onSelectProject?.(proj)}
        role="button"
        tabIndex={0}
        data-cursor-project="true"
        data-project-card="true"
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(proj)}
        onMouseEnter={() => setHoveredId(proj.id)}
        onMouseLeave={() => setHoveredId(null)}
        className={`group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-opacity duration-300 ${
          isSibling ? "opacity-40" : "opacity-100"
        }`}
        aria-label={`Open case study for ${proj.title}`}
      >
        <div
          data-motion="frame"
          className={`relative w-full ${aspectClass} overflow-hidden rounded-none bg-neutral-100 border border-neutral-200/80`}
        >
          <img
            data-motion="media"
            src={proj.image}
            alt={proj.title}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[power2.out] group-hover:scale-[1.04]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Separator Hairline */}
        <div data-motion="line" className="w-full h-px bg-neutral-200 mt-2.5 origin-left" />

        {renderCardMeta(
          typeText || proj.type || "Branding",
          customLine || getProjectLines(proj, proj.title).line1
        )}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-cursor-tag="Projects"
      className="relative w-full bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 select-none"
    >
      <div className="w-full mx-auto max-w-[1440px]">
        
        {/* Title: Projects with lineReveal */}
        <div className="flex items-center gap-2 sm:gap-3 mb-10 sm:mb-14 md:mb-16">
          <h2
            ref={titleRef}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-[clamp(2.25rem,4vw,3.25rem)] font-bold tracking-[-0.035em] text-neutral-900 leading-none"
          >
            Projects
          </h2>
          <span className="inline-flex items-center text-neutral-900 transform translate-y-0.5" aria-hidden="true">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 stroke-current stroke-[2.2] fill-none"
              viewBox="0 0 24 24"
            >
              <path d="M19 5L5 19M5 19H17M5 19V7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* Staggered 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-14 lg:gap-16">
          {/* Left Column */}
          <div className="flex flex-col gap-10 sm:gap-12 md:gap-14">
            {renderProjectCard(p_claro, "aspect-[16/10.5]", "Branding / UI/UX", "CLARO — AI information intelligence platform.")}
            {renderProjectCard(p3, "aspect-[16/10.5]", "Visual Identity", "NOU — Brand identity & design system.")}
            {renderProjectCard(
              p_layer82 || {
                id: "layer-82-motion-design",
                title: "Design and Illustration",
                type: "Design & Illustration",
                year: "2026",
                description: "Design and illustration showcase. Visual craft and dynamic creative design.",
                image: "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
                tools: ["Illustrator", "Photoshop", "Cinema 4D"],
                link: "https://www.behance.net/sukunshsharma",
              },
              "aspect-[16/10.5]",
              "Design & Illustration",
              "Visual craft and dynamic creative direction."
            )}
            {renderProjectCard(p2, "aspect-[16/10.5]", "Motion & Identity", "Kinetic typography and layout motion.")}
            {renderProjectCard(p5, "aspect-[16/10.5]", "Cartography & UI", "Seismic data visualization and spatial mapping.")}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10 sm:gap-12 md:gap-14">
            {renderProjectCard(p1, "aspect-[16/10.5]", "Branding", "WOKO — Street noodle brand identity & packaging.")}
            {renderProjectCard(p4, "aspect-[4/4.2]", "Art Direction", "Monochrome print and editorial composition.")}
            {renderProjectCard(p6, "aspect-[16/10.5]", "Character Animation", "Narrative character styling and rigging.")}
            {renderProjectCard(p_mono, "aspect-[16/10.5]", "Identity", "Monogram emblems and bespoke logotypes.")}
          </div>
        </div>

        {/* See All Projects Button */}
        <div className="mt-16 sm:mt-20 md:mt-24 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (onOpenProjectsExplorer) {
                onOpenProjectsExplorer();
              } else {
                const url = profile?.behance || "https://www.behance.net/sukunshsharma";
                window.open(url, "_blank", "noopener,noreferrer");
              }
            }}
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-900 border-2 border-neutral-900 bg-white hover:bg-neutral-900 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer select-none rounded-none"
          >
            <span>See All Projects</span>
            <svg
              className="w-4 h-4 stroke-current stroke-[2.2] fill-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
