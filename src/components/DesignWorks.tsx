import { ArrowRight, ArrowUpRight, Layers, MousePointer2 } from "lucide-react";
import { motion } from "motion/react";
import { DesignProject } from "../portfolioData";

interface DesignWorksProps {
  projects: DesignProject[];
  onSelectProject: (proj: DesignProject) => void;
  onOpenExplorer: () => void;
}

const cardLayouts = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
];

export default function DesignWorks({ projects, onSelectProject, onOpenExplorer }: DesignWorksProps) {
  const displayedProjects = projects.slice(0, 6);

  return (
    <section id="projects" className="relative overflow-hidden bg-[#f7f8f6] px-4 py-20 text-neutral-900 sm:px-6 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="absolute right-[-12rem] top-20 h-[34rem] w-[34rem] rounded-full bg-[#FF6A00]/10 blur-3xl" />
      <div className="absolute bottom-10 left-[-12rem] h-[34rem] w-[34rem] rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-[12px] font-medium text-neutral-500">
              <Layers className="h-3.5 w-3.5 text-[#FF6A00]" />
              selected UX/UI and visual work
            </div>
            <h2 className="max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-6xl lg:text-7xl">
              case studies with visual craft.
            </h2>
          </div>

          <div className="max-w-2xl lg:ml-auto">
            <p className="text-base leading-8 text-neutral-600">
              A focused set of identity systems, publication layouts, infographics, AI visuals, motion studies, and product-style creative systems. Each project is presented like a hiring portfolio: context, role, tools, and visual outcome.
            </p>
            <button
              type="button"
              onClick={onOpenExplorer}
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#FF6A00] active:translate-y-0"
            >
              <span>open project archive</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {displayedProjects.map((project, index) => {
            const isFeature = index === 0;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
                className={`${cardLayouts[index] || "lg:col-span-4"} group overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_20px_70px_rgba(15,15,15,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_100px_rgba(15,15,15,0.1)]`}
              >
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="block h-full w-full cursor-pointer text-left"
                >
                  <div className={`relative overflow-hidden bg-neutral-950 ${isFeature ? "aspect-[1.55]" : "aspect-[1.25]"}`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.04]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-80" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-neutral-900">
                        {project.year}
                      </span>
                      <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                        {project.type}
                      </span>
                    </div>
                    <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-950 transition-transform duration-300 group-hover:rotate-12">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="space-y-5 p-5 md:p-6">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-900 md:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tools.slice(0, 3).map((tool) => (
                        <span key={tool} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] font-medium text-neutral-500">
                          {tool}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-sm">
                      <span className="inline-flex items-center gap-2 font-medium text-neutral-500">
                        <MousePointer2 className="h-3.5 w-3.5 text-[#FF6A00]" />
                        view project
                      </span>
                      <span className="font-medium text-neutral-350">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </div>

        {projects.length > 6 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={onOpenExplorer}
              className="group inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 transition-all hover:border-neutral-950 hover:text-neutral-950"
            >
              <span>browse all {projects.length} projects</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
