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
  const displayedProjects = projects.slice(0, 3);
  const [firstProject, secondProject, featureProject] = displayedProjects;
  const renderMeta = (project: DesignProject) => `${project.title} / ${project.type}`;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
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
      gsap.from(".work-card-left", {
        x: -90,
        opacity: 0,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 72%" },
      });
      gsap.from(".work-card-right", {
        x: 90,
        opacity: 0,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 72%" },
      });
      gsap.from(".work-card-feature", {
        y: 76,
        opacity: 0,
        scale: 0.985,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".work-card-feature", start: "top 88%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="bg-[#f4f1e8] px-6 py-16 text-[#11110f] md:px-8 md:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="work-heading mb-8 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-medium tracking-[-0.018em] md:text-5xl">
              Selected Project
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenExplorer}
            className="pt-3 text-xs font-medium tracking-normal text-[#11110f]/62 transition-colors hover:text-[#11110f]"
          >
            See all projects
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {firstProject && (
            <button
              type="button"
              onClick={() => onSelectProject(firstProject)}
              className="work-card-left group text-left"
            >
              <div className="relative aspect-[1.35] w-full overflow-hidden bg-neutral-100">
                <img
                  src={firstProject.image}
                  alt={firstProject.title}
                  className="h-full w-full object-cover object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 text-[#11110f]">
                <h3 className="text-lg font-medium leading-none tracking-[-0.018em] md:text-2xl">
                  {firstProject.title}
                </h3>
                <p className="text-[10px] font-medium text-[#11110f]/55 md:text-xs">
                  {firstProject.type}
                </p>
              </div>
            </button>
          )}

          {secondProject && (
            <button
              type="button"
              onClick={() => onSelectProject(secondProject)}
              className="work-card-right group text-left"
            >
              <div className="relative aspect-[1.35] w-full overflow-hidden bg-neutral-100">
                <img
                  src={secondProject.image}
                  alt={secondProject.title}
                  className="h-full w-full object-cover object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3 text-[#11110f]">
                <h3 className="text-lg font-medium leading-none tracking-[-0.018em] md:text-2xl">
                  {secondProject.title}
                </h3>
                <p className="text-[10px] font-medium text-[#11110f]/55 md:text-xs">
                  {secondProject.type}
                </p>
              </div>
            </button>
          )}

          {featureProject && (
            <button
              type="button"
              onClick={() => onSelectProject(featureProject)}
              className="work-card-feature group relative min-h-[300px] overflow-hidden bg-[#e6e1d6] text-left md:col-span-2 md:min-h-[430px]"
            >
              <img
                src={featureProject.image}
                alt={featureProject.title}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f4f1e8]/82 via-[#f4f1e8]/16 to-transparent" />
              <div className="relative flex h-full min-h-[300px] flex-col justify-end p-6 md:min-h-[430px] md:p-8">
                <h3 className="max-w-2xl text-4xl font-medium leading-[0.98] tracking-[-0.018em] text-[#11110f] md:text-7xl">
                  {featureProject.title}
                </h3>
                <p className="mt-4 text-[10px] font-medium text-[#11110f]/60 md:text-xs">
                  {renderMeta(featureProject)}
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
