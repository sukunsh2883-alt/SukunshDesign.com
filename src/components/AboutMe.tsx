import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface AboutMeProps {
  profile?: {
    fullName?: string;
    brandName?: string;
    roles?: string[];
    bio?: string;
    email?: string;
    linkedin?: string;
    behance?: string;
    aboutImage?: string;
  };
  onOpenResume?: () => void;
  onOpenAIWork?: () => void;
  onOpenProjects?: () => void;
}

export default function AboutMe({ profile }: AboutMeProps) {
  const portraitImage =
    profile?.aboutImage ||
    "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png";

  return (
    <section id="about-me" className="relative w-full bg-[#FBFBFC] text-neutral-900 font-sans overflow-hidden py-16 sm:py-24 px-6 sm:px-12 md:px-16 border-t border-neutral-200/60">
      {/* Subtle Light-Grey Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E2E2E8 1px, transparent 1px),
            linear-gradient(to bottom, #E2E2E8 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Main Wide Desktop Composition */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Zone: Introduction, Education & Experience */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 sm:space-y-10 md:space-y-12">
          
          {/* Top-left label */}
          <div>
            <div className="w-12 h-[1.5px] bg-neutral-900 mb-2.5" />
            <div className="inline-flex items-center gap-1 text-xs font-sans font-medium tracking-wide text-neutral-900">
              <span>About me</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-900 stroke-[2]" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-normal leading-[1.06] tracking-[-0.035em] text-neutral-950 select-none">
            I am a Delhi Based<br />
            Visual Designer.
          </h1>

          {/* Intro Paragraph */}
          <p className="text-neutral-600 text-base sm:text-lg md:text-[21px] font-normal leading-relaxed max-w-xl">
            Blending fine art sensibilities with contemporary design,<br className="hidden sm:inline" />
            crafting evocative visual stories through motion,<br className="hidden sm:inline" />
            typography and creative precision.
          </p>

          {/* Education and Experience Section */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-8 sm:gap-0">
              
              {/* Left Column: Education */}
              <div className="flex-1 sm:pr-8 md:pr-10">
                <div className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-neutral-900 uppercase">
                  EDUCATION
                </div>
                <div className="w-6 h-[1.5px] bg-neutral-900 mt-1.5 mb-5" />

                <div className="space-y-5">
                  <div>
                    <div className="text-sm sm:text-[15px] font-medium text-neutral-900 leading-snug">
                      M.Des - IDC School of Design
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-normal">
                      IIT Bombay
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-neutral-200/80" />

                  <div>
                    <div className="text-sm sm:text-[15px] font-medium text-neutral-900 leading-snug">
                      BFA, Visual Communication
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-normal">
                      College of Art, Delhi
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider with subtle center dot */}
              <div className="hidden sm:flex flex-col items-center justify-center relative w-[1px] bg-neutral-200 shrink-0 self-stretch my-1">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 absolute top-1/2 -translate-y-1/2 -left-[2.5px]" />
              </div>

              {/* Right Column: Experience */}
              <div className="flex-1 sm:pl-8 md:pl-10">
                <div className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-neutral-900 uppercase">
                  EXPERIENCE
                </div>
                <div className="w-6 h-[1.5px] bg-neutral-900 mt-1.5 mb-5" />

                <div>
                  <div className="text-sm sm:text-[15px] font-medium text-neutral-900 leading-snug">
                    Visual Designer
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-normal">
                    ShareChat
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Zone: Hanging ID-card Portrait */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start relative pt-6 lg:pt-0">
          
          {/* Lanyard + Badge Sway Group */}
          <motion.div
            className="relative flex flex-col items-center origin-top select-none scale-[0.92] sm:scale-100"
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{
              duration: 7,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            {/* Lanyard Fabric Strap entering from top */}
            <div className="w-7 sm:w-8 h-28 sm:h-36 bg-neutral-950 relative shadow-sm flex flex-col items-center justify-around py-3 rounded-t-sm z-10 overflow-hidden">
              {/* Subtle fabric texture line */}
              <div className="absolute inset-y-0 left-1 w-[1px] bg-white/10" />
              <div className="absolute inset-y-0 right-1 w-[1px] bg-white/10" />
              
              {/* Small repeating white logo symbols printed on lanyard */}
              <span className="text-white text-[10px] opacity-90">✿</span>
              <span className="text-white text-[10px] opacity-90">✿</span>
              <span className="text-white text-[10px] opacity-90">✿</span>
            </div>

            {/* Black Metal Ring & Buckle Assembly */}
            <div className="relative z-20 flex flex-col items-center -mt-0.5">
              <div className="w-8 sm:w-9 h-4 bg-neutral-900 rounded-sm border border-neutral-700 flex items-center justify-center shadow-md">
                <div className="w-4 h-1 bg-neutral-800 rounded-full" />
              </div>
              {/* Metal Ring & Short Hook */}
              <div className="w-6 h-6 border-[3px] border-neutral-900 rounded-full bg-transparent flex items-center justify-center -mt-1">
                <div className="w-2.5 h-4 bg-neutral-900 rounded-b-sm" />
              </div>
            </div>

            {/* Modern ID Badge matching reference image */}
            <div className="relative z-10 -mt-2 w-full max-w-[320px] bg-white rounded-[28px] overflow-hidden border border-neutral-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col">
              
              {/* Top slot clip hole */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-8 h-2 rounded-full bg-neutral-900 border border-neutral-400/50 shadow-inner" />

              {/* Portrait Photograph covering top 62% */}
              <div className="w-full aspect-[4/4.5] overflow-hidden bg-neutral-100">
                <img
                  src={portraitImage}
                  alt="Sooraj Kumar Sharma Portrait"
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>

              {/* Asymmetrical Dark Matte Block */}
              <div className="relative -mt-6 bg-[#18181b] text-white pt-6 pb-5 px-6 rounded-tr-[36px] flex flex-col justify-between min-h-[140px]">
                {/* Name */}
                <div className="space-y-0.5">
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-black tracking-tight text-white leading-tight">
                    SURAJ
                  </h3>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold tracking-tight text-white leading-tight">
                    Kumar Sharma
                  </h3>
                </div>

                {/* Bottom Row */}
                <div className="mt-5 flex items-center justify-between text-xs text-neutral-300 font-medium">
                  <span>Visual Designer</span>
                  <span className="font-mono text-neutral-400">ID #0009256</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}




