import { ArrowUpRight } from "lucide-react";

interface LetsTalkProps {
  profile?: any;
}

export default function LetsTalk({ profile }: LetsTalkProps) {
  const email = profile?.email || "sukunsh2883@gmail.com";
  const phone = profile?.phone || "+91 98765 43210";
  const location = profile?.location || "Delhi, India";

  return (
    <section id="contact" data-cursor-tag="Contact" className="w-full bg-white text-neutral-900 border-t border-neutral-200 pt-20 md:pt-28 pb-20">
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        
        {/* Giant Editorial Heading: LET'S TALK */}
        <div className="text-left">
          <h2 className="font-['Big_Shoulders_Display',sans-serif] text-7xl sm:text-9xl md:text-[150px] lg:text-[190px] font-black uppercase tracking-tight text-neutral-950 leading-[0.85] select-none">
            LET'S TALK
          </h2>

          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-neutral-700">
            <div className="space-y-1.5">
              <a
                href={`mailto:${email}`}
                className="block text-neutral-900 hover:underline transition-colors font-mono"
              >
                {email}
              </a>
              <p className="text-neutral-500 font-mono">{phone}</p>
              <p className="text-neutral-500">{location}</p>
            </div>

            <div className="sm:text-right flex sm:justify-end items-start">
              <p className="font-bold text-neutral-900 text-sm sm:text-base max-w-[280px] tracking-wide">
                AND CREATE SOME STUFF TOGETHER!
              </p>
            </div>
          </div>

          {/* Centered Circular Contact Badge */}
          <div className="mt-14 sm:mt-20 flex justify-center">
            <a
              href={`mailto:${email}`}
              className="group relative flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-neutral-950 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-neutral-800"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowUpRight className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2] transition-transform group-hover:rotate-45" />
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

        </div>

      </div>
    </section>
  );
}
