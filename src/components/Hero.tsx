/* ==========================================================================
   HERO - DO NOT EDIT
   This section is frozen per design constitution: markup, CSS, JS, GSAP
   timelines, ScrollTriggers, mouse interaction, and event handlers are untouched.
   ========================================================================== */
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  onWatchShowreel?: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
  onOpenAboutMe?: () => void;
  onOpenContact?: () => void;
  onHeroLoaded?: () => void;
}

const DESKTOP_SVG_URL = "/artwork/main artwork.svg";
const MOBILE_SVG_URL = "/artwork/mobile-screen.svg";

let cachedDesktopSvgMarkup: string | null = null;
let cachedMobileSvgMarkup: string | null = null;

export function preloadHeroSvg(isMobile = false): Promise<string> {
  if (isMobile && cachedMobileSvgMarkup) return Promise.resolve(cachedMobileSvgMarkup);
  if (!isMobile && cachedDesktopSvgMarkup) return Promise.resolve(cachedDesktopSvgMarkup);

  const url = isMobile ? MOBILE_SVG_URL : DESKTOP_SVG_URL;
  return fetch(encodeURI(url))
    .then((response) => response.text())
    .then((svg) => {
      const cleaned = cleanSvg(svg);
      if (isMobile) cachedMobileSvgMarkup = cleaned;
      else cachedDesktopSvgMarkup = cleaned;
      return cleaned;
    })
    .catch((error) => {
      console.error("Hero SVG failed to load:", url, error);
      return "";
    });
}

// Preload both SVGs immediately on client
if (typeof window !== "undefined") {
  preloadHeroSvg(false);
  preloadHeroSvg(true);
}

const SIT_BASE = { x: 765.7, y: 588.9 };
const FLY_BASE = { x: 883.5, y: 467.5 };

const flowerIds = Array.from({ length: 9 }, (_, index) => `flower_${index + 1}`);
const leafIds = [...Array.from({ length: 11 }, (_, index) => `leaf_${index + 1}`), "leaf_10-2"];
const flowerPerches: Record<string, { x: number; y: number }> = {
  flower_1: { x: 704, y: 541 },
  flower_2: { x: 766, y: 588 },
  flower_3: { x: 907, y: 618 },
  flower_4: { x: 1202, y: 622 },
  flower_5: { x: 824, y: 566 },
  flower_6: { x: 1254, y: 600 },
  flower_7: { x: 1374, y: 546 },
  flower_8: { x: 1470, y: 585 },
  flower_9: { x: 1383, y: 600 },
};
function cleanSvg(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

function findSvgElement<T extends Element>(svg: SVGSVGElement | null, id: string) {
  if (!svg) return null;
  const elements = Array.from(svg.querySelectorAll<T>("[id]"));
  return (
    elements.find((el) => el.id === id) ||
    elements.find((el) => el.id.startsWith(id + "_") || el.id.startsWith(id + "-")) ||
    null
  );
}

export default function Hero({ profile, onOpenProjects, onOpenAIWork, onOpenAboutMe, onOpenContact, onHeroLoaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  });

  useEffect(() => {
    const handleWindowResize = () => {
      const mobileNow = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== mobileNow ? mobileNow : prev));
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let cleanupHero: (() => void) | null = null;

    const setupHero = (svgMarkup: string, isMobileMode: boolean) => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage || cancelled) return;

      stage.innerHTML = svgMarkup;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const svgElement = stage.querySelector("svg");
      if (!svgElement) return;
      svgElement.classList.add("hero-svg");
      svgElement.setAttribute("preserveAspectRatio", "xMidYMax meet");

      const byId = <T extends SVGGraphicsElement>(id: string) => findSvgElement<T>(svgElement, id);
      const existingHeroText = byId("Sukunsh");
      if (existingHeroText) {
        existingHeroText.remove();
      }
      const existingParallax = byId("sukunsh_parallax_group");
      if (existingParallax) {
        existingParallax.remove();
      }
      const heroText: SVGGraphicsElement | null = null;
      const head = byId("head-2");
      const leftEye = byId("eye_ball_left");
      const rightEye = byId("eyes_ball_right");
      const sitPose = byId("beetal_sit_posttion") || byId("beetal_sit_postion");
      const flyPose = byId("beeta_flying_postion");
      const flyRightWing = byId("flyinh_beetal_right-2") || byId("flyinh_beetal_right");
      const flyLeftWing = byId("flyinh_beetal_left");
      const leftWing = byId("beetal_left_wing-2");
      const rightWing = byId("beetal_right_wing-2");
      const flowers = flowerIds.map((id) => byId(id)).filter(Boolean) as SVGGraphicsElement[];
      const leaves = leafIds.map((id) => byId(id)).filter(Boolean) as SVGGraphicsElement[];
      const tagRects = Array.from(svgElement.querySelectorAll("#Layer_147 rect, #Layer_147 path")) as SVGGraphicsElement[];
      const tagTexts = Array.from(svgElement.querySelectorAll("#Layer_148 text")) as SVGGraphicsElement[];

      const wrapSvgElements = (id: string, elements: SVGGraphicsElement[]) => {
        const filtered = elements.filter(Boolean);
        const first = filtered[0];
        if (!first?.parentNode) return null;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", id);
        first.parentNode.insertBefore(group, first);
        filtered.forEach((element) => group.appendChild(element));
        return group as SVGGElement;
      };

      const cameraElement = (byId("camera") || svgElement.querySelector('[id*="camera"]')) as SVGGraphicsElement | null;

      // Group all elements comprising the cactus character
      const cactusElements = Array.from(
        svgElement.querySelectorAll<SVGGraphicsElement>(
          "path.st210, path.st211, #Layer_252, #Layer_123, #Layer_112, #Layer_109, #Layer_108, #Layer_106, #Layer_100, #Layer_97"
        )
      );
      const cactusGroup = wrapSvgElements("cactus_group", cactusElements);

      const backgroundLayer = byId("Layer_38");
      if (heroText?.parentNode === svgElement && backgroundLayer?.parentNode === svgElement) {
        svgElement.insertBefore(heroText, backgroundLayer.nextSibling);
      }

      const cactusParallax = cactusGroup ? wrapSvgElements("cactus_parallax_group", [cactusGroup]) : null;
      const flowerParallax = wrapSvgElements("flower_parallax_group", flowers);
      const leafParallax = wrapSvgElements("leaf_parallax_group", leaves);

      const cleanupFns: Array<() => void> = [];
      const timelines: gsap.core.Animation[] = [];

      ctx = gsap.context(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.ticker.lagSmoothing(1000, 16);

        gsap.set(stage, { opacity: 1 });
        gsap.set(svgElement, { transformOrigin: "center bottom" });
        gsap.set([cactusParallax, flowerParallax, leafParallax].filter(Boolean), {
          transformBox: "fill-box",
          transformOrigin: "50% 50%",
        });
        if (heroText) gsap.set(heroText, { transformOrigin: "center center" });
        if (cactusGroup) gsap.set(cactusGroup, { transformOrigin: "1100px 750px" });
        if (head) gsap.set(head, { transformBox: "fill-box", transformOrigin: "50% 95%" });
        gsap.set([leftEye, rightEye].filter(Boolean), { transformOrigin: "50% 50%" });
        gsap.set([...tagRects, ...tagTexts], { transformOrigin: "center center" });

        if (sitPose && flyPose) {
          svgElement.appendChild(sitPose);
          svgElement.appendChild(flyPose);
          gsap.set(sitPose, {
            transformOrigin: `${SIT_BASE.x}px ${SIT_BASE.y}px`,
            pointerEvents: "none",
            display: "inline",
            visibility: "visible",
            opacity: 1,
          });
          gsap.set(flyPose, {
            transformOrigin: `${FLY_BASE.x}px ${FLY_BASE.y}px`,
            pointerEvents: "none",
            display: "none",
            visibility: "hidden",
            opacity: 0,
          });
        }

        const showPose = (pose?: SVGGraphicsElement | null) => {
          if (!pose) return;
          gsap.killTweensOf(pose);
          gsap.set(pose, { display: "inline", visibility: "visible" });
          gsap.to(pose, {
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const hidePose = (pose?: SVGGraphicsElement | null) => {
          if (!pose) return;
          gsap.killTweensOf(pose);
          gsap.to(pose, {
            opacity: 0,
            duration: 0.15,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
              gsap.set(pose, { visibility: "hidden", display: "none" });
            },
          });
        };

        if (!reduceMotion) {
          const parallaxTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.9,
            },
          });

          parallaxTimeline
            .to(".hero-scroll-base", { yPercent: 0, ease: "none" }, 0)
            .to(cactusParallax, { xPercent: 0.8, yPercent: 0, ease: "none" }, 0)
            .to(flowerParallax, { xPercent: -0.9, yPercent: 0, ease: "none" }, 0)
            .to(leafParallax, { xPercent: 1.1, yPercent: 0, ease: "none" }, 0);
          timelines.push(parallaxTimeline);

          // The camera floating above the cactus hand
          if (cameraElement) {
            gsap.set(cameraElement, {
              autoAlpha: 1,
              transformOrigin: "1590px 310px",
            });
            timelines.push(
              gsap.to(cameraElement, {
                y: -14,
                rotation: 2.2,
                duration: 2.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                overwrite: "auto",
              })
            );
          }

          // Give the cactus a breathing motion
          if (cactusGroup) {
            gsap.set(cactusGroup, { transformOrigin: "1100px 750px" });
            timelines.push(
              gsap.to(cactusGroup, {
                scaleY: 1.02,
                scaleX: 1.008,
                y: -3,
                duration: 2.6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                overwrite: "auto",
              })
            );
          }
        }

        flowers.forEach((flower, index) => {
          gsap.set(flower, {
            transformOrigin: "50% 100%",
            pointerEvents: "all",
          });

          if (!reduceMotion) {
            timelines.push(gsap.to(flower, {
              rotation: index % 2 ? -4.2 : 4.2,
              y: index % 2 ? 4 : -4,
              duration: 1.6 + (index % 4) * 0.15,
              delay: 1.25 + index * 0.025,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              overwrite: "auto",
            }));
          }

          let hoveredFlowerIndex: number | null = null;

          const enterFlower = () => {
            hoveredFlowerIndex = index;
            gsap.to(flower, {
              scale: 1.06,
              duration: 0.28,
              ease: "back.out(1.6)",
              overwrite: "auto",
            });
          };
          const leaveFlower = () => {
            if (hoveredFlowerIndex === index) hoveredFlowerIndex = null;
            gsap.to(flower, {
              scale: 1,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          const onFlowerClick = (e: Event) => {
            e.stopPropagation();
            if (typeof (window as any).__heroLandOnFlower === "function") {
              (window as any).__heroLandOnFlower(index);
            }
          };

          flower.style.cursor = "pointer";
          flower.addEventListener("pointerdown", onFlowerClick);
          if (!isTouch) {
            flower.addEventListener("mouseenter", enterFlower);
            flower.addEventListener("mouseleave", leaveFlower);
            cleanupFns.push(
              () => flower.removeEventListener("pointerdown", onFlowerClick),
              () => flower.removeEventListener("mouseenter", enterFlower),
              () => flower.removeEventListener("mouseleave", leaveFlower),
            );
          } else {
            cleanupFns.push(() => flower.removeEventListener("pointerdown", onFlowerClick));
          }
        });

        leaves.forEach((leaf, index) => {
          gsap.set(leaf, {
            transformOrigin: "50% 100%",
            pointerEvents: "all",
          });

          if (!reduceMotion) {
            timelines.push(gsap.to(leaf, {
              rotation: index % 2 ? -3.5 : 3.5,
              y: index % 2 ? 3 : -3,
              duration: 1.8 + (index % 4) * 0.12,
              delay: 1.15 + index * 0.02,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              overwrite: "auto",
            }));
          }

          const enterLeaf = () => {
            gsap.to(leaf, {
              scale: 1.05,
              duration: 0.28,
              ease: "back.out(1.6)",
              overwrite: "auto",
            });
          };
          const leaveLeaf = () => {
            gsap.to(leaf, {
              scale: 1,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          if (!isTouch) {
            leaf.addEventListener("mouseenter", enterLeaf);
            leaf.addEventListener("mouseleave", leaveLeaf);
            cleanupFns.push(
              () => leaf.removeEventListener("mouseenter", enterLeaf),
              () => leaf.removeEventListener("mouseleave", leaveLeaf),
            );
          }
        });

        tagRects.forEach((rect, index) => {
          const text = tagTexts[index];
          const enterTag = () => {
            gsap.to(rect, {
              scale: 1.04,
              fill: "rgba(18,18,18,0.78)",
              stroke: "rgba(255,255,255,0.48)",
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto",
            });
            if (text) {
              gsap.to(text, {
                fill: "rgba(255,255,255,1)",
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          };
          const leaveTag = () => {
            gsap.to(rect, {
              scale: 1,
              fill: "rgba(12,12,12,0.72)",
              stroke: "rgba(255,255,255,0.34)",
              duration: 0.65,
              ease: "power3.out",
              overwrite: "auto",
            });
            if (text) {
              gsap.to(text, {
                fill: "rgba(255,255,255,0.96)",
                duration: 0.65,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
          };

          if (!isTouch) {
            rect.style.pointerEvents = "all";
            rect.style.cursor = "pointer";
            rect.addEventListener("mouseenter", enterTag);
            rect.addEventListener("mouseleave", leaveTag);
            cleanupFns.push(
              () => rect.removeEventListener("mouseenter", enterTag),
              () => rect.removeEventListener("mouseleave", leaveTag),
            );
          }
        });

        const quickTo = (node: SVGGraphicsElement | null | undefined, prop: string, duration = 0.25) =>
          node ? gsap.quickTo(node, prop, { duration, ease: "power3.out" }) : null;
        const leftEyeX = quickTo(leftEye, "x", 0.22);
        const leftEyeY = quickTo(leftEye, "y", 0.22);
        const rightEyeX = quickTo(rightEye, "x", 0.22);
        const rightEyeY = quickTo(rightEye, "y", 0.22);
        const headRotation = quickTo(head, "rotation", 0.55);

        const moveCharacterDetails = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          leftEyeX?.(x * 3.6);
          rightEyeX?.(x * 3.6);
          leftEyeY?.(y * 2.4);
          rightEyeY?.(y * 2.4);
          headRotation?.(x * 0.35);
        };

        const resetCharacterDetails = () => {
          leftEyeX?.(0);
          leftEyeY?.(0);
          rightEyeX?.(0);
          rightEyeY?.(0);
          headRotation?.(0);
        };

        if (!isTouch) {
          stage.addEventListener("mousemove", moveCharacterDetails);
          stage.addEventListener("mouseleave", resetCharacterDetails);
          cleanupFns.push(
            () => stage.removeEventListener("mousemove", moveCharacterDetails),
            () => stage.removeEventListener("mouseleave", resetCharacterDetails),
          );
        }

        // ==========================================
        // FRESH BEETLE ANIMATION
        // Flies all over the flowers, wings flicker, sits & sways on flowers
        // ==========================================
        const flutterWings = [flyRightWing, flyLeftWing].filter(Boolean) as SVGGraphicsElement[];
        const redWings = [leftWing, rightWing].filter(Boolean) as SVGGraphicsElement[];

        // Initial setup for beetle wings
        flutterWings.forEach((wing, index) => {
          gsap.set(wing, {
            transformOrigin: "50% 50%",
            opacity: 0,
            x: index % 2 === 0 ? -0.6 : 0.6,
            y: -8,
            rotation: index % 2 === 0 ? -8 : 8,
          });
        });
        redWings.forEach((wing, index) => {
          gsap.set(wing, {
            transformOrigin: index === 0 ? "100% 50%" : "0% 50%",
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
          });
        });

        let wingFlickerTween: gsap.core.Timeline | null = null;

        const startWingFlicker = () => {
          // Open outer red wing shells
          if (leftWing) gsap.to(leftWing, { rotation: -26, duration: 0.18, ease: "power2.out", overwrite: "auto" });
          if (rightWing) gsap.to(rightWing, { rotation: 26, duration: 0.18, ease: "power2.out", overwrite: "auto" });

          if (!flutterWings.length) return;
          wingFlickerTween?.kill();

          gsap.set(flutterWings, { opacity: 0.75 });
          wingFlickerTween = gsap.timeline({ repeat: -1 });
          wingFlickerTween
            .to(flutterWings, {
              scaleY: 0.32,
              scaleX: 0.88,
              rotation: (i) => (i % 2 ? 28 : -28),
              opacity: 0.25,
              duration: 0.03,
              ease: "none",
            })
            .to(flutterWings, {
              scaleY: 1.28,
              scaleX: 1.08,
              rotation: (i) => (i % 2 ? -28 : 28),
              opacity: 0.85,
              duration: 0.03,
              ease: "none",
            });
        };

        const stopWingFlicker = () => {
          wingFlickerTween?.kill();
          wingFlickerTween = null;
          // Close outer red wing shells
          if (leftWing) gsap.to(leftWing, { rotation: 0, duration: 0.25, ease: "power2.inOut", overwrite: "auto" });
          if (rightWing) gsap.to(rightWing, { rotation: 0, duration: 0.25, ease: "power2.inOut", overwrite: "auto" });
          flutterWings.forEach((wing) => {
            gsap.to(wing, { opacity: 0, duration: 0.15, overwrite: "auto" });
          });
        };

        // Bézier curve calculation for soaring arcs across the hero section
        const cubicBezier = (p0: number, p1: number, p2: number, p3: number, t: number): number => {
          const mt = 1 - t;
          return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
        };

        const cubicBezierDerivative = (p0: number, p1: number, p2: number, p3: number, t: number): number => {
          const mt = 1 - t;
          return 3 * mt * mt * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t * t * (p3 - p2);
        };

        // State & positions
        let beetleState: "sitting" | "flying" = "sitting";
        let activeFlowerIndex = flowers.findIndex((f) => f.id === "flower_2");
        if (activeFlowerIndex < 0) activeFlowerIndex = 0;

        const initialFlower = flowers[activeFlowerIndex] || flowers[0];
        const initialPerch = flowerPerches[initialFlower?.id] || (isMobileMode ? { x: 1201, y: 624 } : { x: 765, y: 588 });

        let beetleX = initialPerch.x;
        let beetleY = initialPerch.y;
        let beetleRotation = 0;
        let flightTween: gsap.core.Tween | null = null;
        let restTimer: any = null;

        // Position sitPose initially
        gsap.set(sitPose, {
          x: initialPerch.x - SIT_BASE.x,
          y: initialPerch.y - SIT_BASE.y,
          rotation: 0,
        });
        showPose(sitPose);
        hidePose(flyPose);

        // Frame ticker: When sitting on a flower, stick to it and sway with it
        const updateBeetleOnFlower = () => {
          if (beetleState === "sitting" && sitPose) {
            const flower = flowers[activeFlowerIndex] || flowers[0];
            if (flower) {
              const perch = flowerPerches[flower.id] || flowerPerches["flower_2"] || { x: 765, y: 588 };
              const rot = Number(gsap.getProperty(flower, "rotation")) || 0;
              const fy = Number(gsap.getProperty(flower, "y")) || 0;

              const rad = (rot * Math.PI) / 180;
              const arm = Math.max(60, 750 - perch.y);
              const swayX = Math.sin(rad) * arm * 0.7;
              const swayY = fy + (1 - Math.cos(rad)) * arm * 0.7;

              beetleX = perch.x + swayX;
              beetleY = perch.y + swayY;

              gsap.set(sitPose, {
                x: perch.x - SIT_BASE.x + swayX,
                y: perch.y - SIT_BASE.y + swayY,
                rotation: rot,
              });
            }
          }
        };

        gsap.ticker.add(updateBeetleOnFlower);
        cleanupFns.push(() => {
          gsap.ticker.remove(updateBeetleOnFlower);
        });

        // Fly to another flower with wings flickering and soaring curved flight
        const flyToFlower = (targetFlowerIndex?: number) => {
          if (beetleState === "flying") return;
          if (restTimer) clearTimeout(restTimer);

          let nextIndex = targetFlowerIndex;
          if (typeof nextIndex !== "number" || !flowers[nextIndex]) {
            // Pick a different flower across the hero section
            const candidates = flowers
              .map((_, i) => i)
              .filter((i) => i !== activeFlowerIndex);

            // Prefer flowers on the other side or sufficiently far away so it flies all over the flowers
            const currentPerch = flowerPerches[flowers[activeFlowerIndex]?.id] || { x: 765, y: 588 };
            const farCandidates = candidates.filter((i) => {
              const p = flowerPerches[flowers[i]?.id];
              return p && Math.abs(p.x - currentPerch.x) > 200;
            });

            const pool = farCandidates.length > 0 ? farCandidates : candidates;
            nextIndex = pool[Math.floor(Math.random() * pool.length)];
          }

          const targetFlower = flowers[nextIndex] || flowers[0];
          const targetPerch = flowerPerches[targetFlower?.id] || (isMobileMode ? { x: 1201, y: 624 } : { x: 765, y: 588 });

          const startX = beetleX;
          const startY = beetleY;
          const endX = targetPerch.x;
          const endY = targetPerch.y;

          // Flight trajectory: soaring high all over the flowers in the hero section
          const midX = (startX + endX) / 2;
          const distance = Math.hypot(endX - startX, endY - startY);
          const peakY = Math.max(140, Math.min(startY, endY) - 150 - Math.random() * 90);
          const lateralWobble = (Math.random() - 0.5) * 110;

          const p0_x = startX;
          const p0_y = startY;
          const p1_x = startX + (midX - startX) * 0.4 + lateralWobble;
          const p1_y = peakY;
          const p2_x = midX + (endX - midX) * 0.6 - lateralWobble;
          const p2_y = peakY + 15;
          const p3_x = endX;
          const p3_y = endY;

          beetleState = "flying";
          showPose(flyPose);
          hidePose(sitPose);
          startWingFlicker();

          if (flightTween) flightTween.kill();

          const progress = { t: 0 };
          const flightDuration = Math.max(1.8, Math.min(2.8, (distance / 500) * 2.2));

          flightTween = gsap.to(progress, {
            t: 1,
            duration: flightDuration,
            ease: "sine.inOut",
            onUpdate: () => {
              const t = progress.t;
              beetleX = cubicBezier(p0_x, p1_x, p2_x, p3_x, t);
              beetleY = cubicBezier(p0_y, p1_y, p2_y, p3_y, t);

              const dX = cubicBezierDerivative(p0_x, p1_x, p2_x, p3_x, t);
              const dY = cubicBezierDerivative(p0_y, p1_y, p2_y, p3_y, t);

              const targetAngle = Math.atan2(dY, dX) * (180 / Math.PI) + 90;
              let diff = (targetAngle - beetleRotation) % 360;
              if (diff > 180) diff -= 360;
              if (diff < -180) diff += 360;
              beetleRotation += diff * 0.22;

              // Wing-lift bio-oscillation
              const waveY = Math.sin(t * Math.PI * 6) * 2.5;

              gsap.set(flyPose, {
                x: beetleX - FLY_BASE.x,
                y: beetleY + waveY - FLY_BASE.y,
                rotation: beetleRotation,
              });
            },
            onComplete: () => {
              beetleState = "sitting";
              activeFlowerIndex = nextIndex;
              stopWingFlicker();
              showPose(sitPose);
              hidePose(flyPose);

              // Soft landing bounce onto the flower
              gsap.fromTo(
                sitPose,
                { scale: 1.08 },
                { scale: 1, duration: 0.32, ease: "back.out(1.8)" }
              );

              // Sit on this flower, sway with it, then fly to another flower!
              scheduleNextFlight(2200 + Math.random() * 2200);
            },
          });
        };

        const scheduleNextFlight = (delay = 2500) => {
          if (restTimer) clearTimeout(restTimer);
          restTimer = setTimeout(() => {
            if (beetleState === "sitting") {
              flyToFlower();
            }
          }, delay);
        };

        // Click any flower to summon the beetle to that flower
        (window as any).__heroLandOnFlower = (idx: number) => {
          if (idx === activeFlowerIndex && beetleState === "sitting") return;
          if (flightTween) flightTween.kill();
          if (restTimer) clearTimeout(restTimer);
          flyToFlower(idx);
        };

        if (sitPose) {
          sitPose.style.cursor = "pointer";
          const onSitClick = (e: Event) => {
            e.stopPropagation();
            flyToFlower();
          };
          sitPose.addEventListener("pointerdown", onSitClick);
          cleanupFns.push(() => sitPose.removeEventListener("pointerdown", onSitClick));
        }

        // Kick off the flight cycle after initial 2.5s rest on the first flower
        scheduleNextFlight(2500);

        cleanupFns.push(() => {
          if (restTimer) clearTimeout(restTimer);
          if (flightTween) flightTween.kill();
          if (wingFlickerTween) wingFlickerTween.kill();
          delete (window as any).__heroLandOnFlower;
        });

        const resumeHeroAnimations = () => {
          gsap.globalTimeline.resume();
          gsap.ticker.wake();
        };

        const handleResize = () => {
          resumeHeroAnimations();
          ScrollTrigger.refresh();
          updateBeetleOnFlower();
        };

        window.addEventListener("scroll", resumeHeroAnimations, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });
        window.addEventListener("orientationchange", handleResize, { passive: true });
        window.addEventListener("focus", resumeHeroAnimations);
        window.addEventListener("pageshow", resumeHeroAnimations);
        document.addEventListener("visibilitychange", resumeHeroAnimations);
        cleanupFns.push(
          () => window.removeEventListener("scroll", resumeHeroAnimations),
          () => window.removeEventListener("resize", handleResize),
          () => window.removeEventListener("orientationchange", handleResize),
          () => window.removeEventListener("focus", resumeHeroAnimations),
          () => window.removeEventListener("pageshow", resumeHeroAnimations),
          () => document.removeEventListener("visibilitychange", resumeHeroAnimations),
        );

        cleanupHero = () => {
          cleanupFns.forEach((cleanup) => cleanup());
          timelines.forEach((timeline) => timeline.kill());
        };
      }, stage);
    };

    const applySvg = (svgMarkup: string) => {
      const stage = stageRef.current;
      if (!stage || cancelled || !svgMarkup) return;
      stage.innerHTML = svgMarkup;

      try {
        setupHero(svgMarkup, isMobile);
      } catch (error) {
        console.error("Hero animation setup failed; keeping static artwork.", error);
      } finally {
        onHeroLoaded?.();
      }
    };

    preloadHeroSvg(isMobile)
      .then((svgMarkup) => {
        if (!cancelled && svgMarkup) {
          applySvg(svgMarkup);
        } else {
          onHeroLoaded?.();
        }
      })
      .catch((error) => {
        console.error("Hero SVG failed to load.", error);
        const stage = stageRef.current;
        if (stage && !cancelled) stage.innerHTML = "";
        onHeroLoaded?.();
      });

    return () => {
      cancelled = true;
      cleanupHero?.();
      ctx?.revert();
      if (stageRef.current) stageRef.current.innerHTML = "";
    };
  }, [isMobile]);

  const handleNavClick = (sectionId: string) => {
    const target =
      document.getElementById("cinematic-editorial-expand") ||
      document.getElementById("scroll-demo") ||
      document.getElementById(sectionId);
    if (!target) return;

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const top = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      data-cursor-tag="Home"
      className="hero relative h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full overflow-hidden text-white select-none touch-pan-y flex flex-col justify-end items-center"
      style={{ backgroundColor: "#3B4DF7" }}
    >
      {/* Central Interactive Artwork Canvas: Anchored to the base of the hero section */}
      <div className="hero-inner relative flex flex-col justify-end items-center h-full w-full p-0 m-0 touch-pan-y overflow-hidden">
        <div className="hero-art relative flex flex-col justify-end items-center w-full h-full p-0 m-0 touch-pan-y overflow-hidden">
          <div
            ref={stageRef}
            className={`svg-stage relative flex justify-center items-end ${
              isMobile
                ? "w-full h-full max-h-[100dvh] aspect-[820/960]"
                : "w-full h-full max-h-[100dvh] aspect-[1728.2/758.1]"
            } touch-pan-y`}
            style={{ marginBottom: 0, paddingBottom: 0 }}
          />
        </div>
      </div>

      {/* Scroll Down Indicator with animated icon */}
      <button
        type="button"
        onClick={() => handleNavClick("cinematic-editorial-expand")}
        className="hero-scroll-btn absolute bottom-5 sm:bottom-7 z-30 flex flex-col items-center gap-1.5 text-white/90 hover:text-white transition-opacity duration-300 cursor-pointer group select-none pointer-events-auto"
        aria-label="Scroll down to explore"
      >
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase font-semibold text-white/85 group-hover:text-white transition-colors">
          Scroll Down
        </span>
        <div className="w-5 sm:w-6 h-8 sm:h-9 rounded-full border border-white/60 flex items-start justify-center p-1 group-hover:border-white transition-colors">
          <div className="w-1.5 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  );
}
