interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  return (
    <footer id="contact" className="relative bg-[#25231f] px-6 pb-14 pt-24 text-[#f3ead7] md:px-12 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-[1520px]">
        <div className="mb-20 grid gap-10 md:grid-cols-[1.2fr_0.85fr_0.45fr_0.45fr]">
          <h2 className="max-w-4xl text-4xl font-medium leading-none tracking-[-0.012em] md:text-6xl">
            Let&apos;s work together.
          </h2>
          <p className="max-w-sm text-base leading-[1.45] text-[#b8ad9b]">
            Have an idea, film, brand, or visual world to build?
          </p>
          <div className="space-y-1 text-sm uppercase md:text-base">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-[#f25a00]">Instagram</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-[#f25a00]">LinkedIn</a>
            <a href={profile.behance} target="_blank" rel="noreferrer" className="block hover:text-[#f25a00]">Behance</a>
            <a href={`mailto:${profile.email}`} className="block hover:text-[#f25a00]">Email</a>
          </div>
          <p className="text-sm uppercase md:text-base">Delhi, India</p>
        </div>

        <div className="flex items-center justify-between border-t border-[#f3ead7]/16 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wide">
            2026 © Sukunsh. All rights reserved
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-[#f3ead7]/16 bg-[#f25a00] px-7 py-4 text-xs font-semibold uppercase text-[#fff4e7] transition-colors hover:bg-[#191816]"
          >
            Let&apos;s Connect
          </a>
        </div>
      </div>
    </footer>
  );
}
