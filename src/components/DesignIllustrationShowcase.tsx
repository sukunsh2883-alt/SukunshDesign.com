import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface DesignIllustrationShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreatorStudio?: () => void;
  projects?: any[];
  onSelectProject?: (proj: any) => void;
  onAddDesign?: (proj: any) => void;
}

// Exactly the user's artwork showcase images in seamless sequence
const SHOWCASE_IMAGES: string[] = [
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216479/MacBook_Pro_16__-_2_blrh5x.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216478/MacBook_Pro_16__-_3_kgldoh.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216479/MacBook_Pro_16__-_4_a6fb8w.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216479/MacBook_Pro_16__-_5_eqbzcs.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216479/MacBook_Pro_16__-_6_hzk4ov.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216479/MacBook_Pro_16__-_7_jklgij.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216481/MacBook_Pro_16__-_8_fnzrwj.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216481/MacBook_Pro_16__-_13_dzwa3e.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216481/MacBook_Pro_16__-_16_gop309.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300044/Slide_16_9_-_29_nwaotj.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216481/MacBook_Pro_16__-_11_lwzl3p.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216481/MacBook_Pro_16__-_19_syziya.png",
];

export default function DesignIllustrationShowcase({
  isOpen,
  onClose,
}: DesignIllustrationShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Keyboard shortcut: Escape to exit
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize smooth Lenis + GSAP animation
  useEffect(() => {
    if (!isOpen) return;

    // Reset scroll position on opening
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const wrapper = containerRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    // GSAP ScrollTrigger smooth image reveals without lines or borders
    const ctx = gsap.context(() => {
      const items = content.querySelectorAll<HTMLElement>(".showcase-img-block");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.88, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              scroller: wrapper,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, content);

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="design-showcase-screen"
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="fixed inset-0 z-50 overflow-y-auto bg-white p-0 m-0 border-0 outline-0 scroll-smooth selection:bg-neutral-200"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Only control: Minimal floating Back Button */}
        <button
          id="showcase-back-btn"
          onClick={onClose}
          className="fixed top-5 left-5 sm:top-7 sm:left-7 z-[60] flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-neutral-900 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer font-mono text-xs uppercase tracking-wider select-none"
          aria-label="Back to Portfolio"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Seamless Smooth Scroll Artwork Stream with Pure White Background & No Borders/Lines */}
        <main
          ref={contentRef}
          className="w-full bg-white flex flex-col items-center p-0 m-0 border-0 outline-0 leading-none"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center p-0 m-0 border-0 outline-0 leading-none">
            {SHOWCASE_IMAGES.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="showcase-img-block w-full flex justify-center bg-white p-0 m-0 border-0 outline-0 leading-none"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-auto block m-0 p-0 border-0 outline-0 shadow-none select-none align-bottom"
                  loading={index < 2 ? "eager" : "lazy"}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
