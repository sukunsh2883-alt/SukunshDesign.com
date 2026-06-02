import { ArrowUpRight, Compass, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ExplorationItem } from "../portfolioData";

interface ExplorationsProps {
  onSelectImage: (item: { imageUrl: string; title: string }) => void;
  explorations: ExplorationItem[];
}

export default function Explorations({ onSelectImage, explorations }: ExplorationsProps) {
  return (
    <section id="explorations" className="relative overflow-hidden bg-white px-4 py-20 text-neutral-900 sm:px-6 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-neutral-500">
              <Compass className="h-3.5 w-3.5 text-[#FF6A00]" />
              visual experiments
            </div>
            <h2 className="max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-6xl lg:text-7xl">
              moodboards, prompts, and art direction.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-neutral-600 lg:ml-auto">
            Experimental image studies used to explore atmosphere, cinematic mood, AI prompts, visual texture, and future art direction.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {explorations.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.28), ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectImage({ imageUrl: item.imageUrl, title: item.title })}
              className="group overflow-hidden rounded-[32px] border border-neutral-100 bg-[#f7f8f6] text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,15,15,0.09)]"
            >
              <div className="relative aspect-[1.18] overflow-hidden bg-neutral-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-neutral-950">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF6A00]" />
                  study {String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-950 transition-transform group-hover:rotate-12">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">Prompt-led visual research and cinematic composition study.</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
