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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".work-reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="bg-[#050505] px-6 py-16 text-[#f7ecd8] md:px-8 md:py-24">
      <div className="mx-auto max-w-[1520px]">
        <div className="work-reveal mb-8 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.055em] md:text-5xl">
              Selected Project
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenExplorer}
            className="pt-3 text-xs font-medium tracking-[-0.02em] text-[#f7ecd8]/70 transition-colors hover:text-[#f7ecd8]"
          >
            See all projects
          </button>
        </div>

        <div className="work-reveal grid gap-1 md:grid-cols-2">
          {firstProject && (
            <button
              type="button"
              onClick={() => onSelectProject(firstProject)}
              className="group flex min-h-[150px] flex-col justify-between bg-[#ffc84a] p-6 text-left text-black transition-transform duration-500 hover:scale-[1.01] md:min-h-[190px] md:p-8"
            >
              <h3 className="max-w-sm text-3xl font-semibold leading-[1.08] tracking-[-0.055em] md:text-5xl">
                {firstProject.title}
              </h3>
              <p className="mt-8 text-[10px] font-medium text-black/75 md:text-xs">
                {firstProject.title} / {firstProject.type}
              </p>
            </button>
          )}

          {secondProject && (
            <button
              type="button"
              onClick={() => onSelectProject(secondProject)}
              className="group flex min-h-[150px] flex-col justify-between bg-[#f25a00] p-6 text-left text-black transition-transform duration-500 hover:scale-[1.01] md:min-h-[190px] md:p-8"
            >
              <h3 className="max-w-sm text-3xl font-semibold leading-[1.08] tracking-[-0.055em] md:text-5xl">
                {secondProject.title}
              </h3>
              <p className="mt-8 text-[10px] font-medium text-black/75 md:text-xs">
                {secondProject.title} / {secondProject.type}
              </p>
            </button>
          )}

          {featureProject && (
            <button
              type="button"
              onClick={() => onSelectProject(featureProject)}
              className="group flex min-h-[250px] flex-col justify-between bg-[#89a65a] p-6 text-left text-black transition-transform duration-500 hover:scale-[1.005] md:col-span-2 md:min-h-[420px] md:p-8"
            >
              <div className="flex flex-1 items-center justify-center">
                <h3 className="text-center text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                  Portfolio 2026
                </h3>
              </div>
              <p className="text-[10px] font-medium text-black/75 md:text-xs">
                {featureProject.title} / {featureProject.type}
              </p>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
