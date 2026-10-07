import { DesignProject, designProjects } from "../portfolioData";

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
  // Safe project slots with designProjects as guaranteed fallback
  const p1 = projects.find(p => p.id === "woko-noodle-brand-identity") || designProjects.find(p => p.id === "woko-noodle-brand-identity") || projects[1]; // Left Column - Top: WOKO
  const p_claro = projects.find(p => p.id === "claro-ai-information-intelligence") || designProjects.find(p => p.id === "claro-ai-information-intelligence"); // Left Column - Item 2: CLARO
  const p2 = projects.find(p => p.id === "design-kinetic-motion") || designProjects.find(p => p.id === "design-kinetic-motion") || projects[3]; // Left Column - Item 3: Kinetic Motion
  const p6 = projects.find(p => p.id === "design-character-anim") || designProjects.find(p => p.id === "design-character-anim") || projects[6]; // Left Column - Bottom: Character Anim

  const p3 = projects.find(p => p.id === "nou-visual-identity") || designProjects.find(p => p.id === "nou-visual-identity") || projects[2]; // Right Column - Top: NOU (Beside WOKO)
  const p_layer82 = projects.find(p => p.id === "layer-82-motion-design") || designProjects.find(p => p.id === "layer-82-motion-design");
  const p4 = projects.find(p => p.id === "design-1") || designProjects.find(p => p.id === "design-1") || projects[4]; // Right Column - Middle
  const p5 = projects.find(p => p.id === "design-earthquake-map") || designProjects.find(p => p.id === "design-earthquake-map") || projects[5]; // Right Column - Item 3
  const p_mono = projects.find(p => p.id === "design-monogram-logos") || designProjects.find(p => p.id === "design-monogram-logos"); // Right Column - Bottom

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

  const renderCardMeta = (typeText = "Branding", line1 = "Background in Fine Art", _line2?: string) => (
    <div className="mt-2.5 sm:mt-3 md:mt-3.5 flex items-center gap-2 sm:gap-2.5 text-[13px] sm:text-[14px] leading-none text-neutral-300">
      <span className="font-semibold text-white whitespace-nowrap">
        {typeText}
      </span>
      <span className="inline-block w-px h-3.5 bg-neutral-700 shrink-0" />
      <span className="text-neutral-300 font-normal truncate">
        {line1}
      </span>
    </div>
  );

  return (
    <section
      id="projects"
      data-cursor-tag="Projects"
      className="relative w-full bg-[#050505] text-white pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16"
    >
      <div className="w-full mx-auto">
        
        {/* Title: Projects ↙ aligned to H2 standard 36–48px */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-14">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[clamp(2.25rem,4vw,3rem)] font-bold tracking-[-0.035em] text-white leading-none select-none">
            Projects
          </h2>
          <span className="inline-flex items-center text-white transform translate-y-0.5">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 stroke-current stroke-[2.2] fill-none"
              viewBox="0 0 24 24"
            >
              <path d="M19 5L5 19M5 19H17M5 19V7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* 2. Staggered 2-Column Grid (Original 7 Projects Balanced Composition) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            
            {/* Left Item 1: p_claro (Landscape) - Position #1 */}
            {p_claro && (
              <div
                onClick={() => onSelectProject?.(p_claro)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p_claro)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p_claro.image}
                    alt={p_claro.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p_claro.type || "Branding / UI/UX",
                  "CLARO",
                  "AI information intelligence platform."
                )}
              </div>
            )}

            {/* Left Item 2: p3 NOU (Landscape) - Position #3 */}
            {p3 && (
              <div
                onClick={() => onSelectProject?.(p3)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p3)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p3.image}
                    alt={p3.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p3.type || "Visual Identity",
                  getProjectLines(p3, "NOU — Visual identity", "Brand identity and design system.").line1,
                  getProjectLines(p3, "NOU — Visual identity", "Brand identity and design system.").line2
                )}
              </div>
            )}

            {/* Project: Design and Illustration */}
            <div
              onClick={() => {
                const targetProj = p_layer82 || {
                  id: "layer-82-motion-design",
                  title: "Design and Illustration",
                  type: "Design & Illustration",
                  year: "2026",
                  description: "Design and illustration showcase. Visual craft and dynamic creative design.",
                  image: "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
                  tools: ["Illustrator", "Photoshop", "Cinema 4D"],
                  link: "#",
                };
                onSelectProject?.(targetProj);
              }}
              role="button"
              tabIndex={0}
              data-cursor-project="true"
              data-project-card="true"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const targetProj = p_layer82 || {
                    id: "layer-82-motion-design",
                    title: "Design and Illustration",
                    type: "Design & Illustration",
                    year: "2026",
                    description: "Design and illustration showcase. Visual craft and dynamic creative design.",
                    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
                    tools: ["Illustrator", "Photoshop", "Cinema 4D"],
                    link: "#",
                  };
                  onSelectProject?.(targetProj);
                }
              }}
              className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                <img
                  src="https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg"
                  alt="Design and Illustration"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                  fetchPriority="low"
                  referrerPolicy="no-referrer"
                />
              </div>
              {renderCardMeta(
                "Design & Illustration",
                "Design and Illustration"
              )}
            </div>

            {/* Left Item 3: p2 (Landscape) */}
            {p2 && (
              <div
                onClick={() => onSelectProject?.(p2)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p2)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p2.image}
                    alt={p2.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p2.type || "Branding",
                  getProjectLines(p2, "Background in Fine Art", "and Design.").line1,
                  getProjectLines(p2, "Background in Fine Art", "and Design.").line2
                )}
              </div>
            )}

            {/* Left Item 4: p5 (Landscape) */}
            {p5 && (
              <div
                onClick={() => onSelectProject?.(p5)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p5)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p5.image}
                    alt={p5.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p5.type || "Design",
                  getProjectLines(p5, "Background in Fine Art", "and Design.").line1,
                  getProjectLines(p5, "Background in Fine Art", "and Design.").line2
                )}
              </div>
            )}

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            
            {/* Right Item 1: p1 WOKO (Landscape) - Position #2 */}
            {p1 && (
              <div
                onClick={() => onSelectProject?.(p1)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p1)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p1.image}
                    alt={p1.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p1.type || "Branding",
                  getProjectLines(p1, "Background in Fine Art", "and Design.").line1,
                  getProjectLines(p1, "Background in Fine Art", "and Design.").line2
                )}
              </div>
            )}

            {/* Right Item 2: p4 (Square/Taller format) */}
            {p4 && (
              <div
                onClick={() => onSelectProject?.(p4)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p4)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[1/1] sm:aspect-[1/1] md:aspect-[4/4.2] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p4.image}
                    alt={p4.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p4.type || "Design",
                  getProjectLines(p4, "Background in Fine Art", "and Design.").line1,
                  getProjectLines(p4, "Background in Fine Art", "and Design.").line2
                )}
              </div>
            )}

            {/* Right Item 3: p6 Character Anim (Bottom Balancer Card) */}
            {p6 && (
              <div
                onClick={() => onSelectProject?.(p6)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p6)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p6.image}
                    alt={p6.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p6.type || "Branding",
                  getProjectLines(p6, "Background in Fine Art", "and Design.").line1,
                  getProjectLines(p6, "Background in Fine Art", "and Design.").line2
                )}
              </div>
            )}

            {/* Right Item 4: p_mono (Landscape) */}
            {p_mono && (
              <div
                onClick={() => onSelectProject?.(p_mono)}
                role="button"
                tabIndex={0}
                data-cursor-project="true"
                data-project-card="true"
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectProject?.(p_mono)}
                className="group cursor-pointer block w-full outline-none focus-visible:ring-2 focus-visible:ring-white transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:aspect-[16/10.5] overflow-hidden rounded-[4px] bg-neutral-900">
                  <img
                    src={p_mono.image}
                    alt={p_mono.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {renderCardMeta(
                  p_mono.type || "Logo Design",
                  getProjectLines(p_mono, "Background in Fine Art", "and Design.").line1,
                  getProjectLines(p_mono, "Background in Fine Art", "and Design.").line2
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
            className="border border-white/40 bg-transparent px-8 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-medium tracking-normal text-white hover:bg-white hover:text-black active:scale-95 transition-all duration-200 cursor-pointer select-none"
          >
            See all Project
          </button>
        </div>

      </div>
    </section>
  );
}
