import React from "react";

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
  { label: "Hire me", href: "#contact" },
];

export default function Navbar({ profile, onNavigate, onOpenProjects, onOpenAIWork }: NavbarProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (onNavigate) {
      onNavigate(href);
      return;
    }

    if (href === "#projects" && onOpenProjects) {
      onOpenProjects();
      return;
    }

    if (href === "#showreel" && onOpenAIWork) {
      onOpenAIWork();
      return;
    }

    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[150] bg-[#080808] text-white">
      <nav className="mx-auto flex h-9 max-w-5xl items-center justify-between border-b border-white/10 px-3 text-[9px] md:h-11 md:px-4 md:text-[11px]">
        <button
          onClick={() => onNavigate?.("#about-me-modal")}
          className="font-semibold tracking-tight text-white"
        >
          {profile?.brandName || "Sukunsh"}.
        </button>

        <div className="flex items-center gap-2 text-white/70 md:gap-3">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="transition-colors hover:text-white"
            >
              {item.label}
              {index < NAV_ITEMS.length - 1 && <span className="ml-2 text-white/25 md:ml-3">|</span>}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
