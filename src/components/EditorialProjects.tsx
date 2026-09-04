import { DesignProject } from "../portfolioData";

interface EditorialProjectsProps {
  projects: DesignProject[];
  onSelectProject?: (proj: DesignProject) => void;
  onOpenProjectsExplorer?: () => void;
  onOpenAIWork?: () => void;
  profile?: any;
}

export default function EditorialProjects({
  projects,
  onSelectProject,
  profile,
}: EditorialProjectsProps) {
  // Safe project slots (7 projects for full column balancing)
  const p0 = projects[0]; // Hero full-width banner
  const p1 = projects[1]; // Left Column - Tall
  const p2 = projects[2]; // Left Column - Landscape
  const p6 = projects[6] || projects[1]; // Left Column - Bottom Balancer Card
  const p3 = projects[3]; // Right Column - Landscape
  const p4 = projects[4]; // Right Column - Square/Taller
  const p5 = projects[5]; // Right Column - Landscape

  const getProjectLines = (proj?: DesignProject, defaultLine1 = "Background in Fine Art", defaultLine2 = "and Design.") => {
    if (!proj) return { line1: defaultLine1, line2: defaultLine2 };
    if (proj.description) {
      // Split description into two balanced, meaningful lines
      const parts = proj.description.split(/[,.]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return { line1: parts[0], line2: parts[1] };
      }
    }
    return { line1: defaultLine1, line2: defaultLine2 };
  };

  const renderCardMeta = (typeText = "Branding", line1 = "Background in Fine Art", line2 = "and Design.") => (
    <div className="mt-2.5 sm:mt-3.5 md:mt-4 flex items-start gap-2 sm:gap-2.5 text-[clamp(0.75rem,1.2vw,0.875rem)] text-neutral-900 leading-[1.25]">
      <span className="font-semibold text-neutral-950 whitespace-nowrap">
        {typeText}
      </span>
      <span className="inline-block w-px self-stretch bg-neutral-900 shrink-0 my-0.5" />
      <div className="flex flex-col text-neutral-900 font-normal leading-[1.2]">
        <span>{line1}</span>
        <span>{line2}</span>
      </div>
    </div>
  );

  return (
    <section
      id="projects"
      data-cursor-tag="Projects"
      style={{ fontSize: "22px" }}
      className="relative w-full bg-white text-neutral-900 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16"
    >
      <div className="w-full mx-auto">
        
        {/* Title: Projects ↙ with fluid clamp typography */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[clamp(2.75rem,7.5vw,6rem)] font-bold tracking-[-0.035em] text-neutral-950 leading-none select-none">
            Projects
          </h2>
          <span className="inline-flex items-center text-neutral-950 transform translate-y-1">
            <svg
              className="w-[clamp(1.75rem,4.5vw,3.5rem)] h-[clamp(1.75rem,4.5vw,3.5rem)] stroke-current stroke-[2.2] fill-none"
              viewBox="0 0 24 24"
            >
              <path d="M19 5L5 19M5 19H17M5 19V7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* 1. Hero Full-Width Card (Spans the entire screen width with fluid responsiveness) */}
        {p0 && (
          <div className="mb-8 sm:mb-12 md:mb-14">
            <div
              onClick={() => onSelectProject?.(p0)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p0)}
              className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] md:aspect-[21/9] lg:aspect-[2.4/1] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                <img
                  src={p0.image}
                  alt={p0.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              {renderCardMeta(
                p0.type || "Web Architecture",
                getProjectLines(p0, "Spatial Architecture &", "Minimal Editorial Storytelling.").line1,
                getProjectLines(p0, "Spatial Architecture &", "Minimal Editorial Storytelling.").line2
              )}
            </div>
          </div>
        )}

        {/* 2. Staggered 2-Column Grid (Fills full width, dynamically adjusting to mobile, tablet, desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">
          
          {/* Left Column: [Tall Card] -> [Landscape Card] -> [Balanced Card] */}
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            
            {/* Left Item 1: Tall Card */}
            {p1 && (
              <div
                onClick={() => onSelectProject?.(p1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p1)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[4/3] sm:aspect-[4/4] md:aspect-[4/4.8] lg:aspect-[4/4.9] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={p1.image}
                    alt={p1.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p1.type || "UI/UX & Web",
                  getProjectLines(p1, "Design System Tokens &", "Tactile Micro-Interactions.").line1,
                  getProjectLines(p1, "Design System Tokens &", "Tactile Micro-Interactions.").line2
                )}
              </div>
            )}

            {/* Left Item 2: Landscape Card */}
            {p2 && (
              <div
                onClick={() => onSelectProject?.(p2)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p2)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={p2.image}
                    alt={p2.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p2.type || "SaaS & Web",
                  getProjectLines(p2, "Real-Time Visual Metrics &", "Financial Intelligence.").line1,
                  getProjectLines(p2, "Real-Time Visual Metrics &", "Financial Intelligence.").line2
                )}
              </div>
            )}

            {/* Left Item 3: Balancing Card (Eliminates negative space at the bottom) */}
            {p6 && (
              <div
                onClick={() => onSelectProject?.(p6)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p6)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={p6.image}
                    alt={p6.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p6.type || "Visual System",
                  getProjectLines(p6, "Identity Typography &", "Contemporary Spatial Branding.").line1,
                  getProjectLines(p6, "Identity Typography &", "Contemporary Spatial Branding.").line2
                )}
              </div>
            )}

          </div>

          {/* Right Column: [Landscape Card] -> [Square/Taller Card] -> [Landscape Card] */}
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            
            {/* Right Item 1: Landscape Card */}
            {p3 && (
              <div
                onClick={() => onSelectProject?.(p3)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p3)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={p3.image}
                    alt={p3.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p3.type || "Digital Web",
                  getProjectLines(p3, "Kinetic Brand Narrative &", "Modular UI Engineering.").line1,
                  getProjectLines(p3, "Kinetic Brand Narrative &", "Modular UI Engineering.").line2
                )}
              </div>
            )}

            {/* Right Item 2: Square/Taller Card */}
            {p4 && (
              <div
                onClick={() => onSelectProject?.(p4)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p4)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[1/1] sm:aspect-[1/1] md:aspect-[4/4.2] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={p4.image}
                    alt={p4.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p4.type || "E-Commerce",
                  getProjectLines(p4, "Fluid Mobile Checkout &", "Tactile Product Architecture.").line1,
                  getProjectLines(p4, "Fluid Mobile Checkout &", "Tactile Product Architecture.").line2
                )}
              </div>
            )}

            {/* Right Item 3: Landscape Card */}
            {p5 && (
              <div
                onClick={() => onSelectProject?.(p5)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p5)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={p5.image}
                    alt={p5.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p5.type || "Editorial Media",
                  getProjectLines(p5, "Dynamic Typographic Grid &", "Immersive Content Flow.").line1,
                  getProjectLines(p5, "Dynamic Typographic Grid &", "Immersive Content Flow.").line2
                )}
              </div>
            )}

          </div>

        </div>

        {/* 3. See all Project Button */}
        <div className="mt-14 sm:mt-18 md:mt-20 flex justify-center">
          <button
            type="button"
            onClick={() => {
              const behanceUrl = profile?.behance || "https://www.behance.net/sukunshsharma";
              window.open(behanceUrl, "_blank", "noopener,noreferrer");
            }}
            className="border border-neutral-900 bg-white px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium tracking-normal text-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer select-none"
          >
            See all Project
          </button>
        </div>

      </div>
    </section>
  );
}
