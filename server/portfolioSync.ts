import fs from "fs";
import path from "path";

export const defaultJournalPosts = [
  {
    id: "journal-1",
    title: "How AI is changing visual design workflows",
    date: "2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-2",
    title: "Designing cinematic product ads with generative video",
    date: "2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-3",
    title: "From storyboard frames to full AI cinema reels",
    date: "2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1542204172-e7052809a86e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-4",
    title: "Why typography still matters in AI visual direction",
    date: "2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800&auto=format&fit=crop"
  }
];

export const defaultEducation = [
  {
    degree: "M.Des. Communication Design",
    institution: "IDC, IIT Bombay"
  },
  {
    degree: "B.F.A. Visual Communication",
    institution: "College of Art, Delhi University"
  }
];

export const defaultExperience = [
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

export const defaultSkills = [
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

export const defaultSoftware = [
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

export const defaultResumeCategories = [
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

export const defaultProfile = {
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

export function buildPortfolioTsContent(data: {
  aiFilms: any[];
  designProjects: any[];
  videos: any[];
  explorations: any[];
  journalPosts?: any[];
  education?: any[];
  experience?: any[];
  skills?: any[];
  software?: any[];
  RESUME_CATEGORIES?: any[];
  profile: any;
}): string {
  const journalPosts = data.journalPosts && data.journalPosts.length > 0 ? data.journalPosts : defaultJournalPosts;
  const education = data.education && data.education.length > 0 ? data.education : defaultEducation;
  const experience = data.experience && data.experience.length > 0 ? data.experience : defaultExperience;
  const skills = data.skills && data.skills.length > 0 ? data.skills : defaultSkills;
  const software = data.software && data.software.length > 0 ? data.software : defaultSoftware;
  const resumeCategories = data.RESUME_CATEGORIES && data.RESUME_CATEGORIES.length > 0 ? data.RESUME_CATEGORIES : defaultResumeCategories;
  const profile = { ...defaultProfile, ...(data.profile || {}) };

  return `/**
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
export const aiFilms: AIFilm[] = ${JSON.stringify(data.aiFilms || [], null, 2)};

// Selected Design Works List
export const designProjects: DesignProject[] = ${JSON.stringify(data.designProjects || [], null, 2)};

// Motion Archive Section List - Sukunsh's Real AI Videos Only
export const videos: VideoCard[] = ${JSON.stringify(data.videos || [], null, 2)};

// Explorations Section List
export const explorations: ExplorationItem[] = ${JSON.stringify(data.explorations || [], null, 2)};

// Recent Journal Posts
export const journalPosts: JournalPost[] = ${JSON.stringify(journalPosts, null, 2)};

// Professional Credentials
export const education: EducationItem[] = ${JSON.stringify(education, null, 2)};

export const experience: ExperienceItem[] = ${JSON.stringify(experience, null, 2)};

export const skills: string[] = ${JSON.stringify(skills, null, 2)};

export const software: string[] = ${JSON.stringify(software, null, 2)};

export const RESUME_CATEGORIES = ${JSON.stringify(resumeCategories, null, 2)};

// Profile Details
export const profile = ${JSON.stringify(profile, null, 2)};
`;
}
