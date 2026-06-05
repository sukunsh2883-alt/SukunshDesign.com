import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesignProject } from "../portfolioData";

interface DesignWorksProps {
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
  onOpenExplorer: () => void;
}

export default function DesignWorks({ projects, onSelectProject }: DesignWorksProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const displayedProjects = projects.slice(0, 4);

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
    <section ref={sectionRef} id="projects" className="bg-[#fbfbf2] px-6 py-16 text-[#18005a] md:px-8 md:py-24">
      <div className="mx-auto max-w-[1520px]">
        <div className="work-reveal mb-14">
          <h2 className="text-3xl font-semibold uppercase tracking-[-0.04em] md:text-5xl">
            Selected Work
          </h2>
          <p className="mt-2 text-base text-neutral-500 md:text-xl">
            Across Brand Design, Packaging Design & Visual Systems
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {displayedProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project)}
              className="work-reveal group text-left"
            >
              <div className="aspect-[1.42] overflow-hidden bg-neutral-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-neutral-900">
                <h3 className="text-lg font-medium tracking-[-0.03em] md:text-2xl">{project.title}</h3>
                <div className="flex shrink-0 gap-2">
                  <span className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700">{project.year}</span>
                  <span className="hidden rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 md:block">{project.type}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
