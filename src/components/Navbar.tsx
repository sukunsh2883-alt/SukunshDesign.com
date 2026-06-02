import React, { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DEFAULT_LOGO_FONT, getLogoFontStyle } from "../localFonts";

interface NavbarProps {
  activeSection: string;
  profile?: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
  onOpenResume?: () => void;
  onOpenAboutMe?: () => void;
  onNavigate?: (targetId: string) => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "AI Films", href: "#showreel" },
  { label: "About Me", href: "#about-me" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({
  activeSection,
  profile,
  onOpenProjects,
  onOpenAIWork,
  onOpenResume,
  onOpenAboutMe,
  onNavigate,
}: NavbarProps) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoFontFamily = profile?.logoFontFamily || DEFAULT_LOGO_FONT;
  const logoFontStyle = getLogoFontStyle(logoFontFamily);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and past 100px, hide. Else if scrolling up, show.
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (onNavigate) {
      onNavigate(targetId);
      return;
    }

    if (targetId === "#projects" && onOpenProjects) {
      onOpenProjects();
      return;
    }
    if (targetId === "#ai-work" && onOpenAIWork) {
      onOpenAIWork();
      return;
    }
    if (targetId === "#full-resume" && onOpenResume) {
      onOpenResume();
      return;
    }

    const element = document.getElementById(targetId.replace("#", ""));
    if (element) {
      const offset = 80; // Offset for navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const isDark = activeSection === "home" || activeSection === "ai-work";

  return (
    <header className={`fixed top-0 left-0 right-0 z-[150] w-full pointer-events-none transition-transform duration-500 ease-in-out ${
      isVisible || mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
    }`}>
      <nav
        className={`flex items-center justify-between w-full px-6 md:px-12 py-3.5 transition-all duration-300 rounded-none border-b pointer-events-auto ${
          isDark
            ? "bg-neutral-950/70 border-white/10 text-white shadow-none"
            : "bg-white/70 border-neutral-250 text-neutral-900 shadow-none"
        }`}
      >
        {/* Brand Logo - Navigates to About Me */}
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate("#about-me-modal");
            } else {
              onOpenAboutMe?.();
            }
          }}
          className={`flex items-center justify-center px-3 py-1.5 rounded-xl select-none group transition-all duration-300 border border-transparent backdrop-blur-md cursor-pointer bg-transparent outline-none pointer-events-auto ${
            isDark
              ? "hover:bg-white/15 hover:border-white/10"
              : "hover:bg-neutral-950/5 hover:border-neutral-950/5"
          }`}
        >
          <span
            className={`text-2xl font-normal leading-none transition-colors sm:text-[30px] origin-left ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
            style={logoFontStyle}
          >
            Sukunsh.
          </span>
        </button>

        {/* Desktop Web Nav Items */}
        <div className="hidden md:flex items-center gap-1.5 pointer-events-auto">
          {NAV_ITEMS.map((item) => {
            const itemKey = item.href.replace("#", "");
            const isActive = activeSection === itemKey || (item.href === "#showreel" && activeSection === "ai-work");
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-2 text-xs font-sans uppercase tracking-widest transition-all duration-300 rounded-xl border border-transparent ${
                  isActive
                    ? isDark
                      ? "text-white font-bold"
                      : "text-neutral-950 font-bold"
                    : isDark
                      ? "text-neutral-400 hover:text-white hover:bg-white/10"
                      : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-950/5"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activePill"
                    className={`absolute inset-0 border rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${
                      isDark
                        ? "bg-white/15 border-white/15"
                        : "bg-neutral-950/10 border-neutral-950/5"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              isDark
                ? "bg-neutral-900/80 border-neutral-800 text-white hover:bg-neutral-800"
                : "bg-white/80 border-neutral-200 text-neutral-800 hover:bg-neutral-100"
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Animated Dropdown Menu with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute top-20 left-4 right-4 border rounded-3xl p-6 shadow-xl flex flex-col gap-4 md:hidden backdrop-blur-xl ${
              isDark
                ? "bg-neutral-950/95 border-white/10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                : "bg-white/95 border-neutral-250 text-neutral-900 shadow-md"
            }`}
          >
            <div className="flex flex-col gap-3">
              <span className={`text-[10px] font-sans uppercase tracking-[0.2em] mb-1 ${
                isDark ? "text-neutral-400" : "text-neutral-500"
              }`}>
                Navigation
              </span>
              {NAV_ITEMS.map((item) => {
                const itemKey = item.href.replace("#", "");
                const isActive = activeSection === itemKey || (item.href === "#showreel" && activeSection === "ai-work");
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`py-2 text-sm font-sans uppercase tracking-wider transition-all ${
                      isActive
                        ? isDark
                          ? "text-[#FF6A00] font-bold pl-2 border-l-2 border-[#FF6A00]"
                          : "text-[#FF6A00] font-bold pl-2 border-l-2 border-[#FF6A00]"
                        : isDark
                          ? "text-neutral-400 hover:text-white pl-0"
                          : "text-neutral-500 hover:text-neutral-950 pl-0"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className={`h-[1px] my-1 ${isDark ? "bg-white/10" : "bg-neutral-200/60"}`} />

            <div className="flex justify-between items-center pt-2">
              <div className="flex flex-col">
                <span className={`text-[10px] uppercase font-sans tracking-widest ${
                  isDark ? "text-neutral-400" : "text-neutral-500"
                }`}>
                  Get In Touch
                </span>
                <span className={`text-xs font-mono mt-1 ${isDark ? "text-neutral-200" : "text-neutral-750"}`}>
                  sukunsh2883@gmail.com
                </span>
              </div>
              <a
                href="mailto:sukunsh2883@gmail.com"
                className="p-3 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF8A00] text-white overflow-hidden shadow-md"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
