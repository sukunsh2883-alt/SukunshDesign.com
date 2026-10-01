import { motion } from "motion/react";

interface CreativeLoadingArtworkProps {
  progress: number;
  isExiting: boolean;
}

export default function CreativeLoadingArtwork({ progress, isExiting }: CreativeLoadingArtworkProps) {
  // Staggered pop-up items inspired directly by the user's uploaded SVG
  const items = [
    {
      id: "white-flower",
      name: "White Flower",
      delay: 0.15,
      className: "absolute top-[28%] left-[16%] sm:left-[22%] w-12 h-12 sm:w-16 sm:h-16 -rotate-12",
      render: () => (
        <svg viewBox="0 0 90 90" className="w-full h-full drop-shadow-md">
          {/* 6 White Petals */}
          <g fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1">
            <ellipse cx="45" cy="20" rx="11" ry="18" />
            <ellipse cx="45" cy="70" rx="11" ry="18" />
            <ellipse cx="20" cy="45" rx="18" ry="11" />
            <ellipse cx="70" cy="45" rx="18" ry="11" />
            <ellipse cx="27" cy="27" rx="12" ry="17" transform="rotate(-45 27 27)" />
            <ellipse cx="63" cy="63" rx="12" ry="17" transform="rotate(-45 63 63)" />
            <ellipse cx="63" cy="27" rx="12" ry="17" transform="rotate(45 63 27)" />
            <ellipse cx="27" cy="63" rx="12" ry="17" transform="rotate(45 27 63)" />
          </g>
          {/* Orange-Red Center */}
          <circle cx="45" cy="45" r="10" fill="#EA580C" />
          <circle cx="45" cy="45" r="5" fill="#FDBA74" />
        </svg>
      ),
    },
    {
      id: "red-flower",
      name: "Red-Orange Flower",
      delay: 0.35,
      className: "absolute top-[10%] left-[40%] sm:left-[43%] w-14 h-14 sm:w-18 sm:h-18 rotate-12",
      render: () => (
        <svg viewBox="0 0 90 90" className="w-full h-full drop-shadow-md">
          {/* 6 Rounded Petals in vibrant Terracotta / Red-Orange */}
          <g fill="#D95027">
            <circle cx="45" cy="22" r="16" />
            <circle cx="65" cy="33" r="16" />
            <circle cx="65" cy="57" r="16" />
            <circle cx="45" cy="68" r="16" />
            <circle cx="25" cy="57" r="16" />
            <circle cx="25" cy="33" r="16" />
            <circle cx="45" cy="45" r="18" />
          </g>
          {/* Cream & Yellow Center */}
          <circle cx="45" cy="45" r="10" fill="#FFEDD4" />
          <circle cx="45" cy="45" r="5" fill="#FABD42" />
        </svg>
      ),
    },
    {
      id: "stylus-pen",
      name: "Drawing Stylus",
      delay: 0.55,
      className: "absolute top-[10%] right-[10%] sm:right-[18%] w-36 sm:w-48 h-10 rotate-[28deg] origin-center",
      render: () => (
        <svg viewBox="0 0 200 40" className="w-full h-full drop-shadow-md">
          {/* Pen Body: Matte Black Cylinder */}
          <path
            d="M 30 14 L 180 14 Q 192 14 192 20 Q 192 26 180 26 L 30 26 Z"
            fill="#1E2024"
          />
          {/* Tapered Nib Grip */}
          <path
            d="M 30 14 L 12 18 L 8 20 L 12 22 L 30 26 Z"
            fill="#121316"
          />
          {/* Pen Tip Point */}
          <polygon points="8,20 2,20 8,19" fill="#FFFFFF" />
          {/* Iconic Red Accent Ring */}
          <rect x="42" y="14" width="7" height="12" rx="1" fill="#DC2626" />
          {/* Stylus Rocker Buttons */}
          <rect x="75" y="16" width="28" height="8" rx="3" fill="#2E3238" />
          <line x1="89" y1="16" x2="89" y2="24" stroke="#121316" strokeWidth="1" />
          {/* Subtle Pen Highlight Streak */}
          <line x1="56" y1="17" x2="175" y2="17" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: "yellow-flower",
      name: "Yellow Flower",
      delay: 0.75,
      className: "absolute top-[38%] left-[44%] sm:left-[47%] w-14 h-14 sm:w-18 sm:h-18 rotate-6",
      render: () => (
        <svg viewBox="0 0 90 90" className="w-full h-full drop-shadow-md">
          {/* 8 Golden-Yellow Petals */}
          <g fill="#FABD42">
            <ellipse cx="45" cy="20" rx="10" ry="16" />
            <ellipse cx="45" cy="70" rx="10" ry="16" />
            <ellipse cx="20" cy="45" rx="16" ry="10" />
            <ellipse cx="70" cy="45" rx="16" ry="10" />
            <ellipse cx="27" cy="27" rx="11" ry="15" transform="rotate(-45 27 27)" />
            <ellipse cx="63" cy="63" rx="11" ry="15" transform="rotate(-45 63 63)" />
            <ellipse cx="63" cy="27" rx="11" ry="15" transform="rotate(45 63 27)" />
            <ellipse cx="27" cy="63" rx="11" ry="15" transform="rotate(45 27 63)" />
          </g>
          {/* Center Red/Orange Core */}
          <circle cx="45" cy="45" r="11" fill="#D95027" />
          <circle cx="45" cy="45" r="5" fill="#FABD42" />
        </svg>
      ),
    },
    {
      id: "ipad",
      name: "Apple iPad Tablet",
      delay: 0.95,
      className: "absolute bottom-[10%] left-[22%] sm:left-[28%] w-20 sm:w-26 h-28 sm:h-34 -rotate-[36deg] origin-center",
      render: () => (
        <svg viewBox="0 0 110 148" className="w-full h-full drop-shadow-lg">
          {/* iPad Metallic Aluminum Body */}
          <rect
            x="2"
            y="2"
            width="106"
            height="144"
            rx="12"
            ry="12"
            fill="#CBD0D6"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* Camera Module at top-left */}
          <rect x="8" y="8" width="20" height="20" rx="4" fill="#9BA3AF" />
          <circle cx="18" cy="18" r="6" fill="#1E293B" />
          <circle cx="18" cy="18" r="3" fill="#0F172A" />
          <circle cx="19.5" cy="16.5" r="1.5" fill="#93C5FD" opacity="0.6" />

          {/* Minimal Apple Logo in center */}
          <g transform="translate(43, 62) scale(1.1)" fill="#1E293B">
            <path d="M12.4 8.5c0-2.3 1.9-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.6.8-.7 0-1.9-.8-3.1-.8C2.7 3.1 1.2 4 0.4 5.4c-1.6 2.8-.4 7 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.6 1.3-2.7-.1-.1-2.3-.9-2.3-3.5z" />
            <path d="M9.8 2.2C10.4 1.5 10.8.5 10.7 0c-.9.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.1 1 .1 1.9-.5 2.5-1.2z" />
          </g>
        </svg>
      ),
    },
    {
      id: "pentab",
      name: "Graphic Pentab Tablet",
      delay: 1.15,
      className: "absolute bottom-[4%] right-[10%] sm:right-[15%] w-36 sm:w-52 h-26 sm:h-38 -rotate-[22deg] origin-center",
      render: () => (
        <div className="w-full h-full relative drop-shadow-xl">
          {/* High-fidelity Pentab graphic */}
          <svg viewBox="0 0 200 145" className="w-full h-full">
            {/* Tablet Chassis */}
            <rect x="2" y="2" width="196" height="141" rx="14" ry="14" fill="#202226" stroke="#333842" strokeWidth="2" />
            {/* Active Drawing Screen */}
            <rect x="14" y="14" width="140" height="117" rx="6" ry="6" fill="#121316" stroke="#2B2F38" strokeWidth="1" />
            {/* Red Control Ring Dial */}
            <g transform="translate(172, 72.5)">
              <circle cx="0" cy="0" r="14" fill="#1E2025" stroke="#DC2626" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="7" fill="#121316" />
            </g>
            {/* Express Keys on Right Bezel */}
            <g fill="#2D313A">
              <rect x="165" y="26" width="14" height="6" rx="2" />
              <rect x="165" y="38" width="14" height="6" rx="2" />
              <rect x="165" y="100" width="14" height="6" rx="2" />
              <rect x="165" y="112" width="14" height="6" rx="2" />
            </g>
            {/* XPPen / Deco Brand Mark */}
            <text x="84" y="138" fill="#525866" fontSize="7" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">
              XP-PEN
            </text>
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-[260px] sm:h-[320px] mx-auto select-none pointer-events-none mb-2 sm:mb-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ scale: 0, opacity: 0, y: 30 }}
          animate={
            isExiting
              ? { scale: 0.7, opacity: 0, y: -20, transition: { duration: 0.3 } }
              : {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 420,
                    damping: 20,
                    delay: item.delay,
                  },
                }
          }
          className={item.className}
        >
          {/* Subtle gentle float pulse after popping in */}
          <motion.div
            animate={{
              y: [0, -3.5, 0],
              transition: {
                duration: 3 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay + 0.3,
              },
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {item.render()}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
