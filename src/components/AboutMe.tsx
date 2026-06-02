import React from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";

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

export default function AboutMe({ profile, onOpenResume, onOpenProjects }: AboutMeProps) {
  const aboutImg = profile.aboutImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";

  return (
    <section 
      id="about-me" 
      className="relative min-h-screen bg-white text-neutral-950 font-sans select-none border-t border-neutral-200 overflow-hidden"
    >
      {/* Outer Editorial Container - Swiss Grid Layout */}
      <div className="w-full mx-auto max-w-7xl px-4 md:px-8 py-12 flex flex-col">
        
        {/* ROW 1: Top Header Navigation Bar (Divided by borders) */}
        <div className="grid grid-cols-2 md:grid-cols-12 border-t border-b border-neutral-250 py-3 text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
          <div className="col-span-1 md:col-span-3 flex items-center md:border-r border-neutral-200 pr-4">
            <span className="text-neutral-400">DESIGN DIRECTIVES</span>
          </div>
          <div className="col-span-1 md:col-span-4 hidden md:flex items-center border-r border-neutral-200 px-4">
            <span className="text-neutral-900 font-bold">ABOUT SURAJ</span>
          </div>
          <div className="col-span-1 md:col-span-4 flex items-center justify-end md:justify-start px-2 md:px-4 text-right md:text-left truncate">
            <a href={`mailto:${profile.email}`} className="hover:text-[#FF6A00] transition-all truncate">
              {profile.email || "sukunsh2883@gmail.com"}
            </a>
          </div>
          <div className="col-span-1 md:col-span-1 flex items-center justify-end font-normal">
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-250 py-8 md:py-12 items-end gap-8 md:gap-0">
          <div className="col-span-1 md:col-span-6 pr-4">
            <h1 className="text-[18vw] sm:text-[14vw] md:text-[9vw] font-normal tracking-tight text-neutral-950 font-sans leading-[0.82] uppercase">
              About Me
            </h1>
          </div>

          <div className="col-span-1 md:col-span-4 md:border-l border-neutral-200 md:px-6">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Creative Profile
            </p>
            <p className="max-w-sm text-sm md:text-base leading-relaxed text-neutral-700">
              Delhi-based visual artist rooted in Bihar&apos;s cultural heritage, working between art, design, and cinema.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 md:border-l border-neutral-200 md:px-6">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Focus
            </p>
            <div className="space-y-1.5 text-[10px] uppercase tracking-widest text-neutral-700 font-bold">
              <div>AI Films</div>
              <div>Motion Design</div>
              <div>Brand Visuals</div>
              <div>Product Ads</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 items-stretch">
          
          <div className="col-span-1 md:col-span-5 border-b md:border-b-0 md:border-r border-neutral-250 py-8 md:pt-8 md:pb-0 md:pr-8 relative group flex items-start justify-center">
            <div className="w-full relative h-[450px] md:h-[550px] overflow-hidden rounded-lg bg-neutral-950 border border-neutral-100">
              <img
                src={aboutImg}
                alt={profile.fullName}
                className="w-full h-full object-cover grayscale transition-all duration-700 select-none pointer-events-none group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Metadata code layered beautifully under standard fashion grid styles */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white mix-blend-difference">
                <div className="font-mono text-[9px] uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1 rounded">
                  PORTRAIT // ACT.01
                </div>
                <div className="font-sans text-[11px] font-bold text-white uppercase tracking-tight">
                  {profile.fullName || "Suraj Kumar Sharma"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-7 py-8 md:py-8 md:pl-12 flex flex-col justify-between gap-8">
            
            <div className="space-y-6">
              <div>
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  About Me
                </p>
                <h2 className="max-w-xl text-3xl md:text-5xl font-sans font-black leading-[1.02] tracking-tight text-neutral-950">
                  Emotional, bold, story-driven visuals.
                </h2>
              </div>

              <div className="max-w-2xl space-y-4 text-sm md:text-base leading-relaxed text-neutral-600">
                <p>
                  I&apos;m a Delhi-based visual artist, rooted in Bihar&apos;s rich cultural heritage, with a background in Fine Art and Design. My work lives between art, design, and cinema creating visuals that feel emotional, bold, and story driven.
                </p>
                <p>
                  I&apos;m deeply passionate about filmmaking, especially art films, where mood, culture, and human emotions become the language of storytelling. Through every project, I aim to create visuals that don&apos;t just look good, but leave a feeling behind.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                <button
                  onClick={onOpenProjects}
                  className="px-8 py-3.5 rounded-full border border-neutral-300 text-[10px] uppercase font-bold tracking-widest hover:border-neutral-950 hover:bg-neutral-950 hover:text-white transition-all scale-100 active:scale-95 cursor-pointer"
                >
                  EXPLORE WORK
                </button>
                <button
                  onClick={onOpenResume}
                  className="px-8 py-3.5 rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/5 text-[#FF6A00] text-[10px] uppercase font-bold tracking-widest hover:bg-[#FF6A00]/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>FULL RESUME</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6 flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
              <div className="flex items-center gap-4">
                <a 
                  href={profile.linkedin || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-neutral-950 transition-colors flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
                <a 
                  href={profile.behance || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-neutral-950 transition-colors flex items-center gap-1"
                >
                  <span>Behance</span>
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
                <a 
                  href={`mailto:${profile.email}`} 
                  className="hover:text-neutral-950 transition-colors"
                >
                  Email
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Sideways Vertical Right Ribbons */}
      <div className="absolute top-12 bottom-12 right-4 hidden xl:flex flex-col justify-between items-center z-10 select-none pointer-events-none text-neutral-400">
        <span className="whitespace-nowrap select-none text-[8px] uppercase tracking-[0.3em] font-sans font-bold origin-center rotate-90 translate-y-16">
          In the move with the future.
        </span>
        <span className="font-mono text-[9px] uppercase font-bold tracking-wider origin-center rotate-90 -translate-y-8">
          M.DES / IIT BOMBAY
        </span>
      </div>

    </section>
  );
}
