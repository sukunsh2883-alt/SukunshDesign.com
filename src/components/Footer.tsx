import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

interface FooterProps {
  profile: any;
  onNavigate?: (id: string) => void;
}

export default function Footer({ profile, onNavigate }: FooterProps) {
  const artworkRef = useRef<HTMLDivElement | null>(null);
  const [artworkMarkup, setArtworkMarkup] = useState("");

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
      hoverIn: () => void;
      hoverOut: () => void;
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
    const isBotanicalZone = (box: DOMRect | SVGRect) =>
      box.y > 220 && box.y < 760 && box.width < 280 && box.height < 360;
    const roleCounters: Record<"flower" | "leaf" | "stem", number> = { flower: 0, leaf: 0, stem: 0 };

    focusable.forEach((el, index) => {
      const box = getBbox(el);
      if (!box || !isBotanicalZone(box)) return;

      const fill = getFill(el);
      const stroke = getStroke(el);
      const isFlower =
        fill.includes("f9faed") ||
        fill.includes("ffee") ||
        fill.includes("f9bc41") ||
        fill.includes("e9702f") ||
        fill.includes("radialgradient");
      const isStem = stroke.includes("5e6363") || stroke.includes("545251") || stroke.includes("4d4325");
      const role: "flower" | "leaf" | "stem" = isStem ? "stem" : isFlower ? "flower" : "leaf";

      roleCounters[role] += 1;
      const botanicalName = `${role}-${roleCounters[role]}`;

      el.classList.add("botanical-piece", `botanical-${role}`);
      el.setAttribute("data-botanical-role", role);
      el.setAttribute("data-botanical-name", botanicalName);
      el.setAttribute("data-botanical-index", String(index));
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = "50% 100%";
      el.style.pointerEvents = "auto";

      const phase = index * 0.41;
      const speed = role === "stem" ? 0.72 : role === "flower" ? 0.95 : 0.84;
      const strength = role === "stem" ? 0.78 : role === "flower" ? 1.18 : 0.96;

      const hoverIn = () => hoveredPieces.add(el);
      const hoverOut = () => hoveredPieces.delete(el);

      el.addEventListener("pointerenter", hoverIn);
      el.addEventListener("pointerleave", hoverOut);

      pieces.push({
        el,
        cx: box.x + box.width / 2,
        cy: box.y + box.height / 2,
        role,
        phase,
        speed,
        strength,
        hoverIn,
        hoverOut,
      });
    });

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

      for (let i = 0; i < pieces.length; i += 1) {
        const piece = pieces[i];
        const drift = Math.sin(time * 0.3 + piece.phase * 0.58);
        const flutter = Math.sin(time * piece.speed + piece.phase);
        const lift = Math.cos(time * (piece.speed * 0.88) + piece.phase * 1.35);
        const twist = Math.sin(time * (piece.speed * 0.7) + piece.phase * 0.88);

        const waveX = drift * (3.2 + piece.strength * 2.7) + flutter * (2.8 + piece.strength * 2.1);
        const waveY =
          lift * (2.2 + piece.strength * 1.7) + Math.sin(time * 0.44 + piece.phase) * (1.1 + piece.strength * 0.65);
        const waveR = twist * (4.2 + piece.strength * 3.8);

        let tx = waveX;
        let ty = waveY;
        let rot = waveR;
        let scale = 1 + Math.sin(time * 0.4 + piece.phase * 0.7) * 0.012;

        if (pointer) {
          const dx = piece.cx - pointer.x;
          const dy = piece.cy - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const influence = Math.max(0, 1 - distance / 200);

          if (influence > 0) {
            const awayX = (dx / distance) * influence * (11 + piece.strength * 5.5);
            const awayY = (dy / distance) * influence * (8 + piece.strength * 4.2);
            tx += awayX;
            ty += awayY;
            rot += (dx / distance) * influence * (6.4 + piece.strength * 2.6);
            scale += influence * 0.04;
          }
        }

        if (hoveredPieces.has(piece.el)) {
          const pulse = 1 + Math.sin(time * 3.2 + piece.phase) * 0.015;
          tx += Math.sin(time * 1.8 + piece.phase) * (2 + piece.strength * 1.6);
          ty += Math.cos(time * 1.5 + piece.phase) * (1.8 + piece.strength * 1.3);
          rot += Math.sin(time * 1.6 + piece.phase) * (3.4 + piece.strength * 1.1);
          scale *= pulse;
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
      pieces.forEach(({ el, hoverIn, hoverOut }) => {
        el.removeEventListener("pointerenter", hoverIn);
        el.removeEventListener("pointerleave", hoverOut);
      });
    };
  }, [artworkMarkup]);

  return (
    <footer id="contact" className="relative min-h-[760px] overflow-hidden bg-[#111111] text-[#f3f4f4] select-none sm:min-h-[650px] md:min-h-[520px]">
      <div className="absolute inset-0 bg-[#111111]" />
      <div ref={artworkRef} className="footer-artwork absolute inset-0 z-10 overflow-visible" aria-hidden="true">
        {artworkMarkup ? <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: artworkMarkup }} /> : null}
      </div>

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
