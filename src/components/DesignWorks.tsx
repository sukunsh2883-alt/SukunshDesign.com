import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject } from "../portfolioData";

interface DesignWorksProps {
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
  onOpenExplorer: () => void;
}

export default function DesignWorks({ projects, onSelectProject, onOpenExplorer }: DesignWorksProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const displayedProjects = projects.slice(0, 6);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.from(".work-heading", {
        y: 32,
        opacity: 0,
        filter: "blur(12px)",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
        },
      });

      if (!reduceMotion) {
        gsap.fromTo(
          ".project-grid",
          { scale: 1.08, y: 90 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              end: "bottom 58%",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.from(".project-card", {
          x: (index) => (index % 3 === 0 ? -120 : index % 3 === 2 ? 120 : 0),
          y: (index) => (index % 3 === 1 ? 110 : 70),
          opacity: 0,
          scale: 0.96,
          filter: "blur(12px)",
          stagger: 0.08,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".project-grid",
            start: "top 82%",
            invalidateOnRefresh: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="bg-[#191816] px-6 py-20 text-[#f3ead7] md:px-8 md:py-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="work-heading mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-medium tracking-normal text-[#b8ad9b]">Selected work</p>
            <h2 className="font-serif text-5xl font-normal leading-[0.95] tracking-normal md:text-8xl">
              Selected Project
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenExplorer}
            className="rounded-full border border-[#f3ead7]/16 bg-[#f3ead7]/8 px-5 py-3 text-xs font-medium tracking-normal text-[#f3ead7] transition-colors hover:bg-[#f3ead7]/14"
          >
            See all projects
          </button>
        </div>

        <div className="project-grid grid gap-5 md:grid-cols-3 md:gap-6">
          {displayedProjects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project)}
              className={`project-card group text-left ${index % 3 === 1 ? "md:translate-y-14" : ""}`}
            >
              <div className="relative aspect-[0.82] w-full overflow-hidden rounded-[22px] border border-[#f3ead7]/16 bg-[#25231f]">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#191816]/88 via-[#191816]/20 to-transparent p-5">
                  <span className="inline-flex rounded-full border border-[#f3ead7]/16 bg-[#f3ead7]/9 px-3 py-1 text-[10px] font-medium tracking-normal text-[#f3ead7] backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.04]">
                    {project.type}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-medium leading-[1.05] tracking-normal text-[#f3ead7] md:text-2xl">
                  {project.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
