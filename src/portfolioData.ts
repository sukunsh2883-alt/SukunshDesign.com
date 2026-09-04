/**
 * Sukunsh - Creative Portfolio Data Engine
 * 
 * Edit this file to add more films, design projects, video reel archives, journals, and skill sets.
 * Supports HLS streaming and direct MP4/YouTube/Vimeo links.
 */

export interface AIFilm {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  thumbnail: string; // Replace with local path (e.g., "/projects/ai-film-1.jpg") or public URL
  videoUrl: string; // Paste your MP4 or HLS (.m3u8) video URL here, or YouTube/Vimeo links
  tags: string[];
  isAI?: boolean;
}

export interface DesignProject {
  id: string;
  title: string;
  type: string;
  year: string;
  description: string;
  image: string; // Replace with local path (e.g., "/projects/design-1.jpg") or public URL
  tools: string[];
  link: string;
  aboutProject?: string;
  client?: string;
  galleryImages?: string[];
  isAI?: boolean;
  pdfUrl?: string;
  uploadedPdfName?: string;
  behanceEmbedUrl?: string;
}

export interface VideoCard {
  id: string;
  title: string;
  format: "16:9" | "9:16";
  type: string;
  thumbnail: string; // Replace with local path (e.g., "/videos/video-1.jpg") or public URL
  videoUrl: string; // Direct video path or HLS/YouTube link
  duration: string;
  year: string;
  isAI?: boolean;
}

export interface JournalPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string; // Replace with local path (e.g., "/journal/journal-1.jpg") or public URL
  content?: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
}

// AI Film Works Section List
export const aiFilms: AIFilm[] = [
  {
    id: "ai-film-rivr-ad",
    title: "RIVR Film",
    category: "AI Film",
    year: "2026",
    description: "AI-directed cinematic film with dynamic pacing and polished visual framing.",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780259813/RIVR_AD_Flim_ln2lz9.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4",
    tags: ["AI Film", "Cinematic", "Motion", "RIVR"],
    isAI: true
  },
  {
    id: "ai-film-extended-prompt",
    title: "Extended Prompt Film",
    category: "AI Film / Prompt Study",
    year: "2026",
    description: "Eight-second AI film study built from prompt extension and cinematic motion refinement.",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260388/_extend_3______duration____8s____prompt___202605151502_2_ffqasy.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260388/_extend_3______duration____8s____prompt___202605151502_2_ffqasy.mp4",
    tags: ["AI Film", "Prompt Study", "Cinematic"],
    isAI: true
  },
  {
    id: "ai-film-sequence-01-4",
    title: "Sequence 01 Film 04",
    category: "AI Film / Sequence",
    year: "2026",
    description: "Short cinematic AI sequence focused on atmosphere, timing, and visual continuity.",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264965/Sequence_01_4_m7ijop.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264965/Sequence_01_4_m7ijop.mp4",
    tags: ["AI Film", "Sequence", "Cinematic"],
    isAI: true
  },
  {
    id: "ai-film-1",
    title: "Hyper Motion Visual",
    category: "AI Video",
    year: "2026",
    description: "Dynamic storytelling using AI video generation, vector effects, and cinematic motion.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-43958-large.mp4",
    tags: ["AI Video", "Cinematic Visual", "Motion"]
  },
  {
    id: "ai-film-2",
    title: "Cinematic Brand Visual",
    category: "AI Film / Brand Story",
    year: "2026",
    description: "A cinematic AI-generated brand film with dramatic lighting, movement, and storytelling.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-tunnel-in-a-futuristic-city-43282-large.mp4",
    tags: ["Brand", "AI Film", "Cinematic", "Branding"]
  },
  {
    id: "ai-film-music-video",
    title: "Synthwave AI Music Journey",
    category: "AI Music Video",
    year: "2026",
    description: "Retro-futuristic music video using prompt-guided clip loops, neon light streams, and audio-reactive pacing.",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32115-large.mp4",
    tags: ["Music Video", "Synthwave", "AI Video"]
  },
  {
    id: "ai-film-3",
    title: "Storyboard to AI Film",
    category: "Storyboard / Motion",
    year: "2026",
    description: "Visual storytelling experiment moving from storyboard frames to AI-generated motion.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32115-large.mp4",
    tags: ["Storyboard", "Motion", "AI", "Story"]
  },
  {
    id: "ai-film-action",
    title: "Neon Heist Tokyo Sequence",
    category: "AI Action Sequence",
    year: "2026",
    description: "High-octane dramatic action sequence rendered in a cinematic cyberpunk Tokyo utilizing extreme camera pans.",
    thumbnail: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-look-of-a-woman-neon-lighting-43284-large.mp4",
    tags: ["Action", "AI Film", "Cyberpunk"]
  },
  {
    id: "ai-film-glass-bottle",
    title: "Cyber Glass Bottle Concept",
    category: "AI Packaging Design",
    year: "2026",
    description: "Glass fluid material simulation of standard beverage containers casting realistic colored shadows.",
    thumbnail: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-metallic-fluid-flow-abstract-texture-40078-large.mp4",
    tags: ["Packaging", "AI Design", "3D"]
  },
  {
    id: "ai-film-poster-art",
    title: "Chroma Monolith Poster",
    category: "AI Poster Art",
    year: "2026",
    description: "Prismatic graphic posters designed by fusing Midjourney layout queries with custom vector typography.",
    thumbnail: "https://images.unsplash.com/photo-1618005198143-d366800ee4ef?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-spinning-metallic-object-shining-abstract-animation-40082-large.mp4",
    tags: ["Poster", "AI Design", "Typography"]
  },
  {
    id: "ai-film-ad-poster",
    title: "Midnight Energy Ad Campaign",
    category: "Ad Poster Design",
    year: "2026",
    description: "Futuristic commercial poster layouts for an experimental midnight beverage brand showing extreme fluid mechanics.",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mysterious-neon-lights-in-rainy-city-streets-43288-large.mp4",
    tags: ["Ad Poster", "Ads", "Design"]
  }
];

// Selected Design Works List
export const designProjects: DesignProject[] = [
  {
    id: "design-web-arch",
    title: "Architectural Studio Web Platform",
    type: "Web Design",
    year: "2026",
    description: "Editorial web portal showcasing spatial architectures, interactive blueprints, and minimal typography.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
    tools: ["React", "Tailwind CSS", "Figma", "Web Design"],
    link: "mailto:Sukunsh2883@gmail.com",
    client: "Studio Arch & Design",
    aboutProject: "A high-performance editorial web platform designed for architectural storytelling. Built with responsive grid systems, tactile micro-interactions, and expansive full-bleed media layouts that adapt effortlessly to mobile, tablet, and ultra-wide displays.",
    galleryImages: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    id: "design-web-platform",
    title: "NextGen Design System & Web App",
    type: "UI/UX & Web",
    year: "2026",
    description: "Responsive web application and design system featuring high-contrast UI components and dark mode interactions.",
    image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?q=80&w=1400&auto=format&fit=crop",
    tools: ["Figma", "Design Systems", "Web UI", "TypeScript"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Sukunsh Labs",
    aboutProject: "A scalable web UI ecosystem with over 200+ accessible components, tokenized design systems, and responsive layouts engineered for cross-platform speed and visual precision.",
    galleryImages: [
      "https://images.unsplash.com/photo-1581291518655-9523c932dedf?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    id: "design-web-analytics",
    title: "FinTech SaaS Web Dashboard",
    type: "SaaS & Web",
    year: "2025",
    description: "Real-time visual data metrics dashboard with interactive graphs, clean layout grids, and multi-viewport responsiveness.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    tools: ["Next.js", "D3.js", "Tailwind CSS", "Dashboard UI"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Apex Financial",
    aboutProject: "Creating a seamless data analytics dashboard with dense yet legible information architecture, custom financial charting modules, and rapid responsive breakpoints across tablet and mobile.",
    galleryImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    id: "design-web-agency",
    title: "Creative Agency Web Portal",
    type: "Digital Web",
    year: "2026",
    description: "Brand storytelling web screen engineered with kinetic micro-interactions, smooth scrolling, and modular UI cards.",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1400&auto=format&fit=crop",
    tools: ["GSAP", "Three.js", "Web Design", "UI Screens"],
    link: "https://www.behance.net/sukunshsharma",
    client: "ShareChat Creative Lab",
    aboutProject: "A showcase web platform with fluid animations, dynamic typography scales, and modular cards that provide an immersive experience across desktop, iPad, and smartphone screens.",
    galleryImages: [
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: "design-web-mag",
    title: "Minimalist Editorial Magazine Web",
    type: "Editorial Web",
    year: "2025",
    description: "Digital editorial journal featuring high-precision typography scales, multi-column reading modes, and responsive grids.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1400&auto=format&fit=crop",
    tools: ["Typography", "Editorial UI", "Web Layouts"],
    link: "https://www.behance.net/sukunshsharma",
    client: "National Typography Press",
    aboutProject: "An editorial digital reading experience pairing Swiss typography with subtle horizontal dividers and responsive column masonry.",
    galleryImages: [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    id: "design-web-commerce",
    title: "Luxury E-Commerce Web Store",
    type: "E-Commerce",
    year: "2025",
    description: "Seamless e-commerce web platform showcasing luxury product cards, fluid cart drawer, and high-performance navigation.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
    tools: ["React", "Shopify Headless", "Web Screens"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Maison Studio",
    aboutProject: "An ultra-refined digital shopping interface combining high-resolution product carousels, responsive checkout flows, and frictionless navigation.",
    galleryImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    id: "design-web-portfolio",
    title: "Interactive Spatial Web Experience",
    type: "Spatial Web",
    year: "2026",
    description: "Spatial digital experience and portfolio screen crafted with 3D canvas elements, fluid motion, and responsive layout.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1400&auto=format&fit=crop",
    tools: ["WebGL", "Tailwind", "Responsive UI"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Freelance Editorial Study",
    aboutProject: "An experimental web platform combining 3D interactive canvases with structured editorial layout components.",
    galleryImages: [
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    id: "design-pw-socials",
    title: "Digital Campaign Web Experience",
    type: "Digital Web",
    year: "2025",
    description: "Interactive campaign landing page and creative assets designed for high-conversion web distribution.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1400&auto=format&fit=crop",
    tools: ["Figma", "Web Layouts", "Color Theory"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Physics Wallah",
    aboutProject: "A high-intensity web campaign platform requiring fast visual alignment, readable call-out boxes, and engaging graphics.",
    galleryImages: [
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1400&auto=format&fit=crop"
    ]
  }
];

// Motion Archive Section List
export const videos: VideoCard[] = [
  {
    id: "video-kenerate-ad",
    title: "Kenerate Ad Reel",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260451/kenerate-ad-1779796765745_1_njywwd.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260451/kenerate-ad-1779796765745_1_njywwd.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-sequence-01-5",
    title: "Sequence 01 Ad Reel",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260423/Sequence_01_5_ktappc.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260423/Sequence_01_5_ktappc.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-sequence-01-6",
    title: "Sequence 01 Reel 06",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260408/Sequence_01_6_c32bs3.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260408/Sequence_01_6_c32bs3.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-kenerate-ad-02",
    title: "Kenerate Ad Reel 02",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264091/kenerate-ad-1779833779917_w0ndh7.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264091/kenerate-ad-1779833779917_w0ndh7.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-1",
    title: "AI Product Ad Reel",
    format: "16:9",
    type: "AI Ad",
    // Replace "/videos/video-1.jpg" with your own image when ready. Public CDN URL used as a high-quality fallback.
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-look-of-a-woman-neon-lighting-43284-large.mp4",
    duration: "00:15",
    year: "2026"
  },
  {
    id: "video-2",
    title: "Motion Poster Experiment",
    format: "9:16",
    type: "Motion Design",
    // Replace "/videos/video-2.jpg" with your own image when ready. Public CDN URL used as a high-quality fallback.
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-spinning-metallic-object-shining-abstract-animation-40082-large.mp4",
    duration: "00:10",
    year: "2026"
  },
  {
    id: "video-3",
    title: "Cinematic Visual Test",
    format: "16:9",
    type: "AI Film",
    // Replace "/videos/video-3.jpg" with your own image when ready. Public CDN URL used as a high-quality fallback.
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mysterious-neon-lights-in-rainy-city-streets-43288-large.mp4",
    duration: "00:20",
    year: "2026"
  }
];

// Explorations Section List
export interface ExplorationItem {
  id: string;
  title: string;
  imageUrl: string;
  rotation: string;
  yOffset: string;
}

export const explorations: ExplorationItem[] = [
  {
    id: "exp-1",
    title: "Abstract Chrome Fluid",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    rotation: "-6deg",
    yOffset: "0px"
  },
  {
    id: "exp-2",
    title: "Cinematic Fog Study",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    rotation: "4deg",
    yOffset: "60px"
  },
  {
    id: "exp-3",
    title: "Surreal Mirror Portal",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
    rotation: "-3deg",
    yOffset: "-40px"
  },
  {
    id: "exp-4",
    title: "Neon Cinematic Transit",
    imageUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=800&auto=format&fit=crop",
    rotation: "5deg",
    yOffset: "200px"
  },
  {
    id: "exp-5",
    title: "Character Storyboard Concept",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    rotation: "-5deg",
    yOffset: "120px"
  },
  {
    id: "exp-6",
    title: "Dark Cyberpunk Horizon",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    rotation: "3deg",
    yOffset: "250px"
  }
];

// Recent Journal Posts
export const journalPosts: JournalPost[] = [
  {
    id: "journal-1",
    title: "How AI is changing visual design workflows",
    date: "2026",
    readTime: "4 min read",
    // Replace "/journal/journal-1.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-2",
    title: "Designing cinematic product ads with generative video",
    date: "2026",
    readTime: "5 min read",
    // Replace "/journal/journal-2.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-3",
    title: "From storyboard frames to full AI cinema reels",
    date: "2026",
    readTime: "3 min read",
    // Replace "/journal/journal-3.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1542204172-e7052809a86e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-4",
    title: "Why typography still matters in AI visual direction",
    date: "2026",
    readTime: "4 min read",
    // Replace "/journal/journal-4.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800&auto=format&fit=crop"
  }
];

// Professional Credentials
export const education: EducationItem[] = [
  {
    degree: "M.Des. Communication Design",
    institution: "IDC, IIT Bombay"
  },
  {
    degree: "B.F.A. Visual Communication",
    institution: "College of Art, Delhi University"
  }
];

export const experience: ExperienceItem[] = [
  {
    role: "AI Visual Design Intern",
    company: "ShareChat & Moj"
  },
  {
    role: "Freelance Graphic Designer",
    company: "Physics Wallah"
  },
  {
    role: "Graphic Designer & Video Editor",
    company: "Radiation Education"
  }
];

export const skills: string[] = [
  "Branding",
  "Visual Design",
  "UI/UX Design",
  "Motion Graphics",
  "Video Editing",
  "AI Image Generation",
  "AI Video Generation",
  "Prompt Design",
  "2D/3D Illustration",
  "Storyboarding",
  "Typography",
  "Packaging Design",
  "Publication Design",
  "Cinematography",
  "Sound Design"
];

export const software: string[] = [
  "Photoshop",
  "Illustrator",
  "Figma",
  "After Effects",
  "Premiere Pro",
  "Lightroom",
  "Animate",
  "Autodesk Maya",
  "Procreate"
];

export const RESUME_CATEGORIES = [
  "Branding",
  "Visual Design",
  "UI/UX Design",
  "Typographic Design",
  "Illustration (2D & 3D)",
  "Storyboarding",
  "Packaging Design",
  "Publication Design",
  "Motion Graphics",
  "Video Editing",
  "2D Animation",
  "Cinematography",
  "Sound Design",
  "AI Image & Video Generation",
  "Prompt Design & Optimization",
  "Rapid Visual Prototyping",
  "Fine Art Photography",
  "AI Video / Product Ad",
  "AI Film / Brand Story",
  "Academic Project"
];

// Profile Details
export const profile = {
  fullName: "Suraj Kumar Sharma",
  brandName: "Sukunsh",
  roles: [
    "Visual Designer",
    "AI Creative Designer",
    "Motion Designer",
    "Storyboard Artist",
    "AI Film Creator"
  ],
  bio: "Suraj Kumar Sharma is a Visual Designer and AI Creative Designer with deep experience in branding, motion graphics, UI design, AI-assisted creative workflows, video editing, storyboarding, typography, and visual storytelling.",
  email: "sukunsh2883@gmail.com",
  linkedin: "https://www.linkedin.com/in/sukunsh",
  behance: "https://www.behance.net/sukunshsharma",
  instagram: "https://www.instagram.com/sukunsh_",
  accentGradient: "linear-gradient(90deg, #FF6A00 0%, #FFB000 100%)",
  logoFontFamily: "\"Sukunsh Wordmark\", \"Clash Display Local\", \"Arial Black\", Impact, sans-serif",
  heroVideoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1779644211/make_give_bit_loop_motion_202605242304_vd4fkj.mp4",
  aboutImage: "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png",
  aboutImageSecondary: "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png"
};
