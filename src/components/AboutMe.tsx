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
  const aboutImg = profile.aboutImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";

  return (
    <section id="about-me" className="bg-[#080808] px-3 py-5 text-white md:px-4 md:py-12">
      <div className="mx-auto max-w-5xl border-b border-white/10 pb-8 md:pb-14">
        <div className="mx-4 grid items-start gap-5 md:mx-8 md:grid-cols-[0.45fr_0.55fr] md:gap-10">
          <div className="h-[125px] w-[82px] bg-[#d9d9d9] md:h-[300px] md:w-[220px]">
            <img
              src={aboutImg}
              alt={profile.fullName}
              className="h-full w-full object-cover grayscale opacity-0"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="mb-1 text-[8px] font-medium text-white/55 md:text-xs">About:</p>
              <h2 className="max-w-[220px] text-[16px] font-semibold leading-[1.05] tracking-[-0.035em] md:max-w-md md:text-4xl">
                emotional, bold, story driven visuals.
              </h2>
              <div className="mt-5 flex gap-5 text-[9px] font-medium md:text-sm">
                <a href={profile.behance || "#"} target="_blank" rel="noreferrer" className="hover:text-[#FF6A00]">
                  Behance
                </a>
                <button onClick={onOpenResume} className="hover:text-[#FF6A00]">
                  Resume
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[7px] leading-relaxed text-white/55 md:text-xs">
              <p>
                I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design.
              </p>
              <p>
                My work lives between art, design, and cinema creating visuals that feel emotional, bold, and story driven.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
