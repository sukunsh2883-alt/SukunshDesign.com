import { motion } from "motion/react";

interface FooterProps {
  profile: any;
  onNavigate?: (id: string) => void;
}

// Interactive Flying Ladybug Component
const FlyingLadybug = () => {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none select-none"
      style={{ width: 50, height: 50 }}
      animate={{
        x: [40, 160, 110, 210, 40],
        y: [180, 110, 50, 120, 180],
        rotate: [0, 20, -10, 30, 0],
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
        {/* Six thin little legs */}
        <path d="M12,18 L5,16 M12,22 L4,23 M14,26 L9,32 M28,18 L35,16 M28,22 L36,23 M26,26 L31,32" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Underbody */}
        <ellipse cx="20" cy="22" rx="6" ry="8" fill="#111111" />
        
        {/* Left buzzing translucent wing */}
        <motion.path 
          d="M 16,20 C 10,8 2,13 16,20" 
          fill="#d1e8ff" 
          opacity="0.55" 
          animate={{ scaleX: [1, 1.4, 1], scaleY: [1, 0.7, 1], rotate: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 0.08, ease: "linear" }}
          style={{ originX: "16px", originY: "20px" }}
        />
        
        {/* Right buzzing translucent wing */}
        <motion.path 
          d="M 24,20 C 30,8 38,13 24,20" 
          fill="#d1e8ff" 
          opacity="0.55" 
          animate={{ scaleX: [1, 1.4, 1], scaleY: [1, 0.7, 1], rotate: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 0.08, ease: "linear" }}
          style={{ originX: "24px", originY: "20px" }}
        />
        
        {/* Left wing cover (split/open) */}
        <motion.path
          d="M 20,21 C 13,11 10,25 20,30"
          fill="#e74c3c"
          animate={{ rotate: [-8, -18, -8] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          style={{ originX: "20px", originY: "21px" }}
        />
        
        {/* Right wing cover (split/open) */}
        <motion.path
          d="M 20,21 C 27,11 30,25 20,30"
          fill="#e74c3c"
          animate={{ rotate: [8, 18, 8] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          style={{ originX: "20px", originY: "21px" }}
        />
        
        {/* Spots on wing covers */}
        <circle cx="15" cy="23" r="1.2" fill="#111111" />
        <circle cx="14" cy="27" r="1.2" fill="#111111" />
        <circle cx="25" cy="23" r="1.2" fill="#111111" />
        <circle cx="26" cy="27" r="1.2" fill="#111111" />
        
        {/* Head */}
        <circle cx="20" cy="12" r="3.2" fill="#111111" />
        
        {/* Antennas */}
        <path d="M18,10 Q 16,5 11,7 M22,10 Q 24,5 29,7" stroke="#111111" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

export default function Footer({ profile, onNavigate }: FooterProps) {
  return (
    <footer id="contact" className="relative bg-[#0b0c0b] px-6 py-20 text-[#f3f4f4] md:px-16 md:py-28 overflow-hidden select-none">
      <div className="mx-auto max-w-[1400px]">
        {/* Main Grid splitting illustration on the left and form on the right */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.2fr] gap-x-12 gap-y-16 items-center">
          
          {/* LEFT SIDE: Custom Botanical SVG Illustration + Animated Flying Beetle */}
          <div className="relative w-full max-w-[460px] md:max-w-none aspect-square md:aspect-[1.1] flex items-center justify-center overflow-visible">
            
            {/* Animated Flying Ladybug */}
            <FlyingLadybug />
            
            {/* Botanical SVG Canvas */}
            <svg 
              viewBox="0 0 500 500" 
              className="w-full h-full overflow-visible drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Stem and leaf styling gradients */}
                <linearGradient id="yellowPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e3b139" />
                  <stop offset="100%" stopColor="#cfa130" />
                </linearGradient>
                <linearGradient id="redPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e74c3c" />
                  <stop offset="100%" stopColor="#c0392b" />
                </linearGradient>
                <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e221c" />
                  <stop offset="100%" stopColor="#151814" />
                </linearGradient>
              </defs>

              {/* Connector stems underneath flowers */}
              <path d="M 60,500 Q 110,410 190,325" stroke="url(#stemGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 120,500 Q 180,420 280,350" stroke="url(#stemGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 190,325 Q 260,310 360,265" stroke="url(#stemGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 40,500 Q 120,470 140,430" stroke="url(#stemGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Tall Leafy Branches on the left side (Olive/Sage tones) */}
              <g id="tall-leaves">
                {/* Leaf 1 */}
                <path d="M 35,500 C 42,410 65,310 50,230 C 38,310 25,410 35,500" fill="#969458" />
                {/* Leaf 2 */}
                <path d="M 20,500 C 30,420 48,340 75,275 C 58,340 38,420 20,500" fill="#aba866" opacity="0.95" />
                {/* Leaf 3 */}
                <path d="M 55,500 C 65,440 90,380 85,310 C 75,380 60,440 55,500" fill="#848141" />
                
                {/* Miniature leaf branches */}
                <path d="M 105,415 C 115,395 145,385 155,400 C 135,410 115,425 105,415" fill="#aba866" />
                <path d="M 90,440 C 75,420 50,425 40,440 C 60,445 80,450 90,440" fill="#969458" />
                <path d="M 125,350 C 140,330 170,325 180,340 C 160,355 140,365 125,350" fill="#aba866" />
                <path d="M 225,310 C 235,290 265,285 275,300 C 255,315 235,325 225,310" fill="#969458" />
              </g>

              {/* YELLOW FLOWER: Big beautiful golden blossom at the bottom-left */}
              <g id="yellow-flower" transform="translate(70, 420)">
                {/* Petals radiating around core */}
                <path d="M0,0 C -35,-20 -50,15 0,0" fill="url(#yellowPetal)" />
                <path d="M0,0 C -20,-45 20,-40 0,0" fill="url(#yellowPetal)" />
                <path d="M0,0 C 40,-25 45,15 0,0" fill="#cfa130" />
                <path d="M0,0 C 30,35 -10,45 0,0" fill="url(#yellowPetal)" />
                <path d="M0,0 C -40,30 -45,-10 0,0" fill="#848141" />
                <path d="M0,0 C -10,40 30,30 0,0" fill="url(#yellowPetal)" />
                {/* Center rich red-orange sphere */}
                <circle cx="0" cy="0" r="15" fill="#cc4125" />
                <circle cx="-3" cy="-3" r="15" fill="#df5c41" opacity="0.25" />
              </g>

              {/* ORANGE-RED FLOWER: Vibrant little companion flower */}
              <g id="red-flower" transform="translate(135, 450)">
                <path d="M0,0 C -22,-12 -28,12 0,0" fill="url(#redPetal)" />
                <path d="M0,0 C -6,-28 22,-22 0,0" fill="url(#redPetal)" />
                <path d="M0,0 C 28,-6 22,22 0,0" fill="url(#redPetal)" />
                <path d="M0,0 C 12,28 -18,22 0,0" fill="url(#redPetal)" />
                <path d="M0,0 C -22,18 -18,-18 0,0" fill="url(#redPetal)" />
                <circle cx="0" cy="0" r="6.5" fill="#ffffff" />
                <circle cx="0" cy="0" r="3" fill="#cc4125" />
              </g>

              {/* WHITE FLOWER 1 (Left-top Daisy with Sitting Ladybug) */}
              <g id="white-flower-1" transform="translate(195, 335)">
                <path d="M0,0 C 15,-18 38,-8 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -15,-22 -35,0 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C 28,8 22,30 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -6,28 -28,18 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -28,-18 -6,-28 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C 28,-18 6,-28 0,0" fill="#ffffff" opacity="0.95" />
                <circle cx="0" cy="0" r="11" fill="#e06a3b" />
                <circle cx="-2" cy="-2" r="11" fill="#f39c12" opacity="0.2" />

                {/* Crawling Ladybug sitting on White Flower 1 */}
                <motion.g 
                  transform="translate(-6, -6) rotate(35)"
                  animate={{ rotate: [30, 40, 30], scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  {/* Legs */}
                  <path d="M-8,-2 L-13,-4 M-8,2 L-14,3 M-6,6 L-9,11 M8,-2 L13,-4 M8,2 L14,3 M6,6 L9,11" stroke="#111111" strokeWidth="1.5" />
                  {/* Body */}
                  <ellipse cx="0" cy="2" rx="7.5" ry="9.5" fill="#e74c3c" />
                  {/* Wings center partition line */}
                  <line x1="0" y1="-7" x2="0" y2="11" stroke="#111111" strokeWidth="1.2" />
                  {/* Head */}
                  <circle cx="0" cy="-7.5" r="3.5" fill="#111111" />
                  {/* Tiny white head-spots */}
                  <circle cx="-1.2" cy="-8.5" r="0.8" fill="#ffffff" />
                  <circle cx="1.2" cy="-8.5" r="0.8" fill="#ffffff" />
                  {/* Antennae */}
                  <path d="M-2,-10 Q -5,-14 -9,-12 M2,-10 Q 5,-14 9,-12" stroke="#111111" strokeWidth="1" fill="none" />
                  {/* Beetle Spots */}
                  <circle cx="-3.5" cy="-0.5" r="1.5" fill="#111111" />
                  <circle cx="3.5" cy="-0.5" r="1.5" fill="#111111" />
                  <circle cx="-4.5" cy="4.5" r="1.5" fill="#111111" />
                  <circle cx="4.5" cy="4.5" r="1.5" fill="#111111" />
                  <circle cx="0" cy="7.5" r="1.5" fill="#111111" />
                </motion.g>
              </g>

              {/* WHITE FLOWER 2 (Middle Daisy) */}
              <g id="white-flower-2" transform="translate(295, 360)">
                <path d="M0,0 C 22,-12 32,12 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -22,12 -32,-12 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C 12,28 -12,32 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -12,-28 12,-32 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C 28,-28 6,-38 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -28,28 -6,38 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -28,-28 -6,-38 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C 28,28 6,38 0,0" fill="#ffffff" opacity="0.95" />
                <circle cx="0" cy="0" r="13" fill="#e06a3b" />
                <circle cx="-2" cy="-2" r="13" fill="#f39c12" opacity="0.15" />
              </g>

              {/* WHITE FLOWER 3 (Rightmost Daisy) */}
              <g id="white-flower-3" transform="translate(365, 275)">
                <path d="M0,0 C 22,-12 32,12 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -22,12 -32,-12 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C 12,28 -12,32 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -12,-28 12,-32 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C 28,-28 6,-38 0,0" fill="#ffffff" opacity="0.95" />
                <path d="M0,0 C -28,28 -6,38 0,0" fill="#ffffff" opacity="0.95" />
                <circle cx="0" cy="0" r="11.5" fill="#e06a3b" />
                <circle cx="-1.5" cy="-1.5" r="11.5" fill="#f39c12" opacity="0.15" />
              </g>
            </svg>
          </div>

          {/* RIGHT SIDE: "Lets Talk" Typography + Minimalist Multi-Column Link Rows */}
          <div className="flex flex-col justify-center h-full pt-4">
            
            {/* Title with elegant, wide-spaced sans-serif display weight */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-normal tracking-tight text-white leading-none mb-14">
              Lets Talk
            </h2>
            
            {/* Minimal Double-Column Table-Row Link Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 w-full max-w-2xl">
              
              {/* Left Column of Links */}
              <div className="flex flex-col gap-6">
                
                {/* Work Link row */}
                <div 
                  onClick={() => onNavigate?.("#scroll-demo")}
                  className="border-b border-[#232523] pb-3 hover:border-neutral-400 transition-colors duration-300 cursor-pointer group"
                >
                  <span className="block text-sm md:text-base font-sans text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    Work
                  </span>
                </div>

                {/* About Link row */}
                <div 
                  onClick={() => onNavigate?.("#about-me-modal")}
                  className="border-b border-[#232523] pb-3 hover:border-neutral-400 transition-colors duration-300 cursor-pointer group"
                >
                  <span className="block text-sm md:text-base font-sans text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    About
                  </span>
                </div>

                {/* Contact Link row */}
                <a 
                  href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
                  className="border-b border-[#232523] pb-3 hover:border-neutral-400 transition-colors duration-300 block group"
                >
                  <span className="block text-sm md:text-base font-sans text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    Contact
                  </span>
                </a>

              </div>

              {/* Right Column of Links */}
              <div className="flex flex-col gap-6">
                
                {/* Instagram Link row */}
                <a 
                  href={profile?.instagram || "https://instagram.com/sukunsh"}
                  target="_blank" 
                  rel="noreferrer"
                  className="border-b border-[#232523] pb-3 hover:border-neutral-400 transition-colors duration-300 block group"
                >
                  <span className="block text-sm md:text-base font-sans text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    Instagram
                  </span>
                </a>

                {/* Linkden (LinkedIn) Link row */}
                <a 
                  href={profile?.linkedin || "https://www.linkedin.com/in/sukunsh"}
                  target="_blank" 
                  rel="noreferrer"
                  className="border-b border-[#232523] pb-3 hover:border-neutral-400 transition-colors duration-300 block group"
                >
                  <span className="block text-sm md:text-base font-sans text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    Linkden
                  </span>
                </a>

                {/* Behance Link row */}
                <a 
                  href={profile?.behance || "https://www.behance.net/sukunshsharma"}
                  target="_blank" 
                  rel="noreferrer"
                  className="border-b border-[#232523] pb-3 hover:border-neutral-400 transition-colors duration-300 block group"
                >
                  <span className="block text-sm md:text-base font-sans text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                    Behance
                  </span>
                </a>

              </div>

            </div>

            {/* Back To Top Capsule link */}
            <div className="flex justify-end w-full mt-14 md:mt-18 max-w-2xl">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="font-sans text-xs tracking-wider text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer select-none pb-1"
                aria-label="Scroll back to top"
              >
                ( Back To Top )
              </button>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}
