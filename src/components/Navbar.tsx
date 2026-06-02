import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  { label: "work", href: "#projects" },
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
  const logoFontStyle = getLogoFontStyle(profile?.logoFontFamily || DEFAULT_LOGO_FONT);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 80);
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
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - 72,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-[150] bg-[#fbfbf8]/92 backdrop-blur-md transition-transform duration-300 ${
      isVisible || mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
    }`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between border-b border-neutral-200 px-4 md:px-6">
        <button
          onClick={() => {
            if (onNavigate) onNavigate("#about-me-modal");
            else onOpenAboutMe?.();
          }}
          className="text-left"
        >
          <span className="text-[28px] leading-none text-neutral-950" style={logoFontStyle}>
            Sukunsh.
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const itemKey = item.href.replace("#", "");
            const isActive = activeSection === itemKey || (item.href === "#showreel" && activeSection === "ai-work");

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`border-b py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[#FF6A00] text-neutral-950"
                    : "border-transparent text-neutral-500 hover:text-neutral-950"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <a
          href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
          className="hidden border border-neutral-950 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white md:block"
        >
          hire me
        </a>

        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="border border-neutral-250 p-2 text-neutral-950 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-[#fbfbf8] px-4 py-4 md:hidden">
          <div className="grid gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="border-b border-neutral-100 py-3 text-sm font-medium text-neutral-700"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
