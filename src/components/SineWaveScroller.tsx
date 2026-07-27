import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import ShapeGrid from "./ShapeGrid";

gsap.registerPlugin(ScrollTrigger);

interface SineSign {
  heading: string;
  badge: string;
  color: string;
  textColor: string;
}

const SIGN_ITEMS: Record<number, SineSign> = {
  0: {
    heading: "AI Cinema Reels.",
    badge: "GEN-3",
    color: "hsla(212.98, 77.756%, 46.913%, 1)",
    textColor: "#ffffff",
  },
  4: {
    heading: "Generative Motion.",
    badge: "SORA",
    color: "hsla(19.761, 99.947%, 54.542%, 1)",
    textColor: "#ffffff",
  },
  8: {
    heading: "Neural Synthesis.",
    badge: "LUMA",
    color: "hsla(100.98, 48.275%, 50.565%, 1)",
    textColor: "#ffffff",
  },
  12: {
    heading: "Kinetic Visions.",
    badge: "PIKA",
    color: "hsla(47.743, 97.954%, 52.297%, 1)",
    textColor: "#000000",
  },
};

const REEL_IMAGES = [
  "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_44_cmxx0z.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_41_knefoc.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056274/image_36_hyojxm.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_37_mqlouw.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_34_xopufv.png",
  "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_35_st0j6w.png",
  "https://i.pinimg.com/736x/1a/3a/5a/1a3a5a4aa505042bcf531eb8b1b204e7.jpg",
  "https://i.pinimg.com/736x/11/6e/98/116e9875f720a25a50c4aac456f50bdd.jpg",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
];

interface SineWaveScrollerProps {
  count?: number;
  amplitude?: number;
  frequency?: number;
  onSelectProject?: (item: any) => void;
}

export default function SineWaveScroller({
  count = 16,
  amplitude = 150,
  frequency = 2.6,
  onSelectProject,
}: SineWaveScrollerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=280%", // Pin length ensuring complete smooth traversal of all cards
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1.0,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Build items array + add final "X / Let's Connect" card at the end
  const items = Array.from({ length: count }, (_, i) => {
    const sign = SIGN_ITEMS[i];
    const image = REEL_IMAGES[i % REEL_IMAGES.length];
    return { id: i, isConnectCard: false, sign, image };
  });

  // Append the final X / Let's Connect card
  items.push({
    id: count,
    isConnectCard: true,
    sign: undefined,
    image: "",
  });

  // Minimum gap between 9:16 cards so they sit side-by-side in a tight, fluid wavy ribbon
  const cardSpacing = 166;
  const totalCards = items.length;

  return (
    <div
      ref={containerRef}
      className="sine-wave-scroller-container relative w-full h-screen bg-black text-white select-none border-t border-neutral-900 overflow-hidden"
    >
      {/* Moving ShapeGrid Background on Dark Canvas */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-auto">
        <ShapeGrid
          direction="diagonal"
          speed={0.35}
          squareSize={44}
          borderColor="rgba(255, 255, 255, 0.08)"
          hoverFillColor="rgba(255, 255, 255, 0.1)"
          shape="square"
        />
      </div>

      {/* Viewport Stage */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center pointer-events-none z-10">
        
        {/* Floating Sine Wave Items Track */}
        <div
          ref={trackRef}
          className="absolute inset-0 pointer-events-auto flex items-center justify-center overflow-hidden"
        >
          {items.map((item, index) => {
            // Horizontal calculation: enter right, travel seamlessly across wave, exit left
            const windowW = typeof window !== "undefined" ? window.innerWidth : 1200;
            const cardWidth = 160;
            
            // Total travel distance across the entire viewport from offscreen-right to offscreen-left
            const totalTravel = (totalCards * cardSpacing) + windowW + 250;
            const startX = windowW + 120 + index * cardSpacing;
            const xPos = startX - (scrollProgress * totalTravel);

            // Dynamic multi-harmonic G/S-wave calculation for fluid undulating motion
            const phase = index * 0.54;
            const waveOffset = scrollProgress * frequency * Math.PI * 2;
            const primaryWave = Math.sin(phase + waveOffset) * amplitude;
            const harmonicWave = Math.cos((phase * 1.4) + (waveOffset * 1.1)) * (amplitude * 0.35);
            const yPos = primaryWave + harmonicWave;

            // Only render when near or inside viewport bounds (no abrupt popping or vanishing)
            const isVisible = xPos > -cardWidth * 2.5 && xPos < windowW + cardWidth * 2.5;

            if (!isVisible) return null;

            return (
              <div
                key={item.id}
                onClick={() => onSelectProject?.(item)}
                className={`absolute w-[145px] sm:w-[160px] aspect-[9/16] rounded-2xl overflow-hidden border backdrop-blur-md transition-all duration-100 cursor-pointer group ${
                  item.isConnectCard
                    ? "border-white/40 bg-neutral-950/95 hover:border-white hover:scale-105"
                    : "border-white/20 bg-neutral-950/90 hover:border-white/60"
                }`}
                style={{
                  transform: `translate3d(${xPos - cardWidth / 2}px, ${yPos}px, 0)`,
                  opacity: 1, // Full 100% opacity throughout - no fade/disappearing mid-screen
                  zIndex: item.isConnectCard ? 150 : 100,
                }}
              >
                {item.isConnectCard ? (
                  /* Special "X - Let's Connect" End Card */
                  <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-neutral-900 via-black to-neutral-950 text-white relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                        CONNECT
                      </span>
                      {/* X Logo / Icon */}
                      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
                        𝕏
                      </div>
                    </div>

                    <div className="my-auto py-2">
                      <h2 className="text-lg sm:text-xl font-black tracking-tight leading-none text-white font-sans mb-2">
                        LET'S <br />
                        <span className="text-neutral-200">CONNECT.</span>
                      </h2>
                      <p className="text-[10px] font-mono text-neutral-400 leading-tight">
                        Send a message on X.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-neutral-300 group-hover:text-white transition-colors">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Message
                      </span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                ) : item.sign ? (
                  /* Typographic Sign Card (9:16 Reel Format) */
                  <div
                    className="w-full h-full p-4 flex flex-col justify-between border border-white/10 transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: "#080808", color: "#ffffff" }}
                  >
                    <div>
                      <h2 className="text-sm sm:text-base font-bold tracking-tight leading-tight font-sans">
                        {item.sign.heading}
                      </h2>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                        {item.sign.badge}
                      </span>
                      <div className="flex gap-1 font-mono text-xs font-bold">
                        {item.sign.badge.split("").map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px]"
                            style={{
                              backgroundColor: item.sign.color,
                              color: item.sign.textColor,
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Clean AI 9:16 Video Reel Card (No text overlay) */
                  <div className="w-full h-full relative overflow-hidden group/img">
                    <img
                      src={item.image}
                      alt={`AI Reel ${index}`}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/img:opacity-20 transition-opacity" />
                    
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-black/40 border border-white/30 backdrop-blur-sm flex items-center justify-center group-hover/img:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


