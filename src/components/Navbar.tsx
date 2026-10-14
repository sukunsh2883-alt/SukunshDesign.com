import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  const headerRef = useRef<HTMLElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const header = headerRef.current;
    const progressLine = progressLineRef.current;
    if (!header || !progressLine) return;

    // 1. Thin scroll-progress hairline (scaleX, scrubbed from 0 to 1)
    gsap.set(progressLine, { scaleX: 0, transformOrigin: "left center" });
    const progressTrigger = ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        gsap.to(progressLine, {
          scaleX: self.progress,
          duration: 0.1,
          ease: "none",
          overwrite: "auto",
        });
      },
    });

    // 2. Header hides on scroll down and returns on scroll up (0.5s power3.out)
    let lastScroll = 0;
    const scrollTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const currentScroll = self.scroll();
        if (currentScroll > lastScroll && currentScroll > 80) {
          // Scrolling down - hide header
          gsap.to(header, {
            yPercent: -100,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else if (currentScroll < lastScroll) {
          // Scrolling up - show header
          gsap.to(header, {
            yPercent: 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
        lastScroll = currentScroll;
      },
    });

    return () => {
      progressTrigger.kill();
      scrollTrigger.kill();
    };
  }, []);

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
      label: "About",
      ariaLabel: "About Sukunsh",
      link: "#about",
      onClick: () => handleNavClick("#about"),
    },
    {
      label: "Project",
      ariaLabel: "Open design projects explorer",
      link: "#projects",
      onClick: () => handleNavClick("#projects"),
    },
    {
      label: "Contact",
      ariaLabel: "Get in touch via email",
      link: `mailto:${profile?.email || "sukunsh2883@gmail.com"}`,
      onClick: () => {
        window.location.href = `mailto:${profile?.email || "sukunsh2883@gmail.com"}`;
      },
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
      label: "GitHub",
      link: profile?.github || "https://github.com/surajsharma",
    },
    {
      label: "Email",
      link: `mailto:${profile?.email || "Sukunsh2883@gmail.com"}`,
    },
  ];

  return (
    <header
      ref={headerRef}
      className="navbar fixed inset-x-0 top-0 z-[150] pointer-events-none will-change-transform"
    >
      {/* Thin scroll-progress hairline (scaleX, scrubbed) */}
      <div
        ref={progressLineRef}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#3B4DF7] z-[160] origin-left pointer-events-none"
      />

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
    </header>
  );
}

