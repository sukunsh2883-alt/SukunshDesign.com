import { DesignProject } from "../portfolioData";
import ContinuousLoopVideo from "./ContinuousLoopVideo";

interface EditorialProjectsProps {
  projects: DesignProject[];
  onSelectProject?: (proj: DesignProject) => void;
  onOpenProjectsExplorer?: () => void;
  onOpenAIWork?: () => void;
  onOpenDesignShowcase?: () => void;
  profile?: any;
}

export default function EditorialProjects({
  projects,
  onSelectProject,
  onOpenProjectsExplorer,
  onOpenAIWork,
  onOpenDesignShowcase,
  profile,
}: EditorialProjectsProps) {
  // Safe project slots for the 4 active visual projects
  const heroProject = projects[0];
  const pLeft1 = projects[0];  // Top-Left: Architectural Studio Web Platform
  const pRight1 = projects[1]; // Top-Right: Creative Agency Web Portal
  const pLeft2 = projects[2];  // Bottom-Left: NextGen Design System & Web App
  const pRight2 = projects[3]; // Bottom-Right: Luxury E-Commerce Web Store

  const getProjectLines = (proj?: DesignProject, defaultLine1 = "Background in Fine Art", defaultLine2 = "and Design.") => {
    if (!proj) return { line1: defaultLine1, line2: defaultLine2 };
    if (proj.description) {
      // Split description into two balanced, meaningful lines
      const parts = proj.description.split(/[,.]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return { line1: parts[0], line2: parts.slice(1).join(", ") };
      } else if (parts.length === 1) {
        return { line1: parts[0], line2: proj.client ? `Client: ${proj.client} (${proj.year})` : defaultLine2 };
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
        {line2 && <span>{line2}</span>}
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

        {/* 1. Hero Motion Graphic View (Uncropped video with natural sizing, no surrounding text, cursor hover tag) */}
        {heroProject && (
          <div className="mb-8 sm:mb-12 md:mb-14">
            <div
              data-cursor-tag="See all projects"
              data-cursor-text="See all projects"
              onClick={() => {
                if (onOpenDesignShowcase) {
                  onOpenDesignShowcase();
                } else {
                  onSelectProject?.(heroProject);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (onOpenDesignShowcase) {
                    onOpenDesignShowcase();
                  } else {
                    onSelectProject?.(heroProject);
                  }
                }
              }}
              className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div 
                className="relative w-full aspect-[1728/1116] overflow-hidden rounded-[4px] bg-neutral-50 shadow-xs hover:shadow-md transition-shadow duration-300"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <ContinuousLoopVideo
                  src="/design-illustration-loop.mp4"
                  fallbackSrc="https://res.cloudinary.com/dylv5m3jk/video/upload/v1789396420/MacBook_Pro_16-_-_1_4_f7ttaj.mp4"
                  poster="https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg"
                  alt={heroProject.title || "Design & Illustration Showcase"}
                  className="w-full h-full block object-contain select-none transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Symmetrical 2-Column Grid (4 Active Projects Matching Preview) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            
            {/* Left Item 1: Architectural Studio Web Platform */}
            {pLeft1 && (
              <div
                onClick={() => onSelectProject?.(pLeft1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(pLeft1)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={pLeft1.image}
                    alt={pLeft1.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  pLeft1.type || "Web Design",
                  getProjectLines(pLeft1, "Editorial web portal showcasing spatial architectures", "interactive blueprints, and minimal typography.").line1,
                  getProjectLines(pLeft1, "Editorial web portal showcasing spatial architectures", "interactive blueprints, and minimal typography.").line2
                )}
              </div>
            )}

            {/* Left Item 2: NextGen Design System & Web App */}
            {pLeft2 && (
              <div
                onClick={() => onSelectProject?.(pLeft2)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(pLeft2)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={pLeft2.image}
                    alt={pLeft2.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  pLeft2.type || "UI/UX & Web",
                  getProjectLines(pLeft2, "Concept branding for Somu Samosa", "including logo, colors, stickers, and social media designs.").line1,
                  getProjectLines(pLeft2, "Concept branding for Somu Samosa", "including logo, colors, stickers, and social media designs.").line2
                )}
              </div>
            )}

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            
            {/* Right Item 1: Creative Agency Web Portal */}
            {pRight1 && (
              <div
                onClick={() => onSelectProject?.(pRight1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(pRight1)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={pRight1.image}
                    alt={pRight1.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  pRight1.type || "Digital Web",
                  getProjectLines(pRight1, "Brand storytelling web screen engineered with kinetic micro-interactions", "smooth scrolling, and modular UI cards.").line1,
                  getProjectLines(pRight1, "Brand storytelling web screen engineered with kinetic micro-interactions", "smooth scrolling, and modular UI cards.").line2
                )}
              </div>
            )}

            {/* Right Item 2: Luxury E-Commerce Web Store */}
            {pRight2 && (
              <div
                onClick={() => onSelectProject?.(pRight2)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(pRight2)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-[#d8d8d8] shadow-xs hover:shadow-md transition-shadow duration-300">
                  <img
                    src={pRight2.image}
                    alt={pRight2.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  pRight2.type || "E-Commerce",
                  getProjectLines(pRight2, "Seamless e-commerce web platform showcasing luxury product cards", "fluid cart drawer, and high-performance navigation.").line1,
                  getProjectLines(pRight2, "Seamless e-commerce web platform showcasing luxury product cards", "fluid cart drawer, and high-performance navigation.").line2
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
