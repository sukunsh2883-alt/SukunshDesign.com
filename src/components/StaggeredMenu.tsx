import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import './StaggeredMenu.css';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel?: string;
  link?: string;
  onClick?: () => void;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  logoText?: string;
  onLogoClick?: () => void;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl,
  logoText,
  onLogoClick,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#FF6A00',
  changeMenuColorOnOpen = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerTopRef = useRef<HTMLSpanElement>(null);
  const burgerMidRef = useRef<HTMLSpanElement>(null);
  const burgerBotRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  const textWrapRef = useRef<HTMLSpanElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const burgerAnimRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const bTop = burgerTopRef.current;
      const bMid = burgerMidRef.current;
      const bBot = burgerBotRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !bTop || !bMid || !bBot || !icon || !textInner) return;

      gsap.set(panel, { opacity: 0, y: -10, scale: 0.96, display: 'none', pointerEvents: 'none' });
      gsap.set(bTop, { y: -5, rotate: 0, opacity: 1 });
      gsap.set(bMid, { y: 0, rotate: 0, opacity: 1 });
      gsap.set(bBot, { y: 5, rotate: 0, opacity: 1 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor]);

  const animateBurgerIcon = useCallback((opening: boolean) => {
    const bTop = burgerTopRef.current;
    const bMid = burgerMidRef.current;
    const bBot = burgerBotRef.current;
    if (!bTop || !bMid || !bBot) return;

    burgerAnimRef.current?.kill();
    const tl = gsap.timeline();

    if (opening) {
      tl.to(bMid, { opacity: 0, scaleX: 0, duration: 0.2, ease: 'power2.in' }, 0)
        .to(bTop, { y: 0, rotate: 45, duration: 0.3, ease: 'power3.out' }, 0.05)
        .to(bBot, { y: 0, rotate: -45, duration: 0.3, ease: 'power3.out' }, 0.05);
    } else {
      tl.to([bTop, bBot], { rotate: 0, duration: 0.2, ease: 'power2.in' }, 0)
        .to(bTop, { y: -5, duration: 0.2, ease: 'power3.out' }, 0.1)
        .to(bBot, { y: 5, duration: 0.2, ease: 'power3.out' }, 0.1)
        .to(bMid, { opacity: 1, scaleX: 1, duration: 0.2, ease: 'power2.out' }, 0.1);
    }
    burgerAnimRef.current = tl;
  }, []);

  const animateText = useCallback((opening: boolean) => {
    const textInner = textInnerRef.current;
    if (!textInner) return;
    gsap.to(textInner, {
      yPercent: opening ? -50 : 0,
      duration: 0.3,
      ease: 'power3.out'
    });
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn || !changeMenuColorOnOpen) return;
      const targetColor = opening ? openMenuButtonColor : menuButtonColor;
      gsap.to(btn, { color: targetColor, duration: 0.25 });
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  const openDropdown = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.killTweensOf(panel);
    gsap.set(panel, { display: 'flex', pointerEvents: 'auto' });

    const items = panel.querySelectorAll('.sm-panel-item');
    const socials = panel.querySelector('.sm-socials');

    gsap.fromTo(
      panel,
      { opacity: 0, y: -12, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.4)' }
    );

    if (items.length) {
      gsap.fromTo(
        items,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.04, ease: 'power2.out', delay: 0.04 }
      );
    }

    if (socials) {
      gsap.fromTo(
        socials,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', delay: 0.12 }
      );
    }
  }, []);

  const closeDropdown = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.killTweensOf(panel);
    gsap.to(panel, {
      opacity: 0,
      y: -8,
      scale: 0.96,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(panel, { display: 'none', pointerEvents: 'none' });
      }
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const nextState = !openRef.current;
    openRef.current = nextState;
    setOpen(nextState);

    if (nextState) {
      onMenuOpen?.();
      openDropdown();
    } else {
      onMenuClose?.();
      closeDropdown();
    }

    animateBurgerIcon(nextState);
    animateColor(nextState);
    animateText(nextState);
  }, [openDropdown, closeDropdown, animateBurgerIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      closeDropdown();
      animateBurgerIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [closeDropdown, animateBurgerIcon, animateColor, animateText, onMenuClose]);

  useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div
      ref={menuContainerRef}
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper'}
      style={accentColor ? ({ '--sm-accent': accentColor } as React.CSSProperties) : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div
          className="sm-logo cursor-pointer flex items-center gap-1.5"
          aria-label="Logo"
          onClick={onLogoClick}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="sm-logo-img"
              draggable={false}
              width={110}
              height={24}
            />
          ) : (
            <span className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white select-none">
              Sukunsh<span className="text-[#FF6A00] font-black">.</span>
            </span>
          )}
        </div>

        <div className="relative flex items-center">
          <button
            ref={toggleBtnRef}
            className="sm-toggle flex items-center"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                <span className="sm-toggle-line">Menu</span>
                <span className="sm-toggle-line">Close</span>
              </span>
            </span>
            <span ref={iconRef} className="sm-icon sm-hamburger-icon" aria-hidden="true">
              <span ref={burgerTopRef} className="sm-icon-line sm-burger-top" />
              <span ref={burgerMidRef} className="sm-icon-line sm-burger-mid" />
              <span ref={burgerBotRef} className="sm-icon-line sm-burger-bot" />
            </span>
          </button>

          {/* Compact Floating Dropdown Panel (Non-fullscreen) */}
          <aside
            id="staggered-menu-panel"
            ref={panelRef}
            className="staggered-menu-panel"
            aria-hidden={!open}
          >
            <nav className="sm-panel-inner w-full" aria-label="Quick Navigation">
              <ul className="sm-panel-list w-full" role="list">
                {items && items.length > 0 ? (
                  items.map((it, idx) => (
                    <li className="sm-panel-itemWrap w-full" key={it.label + idx}>
                      <a
                        className="sm-panel-item group flex items-center justify-between w-full px-3.5 py-2.5 rounded-[4px] hover:bg-white/[0.08] active:scale-[0.98] transition-all text-white"
                        href={it.link || '#'}
                        aria-label={it.ariaLabel}
                        onClick={(e) => {
                          if (it.onClick) {
                            e.preventDefault();
                            it.onClick();
                          }
                          closeMenu();
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {displayItemNumbering && (
                            <span className="text-[11px] font-mono text-neutral-400 group-hover:text-[#FF6A00] transition-colors">
                              0{idx + 1}
                            </span>
                          )}
                          <span className="text-[15px] font-medium tracking-tight text-white/90 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                            {it.label}
                          </span>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 group-hover:text-[#FF6A00] transition-all duration-200" />
                      </a>
                    </li>
                  ))
                ) : null}
              </ul>

              {displaySocials && socialItems && socialItems.length > 0 && (
                <div className="sm-socials mt-2.5 pt-2.5 border-t border-white/10 w-full" aria-label="Social links">
                  <div className="flex items-center justify-between gap-1 px-1">
                    {socialItems.map((s, i) => (
                      <a
                        key={s.label + i}
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-neutral-400 hover:text-white hover:underline transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </aside>
        </div>
      </header>
    </div>
  );
};

export default StaggeredMenu;
