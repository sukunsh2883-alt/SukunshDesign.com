import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Subcomponents
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DesignWorks from "./components/DesignWorks";
import Explorations from "./components/Explorations";
import Footer from "./components/Footer";
import Lightbox from "./components/Lightbox";
import AdminPanel from "./components/AdminPanel";
import ProjectCaseStudy from "./components/ProjectCaseStudy";
import ProjectsExplorer from "./components/ProjectsExplorer";
import AIWorkExplorer from "./components/AIWorkExplorer";
import FullResumeModal from "./components/FullResumeModal";
import AboutMeModal from "./components/AboutMeModal";
import AboutMe from "./components/AboutMe";
import Showreel from "./components/Showreel";

// State Engines and Credentials
import {
  aiFilms as initialFilms,
  designProjects as initialDesigns,
  videos as initialVideos,
  explorations as initialExplorations,
  AIFilm,
  DesignProject,
  VideoCard,
  ExplorationItem,
  profile
} from "./portfolioData";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // Dynamic portfolio item states for local uploader simulations with localStorage persistence
  const [profileState, setProfileState] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("portfolio_profile");
      return saved ? JSON.parse(saved) : profile;
    } catch (e) {
      return profile;
    }
  });

  const [films, setFilms] = useState<AIFilm[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_films");
      if (saved) {
        const savedFilms = JSON.parse(saved);
        const savedFilmIds = new Set(savedFilms.map((film: AIFilm) => film.id));
        const missingInitialFilms = initialFilms.filter((film) => !savedFilmIds.has(film.id));

        if (missingInitialFilms.length > 0) {
          return [...missingInitialFilms, ...savedFilms];
        }

        return savedFilms;
      }
      return initialFilms;
    } catch (e) {
      return initialFilms;
    }
  });

  const [designs, setDesigns] = useState<DesignProject[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_designs");
      return saved ? JSON.parse(saved) : initialDesigns;
    } catch (e) {
      return initialDesigns;
    }
  });

  const [videosState, setVideosState] = useState<VideoCard[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_videos");
      if (saved) {
        const savedVideos = JSON.parse(saved);
        const savedVideoIds = new Set(savedVideos.map((video: VideoCard) => video.id));
        const missingInitialVideos = initialVideos.filter((video) => !savedVideoIds.has(video.id));

        if (missingInitialVideos.length > 0) {
          return [...missingInitialVideos, ...savedVideos];
        }

        return savedVideos;
      }
      return initialVideos;
    } catch (e) {
      return initialVideos;
    }
  });

  const [explorationsState, setExplorationsState] = useState<ExplorationItem[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_explorations");
      return saved ? JSON.parse(saved) : initialExplorations;
    } catch (e) {
      return initialExplorations;
    }
  });

  const [selectedDesignProject, setSelectedDesignProject] = useState<DesignProject | null>(null);
  
  // Interactive full portal screen triggers
  const [isProjectsExplorerOpen, setIsProjectsExplorerOpen] = useState(false);
  const [isAIWorkExplorerOpen, setIsAIWorkExplorerOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  const closePortals = () => {
    setIsProjectsExplorerOpen(false);
    setIsAIWorkExplorerOpen(false);
    setIsResumeOpen(false);
    setIsAboutMeOpen(false);
  };

  const openPortal = (portal: "projects" | "ai-work" | "resume" | "about") => {
    closePortals();

    if (portal === "projects") {
      setIsProjectsExplorerOpen(true);
    } else if (portal === "ai-work") {
      setIsAIWorkExplorerOpen(true);
    } else if (portal === "resume") {
      setIsResumeOpen(true);
    } else {
      setIsAboutMeOpen(true);
    }

    window.history.pushState({ portal }, "", `#${portal}`);
  };

  const closePortalWithHistory = () => {
    if (window.history.state?.portal) {
      window.history.back();
      return;
    }
    closePortals();
  };

  useEffect(() => {
    const handlePopState = () => {
      closePortals();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Synchronize state down to localStorage so data persists securely across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem("portfolio_profile", JSON.stringify(profileState));
    } catch (e) {
      console.error("Failed to persist profile state to localStorage", e);
    }
  }, [profileState]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_films", JSON.stringify(films));
    } catch (e) {
      console.error("Failed to persist films state to localStorage", e);
    }
  }, [films]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_designs", JSON.stringify(designs));
    } catch (e) {
      console.error("Failed to persist designs state to localStorage", e);
    }
  }, [designs]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_videos", JSON.stringify(videosState));
    } catch (e) {
      console.error("Failed to persist videos state to localStorage", e);
    }
  }, [videosState]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolio_explorations", JSON.stringify(explorationsState));
    } catch (e) {
      console.error("Failed to persist explorations state to localStorage", e);
    }
  }, [explorationsState]);

  // Lightbox view state managers
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    mediaType: "image" as "image" | "video",
    src: "",
    title: "",
    category: "",
    description: ""
  });

  // Seamless unified portal-to-portal navigation switcher
  const handleNavigate = (targetId: string) => {
    const id = targetId.replace("#", "");

    // Close all active portal view states
    closePortals();

    if (targetId === "#projects") {
      openPortal("projects");
    } else if (targetId === "#ai-work" || targetId === "#showreel") {
      openPortal("ai-work");
    } else if (targetId === "#full-resume") {
      openPortal("resume");
    } else if (targetId === "#about-me-modal") {
      openPortal("about");
    } else {
      // Small delay to allow any transition state to settle, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = id === "home" ? 0 : 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: id === "home" ? 0 : offsetPosition,
            behavior: "smooth"
          });
        }
      }, 50);
    }
  };

  // Track active visual section via scroll listener
  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      const sections = ["home", "projects", "showreel", "about-me", "contact"];
      const triggerY = window.innerHeight * 0.35; // 35% down the screen
      
      let currentSection = "home";
      let closestSection = "home";
      let minDistance = Infinity;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the element spans across the trigger line, it is immediately the active section
          if (rect.top <= triggerY && rect.bottom >= triggerY) {
            setActiveSection(sectionId);
            return;
          }
          // Proximity checkpoint
          const dist = Math.abs(rect.top - triggerY);
          if (dist < minDistance) {
            minDistance = dist;
            closestSection = sectionId;
          }
        }
      }
      setActiveSection(closestSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Call once to initialize
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  // Triggers main showreel lightbox projection
  const handleLaunchShowreel = () => {
    const featuredReel = videosState[0];

    setLightbox({
      isOpen: true,
      mediaType: "video",
      src: featuredReel?.videoUrl || profileState.heroVideoUrl,
      title: featuredReel?.title || "Sukunsh Visual Showreel 2026",
      category: featuredReel?.type || "Creative Reel",
      description: "A concise motion reel showing product ads, AI film studies, kinetic layouts, and cinematic visual direction."
    });
  };

  const handleSelectProject = (project: DesignProject) => {
    if (project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    } else {
      setSelectedDesignProject(project);
    }
  };

  const handleAddFilm = (newFilm: AIFilm) => {
    setFilms((prev) => [newFilm, ...prev]);
  };

  const handleAddDesign = (newDesign: DesignProject) => {
    setDesigns((prev) => [newDesign, ...prev]);
  };

  const handleAddVideo = (newVideo: VideoCard) => {
    setVideosState((prev) => [newVideo, ...prev]);
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 overflow-x-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" profile={profileState} onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header Floating navigation bar */}
            <Navbar 
              profile={profileState}
              activeSection={
                isAboutMeOpen ? "about-me" :
                isResumeOpen ? "full-resume" :
                isAIWorkExplorerOpen ? "ai-work" :
                isProjectsExplorerOpen ? "projects" :
                activeSection
              }
              onNavigate={handleNavigate}
              onOpenProjects={() => handleNavigate("#projects")}
              onOpenAIWork={() => handleNavigate("#ai-work")}
              onOpenResume={() => handleNavigate("#full-resume")}
              onOpenAboutMe={() => handleNavigate("#about-me-modal")}
            />

            {/* Main view container */}
            <main className="flex-grow">
              
              {/* Cinematic hero section */}
              <Hero 
                profile={profileState} 
                onWatchShowreel={handleLaunchShowreel} 
                onOpenProjects={() => openPortal("projects")}
                onOpenAIWork={() => openPortal("ai-work")}
              />

              {/* Selected Design works bento grid */}
              <DesignWorks
                projects={designs}
                onSelectProject={handleSelectProject}
                onOpenExplorer={() => openPortal("projects")}
              />

              {/* Motion reel archive */}
              <Showreel
                videos={videosState}
                films={films}
                onSelectVideo={(video) =>
                  setLightbox({
                    isOpen: true,
                    mediaType: "video",
                    src: video.videoUrl,
                    title: video.title,
                    category: video.type,
                    description: `${video.duration} motion reel / ${video.year}`
                  })
                }
                onSelectFilm={(film) =>
                  setLightbox({
                    isOpen: true,
                    mediaType: "video",
                    src: film.videoUrl,
                    title: film.title,
                    category: film.category,
                    description: film.description
                  })
                }
                onOpenExplorer={() => openPortal("ai-work")}
              />

              {/* Seamless-picture homepage About Me Section */}
              <AboutMe
                profile={profileState}
                onOpenResume={() => openPortal("resume")}
                onOpenAIWork={() => openPortal("ai-work")}
                onOpenProjects={() => openPortal("projects")}
              />

              {/* Parallax elements photo gallery */}
              <Explorations
                explorations={explorationsState}
                onSelectImage={(item) =>
                  setLightbox({
                    isOpen: true,
                    mediaType: "image",
                    src: item.imageUrl,
                    title: item.title,
                    category: "Exploration study",
                    description: "Unreleased art studies and prompt experimentations."
                  })
                }
              />

            </main>

            {/* Marqueed footer section */}
            <Footer profile={profileState} />

            {/* Floating portfolio control admin panel */}
            <AdminPanel
              onAddFilm={handleAddFilm}
              onAddDesign={handleAddDesign}
              onAddVideo={handleAddVideo}
              onAddExploration={(newExp) => setExplorationsState((prev) => [newExp, ...prev])}
              profile={profileState}
              onUpdateProfile={setProfileState}
              designs={designs}
              onUpdateDesigns={setDesigns}
              films={films}
              onUpdateFilms={setFilms}
              videos={videosState}
              onUpdateVideos={setVideosState}
              explorations={explorationsState}
              onUpdateExplorations={setExplorationsState}
            />

            {/* Cinematic media projection lightbox */}
            <Lightbox
              isOpen={lightbox.isOpen}
              mediaType={lightbox.mediaType}
              src={lightbox.src}
              title={lightbox.title}
              category={lightbox.category}
              description={lightbox.description}
              onClose={() =>
                setLightbox((prev) => ({ ...prev, isOpen: false }))
              }
            />

            {/* Interactive Fullscreen Portals */}
            <AnimatePresence>
              {isProjectsExplorerOpen && (
                <ProjectsExplorer
                  isOpen={isProjectsExplorerOpen}
                  onClose={closePortalWithHistory}
                  projects={designs}
                  onSelectProject={handleSelectProject}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAIWorkExplorerOpen && (
                <AIWorkExplorer
                  isOpen={isAIWorkExplorerOpen}
                  onClose={closePortalWithHistory}
                  films={films}
                  videos={videosState}
                  explorations={explorationsState}
                  onSelectFilm={(film) => {
                    setLightbox({
                      isOpen: true,
                      mediaType: "video",
                      src: film.videoUrl,
                      title: film.title,
                      category: film.category,
                      description: film.description
                    });
                  }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isResumeOpen && (
                <FullResumeModal
                  isOpen={isResumeOpen}
                  onClose={closePortalWithHistory}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAboutMeOpen && (
                <AboutMeModal
                  isOpen={isAboutMeOpen}
                  onClose={closePortalWithHistory}
                  profile={profileState}
                />
              )}
            </AnimatePresence>

            {/* Dynamic Fullscreen Case Study Overlay */}
            <AnimatePresence>
              {selectedDesignProject && (
                <ProjectCaseStudy
                  project={designs.find(d => d.id === selectedDesignProject.id) || selectedDesignProject}
                  onClose={() => setSelectedDesignProject(null)}
                  onUpdateProject={(updatedProj) => {
                    setDesigns((prev) => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
