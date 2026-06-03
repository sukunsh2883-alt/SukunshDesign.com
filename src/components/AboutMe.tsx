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
  return (
    <section id="about-me" className="bg-[#050505] px-6 py-16 text-white md:px-8 md:py-24">
      <div className="mx-auto max-w-[1520px] border-t border-white/15 pt-12">
        <div className="grid gap-8 md:grid-cols-[0.45fr_0.55fr]">
          <div>
            <p className="mb-2 text-xs text-white/55">About:</p>
            <h2 className="max-w-sm text-2xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-4xl">
              emotional, bold, story driven visuals.
            </h2>
            <div className="mt-8 flex gap-6 text-sm">
              <a href={profile.behance} target="_blank" rel="noreferrer" className="hover:text-[#f25a00]">Behance</a>
              <button onClick={onOpenResume} className="hover:text-[#f25a00]">Resume</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-xs leading-relaxed text-white/55 md:text-sm">
            <p>
              I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
            </p>
            <p>
              My work lives between art, design, and cinema creating visuals that feel emotional, bold, and story driven.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
