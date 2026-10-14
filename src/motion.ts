import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

// Register all GSAP plugins once in this single source of truth
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin);

export { gsap, ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin };

/* ==========================================================================
   MOTION TOKENS
   Quiet, precise, rectilinear motion system for high-end studio portfolio.
   ========================================================================== */
export const MOTION_TOKENS = {
  ease: {
    out: "expo.out",
    inOut: "power3.inOut",
    soft: "power2.out",
    frame: "power4.inOut",
  },
  duration: {
    fast: 0.35,
    normal: 0.9,
    slow: 1.3,
    frame: 1.6,
  },
  stagger: {
    text: 0.08,
    item: 0.06,
  },
  scroll: {
    start: "top 85%",
    once: true,
  },
} as const;

/**
 * Checks if user prefers reduced motion
 */
export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 1. lineReveal(el): SplitText by lines with mask, revealed with yPercent: 110
 */
export function lineReveal(el: HTMLElement | null, delay = 0) {
  if (!el || isReducedMotion()) return null;

  try {
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.0,
          ease: MOTION_TOKENS.ease.out,
          stagger: MOTION_TOKENS.stagger.text,
          delay,
          scrollTrigger: {
            trigger: el,
            start: MOTION_TOKENS.scroll.start,
            once: true,
          },
        });
      },
    });
    return split;
  } catch (err) {
    console.warn("[Motion] SplitText fallback:", err);
    gsap.fromTo(
      el,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: MOTION_TOKENS.ease.out,
        scrollTrigger: { trigger: el, start: MOTION_TOKENS.scroll.start, once: true },
      }
    );
    return null;
  }
}

/**
 * 2. frameReveal(frame): overflow-hidden rectangular reveal
 * clip-path inset(100% 0 0 0) to inset(0) in 1.3s power4.inOut,
 * with inner media scaling 1.2 to 1 in 1.6s expo.out.
 */
export function frameReveal(frame: HTMLElement | null, delay = 0) {
  if (!frame) return null;

  if (isReducedMotion()) {
    gsap.set(frame, { clipPath: "inset(0%)", opacity: 1 });
    return null;
  }

  const innerMedia = frame.querySelector<HTMLElement>("img, video, [data-motion='media']");

  gsap.set(frame, { clipPath: "inset(100% 0 0 0)", opacity: 1, overflow: "hidden" });
  if (innerMedia) {
    gsap.set(innerMedia, { scale: 1.2, transformOrigin: "center center" });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: frame,
      start: "top 85%",
      once: true,
    },
    delay,
  });

  tl.to(frame, {
    clipPath: "inset(0% 0 0 0)",
    duration: MOTION_TOKENS.duration.slow,
    ease: MOTION_TOKENS.ease.frame,
  }, 0);

  if (innerMedia) {
    tl.to(
      innerMedia,
      {
        scale: 1,
        duration: MOTION_TOKENS.duration.frame,
        ease: MOTION_TOKENS.ease.out,
      },
      0
    );
  }

  return tl;
}

/**
 * 3. fadeUp(els): y 20 and autoAlpha 0 to 1, 0.9s power3.out, batched with ScrollTrigger.batch
 */
export function fadeUp(targets: string | Element[] | NodeListOf<Element>, trigger?: Element) {
  if (isReducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }

  if (typeof targets === "string" || Array.isArray(targets) || targets instanceof NodeList) {
    ScrollTrigger.batch(targets, {
      start: MOTION_TOKENS.scroll.start,
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: MOTION_TOKENS.duration.normal,
            ease: MOTION_TOKENS.ease.soft,
            stagger: MOTION_TOKENS.stagger.item,
            overwrite: "auto",
          }
        );
      },
    });
  }
}

/**
 * 4. drawLine(line): scaleX 0 to 1 from the left, 1.2s expo.inOut
 */
export function drawLine(line: HTMLElement | null, delay = 0) {
  if (!line) return null;

  if (isReducedMotion()) {
    gsap.set(line, { scaleX: 1, opacity: 1 });
    return null;
  }

  gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

  return gsap.to(line, {
    scaleX: 1,
    duration: 1.2,
    ease: "expo.inOut",
    delay,
    scrollTrigger: {
      trigger: line,
      start: "top 90%",
      once: true,
    },
  });
}

/**
 * 5. parallax(media): yPercent -6 to 6 with scrub, desktop only and not under reduced motion
 */
export function parallax(media: HTMLElement | null, triggerEl?: HTMLElement | null) {
  if (!media || isReducedMotion() || typeof window === "undefined" || window.innerWidth < 1024) {
    return null;
  }

  // Slightly oversize media so there are no edge gaps
  gsap.set(media, { scale: 1.08 });

  return gsap.fromTo(
    media,
    { yPercent: -6 },
    {
      yPercent: 6,
      ease: "none",
      scrollTrigger: {
        trigger: triggerEl || media,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}

/**
 * 6. setupTextRoll(buttonOrLink): label slides up while duplicate slides in on hover (pointer: fine only)
 */
export function setupTextRoll(element: HTMLElement | null) {
  if (!element || typeof window === "undefined") return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const originalText = element.getAttribute("data-text-roll") || element.textContent?.trim() || "";
  if (!originalText) return;

  element.classList.add("overflow-hidden", "relative", "inline-flex");
}
