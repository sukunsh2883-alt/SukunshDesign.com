import React, { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
  { label: "home", href: "#home" },
  { label: "projects", href: "#projects" },
  { label: "ai films", href: "#showreel" },
  { label: "about", href: "#about-me" },
  { label: "contact", href: "#contact" },
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
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoFontFamily = profile?.logoFontFamily || DEFAULT_LOGO_FONT;
  const logoFontStyle = getLogoFontStyle(logoFontFamily);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 120);
      setLastScrollY(currentScrollY);
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
    if ((targetId === "#ai-work" || targetId === "#showreel") && onOpenAIWork) {
      onOpenAIWork();
      return;
    }
    if (targetId === "#full-resume" && onOpenResume) {
      onOpenResume();
      return;
    }

    const element = document.getElementById(targetId.replace("#", ""));
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[150] px-3 pt-3 transition-transform duration-500 ${
        isVisible || mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[24px] border border-white/70 bg-white/[0.78] px-3 py-2 text-neutral-900 shadow-[0_18px_60px_rgba(15,15,15,0.08)] backdrop-blur-2xl md:px-4">
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate("#about-me-modal");
            } else {
              onOpenAboutMe?.();
            }
          }}
          className="group flex items-center gap-3 rounded-[18px] px-2 py-1.5 transition-colors hover:bg-neutral-950/5"
        >
          <span
            className="text-[27px] leading-none text-neutral-900 transition-transform group-hover:scale-[1.02] sm:text-[32px]"
            style={logoFontStyle}
          >
            Sukunsh.
          </span>
        </button>

        <div className="hidden items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50/80 p-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const itemKey = item.href.replace("#", "");
            const isActive = activeSection === itemKey || (item.href === "#showreel" && activeSection === "ai-work");

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative rounded-full px-4 py-2 text-[12px] font-medium tracking-normal transition-colors ${
                  isActive ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_8px_24px_rgba(15,15,15,0.08)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <a
          href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
          className="hidden items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[12px] font-semibold text-white transition-all hover:bg-[#FF6A00] md:inline-flex"
        >
          <span>hire me</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>

        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-3 mt-2 rounded-[24px] border border-neutral-200 bg-white/95 p-4 shadow-[0_22px_70px_rgba(15,15,15,0.12)] backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a
              href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
              className="mt-3 flex items-center justify-between rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
            >
              <span>{profile?.email || "sukunsh2883@gmail.com"}</span>
              <ArrowUpRight className="h-4 w-4 text-[#FF6A00]" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
