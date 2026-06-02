import { ArrowRight, ArrowUpRight, Film, GraduationCap, MapPin, Sparkles } from "lucide-react";
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
  const story = [
    "I'm a Delhi-based visual artist, rooted in Bihar's rich cultural heritage, with a background in Fine Art and Design. My work lives between art, design, and cinema creating visuals that feel emotional, bold, and story driven.",
    "I'm deeply passionate about filmmaking, especially art films, where mood, culture, and human emotions become the language of storytelling. Through every project, I aim to create visuals that don't just look good, but leave a feeling behind.",
  ];

  return (
    <section id="about-me" className="relative overflow-hidden bg-[#f7f8f6] px-4 py-20 text-neutral-900 sm:px-6 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-28 hidden lg:block"
          >
            <div className="overflow-hidden rounded-[38px] border border-white bg-white p-3 shadow-[0_24px_90px_rgba(15,15,15,0.08)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-neutral-950">
                <img
                  src={aboutImg}
                  alt={profile.fullName}
                  className="h-full w-full object-cover grayscale transition-transform duration-700 hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/72 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/15 bg-black/35 p-4 text-white backdrop-blur-xl">
                  <p className="text-[11px] font-medium text-white/55">visual artist / UX UI designer</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">{profile.fullName}</h3>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-[12px] font-medium text-neutral-500">
              <Sparkles className="h-3.5 w-3.5 text-[#FF6A00]" />
              about the designer
            </div>

            <h2 className="max-w-4xl text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-6xl lg:text-7xl">
              emotional, bold, story-driven visuals.
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { icon: MapPin, title: "Delhi", body: "based visual artist" },
                { icon: GraduationCap, title: "Fine Art", body: "and design background" },
                { icon: Film, title: "Cinema", body: "mood-led storytelling" },
              ].map((item) => (
                <div key={item.title} className="rounded-[28px] border border-white bg-white/[0.78] p-5 shadow-[0_18px_55px_rgba(15,15,15,0.05)]">
                  <item.icon className="h-5 w-5 text-[#FF6A00]" />
                  <p className="mt-5 text-xl font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[34px] border border-white bg-white/[0.78] p-6 shadow-[0_22px_80px_rgba(15,15,15,0.06)] md:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-5 text-base leading-8 text-neutral-600">
                  {story.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-[12px] font-semibold tracking-[0.22em] text-neutral-400">
                    focus areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["UX/UI design", "AI films", "motion design", "brand visuals", "storyboards", "product ads"].map((item) => (
                      <span key={item} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-[12px] font-medium text-neutral-600">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row">
                <button
                  onClick={onOpenProjects}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#FF6A00]"
                >
                  <span>explore work</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onOpenResume}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 transition-all hover:border-neutral-950 hover:text-neutral-950"
                >
                  <span>full resume</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onOpenAIWork}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-6 py-3.5 text-sm font-semibold text-[#C44D00] transition-all hover:bg-[#FF6A00] hover:text-white"
                >
                  <span>AI archive</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-neutral-500">
              <a href={profile.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full px-1 py-2 hover:text-neutral-950">
                LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a href={profile.behance || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full px-1 py-2 hover:text-neutral-950">
                Behance <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 rounded-full px-1 py-2 hover:text-neutral-950">
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
