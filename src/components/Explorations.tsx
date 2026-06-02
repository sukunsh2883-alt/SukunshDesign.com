import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { ExplorationItem } from "../portfolioData";

interface ExplorationsProps {
  onSelectImage: (item: { imageUrl: string; title: string }) => void;
  explorations: ExplorationItem[];
}

export default function Explorations({ onSelectImage, explorations }: ExplorationsProps) {
  return (
    <section id="explorations" className="bg-[#fbfbf8] px-4 py-20 text-neutral-950 md:px-6">
      <div className="mx-auto max-w-7xl border-b border-neutral-200 pb-14">
        <div className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-3 text-sm font-medium text-[#FF6A00]">experiments</p>
            <h2 className="text-[42px] font-medium leading-none tracking-[-0.04em] md:text-7xl">
              studies
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-neutral-600 md:ml-auto">
            Prompt, mood, image, and cinematic direction.
          </p>
        </div>

        <div className="grid border-l border-t border-neutral-200 md:grid-cols-3">
          {explorations.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.18) }}
              onClick={() => onSelectImage({ imageUrl: item.imageUrl, title: item.title })}
              className="group border-b border-r border-neutral-200 bg-[#fbfbf8] text-left"
            >
              <div className="aspect-[1.15] overflow-hidden bg-neutral-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-neutral-500">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">{item.title}</h3>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#FF6A00]" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
