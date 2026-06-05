interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  return (
    <footer id="contact" className="relative bg-[#f25a00] px-6 pb-14 pt-24 text-[#ffffff] md:px-12 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-20 grid gap-10 md:grid-cols-[1.4fr_0.45fr_0.45fr]">
          <h2 className="max-w-3xl text-4xl font-semibold uppercase leading-none tracking-[-0.055em] md:text-6xl">
            Designed with Intent
          </h2>
          <div className="space-y-1 text-sm uppercase md:text-base">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-white">Instagram</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-white">LinkedIn</a>
            <a href={profile.behance} target="_blank" rel="noreferrer" className="block hover:text-white">Behance</a>
            <a href={`mailto:${profile.email}`} className="block hover:text-white">Email</a>
          </div>
          <p className="text-sm uppercase md:text-base">Delhi, India</p>
        </div>

        <div className="flex items-center justify-between border-t border-[#1b005a]/70 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wide">
            2026 © Sukunsh. All rights reserved
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-[#1b005a] px-7 py-4 text-xs font-semibold uppercase text-white transition-colors hover:bg-[#050505]"
          >
            Let&apos;s Connect
          </a>
        </div>
      </div>
    </footer>
  );
}
