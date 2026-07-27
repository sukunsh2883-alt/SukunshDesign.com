import React from "react";
import StaggeredMenu from "./StaggeredMenu";

interface NavbarProps {
  activeSection: string;
  profile?: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
  onOpenResume?: () => void;
  onOpenAboutMe?: () => void;
  onOpenGitHub?: () => void;
  onNavigate?: (targetId: string) => void;
}

export default function Navbar({
  profile,
  onNavigate,
  onOpenProjects,
  onOpenAIWork,
  onOpenGitHub,
}: NavbarProps) {
  const handleNavClick = (href: string) => {
    if (href === "#projects" && onOpenProjects) {
      onOpenProjects();
      return;
    }

    if (href === "#showreel" && onOpenAIWork) {
      onOpenAIWork();
      return;
    }

    if (href === "#github" && onOpenGitHub) {
      onOpenGitHub();
      return;
    }

    if (onNavigate) {
      onNavigate(href);
      return;
    }

    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  const menuItems = [
    {
      label: "Home",
      ariaLabel: "Go to home section",
      link: "#home",
      onClick: () => handleNavClick("#home"),
    },
    {
      label: "Showcase",
      ariaLabel: "View interactive showcase",
      link: "#scroll-demo",
      onClick: () => handleNavClick("#scroll-demo"),
    },
    {
      label: "Design Projects",
      ariaLabel: "Open design projects explorer",
      link: "#projects",
      onClick: () => handleNavClick("#projects"),
    },
    {
      label: "AI Short Films",
      ariaLabel: "Open AI work explorer",
      link: "#showreel",
      onClick: () => handleNavClick("#showreel"),
    },
    {
      label: "GitHub Code",
      ariaLabel: "Open GitHub repository explorer",
      link: "#github",
      onClick: () => handleNavClick("#github"),
    },
    {
      label: "About Me",
      ariaLabel: "About Sukunsh",
      link: "#about",
      onClick: () => handleNavClick("#about"),
    },
    {
      label: "Hire me",
      ariaLabel: "Go to contact section",
      link: "#contact",
      onClick: () => handleNavClick("#contact"),
    },
  ];

  const socialItems = [
    {
      label: "LinkedIn",
      link: profile?.linkedin || "https://www.linkedin.com/in/sukunsh",
    },
    {
      label: "Behance",
      link: profile?.behance || "https://www.behance.net/sukunshsharma",
    },
    {
      label: "Email",
      link: `mailto:${profile?.email || "Sukunsh2883@gmail.com"}`,
    },
  ];

  return (
    <div className="navbar fixed inset-x-0 top-0 z-[150] pointer-events-none">
      <StaggeredMenu
        position="right"
        isFixed={true}
        logoText={`${profile?.brandName || "Sukunsh"}.`}
        onLogoClick={() => handleNavClick("#home")}
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen={true}
        colors={["#0c0c0e", "#18181b", "#27272a"]}
        accentColor="#f97316"
      />
    </div>
  );
}

