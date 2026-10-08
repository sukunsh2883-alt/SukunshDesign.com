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
      name: "GitHub",
      platform: "GitHub",
      url: profile?.github || "https://github.com/surajsharma",
      handle: "/surajsharma",
    },
    {
      name: "Instagram",
      platform: "Instagram",
      url: instagram,
      handle: "@Sukunsh_",
    },
  ];

  return (
    <section id="contact" data-cursor-tag="Contact" className="w-full bg-[#ff3b30] text-black border-t border-black/15 pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 font-sans selection:bg-black selection:text-white select-none">
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        {/* Editorial Heading: LET'S TALK with Circular Rotating Badge */}
        <div className="text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
            <h2 className="text-[clamp(2.25rem,4vw,3rem)] font-bold uppercase tracking-[-0.035em] text-neutral-950 leading-none select-none">
              LET'S TALK
            </h2>

            {/* Circular Rotating Contact Badge */}
            <a
              href={`mailto:${email}`}
              aria-label="Contact Suraj via Email"
              className="group relative shrink-0 flex items-center justify-center h-22 w-22 sm:h-26 sm:w-26 md:h-28 md:w-28 rounded-full bg-neutral-950 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-black self-start sm:self-center"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 stroke-[2.2] text-white transition-transform group-hover:rotate-45" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                  <path
                    id="circlePathFooter"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[7.5px] font-bold uppercase tracking-[0.24em] fill-white/80">
                    <textPath href="#circlePathFooter">
                      • CONTACT US • CONTACT US • 
                    </textPath>
                  </text>
                </svg>
              </div>
            </a>
          </div>

          {/* Minimal 1-Line Email & Social Links */}
          <div className="mt-8 sm:mt-12 pt-6 border-t border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono text-xs sm:text-sm">
            <div>
              <a
                href={`mailto:${email}`}
                className="text-neutral-950 hover:underline font-bold tracking-tight text-base sm:text-xl"
              >
                {email}
              </a>
              <p className="text-neutral-900/80 font-medium text-xs mt-0.5">{location}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 uppercase tracking-[0.18em]">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-950 hover:text-black font-semibold hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>{social.platform}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
