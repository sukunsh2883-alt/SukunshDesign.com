import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { DesignProject } from "../portfolioData";

interface DesignWorksProps {
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
  onOpenExplorer: () => void;
}

export default function DesignWorks({ projects, onSelectProject, onOpenExplorer }: DesignWorksProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewport, setViewport] = useState<"sm" | "md" | "lg">("lg");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewport("lg");
      } else if (window.innerWidth >= 768) {
        setViewport("md");
      } else {
        setViewport("sm");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedProjects = projects.slice(0, 6);

  // Dynamic grid column/row tracks with a custom spring ratio
  let gridTemplateColumns = "1fr";
  let gridTemplateRows = "1fr";

  if (viewport === "lg") {
    if (hoveredIndex === null) {
      gridTemplateColumns = "1fr 1fr 1fr";
      gridTemplateRows = "1fr 1fr";
    } else {
      const lgCol = hoveredIndex % 3;
      const lgRow = Math.floor(hoveredIndex / 3);
      gridTemplateColumns = [0, 1, 2].map(c => c === lgCol ? "1.5fr" : "0.75fr").join(" ");
      gridTemplateRows = [0, 1].map(r => r === lgRow ? "1.33fr" : "0.67fr").join(" ");
    }
  } else if (viewport === "md") {
    if (hoveredIndex === null) {
      gridTemplateColumns = "1fr 1fr";
      gridTemplateRows = "1fr 1fr 1fr";
    } else {
      const mdCol = hoveredIndex % 2;
      const mdRow = Math.floor(hoveredIndex / 2);
      gridTemplateColumns = [0, 1].map(c => c === mdCol ? "1.45fr" : "0.55fr").join(" ");
      gridTemplateRows = [0, 1, 2].map(r => r === mdRow ? "1.25fr" : "0.875fr").join(" ");
    }
  } else {
    if (hoveredIndex === null) {
      gridTemplateColumns = "1fr";
      gridTemplateRows = "repeat(6, 1fr)";
    } else {
      gridTemplateColumns = "1fr";
      gridTemplateRows = Array(6).fill(null).map((_, r) => r === hoveredIndex ? "1.5fr" : "0.9fr").join(" ");
    }
  }

  return (
    <section id="projects" className="py-16 md:py-24 bg-white relative">
      
      {/* Background Ambient Accents (Light Mode adapted) */}
      <div className="absolute top-1/4 right-[5%] w-[400px] h-[400px] rounded-full bg-[#FF6A00]/2 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-[400px] h-[400px] rounded-full bg-neutral-100 blur-[150px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#FF6A00] font-semibold block mb-3">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-sans font-black tracking-[0.18em] md:tracking-[0.24em] text-neutral-900 uppercase">
              PROJECTS
            </h2>
            <p className="mt-4 text-sm md:text-base text-neutral-600 leading-relaxed max-w-xl">
              A focused set of identity systems, publication layouts, AI visual campaigns, motion studies, and brand experiments.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenExplorer}
            className="inline-flex w-max items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-800 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95"
          >
            <span>Open Project Explorer</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Board Layout (Cinematic, equal-sized grids, zero spacing) */}
        <div className="w-full overflow-hidden select-none mx-auto max-w-[1881px] md:max-w-[1254px] lg:max-w-[1881px]">
          <div 
            className="grid gap-[1px] w-full"
            style={{
              gridTemplateColumns,
              gridTemplateRows,
              transition: "grid-template-columns 0.65s cubic-bezier(0.34, 1.85, 0.4, 0.95), grid-template-rows 0.65s cubic-bezier(0.34, 1.85, 0.4, 0.95)",
              aspectRatio: viewport === "lg" ? "1881 / 824" : viewport === "md" ? "1254 / 1236" : "auto"
            }}
          >
            {displayedProjects.map((project, index) => {
              const itemIsHovered = hoveredIndex === index;
              return (
                <a
                  href={project.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={project.id}
                  className="group relative bg-[#0a0a0a] rounded-xl overflow-hidden cursor-pointer w-full h-full transition-all duration-300 block"
                  style={{
                    aspectRatio: viewport === "sm" ? "627 / 412" : "auto",
                    zIndex: itemIsHovered ? 10 : 1
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectProject(project);
                  }}
                >
                  
                  {/* Halftone Retro Pattern Overlay */}
                  <div className="absolute inset-0 halftone-overlay opacity-[0.03] mix-blend-overlay pointer-events-none z-[1]" />

                  {/* Cover Image */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Dark overlay that transitions to be slightly stronger on hover */}
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/55 transition-colors duration-300" />
                  </div>

                  {/* Bottom Title Card (Fades in exclusively on hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-24 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 select-none">
                    <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#FF6A00] font-extrabold mb-2.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
                      View on Behance
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif italic text-white tracking-wide flex items-center justify-between gap-4">
                      <span>{project.title}</span>
                      <div className="p-2 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] group-hover:bg-[#FF6A00] group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </h3>
                  </div>

                </a>
              );
            })}
          </div>
        </div>

        {/* Full archive option */}
        {projects.length > 6 && (
          <div className="flex justify-center mt-12 relative z-10">
            <button
              type="button"
              onClick={onOpenExplorer}
              className="group flex items-center gap-2.5 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 active:scale-95 text-neutral-800 px-7 py-3 text-xs uppercase tracking-widest font-mono font-bold transition-all duration-300 cursor-pointer shadow-xs hover:text-black"
            >
              <span>Browse Full Project Archive</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF6A00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
