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

export default function AboutMe({ profile, onOpenResume }: AboutMeProps) {
  const portrait =
    profile.aboutImage ||
    "https://res.cloudinary.com/dylv5m3jk/image/upload/v1780485999/Screenshot_2026-06-03_165617_seilm1.png";

  return (
    <section id="about-me" className="bg-[#050505] px-6 py-14 text-white md:px-8 md:py-20">
      <div className="mx-auto max-w-[1520px] border-t border-white/15 pt-12">
        <div className="grid gap-10 md:grid-cols-[280px_1fr] md:items-end lg:grid-cols-[320px_1fr]">
          <figure className="relative aspect-[0.8] w-full max-w-[260px] overflow-hidden bg-white/5 md:max-w-[320px]">
            <img
              src={portrait}
              alt={profile.fullName}
              className="h-full w-full object-cover grayscale contrast-110"
              referrerPolicy="no-referrer"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 px-5 py-4 text-[10px] font-semibold tracking-[-0.02em] text-white">
              <span>Portrait // Act.01</span>
              <span>{profile.brandName}</span>
            </figcaption>
          </figure>

          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="mb-3 text-xs text-white/45">About</p>
              <h2 className="max-w-md text-3xl font-semibold leading-[0.98] tracking-[-0.05em] text-white md:text-5xl">
                Emotional, bold, story-driven visuals.
              </h2>
              <div className="mt-8 flex gap-7 text-sm text-white/75">
                <a href={profile.behance} target="_blank" rel="noreferrer" className="hover:text-[#f25a00]">Behance</a>
                <button onClick={onOpenResume} className="hover:text-[#f25a00]">Resume</button>
              </div>
            </div>

            <div className="max-w-xl space-y-5 text-sm leading-relaxed tracking-[-0.02em] text-white/62 md:text-base">
              <p>
                I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
              </p>
              <p>
                My work lives between art, design, and cinema, creating visuals that feel emotional, bold, and story driven.
              </p>
              <p>
                I&apos;m deeply passionate about filmmaking, especially art films, where mood, culture, and human emotions become the language of storytelling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
