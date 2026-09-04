import { ArrowUpRight, Linkedin, Instagram } from "lucide-react";

interface LetsTalkProps {
  profile?: any;
}

export default function LetsTalk({ profile }: LetsTalkProps) {
  const email = profile?.email || "sukunsh2883@gmail.com";
  const location = profile?.location || "Delhi, India";
  const linkedin = profile?.linkedin || "https://www.linkedin.com/in/sukunsh";
  const behance = profile?.behance || "https://www.behance.net/sukunshsharma";
  const instagram = profile?.instagram || "https://www.instagram.com/sukunsh_";

  const socialLinks = [
    {
      name: "Suraj Kumar Sharma",
      platform: "LinkedIn",
      url: linkedin,
      handle: "LinkedIn",
    },
    {
      name: "Behance",
      platform: "Behance",
      url: behance,
      handle: "/sukunshsharma",
    },
    {
      name: "Instagram",
      platform: "Instagram",
      url: instagram,
      handle: "@Sukunsh_",
    },
  ];

  return (
    <section id="contact" data-cursor-tag="Contact" className="w-full bg-white text-neutral-900 border-t border-neutral-200 pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20">
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        {/* Editorial Heading: LET'S TALK with Circular Rotating Badge directly beside it */}
        <div className="text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
            <h2 className="font-['Big_Shoulders_Display',sans-serif] text-[clamp(4.25rem,13vw,11.5rem)] font-black uppercase tracking-tight text-neutral-950 leading-[0.85] select-none">
              LET'S TALK
            </h2>

            {/* Circular Rotating Contact Badge placed beside LET'S TALK */}
            <a
              href={`mailto:${email}`}
              aria-label="Contact Sukunsh via Email"
              className="group relative shrink-0 flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full bg-neutral-950 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-neutral-800 self-start sm:self-center"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowUpRight className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 stroke-[2] transition-transform group-hover:rotate-45" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                  <path
                    id="circlePathFooter"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[7.5px] font-bold uppercase tracking-[0.24em] fill-neutral-400">
                    <textPath href="#circlePathFooter">
                      • CONTACT US • CONTACT US • 
                    </textPath>
                  </text>
                </svg>
              </div>
            </a>
          </div>

          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-[clamp(0.75rem,1.2vw,0.875rem)] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            <div className="space-y-1.5">
              <a
                href={`mailto:${email}`}
                className="block text-neutral-900 hover:underline transition-colors font-mono"
              >
                {email}
              </a>
              <p className="text-neutral-500">{location}</p>
            </div>

            <div className="sm:text-right flex sm:justify-end items-start">
              <p className="font-bold text-neutral-900 text-sm sm:text-base max-w-[280px] tracking-wide">
                AND CREATE SOME STUFF TOGETHER!
              </p>
            </div>
          </div>

          {/* Social Links Row: LinkedIn (Sukunsh Sharma), Behance, Instagram */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-neutral-200">
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">Connect & Follow</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-[6px] border border-neutral-300 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium text-neutral-900 shadow-2xs transition-all duration-200 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95"
                >
                  <span className="font-semibold">{social.name}</span>
                  <span className="text-[11px] text-neutral-400 group-hover:text-neutral-300 font-mono hidden sm:inline">
                    ({social.handle})
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[2] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
