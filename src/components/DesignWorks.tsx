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
  const displayedProjects = projects.slice(0, 9);
  const columns = [
    displayedProjects.filter((_, index) => index % 3 === 1),
    displayedProjects.filter((_, index) => index % 3 === 0),
    displayedProjects.filter((_, index) => index % 3 === 2),
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768;
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const grid = section.querySelector<HTMLElement>(".projects-grid");
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      const leftCards = gsap.utils.toArray<HTMLElement>(".project-column-left .project-card");
      const centerCards = gsap.utils.toArray<HTMLElement>(".project-column-center .project-card");
      const rightCards = gsap.utils.toArray<HTMLElement>(".project-column-right .project-card");

      gsap.set(".projects-header", { opacity: 1, y: 0 });
      gsap.set(".see-all-projects", { opacity: 1, y: 0, pointerEvents: "auto" });

      if (reduceMotion || !grid) {
        gsap.set(".projects-header", { opacity: 1, y: 0 });
        gsap.set(grid, { opacity: 1, scale: 1, xPercent: 0, yPercent: 0 });
        gsap.set(cards, { opacity: 1, scale: 1, xPercent: 0, yPercent: 0, clearProps: "zIndex" });
        gsap.set(".see-all-projects", { opacity: 1, y: 0, pointerEvents: "auto" });
        return;
      }

      gsap.set(grid, {
        scale: isMobile || isTouch ? 1.4 : 3,
        transformOrigin: "center top",
      });

      gsap.set(cards, {
        opacity: isMobile || isTouch ? 0 : 1,
        scale: 1,
        zIndex: (index) => cards.length - index,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: isMobile || isTouch ? "top 82%" : "top center",
          end: isMobile || isTouch ? "bottom 78%" : "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: "power1.inOut",
        },
      });

      tl.add("start")
        .to(grid, {
          scale: 1,
          transformOrigin: "center top",
          ease: "power1.inOut",
        }, "start")
        .fromTo(leftCards, {
          xPercent: (index) => isMobile || isTouch ? -14 : -((index + 1) * 40 + index * 80),
          yPercent: (index) => isMobile || isTouch ? 22 : (index + 1) * 35 + index * 80,
        }, {
          xPercent: 0,
          yPercent: 0,
          duration: 0.8,
        }, "start")
        .fromTo(rightCards, {
          xPercent: (index) => isMobile || isTouch ? 14 : (index + 1) * 40 + index * 80,
          yPercent: (index) => isMobile || isTouch ? 22 : (index + 1) * 35 + index * 80,
        }, {
          xPercent: 0,
          yPercent: 0,
          duration: 0.8,
        }, "start")
        .fromTo(centerCards, {
          yPercent: isMobile || isTouch ? 34 : 80,
          opacity: 0.6,
        }, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
        }, "start")
        .to(cards, {
          zIndex: 1,
          duration: 0.01,
        }, 0.72);

      const refresh = () => ScrollTrigger.refresh();
      const images = Array.from(section.querySelectorAll("img")) as HTMLImageElement[];
      images.forEach((image) => {
        if (image.complete) return;
        image.addEventListener("load", refresh, { once: true });
        image.addEventListener("error", refresh, { once: true });
        cleanupFns.push(
          () => image.removeEventListener("load", refresh),
          () => image.removeEventListener("error", refresh),
        );
      });

      const refreshTimer = window.setTimeout(refresh, 320);
      cleanupFns.push(() => window.clearTimeout(refreshTimer));
    }, section);

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="projects-pin">
        <div className="projects-header">
          <div>
            <p className="section-kicker">Selected Work</p>
            <h2>Projects</h2>
          </div>
          <button
            type="button"
            onClick={onOpenExplorer}
            className="see-all-projects"
          >
            See All Projects
          </button>
        </div>

        <div className="projects-grid">
          {columns.map((columnProjects, columnIndex) => (
            <div
              key={columnIndex}
              className={`project-column ${
                columnIndex === 0
                  ? "project-column-left"
                  : columnIndex === 1
                    ? "project-column-center"
                    : "project-column-right"
              }`}
            >
              {columnProjects.map((project, index) => {
                const originalIndex = displayedProjects.findIndex((item) => item.id === project.id);
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className={`project-card ${originalIndex === 0 ? "project-card--featured" : ""}`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      loading={originalIndex > 2 ? "lazy" : "eager"}
                      referrerPolicy="no-referrer"
                    />
                    <div className="project-card__overlay">
                      <h3>{project.title}</h3>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
