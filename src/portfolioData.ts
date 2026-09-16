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
    "title": "RIVR Ad Film",
    "category": "AI Film / Product Ad",
    "year": "2026",
    "description": "AI-directed product film with cinematic ad pacing and polished commercial framing.",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780259813/RIVR_AD_Flim_ln2lz9.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4",
    "tags": [
      "AI Film",
      "Product Ad",
      "Commercial",
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
    "id": "AI film",
    "title": "Ai short Film",
    "type": "Film",
    "year": "2026",
    "description": "Academic photo communication study capturing extreme body elasticity, suspension leaps, and somatic contour lighting.",
    "image": "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216477/MacBook_Pro_16__-_1_bsd6qe.png",
    "tools": [
      "Studio Spotlight Rigging",
      "Motion Capture",
      "Contrast Optimization",
      "Academic Layouts"
    ],
    "link": "mailto:Sukunsh2883@gmail.com",
    "client": "College of Art, Delhi University",
    "aboutProject": "Action photography is an incredibly exciting genre to shoot. Under the guidance of Mr. Parveen Kumar, the study explores body contouring using high-density side lighting and extreme raw athleticism. It illustrates suspension, equilibrium, and spatial trajectory transitions in darkness.",
    "galleryImages": [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/v1789216477/MacBook_Pro_16__-_1_bsd6qe.png",
      "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png",
      "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png"
    ],
    "isAI": true,
    "pdfUrl": "",
    "uploadedPdfName": "",
    "behanceEmbedUrl": ""
  },
  {
    "id": "design-illustrative-riso",
    "title": "Samozaa  – Brand Identity Design | Food & Beverage",
    "type": "Branding",
    "year": "2026",
    "description": "Concept branding for Somu Samosa, including logo, colors, stickers, and social media designs.",
    "image": "https://mir-cdn.behance.net/v1/rendition/project_modules/source/0cada2251593317.6a3a85ae7be3f.jpg",
    "tools": [
      "Figma",
      "Illustrator"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "NA",
    "aboutProject": "Samozaa is a fictional food brand created as a concept project to explore the branding and visual identity of a modern Indian snack business. The project focuses on creating a fun, memorable, and appealing brand that connects traditional Indian street food with a fresh, youthful visual style.",
    "galleryImages": [
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/0cada2251593317.6a3a85ae7be3f.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/48977a251593317.6a3a85ae7b35a.png",
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
    "id": "design-kinetic-motion",
    "title": "Typographic Picture Book",
    "type": "Typographic Design",
    "year": "2025",
    "description": "Created an experimental typographic picture book for children",
    "image": "https://mir-cdn.behance.net/v1/rendition/project_modules/source/d1fc7a227599367.6842d0a3c192f.png",
    "tools": [
      "After Effects",
      "Illustrator",
      "Premiere Pro"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "IDC",
    "aboutProject": "Created an experimental typographic picture book for children, blending Hindi Devanagari letterforms, animation, and bird illustrations.",
    "galleryImages": [
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/d1fc7a227599367.6842d0a3c192f.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/5132dc227599367.6842d0a3bde07.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/4a5edc227599367.6842d0a3c29e1.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/1964bf227599367.6842d0a3c1186.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/29e342227599367.6842d0a3bc8f5.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/02c3aa227599367.6842d0a3be88b.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/1a632e227599367.6842d0a3bd423.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/b1a51a227599367.6842d0a3babf9.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/1ca87b227599367.6842d0a3bf12f.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/fd8f57227599367.6842d0a3c0732.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/c9bfff227599367.6842d0a3c2214.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/ec1737227599367.6842d0a3bfc32.png"
    ],
    "isAI": false,
    "pdfUrl": "",
    "uploadedPdfName": "",
    "behanceEmbedUrl": ""
  },
  {
    "id": "design-1",
    "title": "AI-powered virtual gifts",
    "type": "AI Image & Video Generation",
    "year": "2026",
    "description": "AI-powered virtual gifts for creators and fans to boost engagement.",
    "image": "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png",
    "tools": [
      "Envato Ai"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "Sharechat",
    "aboutProject": "AI-powered virtual gifts for creators and fans to boost engagement.",
    "galleryImages": [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/bef690244190887.69922d8981229.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/60121c244190887.69922d89831d8.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/311bcd244190887.69922d8982ae3.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/201e1b244190887.69922d8980d00.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/f49c65244190887.69922d8981e54.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/8a51f1244190887.69922d898257c.png"
    ],
    "isAI": true,
    "pdfUrl": "",
    "uploadedPdfName": "",
    "behanceEmbedUrl": ""
  },
  {
    "id": "design-monogram-logos",
    "title": " Apan Makhaan (Information Design)",
    "type": "Visual Design",
    "year": "2025",
    "description": "Created an information design project visualizing the journey of makhana",
    "image": "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_37_mqlouw.png",
    "tools": [
      "Illustrator",
      "Grids",
      "Inking"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "IDC",
    "aboutProject": "Created an information design project visualizing the journey of makhana, from cultivation to processing and packaging.",
    "galleryImages": [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_37_mqlouw.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/a591a3225407905.681c83f22523c.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/dac494225407905.681c83f224b91.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/cc528a225407905.681c83f225f4d.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/9b914c225407905.681c83f225881.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/6f75e1225407905.681c83f2266b2.png"
    ],
    "isAI": false,
    "pdfUrl": "",
    "uploadedPdfName": "",
    "behanceEmbedUrl": ""
  },
  {
    "id": "design-earthquake-map",
    "title": "Branding Sikki Golden Craft",
    "type": "Branding",
    "year": "2025",
    "description": "Created a concept branding project for Sikki Golden Craft, ",
    "image": "https://mir-cdn.behance.net/v1/rendition/project_modules/source/9c717a230154043.6871634147fc9.jpg",
    "tools": [
      "Figma",
      "Illustrator",
      "Evagenerate"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "Self",
    "aboutProject": "Created a concept branding project for Sikki Golden Craft, transforming a local craft brand into an internationally styled brand identity.",
    "galleryImages": [
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/9c717a230154043.6871634147fc9.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/df88ef230154043.68716258a7f7e.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/4a2ec2230154043.68716258a74f3.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/acbe6b230154043.68716258a693f.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/7d1b95230154043.68716258a94ce.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/7f4075230154043.68716258a99f1.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/13cc3a230154043.68716258a8ed4.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/3e5fc0230154043.68716258aa13c.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/cceee4230154043.6871636ca63f7.jpg",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/e02a9f230154043.68716258a8516.jpg"
    ],
    "isAI": false,
    "pdfUrl": "",
    "uploadedPdfName": "",
    "behanceEmbedUrl": ""
  },
  {
    "id": "design-character-anim",
    "title": "Board Game Design",
    "type": "Packaging Design",
    "year": "2025",
    "description": "Designed an educational board game ",
    "image": "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_35_st0j6w.png",
    "tools": [
      "Photoshop",
      "Procreate"
    ],
    "link": "https://www.behance.net/sukunshsharma",
    "client": "IDC",
    "aboutProject": "Designed an educational board game that teaches children earthquake evacuation and safety through fun, interactive gameplay",
    "galleryImages": [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_35_st0j6w.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/f629df212733887.673a9b561ebb8.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/01790b212733887.673a9b561f3af.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/001699212733887.673a9b562031a.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/efb4b8212733887.673a9b5622226.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/c4eb6d212733887.673a9b56237ca.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/f4fdf1212733887.673a9b5621c37.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/30ede1212733887.673a9b5620ba0.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/863764212733887.673a9b561fa7a.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/38fd24212733887.673a9b5623029.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/a48208212733887.673a9b56229b8.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/fcd352212733887.673a9b56244af.png",
      "https://mir-cdn.behance.net/v1/rendition/project_modules/source/132dca212733887.673a9b562146b.png"
    ],
    "isAI": false,
    "pdfUrl": "",
    "uploadedPdfName": "",
    "behanceEmbedUrl": ""
  },
];

// Motion Archive Section List - Sukunsh's Real AI Videos Only
export const videos: VideoCard[] = [
  {
    "id": "video-kenerate-ad",
    "title": "Kenerate Ad Reel",
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
    "title": "Sequence 01 Ad Reel",
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
    "title": "Sequence 01 Reel 06",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260408/Sequence_01_6_c32bs3.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260408/Sequence_01_6_c32bs3.mp4",
    "duration": "00:15",
    "year": "2026",
    "isAI": true
  },
  {
    "id": "video-kenerate-ad-02",
    "title": "Kenerate Ad Reel 02",
    "format": "9:16",
    "type": "AI Ad Reel",
    "thumbnail": "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264091/kenerate-ad-1779833779917_w0ndh7.jpg",
    "videoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264091/kenerate-ad-1779833779917_w0ndh7.mp4",
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
  "instagram": "https://www.instagram.com/sukunsh",
  "accentGradient": "linear-gradient(90deg, #FF6A00 0%, #FFB000 100%)",
  "logoFontFamily": "\"Sukunsh Wordmark\", \"Clash Display Local\", \"Arial Black\", Impact, sans-serif",
  "heroVideoUrl": "https://res.cloudinary.com/dylv5m3jk/video/upload/v1779644211/make_give_bit_loop_motion_202605242304_vd4fkj.mp4",
  "aboutImage": "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png",
  "aboutImageSecondary": "https://res.cloudinary.com/dylv5m3jk/image/upload/v1785077426/download_24_dl22dv.png",
  "badgeRole": "Visual Designer • IDC IIT Bombay",
  "location": "Delhi, India",
  "aboutHeading": "I'm a Delhi-based Web Designer.",
  "narrativeQuote": "Blending fine art sensibilities with contemporary design, crafting evocative visual stories through motion, typography and creative precision.",
  "projectsHeading": "Projects",
  "aiFilmHeading": "AI Film",
  "aiFilmSubtitle": "Curated cinematic visual direction generated and framed with high-fidelity creative systems.",
  "aiReelsHeading": "AI MOTION REELS",
  "aiReelsSubtitle": "Cinematic AI motion reels, prompt experiments, and commercial dynamic vignettes.",
  "contactHeading": "Let's make something meaningful together.",
  "instagramHandle": "@Sukunsh_",
  "education": [
    {
      "degree": "M.Des - IDC School of Design",
      "institution": "IIT Bombay"
    },
    {
      "degree": "BFA, Visual Communication",
      "institution": "College of Art, Delhi"
    }
  ],
  "experience": [
    {
      "role": "Visual Designer",
      "company": "ShareChat"
    }
  ]
};
