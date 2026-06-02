import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { DesignProject } from "../portfolioData";

interface DesignWorksProps {
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
  onOpenExplorer: () => void;
}

export default function DesignWorks({ projects, onSelectProject, onOpenExplorer }: DesignWorksProps) {
  const displayedProjects = projects.slice(0, 6);

  return (
    <section id="projects" className="bg-[#fbfbf8] px-4 py-20 text-neutral-950 md:px-6">
      <div className="mx-auto max-w-7xl border-b border-neutral-200 pb-14">
        <div className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-3 text-sm font-medium text-[#FF6A00]">selected work</p>
            <h2 className="text-[42px] font-medium leading-none tracking-[-0.04em] md:text-7xl">
              projects
            </h2>
          </div>
          <div className="max-w-xl md:ml-auto">
            <p className="text-base leading-7 text-neutral-600">
              UX/UI, brand systems, print, motion, and AI visual design.
            </p>
            <button
              type="button"
              onClick={onOpenExplorer}
              className="mt-5 inline-flex items-center gap-2 border border-neutral-950 px-5 py-3 text-sm font-medium transition-colors hover:bg-neutral-950 hover:text-white"
            >
              archive <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid border-l border-t border-neutral-200 md:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.42, delay: Math.min(index * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
              className="group border-b border-r border-neutral-200 bg-[#fbfbf8]"
            >
              <button type="button" onClick={() => onSelectProject(project)} className="block h-full w-full text-left">
                <div className="aspect-[1.28] overflow-hidden bg-neutral-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <div className="mb-8 flex items-center justify-between text-sm text-neutral-500">
                    <span>{project.year}</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-2xl font-medium tracking-[-0.03em] text-neutral-950">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">{project.type}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
                    <span className="text-sm text-neutral-500">{project.tools.slice(0, 2).join(" / ")}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#FF6A00]" />
                  </div>
                </div>
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
