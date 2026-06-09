interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  return (
    <footer id="contact" className="relative bg-[#8b7cf2] px-6 pb-14 pt-24 text-[#160b34] md:px-12 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-20 grid gap-10 md:grid-cols-[1.4fr_0.45fr_0.45fr]">
          <h2 className="max-w-4xl text-4xl font-medium leading-none tracking-[-0.012em] md:text-6xl">
            Work together
          </h2>
          <div className="space-y-1 text-sm uppercase md:text-base">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-[#f25a00]">Instagram</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-[#f25a00]">LinkedIn</a>
            <a href={profile.behance} target="_blank" rel="noreferrer" className="block hover:text-[#f25a00]">Behance</a>
            <a href={`mailto:${profile.email}`} className="block hover:text-[#f25a00]">Email</a>
          </div>
          <p className="text-sm uppercase md:text-base">Delhi, India</p>
        </div>

        <div className="flex items-center justify-between border-t border-[#160b34]/35 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wide">
            2026 © Sukunsh. All rights reserved
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-[#f25a00] px-7 py-4 text-xs font-semibold uppercase text-[#fff4e7] transition-colors hover:bg-[#160b34]"
          >
            Let&apos;s Connect
          </a>
        </div>
      </div>
    </footer>
  );
}
