import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface AboutMeProps {
  profile: {
    fullName: string;
    brandName: string;
    roles: string[];
    bio: string;
    email: string;
    linkedin: string;
    behance: string;
    aboutImage?: string;
  };
  onOpenResume: () => void;
  onOpenAIWork: () => void;
  onOpenProjects: () => void;
}

export default function AboutMe({ profile, onOpenResume, onOpenAIWork, onOpenProjects }: AboutMeProps) {
  const aboutImg = profile.aboutImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";

  return (
    <section id="about-me" className="bg-[#fbfbf8] px-4 py-20 text-neutral-950 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-neutral-200 pb-14 lg:grid-cols-[0.86fr_1.14fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42 }}
          className="overflow-hidden border border-neutral-250 bg-neutral-100"
        >
          <img
            src={aboutImg}
            alt={profile.fullName}
            className="h-full min-h-[460px] w-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div>
          <p className="mb-3 text-sm font-medium text-[#FF6A00]">about</p>
          <h2 className="max-w-3xl text-[42px] font-medium leading-none tracking-[-0.04em] md:text-7xl">
            emotional, bold, story-driven visuals.
          </h2>

          <div className="mt-10 grid gap-7 border-y border-neutral-200 py-8 md:grid-cols-2">
            <p className="text-base leading-8 text-neutral-600">
              I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
            </p>
            <p className="text-base leading-8 text-neutral-600">
              My work lives between art, design, and cinema creating visuals that feel emotional, bold, and story driven.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["UX/UI", "AI films", "motion", "brand visuals", "storyboards"].map((item) => (
              <span key={item} className="border border-neutral-250 px-3 py-2 text-sm text-neutral-600">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={onOpenProjects} className="inline-flex items-center gap-2 border border-neutral-950 bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-[#FF6A00] hover:border-[#FF6A00]">
              work <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onOpenResume} className="inline-flex items-center gap-2 border border-neutral-250 px-5 py-3 text-sm font-medium text-neutral-800 hover:border-neutral-950">
              resume <ArrowUpRight className="h-4 w-4" />
            </button>
            <button onClick={onOpenAIWork} className="inline-flex items-center gap-2 border border-neutral-250 px-5 py-3 text-sm font-medium text-neutral-800 hover:border-neutral-950">
              AI archive <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
