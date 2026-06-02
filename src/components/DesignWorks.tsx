import { DesignProject } from "../portfolioData";

interface DesignWorksProps {
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
  onOpenExplorer: () => void;
}

export default function DesignWorks({ projects, onSelectProject, onOpenExplorer }: DesignWorksProps) {
  const actionProject = projects.find((project) => project.title.toLowerCase().includes("action")) || projects[0];
  const typographyProject =
    projects.find((project) => project.title.toLowerCase().includes("typographic")) ||
    projects.find((project) => project.type.toLowerCase().includes("typography")) ||
    projects[1];

  return (
    <section id="projects" className="bg-[#080808] px-3 py-5 text-white md:px-4 md:py-12">
      <div className="mx-auto max-w-5xl border-b border-white/10 pb-8 md:pb-14">
        <div className="mb-5 flex items-center justify-between px-4 md:px-8">
          <h2 className="text-[22px] font-semibold tracking-[-0.04em] md:text-5xl">
            Selected Projet
          </h2>
          <button
            type="button"
            onClick={onOpenExplorer}
            className="text-[9px] font-medium text-white/70 hover:text-white md:text-xs"
          >
            See More
          </button>
        </div>

        <div className="mx-4 grid border border-black md:mx-8 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelectProject(actionProject)}
            className="min-h-[74px] bg-[#ffc94b] p-4 text-left text-white transition-opacity hover:opacity-90 md:min-h-[190px] md:p-8"
          >
            <h3 className="max-w-[210px] text-[20px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
              Action Photography
            </h3>
            <p className="mt-3 text-[7px] text-white/80 md:text-xs">Action Photography / Fine Art</p>
          </button>

          <button
            type="button"
            onClick={() => onSelectProject(typographyProject)}
            className="min-h-[74px] border-t border-black bg-[#f25a00] p-4 text-left text-white transition-opacity hover:opacity-90 md:min-h-[190px] md:border-l md:border-t-0 md:p-8"
          >
            <h3 className="max-w-[260px] text-[20px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-5xl">
              Typography Picture Book
            </h3>
            <p className="mt-3 text-[7px] text-white/80 md:text-xs">Book / Typography</p>
          </button>

          <button
            type="button"
            onClick={onOpenExplorer}
            className="col-span-full flex min-h-[150px] flex-col items-center justify-center bg-[#91aa5b] p-6 text-white transition-opacity hover:opacity-90 md:min-h-[360px]"
          >
            <span className="text-[30px] font-semibold leading-none tracking-[-0.045em] md:text-7xl">
              Portfolio 2026
            </span>
            <span className="mt-4 h-px w-16 bg-white/70 md:w-28" />
            <span className="mt-10 self-start text-[7px] text-white/80 md:ml-2 md:text-xs">
              Action Photography / Fine Art
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
