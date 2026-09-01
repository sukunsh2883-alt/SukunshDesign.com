import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

interface FooterProps {
  profile: any;
  onNavigate?: (id: string) => void;
}

interface HoveredBotanical {
  role: "flower" | "leaf" | "stem";
  name: string;
  label: string;
  x: number;
  y: number;
}

export default function Footer({ profile, onNavigate }: FooterProps) {
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const [artworkMarkup, setArtworkMarkup] = useState("");
  const [botanicalCounts, setBotanicalCounts] = useState({ flower: 0, leaf: 0, stem: 0 });
  const [hoveredInfo, setHoveredInfo] = useState<HoveredBotanical | null>(null);
  const [isBreezing, setIsBreezing] = useState(false);
  const breezeImpulseRef = useRef(0);

  useEffect(() => {
    let active = true;

    fetch("/artwork/last.svg")
      .then((response) => response.text())
      .then((markup) => {
        if (active) setArtworkMarkup(markup);
      })
      .catch(() => {
        if (active) setArtworkMarkup("");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = artworkRef.current;
    if (!root) return;

    const svg = root.querySelector("svg");
    if (!svg) return;

    svg.setAttribute("preserveAspectRatio", "xMinYMax meet");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focusable = Array.from(svg.querySelectorAll("path, ellipse, circle, line, rect")) as SVGGraphicsElement[];
    svg.style.pointerEvents = "auto";

    const pieces: Array<{
      el: SVGGraphicsElement;
      cx: number;
      cy: number;
      role: "flower" | "leaf" | "stem";
      phase: number;
      speed: number;
      strength: number;
      label: string;
      clickImpulse: number;
      hoverIn: (e: PointerEvent) => void;
      hoverOut: () => void;
      handleClick: () => void;
    }> = [];
    const hoveredPieces = new Set<SVGGraphicsElement>();

    const getBbox = (el: SVGGraphicsElement) => {
      try {
        return el.getBBox();
      } catch {
        return null;
      }
    };

    const getFill = (el: SVGGraphicsElement) => (el.getAttribute("fill") || "").toLowerCase();
    const getStroke = (el: SVGGraphicsElement) => (el.getAttribute("stroke") || "").toLowerCase();
    const getClassName = (el: SVGGraphicsElement) => (el.getAttribute("class") || "").toLowerCase();

    const isBackgroundBox = (box: DOMRect | SVGRect) => box.width > 1200 && box.height > 700;
    const roleCounters: Record<"flower" | "leaf" | "stem", number> = { flower: 0, leaf: 0, stem: 0 };

    focusable.forEach((el, index) => {
      const box = getBbox(el);
      if (!box || box.width === 0 || box.height === 0 || isBackgroundBox(box)) return;

      const fill = getFill(el);
      const stroke = getStroke(el);
      const cls = getClassName(el);

      const isFlower =
        fill.includes("f9faed") ||
        fill.includes("ffee") ||
        fill.includes("f9bc41") ||
        fill.includes("e9702f") ||
        fill.includes("d75027") ||
        fill.includes("ffecd2") ||
        fill.includes("ff5a28") ||
        fill.includes("712a14") ||
        fill.includes("radialgradient") ||
        fill.includes("svgid_") ||
        cls.includes("st4") ||
        cls.includes("st5") ||
        cls.includes("st7") ||
        cls.includes("st8") ||
        cls.includes("st9") ||
        cls.includes("st10");

      const isStem =
        stroke.includes("5e6363") ||
        stroke.includes("545251") ||
        stroke.includes("4d4325") ||
        cls.includes("st3") ||
        cls.includes("st6");

      const role: "flower" | "leaf" | "stem" = isStem ? "stem" : isFlower ? "flower" : "leaf";

      roleCounters[role] += 1;
      const count = roleCounters[role];
      const botanicalName = `${role}-${count}`;
      const label =
        role === "flower"
          ? `Flower Petal #${count}`
          : role === "leaf"
            ? `Botanical Leaf #${count}`
            : `Living Stem #${count}`;

      el.classList.add("botanical-piece", `botanical-${role}`);
      el.setAttribute("data-botanical-role", role);
      el.setAttribute("data-botanical-name", botanicalName);
      el.setAttribute("data-botanical-index", String(index));
      el.setAttribute("aria-label", label);
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = "50% 100%";
      el.style.pointerEvents = "auto";
      el.style.cursor = "pointer";
      el.style.transition = "filter 0.3s ease";

      // Add SVG title element for browser hover tooltips
      const existingTitle = el.querySelector("title");
      if (!existingTitle) {
        const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title");
        titleEl.textContent = `${label} - Hover to view animation`;
        el.appendChild(titleEl);
      }

      const phase = index * 0.37;
      const speed = role === "stem" ? 0.75 : role === "flower" ? 1.05 : 0.88;
      const strength = role === "stem" ? 0.82 : role === "flower" ? 1.35 : 1.12;

      let pieceObj: (typeof pieces)[0];

      const hoverIn = (event: PointerEvent) => {
        hoveredPieces.add(el);
        const rect = svg.getBoundingClientRect();
        setHoveredInfo({
          role,
          name: botanicalName,
          label,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      };

      const hoverOut = () => {
        hoveredPieces.delete(el);
        setHoveredInfo(null);
      };

      const handleClick = () => {
        if (pieceObj) {
          pieceObj.clickImpulse = 1.0;
        }
      };

      el.addEventListener("pointerenter", hoverIn as any);
      el.addEventListener("pointerleave", hoverOut);
      el.addEventListener("click", handleClick);

      pieceObj = {
        el,
        cx: box.x + box.width / 2,
        cy: box.y + box.height / 2,
        role,
        phase,
        speed,
        strength,
        label,
        clickImpulse: 0,
        hoverIn,
        hoverOut,
        handleClick,
      };

      pieces.push(pieceObj);
    });

    setBotanicalCounts({ ...roleCounters });

    if (reduceMotion || pieces.length === 0) return;

    const rectState = { left: 0, top: 0, scaleX: 1, scaleY: 1, width: 1, height: 1 };
    const updateRect = () => {
      const bounds = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      rectState.left = bounds.left;
      rectState.top = bounds.top;
      rectState.width = bounds.width || 1;
      rectState.height = bounds.height || 1;
      rectState.scaleX = viewBox.width / rectState.width;
      rectState.scaleY = viewBox.height / rectState.height;
    };

    updateRect();

    let pointer: { x: number; y: number } | null = null;
    let raf = 0;

    const handleMove = (event: PointerEvent) => {
      const localX = (event.clientX - rectState.left) * rectState.scaleX;
      const localY = (event.clientY - rectState.top) * rectState.scaleY;
      pointer = { x: localX, y: localY };
    };

    const clearPointer = () => {
      pointer = null;
    };

    const animate = (now: number) => {
      const time = now * 0.001;

      if (breezeImpulseRef.current > 0) {
        breezeImpulseRef.current = Math.max(0, breezeImpulseRef.current - 0.015);
      }
      const breeze = breezeImpulseRef.current;

      for (let i = 0; i < pieces.length; i += 1) {
        const piece = pieces[i];
        if (piece.clickImpulse > 0) {
          piece.clickImpulse = Math.max(0, piece.clickImpulse - 0.03);
        }
        const impulse = piece.clickImpulse;

        const drift = Math.sin(time * 0.35 + piece.phase * 0.58);
        const flutter = Math.sin(time * piece.speed + piece.phase);
        const lift = Math.cos(time * (piece.speed * 0.88) + piece.phase * 1.35);
        const twist = Math.sin(time * (piece.speed * 0.7) + piece.phase * 0.88);

        const waveX = drift * (3.5 + piece.strength * 3.2) + flutter * (3.0 + piece.strength * 2.4);
        const waveY =
          lift * (2.5 + piece.strength * 2.0) + Math.sin(time * 0.45 + piece.phase) * (1.2 + piece.strength * 0.8);
        const waveR = twist * (4.8 + piece.strength * 4.2);

        let tx = waveX + Math.sin(time * 2.5 + piece.phase) * breeze * 24;
        let ty = waveY - Math.cos(time * 2.0 + piece.phase) * breeze * 16;
        let rot = waveR + Math.sin(time * 3.0 + piece.phase) * breeze * 18;
        let scale = 1 + Math.sin(time * 0.45 + piece.phase * 0.7) * 0.015 + impulse * 0.22;

        if (pointer) {
          const dx = piece.cx - pointer.x;
          const dy = piece.cy - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const influence = Math.max(0, 1 - distance / 220);

          if (influence > 0) {
            const awayX = (dx / distance) * influence * (14 + piece.strength * 6.5);
            const awayY = (dy / distance) * influence * (10 + piece.strength * 5.0);
            tx += awayX;
            ty += awayY;
            rot += (dx / distance) * influence * (8.5 + piece.strength * 3.2);
            scale += influence * 0.06;
          }
        }

        const isHovered = hoveredPieces.has(piece.el);
        if (isHovered) {
          const pulse = 1 + Math.sin(time * 3.8 + piece.phase) * 0.025;
          tx += Math.sin(time * 2.2 + piece.phase) * (3.5 + piece.strength * 2.2);
          ty += Math.cos(time * 1.8 + piece.phase) * (3.0 + piece.strength * 1.8);
          rot += Math.sin(time * 2.0 + piece.phase) * (6.0 + piece.strength * 2.0);
          scale *= 1.2 * pulse;
          piece.el.style.filter =
            piece.role === "flower"
              ? "drop-shadow(0 0 10px rgba(249, 250, 237, 0.95)) brightness(1.25)"
              : "drop-shadow(0 0 8px rgba(127, 113, 62, 0.85)) brightness(1.2)";
        } else {
          piece.el.style.filter = "none";
        }

        piece.el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`;
      }

      raf = window.requestAnimationFrame(animate);
    };

    raf = window.requestAnimationFrame(animate);
    svg.addEventListener("pointermove", handleMove);
    svg.addEventListener("pointerleave", clearPointer);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", clearPointer);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      svg.removeEventListener("pointermove", handleMove);
      svg.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", clearPointer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      pieces.forEach(({ el, hoverIn, hoverOut, handleClick }) => {
        el.removeEventListener("pointerenter", hoverIn as any);
        el.removeEventListener("pointerleave", hoverOut);
        el.removeEventListener("click", handleClick);
      });
    };
  }, [artworkMarkup]);

  const triggerBreeze = () => {
    breezeImpulseRef.current = 1.5;
    setIsBreezing(true);
    setTimeout(() => setIsBreezing(false), 2000);
  };

  return (
    <footer id="contact" data-cursor-tag="Contact Me" className="relative min-h-[760px] overflow-hidden bg-[#111111] text-[#f3f4f4] select-none sm:min-h-[650px] md:min-h-[520px]">
      <div className="absolute inset-0 bg-[#111111]" />

      <div ref={artworkRef} className="footer-artwork absolute inset-0 z-10 overflow-visible" aria-label="Interactive Botanical Artwork with Leaves and Flowers">
        {artworkMarkup ? <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: artworkMarkup }} /> : null}
      </div>

      {/* Floating Botanical Hover Badge */}
      <AnimatePresence>
        {hoveredInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 5 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: Math.min(Math.max(hoveredInfo.x - 70, 20), window.innerWidth - 180),
              top: Math.max(hoveredInfo.y - 45, 20),
            }}
            className="pointer-events-none z-30 flex items-center gap-2 rounded-full border border-white/20 bg-[#181818]/90 px-3.5 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md"
          >
            <span className="text-sm">
              {hoveredInfo.role === "flower" ? "🌸" : hoveredInfo.role === "leaf" ? "🌿" : "🌱"}
            </span>
            <span className="capitalize">{hoveredInfo.label}</span>
            <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-white/70">
              Interactive
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-[14%] z-20 flex w-[min(560px,86vw)] -translate-x-1/2 flex-col sm:top-[17%] lg:left-[54%] lg:top-[25%] lg:w-[42vw] lg:translate-x-0"
      >
        <h2 className="text-[clamp(2.5rem,5vw,4.7rem)] font-normal leading-none tracking-[-0.04em] text-[#f3f4f4]">
          Let's Talk
        </h2>
        <a
          href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
          className="mt-4 w-fit text-[clamp(0.85rem,1.6vw,1.15rem)] tracking-[0.12em] text-[#d7d7d7] transition-colors hover:text-white"
        >
          {profile?.email || "sukunsh2883@gmail.com"}
        </a>

        <nav className="mt-10 grid grid-cols-2 gap-x-8 gap-y-1" aria-label="Footer navigation">
          <button type="button" onClick={() => onNavigate?.("#scroll-demo")} className="footer-link">
            <span>Work</span><ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          <a href={profile?.instagram || "https://instagram.com/sukunsh"} target="_blank" rel="noreferrer" className="footer-link">
            <span>Instagram</span><ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button type="button" onClick={() => onNavigate?.("#about")} className="footer-link">
            <span>About</span><ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          <a href={profile?.linkedin || "https://www.linkedin.com/in/sukunsh"} target="_blank" rel="noreferrer" className="footer-link">
            <span>LinkedIn</span><ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`} className="footer-link">
            <span>Contact</span><ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a href={profile?.behance || "https://www.behance.net/sukunshsharma"} target="_blank" rel="noreferrer" className="footer-link">
            <span>Behance</span><ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </nav>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-9 inline-flex w-fit items-center gap-2 text-xs text-white/55 transition-colors hover:text-white"
          aria-label="Scroll back to top"
        >
          <span>Back to top</span>
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </footer>
  );
}

