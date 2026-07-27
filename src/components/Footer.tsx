import { useEffect, useRef, useState } from "react";

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
    const isBotanicalZone = (box: DOMRect | SVGRect) => box.x < 620 && box.y > 320;
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
      const speed = role === "stem" ? 0.65 : role === "flower" ? 0.82 : 0.74;
      const strength = role === "stem" ? 0.65 : role === "flower" ? 1 : 0.82;

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
        const drift = Math.sin(time * 0.32 + piece.phase * 0.58);
        const flutter = Math.sin(time * piece.speed + piece.phase);
        const lift = Math.cos(time * (piece.speed * 0.9) + piece.phase * 1.35);
        const twist = Math.sin(time * (piece.speed * 0.72) + piece.phase * 0.88);

        const waveX = drift * (2.4 + piece.strength * 1.9) + flutter * (2.2 + piece.strength * 1.8);
        const waveY =
          lift * (1.6 + piece.strength * 1.5) + Math.sin(time * 0.44 + piece.phase) * (0.7 + piece.strength * 0.5);
        const waveR = twist * (2.8 + piece.strength * 3.2);

        let tx = waveX;
        let ty = waveY;
        let rot = waveR;
        let scale = 1 + Math.sin(time * 0.4 + piece.phase * 0.7) * 0.008;

        if (pointer) {
          const dx = piece.cx - pointer.x;
          const dy = piece.cy - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const influence = Math.max(0, 1 - distance / 190);

          if (influence > 0) {
            const awayX = (dx / distance) * influence * (9 + piece.strength * 4.5);
            const awayY = (dy / distance) * influence * (7 + piece.strength * 3.4);
            tx += awayX;
            ty += awayY;
            rot += (dx / distance) * influence * (5.2 + piece.strength * 2.1);
            scale += influence * 0.03;
          }
        }

        if (hoveredPieces.has(piece.el)) {
          const pulse = 1 + Math.sin(time * 3.2 + piece.phase) * 0.015;
          tx += Math.sin(time * 1.8 + piece.phase) * (1.6 + piece.strength * 1.2);
          ty += Math.cos(time * 1.5 + piece.phase) * (1.2 + piece.strength * 1.1);
          rot += Math.sin(time * 1.6 + piece.phase) * (2.4 + piece.strength * 0.9);
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
    <footer id="contact" className="relative min-h-[620px] overflow-hidden bg-[#111111] text-[#f3f4f4] select-none md:min-h-[680px]">
      <div className="absolute inset-0 bg-[#111111]" />
      <div ref={artworkRef} className="footer-artwork absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        {artworkMarkup ? <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: artworkMarkup }} /> : null}
      </div>

      <button
        type="button"
        onClick={() => onNavigate?.("#scroll-demo")}
        className="absolute left-[48.5%] top-[52%] z-30 h-10 w-[20%] cursor-pointer rounded-sm bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Work"
      />
      <button
        type="button"
        onClick={() => onNavigate?.("#about-me-modal")}
        className="absolute left-[48.5%] top-[61%] z-30 h-10 w-[20%] cursor-pointer rounded-sm bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="About"
      />
      <a
        href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
        className="absolute left-[48.5%] top-[70%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Contact"
      />
      <a
        href={profile?.instagram || "https://instagram.com/sukunsh"}
        target="_blank"
        rel="noreferrer"
        className="absolute left-[70.5%] top-[52%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Instagram"
      />
      <a
        href={profile?.linkedin || "https://www.linkedin.com/in/sukunsh"}
        target="_blank"
        rel="noreferrer"
        className="absolute left-[70.5%] top-[61%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="LinkedIn"
      />
      <a
        href={profile?.behance || "https://www.behance.net/sukunshsharma"}
        target="_blank"
        rel="noreferrer"
        className="absolute left-[70.5%] top-[70%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Behance"
      />
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-[8%] right-[9%] z-30 h-9 w-32 cursor-pointer rounded-sm bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Scroll back to top"
      />
    </footer>
  );
}
