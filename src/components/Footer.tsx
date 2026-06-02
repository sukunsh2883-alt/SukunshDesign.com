interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  return (
    <footer id="contact" className="bg-[#080808] px-3 pb-3 text-white md:px-4 md:pb-6">
      <div className="mx-auto max-w-5xl bg-[#f25a00] px-4 py-5 md:px-8 md:py-10">
        <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[8px] text-white/85 md:text-xs">contact</p>
            <h2 className="max-w-[230px] text-[15px] font-semibold leading-[1.05] tracking-[-0.03em] md:max-w-lg md:text-4xl">
              available for visual design work.
            </h2>
          </div>

          <div className="grid grid-cols-[0.5fr_0.5fr] border-l border-white/45 pl-4 text-[8px] md:pl-8 md:text-xs">
            <div>
              <h3 className="text-[14px] font-semibold tracking-[-0.03em] md:text-3xl">Sukunsh.</h3>
              <a href={`mailto:${profile.email}`} className="mt-1 block text-white/80 hover:text-white">
                {profile.email}
              </a>
            </div>
            <div className="space-y-1 text-white/85">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-white">LinkedIn</a>
              <a href={profile.behance} target="_blank" rel="noreferrer" className="block hover:text-white">Behance</a>
              <a href={`mailto:${profile.email}`} className="block hover:text-white">Email</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
