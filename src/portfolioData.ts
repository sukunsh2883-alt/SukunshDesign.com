/**
 * Sukunsh - Creative Portfolio Data Engine
 * 
 * Auto-synced from Creator Studio & git persistent.
 * Edit this file to add more films, design projects, video reel archives, journals, and skill sets.
 * Supports HLS streaming and direct MP4/YouTube/Vimeo links.
 */

export interface AIFilm {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  thumbnail: string; // Replace with local path or public URL
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
  image: string; // Replace with local path or public URL
  tools: string[];
  link: string;
  aboutProject?: string;
  client?: string;
  galleryImages?: string[];
  video?: string;
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
  thumbnail: string; // Replace with local path or public URL
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
  image: string;
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

export interface ExplorationItem {
  id: string;
  title: string;
  imageUrl: string;
  rotation: string;
  yOffset: string;
}

// AI Film Works Section List
export const aiFilms: AIFilm[] = [
  {
    "id": "ai-film-rivr-ad",
    "title": "RIVR Film",
    "category": "AI Film",
    "year": "2026",
    "description": "AI-directed cinematic film with dynamic pacing and polished visual framing.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780259813/RIVR_AD_Flim_ln2lz9.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4",
    "tags": [
      "AI Film",
      "Cinematic",
      "Motion",
      "RIVR"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-extended-prompt",
    "title": "Extended Prompt Film",
    "category": "AI Film / Prompt Study",
    "year": "2026",
    "description": "Eight-second AI film study built from prompt extension and cinematic motion refinement.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260388/_extend_3______duration____8s____prompt___202605151502_2_ffqasy.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260388/_extend_3______duration____8s____prompt___202605151502_2_ffqasy.mp4",
    "tags": [
      "AI Film",
      "Prompt Study",
      "Cinematic"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-sequence-01-4",
    "title": "Sequence 01 Film 04",
    "category": "AI Film / Sequence",
    "year": "2026",
    "description": "Short cinematic AI sequence focused on atmosphere, timing, and visual continuity.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264965/Sequence_01_4_m7ijop.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264965/Sequence_01_4_m7ijop.mp4",
    "tags": [
      "AI Film",
      "Sequence",
      "Cinematic"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-kenerate-commercial",
    "title": "Kenerate Commercial",
    "category": "AI Commercial / Motion",
    "year": "2026",
    "description": "High-impact brand commercial with AI motion simulation and cinematic editing.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264091/kenerate-ad-1779833779917_w0ndh7.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264091/kenerate-ad-1779833779917_w0ndh7.mp4",
    "tags": [
      "AI Film",
      "Commercial",
      "Motion"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-kenerate-motion-ad",
    "title": "Kenerate Motion Ad",
    "category": "AI Film / Brand Ad",
    "year": "2026",
    "description": "AI-generated promotional motion visual with fluid transitions and refined color grading.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260451/kenerate-ad-1779796765745_1_njywwd.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260451/kenerate-ad-1779796765745_1_njywwd.mp4",
    "tags": [
      "AI Film",
      "Brand",
      "Motion"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-sequence-01-5",
    "title": "Sequence 01 Film 05",
    "category": "AI Sequence Study",
    "year": "2026",
    "description": "Atmospheric narrative sequence exploring cinematic depth and pacing.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260423/Sequence_01_5_ktappc.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260423/Sequence_01_5_ktappc.mp4",
    "tags": [
      "AI Film",
      "Sequence",
      "Cinematic"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-sequence-01-6",
    "title": "Sequence 01 Film 06",
    "category": "AI Sequence Study",
    "year": "2026",
    "description": "Cinematic exploration of light, texture, and continuity across frames.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260408/Sequence_01_6_c32bs3.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260408/Sequence_01_6_c32bs3.mp4",
    "tags": [
      "AI Film",
      "Sequence",
      "Cinematic"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-visual-exp-01",
    "title": "AI Visual Experiment 01",
    "category": "AI Visual Lab",
    "year": "2026",
    "description": "Creative visual experiment leveraging state-of-the-art generative motion models.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469510/1779188840357_o77qqi_emmrp5.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1789469510/1779188840357_o77qqi_emmrp5.mp4",
    "tags": [
      "AI Film",
      "Experiment",
      "Motion"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-visual-exp-02",
    "title": "AI Visual Experiment 02",
    "category": "AI Visual Lab",
    "year": "2026",
    "description": "Generative video investigation into kinetic typography, light, and fluid camera trajectories.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469385/1779095774772_lmmytk_hnbcwi.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1789469385/1779095774772_lmmytk_hnbcwi.mp4",
    "tags": [
      "AI Film",
      "Experiment",
      "Motion"
    ],
    "isAI": true
  },
  {
    "id": "ai-film-visual-exp-03",
    "title": "AI Visual Experiment 03",
    "category": "AI Visual Lab",
    "year": "2026",
    "description": "Short-form AI visual exploration focusing on dynamic camera movement and cinematic composition.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469345/1779197811307_n2mlxu_zz5t4u.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1789469345/1779197811307_n2mlxu_zz5t4u.mp4",
    "tags": [
      "AI Film",
      "Experiment",
      "Motion"
    ],
    "isAI": true
  }
];

// Selected Design Works List
export const designProjects: DesignProject[] = [
  {
    "id": "design-web-arch",
    "title": "Architectural Studio Web Platform",
    "type": "Web Design",
    "year": "2026",
    "description": "Editorial web portal showcasing spatial architectures, interactive blueprints, and minimal typography.",
    "video": "/design-illustration-loop.mp4",
    "image": "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789397162/MacBook_Pro_16__-_1_yuqe2k.jpg",
    "tools": [
      "Design System",
      "Illustration",
      "UI/UX"
    ],
    "link": "mailto:Sukunsh2883@gmail.com",
    "client": "Studio Showcase",
    "aboutProject": "A showcase of design and illustration works.",
    "galleryImages": [
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
      "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216481/MacBook_Pro_16__-_19_syziya.png"
    ]
  },
  {
    "id": "design-web-platform",
    "title": "NextGen Design System & Web App",
    "type": "UI/UX & Web",
    "year": "2026",
    "description": "Concept branding for Somu Samosa, including logo, colors, stickers, and social media designs.",
    "image": "https://mir-cdn.behance.net/v1/rendition/project_modules/source/0cada2251593317.6a3a85ae7be3f.jpg",
    "tools": [
      "Figma",
      "Design Systems",
      "Web UI",
      "TypeScript"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "Sukunsh Labs",
    "aboutProject": "Concept branding for Somu Samosa, including logo, colors, stickers, and social media designs.",
    "galleryImages": [
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/0cada2251593317.6a3a85ae7be3f.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/a75c70251593317.6a3a85ae7c300.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/82b886251593317.6a3a85ae7ae50.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/9c49bf251593317.6a3a85ae7a82c.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/eaa77b251593317.6a3a85ae7b92c.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/fb56af251593317.6a3a85ae7c7fb.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/b6ef6b251593317.6a3a85ae7a2b9.png"
    ],
    "isAI": false,
    "pdfUrl": "",
    "uploadedPdfName": "",
    "behanceEmbedUrl": ""
  },
  {
    "id": "design-web-analytics",
    "title": "Virtual Gifts & Fan Engagement",
    "type": "AI Video & Virtual Gifts",
    "year": "2025",
    "description": "AI generative video virtual gifts designed for ShareChat and Moj, driving real-time creator and fan engagement.",
    "image": "https://mir-cdn.behance.net/v1/rendition/project_modules/source/a1c8e7244190887.69922d898174e.png",
    "tools": [
      "AI Generative Video",
      "Motion Design",
      "Virtual Gifts",
      "Creator Engagement"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "ShareChat & Moj",
    "aboutProject": "AI generative video virtual gifts designed for ShareChat and Moj. This project is catered specifically for creators and fan engagements, elevating live-stream and community interactions through high-impact generative visual gifts and celebratory animation sequences.",
    "galleryImages": [
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/a1c8e7244190887.69922d898174e.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/bef690244190887.69922d8981229.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/60121c244190887.69922d89831d8.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/311bcd244190887.69922d8982ae3.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/201e1b244190887.69922d8980d00.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/f49c65244190887.69922d8981e54.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/8a51f1244190887.69922d898257c.png"
    ],
    "isAI": true
  },
  {
    "id": "design-web-agency",
    "title": "Creative Agency Web Portal",
    "type": "Digital Web",
    "year": "2026",
    "description": "Brand storytelling web screen engineered with kinetic micro-interactions, smooth scrolling, and modular UI cards.",
    "image": "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1400&auto=format&fit=crop",
    "tools": [
      "GSAP",
      "Three.js",
      "Web Design",
      "UI Screens"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "ShareChat Creative Lab",
    "aboutProject": "A showcase web platform with fluid animations, dynamic typography scales, and modular cards that provide an immersive experience across desktop, iPad, and smartphone screens.",
    "galleryImages": [
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    "id": "design-web-mag",
    "title": "Minimalist Editorial Magazine Web",
    "type": "Editorial Web",
    "year": "2025",
    "description": "Digital editorial journal featuring high-precision typography scales, multi-column reading modes, and responsive grids.",
    "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1400&auto=format&fit=crop",
    "tools": [
      "Typography",
      "Editorial UI",
      "Web Layouts"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "National Typography Press",
    "aboutProject": "An editorial digital reading experience pairing Swiss typography with subtle horizontal dividers and responsive column masonry.",
    "galleryImages": [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    "id": "design-web-commerce",
    "title": "Luxury E-Commerce Web Store",
    "type": "E-Commerce",
    "year": "2025",
    "description": "Seamless e-commerce web platform showcasing luxury product cards, fluid cart drawer, and high-performance navigation.",
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
    "tools": [
      "React",
      "Shopify Headless",
      "Web Screens"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "Maison Studio",
    "aboutProject": "An ultra-refined digital shopping interface combining high-resolution product carousels, responsive checkout flows, and frictionless navigation.",
    "galleryImages": [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    "id": "design-web-portfolio",
    "title": "Interactive Spatial Web Experience",
    "type": "Spatial Web",
    "year": "2026",
    "description": "Spatial digital experience and portfolio screen crafted with 3D canvas elements, fluid motion, and responsive layout.",
    "image": "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1400&auto=format&fit=crop",
    "tools": [
      "WebGL",
      "Tailwind",
      "Responsive UI"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "Freelance Editorial Study",
    "aboutProject": "An experimental web platform combining 3D interactive canvases with structured editorial layout components.",
    "galleryImages": [
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  {
    "id": "design-pw-socials",
    "title": "Digital Campaign Web Experience",
    "type": "Digital Web",
    "year": "2025",
    "description": "Interactive campaign landing page and creative assets designed for high-conversion web distribution.",
    "image": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1400&auto=format&fit=crop",
    "tools": [
      "Figma",
      "Web Layouts",
      "Color Theory"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "Physics Wallah",
    "aboutProject": "A high-intensity web campaign platform requiring fast visual alignment, readable call-out boxes, and engaging graphics.",
    "galleryImages": [
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1400&auto=format&fit=crop"
    ]
  }
];

// Motion Archive Section List - Sukunsh's Real AI Videos Only
export const videos: VideoCard[] = [
  {
    "id": "video-kenerate-ad-02",
    "title": "Kenerate Commercial",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264091/kenerate-ad-1779833779917_w0ndh7.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264091/kenerate-ad-1779833779917_w0ndh7.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  },
  {
    "id": "video-kenerate-ad",
    "title": "Kenerate Motion Ad",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260451/kenerate-ad-1779796765745_1_njywwd.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260451/kenerate-ad-1779796765745_1_njywwd.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  },
  {
    "id": "video-sequence-01-5",
    "title": "Sequence 01 Film 05",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260423/Sequence_01_5_ktappc.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260423/Sequence_01_5_ktappc.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  },
  {
    "id": "video-sequence-01-6",
    "title": "Sequence 01 Film 06",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260408/Sequence_01_6_c32bs3.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260408/Sequence_01_6_c32bs3.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  },
  {
    "id": "video-ai-exp-1",
    "title": "AI Visual Experiment 01",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469510/1779188840357_o77qqi_emmrp5.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1789469510/1779188840357_o77qqi_emmrp5.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  },
  {
    "id": "video-ai-exp-2",
    "title": "AI Visual Experiment 02",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469385/1779095774772_lmmytk_hnbcwi.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1789469385/1779095774772_lmmytk_hnbcwi.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  },
  {
    "id": "video-ai-exp-3",
    "title": "AI Visual Experiment 03",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1789469345/1779197811307_n2mlxu_zz5t4u.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1789469345/1779197811307_n2mlxu_zz5t4u.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  }
];

// Explorations Section List
export const explorations: ExplorationItem[] = [
  {
    "id": "exp-1",
    "title": "Abstract Chrome Fluid",
    "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    "rotation": "-6deg",
    "yOffset": "0px"
  },
  {
    "id": "exp-2",
    "title": "Cinematic Fog Study",
    "imageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    "rotation": "4deg",
    "yOffset": "60px"
  },
  {
    "id": "exp-3",
    "title": "Surreal Mirror Portal",
    "imageUrl": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
    "rotation": "-3deg",
    "yOffset": "-40px"
  },
  {
    "id": "exp-4",
    "title": "Neon Cinematic Transit",
    "imageUrl": "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=800&auto=format&fit=crop",
    "rotation": "5deg",
    "yOffset": "200px"
  },
  {
    "id": "exp-5",
    "title": "Character Storyboard Concept",
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    "rotation": "-5deg",
    "yOffset": "120px"
  },
  {
    "id": "exp-6",
    "title": "Dark Cyberpunk Horizon",
    "imageUrl": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    "rotation": "3deg",
    "yOffset": "250px"
  }
];

// Recent Journal Posts
export const journalPosts: JournalPost[] = [
  {
    "id": "journal-1",
    "title": "How AI is changing visual design workflows",
    "date": "2026",
    "readTime": "4 min read",
    "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
  },
  {
    "id": "journal-2",
    "title": "Designing cinematic product ads with generative video",
    "date": "2026",
    "readTime": "5 min read",
    "image": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"
  },
  {
    "id": "journal-3",
    "title": "From storyboard frames to full AI cinema reels",
    "date": "2026",
    "readTime": "3 min read",
    "image": "https://images.unsplash.com/photo-1542204172-e7052809a86e?q=80&w=800&auto=format&fit=crop"
  },
  {
    "id": "journal-4",
    "title": "Why typography still matters in AI visual direction",
    "date": "2026",
    "readTime": "4 min read",
    "image": "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800&auto=format&fit=crop"
  }
];

// Professional Credentials
export const education: EducationItem[] = [
  {
    "degree": "M.Des. Communication Design",
    "institution": "IDC, IIT Bombay"
  },
  {
    "degree": "B.F.A. Visual Communication",
    "institution": "College of Art, Delhi University"
  }
];

export const experience: ExperienceItem[] = [
  {
    "role": "AI Visual Design Intern",
    "company": "ShareChat & Moj"
  },
  {
    "role": "Freelance Graphic Designer",
    "company": "Physics Wallah"
  },
  {
    "role": "Graphic Designer & Video Editor",
    "company": "Radiation Education"
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
  "fullName": "Suraj Kumar Sharma",
  "brandName": "Sukunsh",
  "roles": [
    "Visual Designer",
    "AI Creative Designer",
    "Motion Designer",
    "Storyboard Artist",
    "AI Film Creator"
  ],
  "bio": "Suraj Kumar Sharma is a Visual Designer and AI Creative Designer with deep experience in branding, motion graphics, UI design, AI-assisted creative workflows, video editing, storyboarding, typography, and visual storytelling.",
  "email": "sukunsh2883@gmail.com",
  "linkedin": "https://www.linkedin.com/in/sukunsh",
  "behance": "https://www.behance.net/sukunshsharma",
  "instagram": "https://www.instagram.com/sukunsh_",
  "accentGradient": "linear-gradient(90deg, #FF6A00 0%, #FFB000 100%)",
  "logoFontFamily": "\"Sukunsh Wordmark\", \"Clash Display Local\", \"Arial Black\", Impact, sans-serif",
  "heroVideoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/v1779644211/make_give_bit_loop_motion_202605242304_vd4fkj.mp4",
  "aboutImage": "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png",
  "aboutImageSecondary": "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png"
};
