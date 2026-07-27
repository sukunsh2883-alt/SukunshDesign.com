import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Globe, Eye, Palette, Check, RefreshCw, Settings, Sliders, ArrowUpRight } from "lucide-react";
import { DesignProject } from "../portfolioData";

interface ProjectCaseStudyProps {
  project: DesignProject;
  allProjects?: DesignProject[];
  onClose: () => void;
  onUpdateProject?: (updated: DesignProject) => void;
}

// Comprehensive professional bilingual translation mapping for all portfolio projects
const PROJECT_TRANSLATIONS: Record<string, {
  en: { title: string; description: string; category: string; role: string };
  ja: { title: string; description: string; category: string; role: string };
}> = {
  "AI film": {
    en: {
      title: "Ai short Film",
      description: "Academic photo communication study capturing body elasticity, somatic contour lighting, and levitating leaps.",
      category: "Cinematic Production",
      role: "AI DIRECTION / CINEMATOGRAPHY / AUDIO DESIGN"
    },
    ja: {
      title: "AIショートフィルム",
      description: "身体の弾力性、体細胞の輪郭照明、そして空中浮遊する跳躍を捉えた、学術的な写真コミュニケーション研究。",
      category: "映画制作・プロダクション",
      role: "AIディレクション / シネマトグラフィ / 音響デザイン"
    }
  },
  "design-illustrative-riso": {
    en: {
      title: "Risography Welcome Cards",
      description: "Designed, layered, and printed tactile welcome cards and illustrations utilizing physical Risography duplicators.",
      category: "Risography Illustration",
      role: "GRAPHIC DESIGN / LAYER DESIGN / PRINT PRODUCTION"
    },
    ja: {
      title: "リソグラフのウェルカムカード",
      description: "触覚的なリソグラフ印刷機を使用し、温かみのあるウェルカムカードや絵本の挿絵をレイヤー設計・印刷。",
      category: "リソグラフ・イラストレーション",
      role: "グラフィックデザイン / レイヤー設計 / 印刷管理"
    }
  },
  "design-kinetic-motion": {
    en: {
      title: "Fluid Kinetic Promo Loop",
      description: "Immersive branded motion sequence demonstrating complex layout transformations and typographic rhythm.",
      category: "Kinetic Layout",
      role: "MOTION DESIGN / ART DIRECTION / BRANDING"
    },
    ja: {
      title: "流体キネティック・プロモループ",
      description: "複雑なレイアウト変換とタイポグラフィの遷移を示す、ブランドのモーショングラフィックス動画シーケンス。",
      category: "キネティック・レイアウト",
      role: "モーションデザイン / アートディレクション / ブランディング"
    }
  },
  "design-1": {
    en: {
      title: "Brand Identity Layouts",
      description: "Comprehensive visual identity guidelines with high-contrast publication grids and editorial systems.",
      category: "Visual Identity",
      role: "CREATIVE DIRECTION / BRAND SYSTEM / LAYOUT"
    },
    ja: {
      title: "ブランドアイデンティティ・レイアウト",
      description: "力強いタイポグラフィ、色彩アクセントスキーム、映画的なブランドガイドラインを備えた視覚システム。",
      category: "ビジュアル・アイデンティティ",
      role: "クリエイティブディレクション / ブランド構築 / レイアウト"
    }
  },
  "design-monogram-logos": {
    en: {
      title: "Minimal Monogram logos",
      description: "Fusing geometric monolith structures with elegant hand-lettering to compile modern monogram brand marks.",
      category: "Monogram Branding",
      role: "LOGO DESIGN / CALLIGRAPHY / VECTOR ART"
    },
    ja: {
      title: "ミニマルなモノグラムロゴ",
      description: "幾何学的なモノリスレイアウトと優雅な書体を融合させ、レスポンシブで現代的な企業ロゴデザインを制作。",
      category: "モノグラム・ブランディング",
      role: "ロゴデザイン / カリグラフィー / ベクターアート"
    }
  },
  "design-earthquake-map": {
    en: {
      title: "Disaster Pedagogy Map",
      description: "High-density educational layout visualizing earthquake evacuation vectors, safety coordinates, and risk metrics.",
      category: "Information Map",
      role: "INFORMATION DESIGN / INFOGRAPHICS / RESEARCH"
    },
    ja: {
      title: "防災教育マップ",
      description: "構造的な危険区域と安全な避難経路を明確なインフォグラフィックで示した、高密度の避難地図設計。",
      category: "情報システム・地図設計",
      role: "情報デザイン / インフォグラフィックス / フィールド調査"
    }
  },
  "design-character-anim": {
    en: {
      title: "Neuro 2D Character Run",
      description: "A frame-by-frame 2D hand-drawn running cycle highlighting fluid action, clothing inertia, and drag mechanics.",
      category: "Character Animation",
      role: "CHARACTER ANIMATION / ILLUSTRATION / 2D ART"
    },
    ja: {
      title: "ニューロ2Dキャラクター走運動",
      description: "流れるような動き、衣服の慣性、風の抵抗を際立たせた、手描きのコマ送り2Dキャラクター走のサイクル。",
      category: "キャラクター・アニメーション",
      role: "キャラクターアニメーション / 作画 / 2Dアート"
    }
  },
  "design-pw-socials": {
    en: {
      title: "PW Campaign Creatives",
      description: "Vibrant branded layouts, visual compositions, and social media advertising grids tailored for extensive outreach.",
      category: "Social Campaign",
      role: "GRAPHIC DESIGN / SOCIAL MEDIA / DIGITAL ASSETS"
    },
    ja: {
      title: "PWキャンペーン・クリエイティブ",
      description: "広範なデジタル配信のために設計された、ブランドのビジュアルレイアウト投稿、バナー、広告合成イメージ。",
      category: "ソーシャル・キャンペーン",
      role: "グラフィックデザイン / ソーシャルメディア / デジタルアセット"
    }
  },
  "design-2": {
    en: {
      title: "Typographic Children’s Book",
      description: "A physical publication concept where expressive kinetic layouts replace traditional illustration forms.",
      category: "Editorial Design",
      role: "EDITORIAL DESIGN / BOOK WRITING / TYPOGRAPHY"
    },
    ja: {
      title: "タイポグラフィ絵本",
      description: "表現豊かで動的なタイポグラフィが伝統的なイラストに代わる、新しい物語の視覚フォーマット。",
      category: "エディトリアル・書籍装丁",
      role: "エディトリアルデザイン / 装丁 / タイポグラフィ"
    }
  },
  "design-eco-box": {
    en: {
      title: "Aftershock Board Packaging",
      description: "Sustainable structure and layout design for board game packaging including dividers and rules cases.",
      category: "Packaging Design",
      role: "PACKAGING DESIGN / STRUCTURAL LAYOUT / ECO-BOX"
    },
    ja: {
      title: "アフターショック・ボードパッケージ",
      description: "特製の仕切りやルール解説ケースを備えた、環境に優しい段ボールの構造的パッケージレイアウト。",
      category: "パッケージ・デザイン",
      role: "パッケージデザイン / 構造レイアウト / エコボックス設計"
    }
  },
  "design-3": {
    en: {
      title: "Aftershock: Escape Quake",
      description: "A collaborative educational board game simulating tactical evacuation and emergency scenarios.",
      category: "Game Blueprints",
      role: "GAME DESIGN / ILLUSTRATION / SYSTEM BLUEPRINTS"
    },
    ja: {
      title: "アフターショック：地震からの脱出",
      description: "戦略的な教育を通じて、現実世界の地震避難シナリオをシミュレートする包括的なボードゲーム。",
      category: "ゲーム・ブループリント",
      role: "ゲームデザイン / イラストレーション / システム設計"
    }
  },
  "design-4": {
    en: {
      title: "AI Virtual Gifts & UI",
      description: "Sleek virtual rewards, frosted glass interface materials, and custom interactive assets.",
      category: "UI UX & 3D Render",
      role: "UI UX DESIGN / 3D RENDERING / PRODUCT ASSETS"
    },
    ja: {
      title: "AIバーチャルギフト & UI",
      description: "最大限のエンゲージメントを目指してモデリングされた、AI生成の特製ギフト、ガラスUI素材、インターフェース。",
      category: "UI UX & 3Dレンダリング",
      role: "UI UXデザイン / 3Dレンダリング / プロダクトアセット"
    }
  }
};

// Fluid agency-grade theme palette mappings
const getProjectBgColor = (id: string) => {
  const colors: Record<string, string> = {
    "AI film": "bg-[#E11D48]", // Deep Rose Red
    "design-illustrative-riso": "bg-[#FDA4AF]", // Soft Coral Rose
    "design-kinetic-motion": "bg-[#7C3AED]", // Royal Purple
    "design-1": "bg-[#334155]", // Modern Slate Gray
    "design-monogram-logos": "bg-[#EA580C]", // Bright Orange
    "design-earthquake-map": "bg-[#D97706]", // Industrial Amber
    "design-character-anim": "bg-[#0D9488]", // Vibrant Teal
    "design-pw-socials": "bg-[#2563EB]", // Deep Ocean Blue
    "design-2": "bg-[#9F1239]", // Rich Crimson
    "design-eco-box": "bg-[#15803D]", // Organic Green
    "design-3": "bg-[#C2410C]", // Terracotta Clay
    "design-4": "bg-[#0891B2]", // Electric Cyan
  };
  return colors[id] || "bg-[#171717]";
};

// Generates exactly 5 stunning high-resolution design showcase images for each project
const getProjectGalleryImages = (proj: DesignProject): string[] => {
  const primary = proj.image || "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200";
  
  const galleries: Record<string, string[]> = {
    "AI film": [
      primary,
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200"
    ],
    "design-illustrative-riso": [
      primary,
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200",
      "https://images.unsplash.com/photo-1501472312651-726afd116ff1?q=80&w=1200"
    ],
    "design-kinetic-motion": [
      primary,
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200"
    ],
    "design-1": [
      primary,
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200"
    ],
    "design-monogram-logos": [
      primary,
      "https://images.unsplash.com/photo-1626785774625-ddc7c8241314?q=80&w=1200",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200",
      "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?q=80&w=1200"
    ],
    "design-earthquake-map": [
      primary,
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200",
      "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1200",
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=1200",
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200"
    ],
    "design-character-anim": [
      primary,
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
      "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200"
    ],
    "design-pw-socials": [
      primary,
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
      "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200"
    ],
    "design-2": [
      primary,
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1200",
      "https://images.unsplash.com/photo-1474932430478-367db26831c1?q=80&w=1200"
    ],
    "design-eco-box": [
      primary,
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1200",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200",
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1200"
    ],
    "design-3": [
      primary,
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1200",
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=1200",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200",
      "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=1200"
    ],
    "design-4": [
      primary,
      "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200"
    ]
  };

  const list = galleries[proj.id] || [
    primary,
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200",
    "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200"
  ];

  return list.slice(0, 5);
};

export default function ProjectCaseStudy({ project, allProjects = [], onClose, onUpdateProject }: ProjectCaseStudyProps) {
  // Seamlessly transition project views internally inside this gorgeous modal
  const [activeProj, setActiveProj] = useState<DesignProject>(project);
  const [lang, setLang] = useState<"en" | "ja">("en");

  // State configurations for administrative customizer
  const [showSettings, setShowSettings] = useState(false);
  const [embedInput, setEmbedInput] = useState(activeProj.behanceEmbedUrl || activeProj.link || "");
  const [thumbnailInput, setThumbnailInput] = useState(activeProj.image || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Gallery slider control configurations
  const rightColumnRef = React.useRef<HTMLDivElement>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const galleryImages = getProjectGalleryImages(activeProj);

  // Sync inputs when active project transitions
  useEffect(() => {
    setEmbedInput(activeProj.behanceEmbedUrl || activeProj.link || "");
    setThumbnailInput(activeProj.image || "");
    setActiveImgIndex(0);
    if (rightColumnRef.current) {
      rightColumnRef.current.scrollTop = 0;
    }
  }, [activeProj]);

  // Lock body scroll when overlay mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Sync back live customizer edits to dashboard state
  useEffect(() => {
    if (onUpdateProject) {
      onUpdateProject({
        ...activeProj,
        behanceEmbedUrl: embedInput.trim(),
        link: embedInput.trim(),
        image: thumbnailInput.trim(),
      });
    }
  }, [embedInput, thumbnailInput]);

  const handleSaveChanges = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Find the list of other display projects for bottom-right carousel
  const carouselProjects = allProjects.length > 0 ? allProjects : [activeProj];
  
  // Find index of current project in full list (padded to 2 digits)
  const activeIndex = carouselProjects.findIndex((p) => p.id === activeProj.id);
  const paddedIndex = (activeIndex !== -1 ? activeIndex + 1 : 1).toString().padStart(2, "0");

  // Safely extract bilingual translation parameters
  const translation = PROJECT_TRANSLATIONS[activeProj.id] || {
    en: {
      title: activeProj.title,
      description: activeProj.description || "Establish seamless, premium design layouts, publication grids, and immersive branding case studies directly.",
      category: activeProj.type,
      role: activeProj.tools?.join(" / ") || "ART DIRECTION / CREATIVE PRODUCTION"
    },
    ja: {
      title: activeProj.title,
      description: activeProj.description || "確立された視覚表現システム、グリッドレイアウト、および没入感のあるブランド・ケーススタディの開発。",
      category: activeProj.type,
      role: activeProj.tools?.join(" / ") || "アートディレクション / クリエイティブ制作"
    }
  };

  const activeContent = lang === "en" ? translation.en : translation.ja;

  const handleViewSite = () => {
    if (activeProj.link) {
      window.open(activeProj.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleRightScroll = () => {
    if (rightColumnRef.current) {
      const container = rightColumnRef.current;
      const index = Math.round(container.scrollTop / container.clientHeight);
      if (index >= 0 && index < galleryImages.length && index !== activeImgIndex) {
        setActiveImgIndex(index);
      }
    }
  };

  const handleThumbnailClick = (idx: number) => {
    if (rightColumnRef.current) {
      const container = rightColumnRef.current;
      container.scrollTo({
        top: idx * container.clientHeight,
        behavior: "smooth"
      });
      setActiveImgIndex(idx);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-white overflow-hidden flex flex-col md:flex-row h-full w-full select-none"
    >
      {/* LEFT COLUMN: Clean Editorial Presentation (~38% Width on Desktop) */}
      <div className="w-full md:w-[38%] bg-white flex flex-col h-full overflow-y-auto px-8 md:px-12 py-8 relative">
        
        {/* Row 1: Floating Circular Close and Language Selector */}
        <div className="flex items-center justify-between w-full mb-12">
          <div className="flex items-center gap-6">
            {/* Close Circular Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md group"
              aria-label="Close details"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Clean Editorial EN/JA Language Switcher */}
            <div className="flex items-center gap-3 font-sans text-xs">
              <button
                onClick={() => setLang("en")}
                className={`font-semibold tracking-wider transition-all cursor-pointer ${
                  lang === "en" ? "text-black border-b-2 border-black pb-0.5" : "text-neutral-400 hover:text-black pb-0.5"
                }`}
              >
                EN
              </button>
              <span className="text-neutral-300 select-none">/</span>
              <button
                onClick={() => setLang("ja")}
                className={`font-semibold tracking-wider transition-all cursor-pointer ${
                  lang === "ja" ? "text-black border-b-2 border-black pb-0.5" : "text-neutral-400 hover:text-black pb-0.5"
                }`}
              >
                JA
              </button>
            </div>
          </div>
        </div>

        {/* Content wrapper with beautiful vertical rhythm */}
        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto md:mx-0 w-full text-left">
          
          {/* Project Index */}
          <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 block mb-3 uppercase">
            {paddedIndex}
          </span>

          {/* Project Title with massive, space-tight display weight */}
          <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-neutral-900 leading-none mb-6">
            {activeContent.title}
          </h2>

          {/* Project Description with balanced reading density */}
          <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-sans mb-10 font-normal">
            {activeContent.description}
          </p>

          {/* Editorial Horizontal Divider */}
          <div className="w-full h-[1px] bg-neutral-200 mb-8" />

          {/* Metadata Table */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-left mb-12">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400 block mb-1">
                Category
              </span>
              <span className="text-xs font-sans font-medium text-neutral-800 uppercase tracking-wider block">
                {activeContent.category}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400 block mb-1">
                Role
              </span>
              <span className="text-xs font-sans font-medium text-neutral-800 uppercase tracking-wide block leading-relaxed">
                {activeContent.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {activeProj.link && (
              <button
                onClick={handleViewSite}
                className="group self-start flex items-center justify-center gap-2.5 px-8 py-3.5 border border-neutral-300 hover:border-black rounded-full text-xs font-bold uppercase tracking-widest text-neutral-700 hover:text-black hover:bg-neutral-50 transition-all cursor-pointer shadow-sm active:scale-95 duration-300"
              >
                <span>View Site</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}

            {/* Back to main page button explicitly requested */}
            <button
              onClick={onClose}
              className="group self-start flex items-center justify-center gap-2 text-xs font-sans font-medium text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer mt-4"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Main Portfolio</span>
            </button>
          </div>
        </div>

        {/* Bottom Panel: Admin Customizer toggle button */}
        <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-400">
            ID: {activeProj.id}
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider text-neutral-400 hover:text-neutral-900 bg-neutral-50 border border-neutral-200 cursor-pointer hover:border-neutral-400 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize metadata</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Full-Bleed Dynamic Scroll Showcase with 5 snaps (~62% Width on Desktop) */}
      <div className={`w-full md:w-[62%] ${getProjectBgColor(activeProj.id)} relative h-full overflow-hidden flex flex-col transition-all duration-700 ease-in-out`}>
        
        {/* Floating Ambient Background Rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-[800px] h-[800px] rounded-full bg-white/5 -top-1/4 -right-1/4 blur-3xl animate-pulse" />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-black/10 -bottom-1/4 -left-1/4 blur-3xl" />
        </div>

        {/* Scrollable container for the 5 full-bleed images */}
        <div
          ref={rightColumnRef}
          onScroll={handleRightScroll}
          className="w-full h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth relative z-10"
        >
          {galleryImages.map((imgUrl, idx) => (
            <div 
              key={idx} 
              className="w-full h-full snap-start relative flex items-center justify-center p-6 md:p-12 shrink-0"
              style={{ height: "100%" }}
            >
              {/* Center Floating Presentation Card */}
              <div className="relative w-full max-w-[90%] md:max-w-[80%] aspect-[1.4] rounded-2xl overflow-hidden bg-black/10 backdrop-blur-sm border border-white/10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.45)] flex items-center justify-center p-3">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, margin: "-10%" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={imgUrl}
                  alt={`${activeProj.title} showcase ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl shadow-lg select-none"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=1200";
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Right: Slide Navigation Strip representing the 5 project images */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-12 z-20 flex flex-col items-end gap-2 bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/70 select-none">
            Slide {activeImgIndex + 1} of 5
          </span>
          <div className="flex gap-1.5 max-w-[280px] md:max-w-[420px] overflow-x-auto scrollbar-none">
            {galleryImages.map((imgUrl, idx) => {
              const isActive = idx === activeImgIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative w-10 h-7 rounded-md overflow-hidden cursor-pointer border transition-all shrink-0 hover:scale-105 active:scale-95 ${
                    isActive 
                      ? "border-white scale-110 shadow-md" 
                      : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/30"
                  }`}
                  title={`Go to slide ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=80";
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Left Badge */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-12 z-20 hidden sm:flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-sans text-white/50 uppercase tracking-[0.25em] font-medium">
            Creative Portfolio // Scroll to explore
          </span>
        </div>
      </div>

      {/* ADMIN METADATA CUSTOMIZER OVERLAY PANEL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg p-6 text-left shadow-2xl relative"
            >
              {/* Close Customizer */}
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 mb-6">
                <Palette className="w-5 h-5 text-[#FF6A00]" />
                <div>
                  <h4 className="text-sm font-sans font-bold text-white tracking-wide">
                    Live Metadata Customizer
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Tweak current project properties in real-time.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Field 1: Live Demo Link URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 block">
                    Live Demo / Site Target Link
                  </label>
                  <input
                    type="text"
                    value={embedInput}
                    onChange={(e) => setEmbedInput(e.target.value)}
                    placeholder="e.g. https://www.behance.net/gallery/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6A00] transition-all font-mono"
                  />
                  <span className="text-[9px] text-neutral-400 block">
                    Defines where the "View Site" button redirects.
                  </span>
                </div>

                {/* Field 2: Custom Cover/Showcase Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 block">
                    Mock Showcase Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={thumbnailInput}
                      onChange={(e) => setThumbnailInput(e.target.value)}
                      placeholder="Paste any high-resolution image URL"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-white/5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF6A00] transition-all font-mono"
                    />
                    {thumbnailInput && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
                        <img
                          src={thumbnailInput}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=80";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-400 block">
                    Updates the primary image representation inside this card.
                  </span>
                </div>
              </div>

              {/* Status footer inside customizer sheet */}
              <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-white/5">
                <span className="text-[10px] font-mono text-[#FF6A00] animate-pulse">
                  ● Direct Sync Active
                </span>
                <button
                  onClick={handleSaveChanges}
                  className={`px-5 py-2 rounded-xl text-xs font-sans font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] ${
                    saveSuccess 
                      ? "bg-green-500 text-white" 
                      : "bg-[#FF6A00] text-white hover:bg-orange-600"
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Changes Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
