import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  onWatchShowreel?: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
  onOpenAboutMe?: () => void;
  onOpenContact?: () => void;
}

const SVG_URL = "/artwork/main artwork.svg";

type HeroMetrics = {
  stageScale: number;
  stageY: number;
  sukunshScale: number;
};

const flowerIds = Array.from({ length: 9 }, (_, index) => `flower_${index + 1}`);
const leafIds = [...Array.from({ length: 11 }, (_, index) => `leaf_${index + 1}`), "leaf_10-2"];
const flowerPerches: Record<string, { x: number; y: number }> = {
  flower_1: { x: 382, y: 468 },
  flower_2: { x: 315, y: 494 },
  flower_3: { x: 250, y: 405 },
  flower_4: { x: 880, y: 472 },
  flower_5: { x: 465, y: 548 },
  flower_6: { x: 875, y: 522 },
  flower_7: { x: 844, y: 424 },
  flower_8: { x: 922, y: 452 },
  flower_9: { x: 785, y: 510 },
};
function cleanSvg(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

function findSvgElement<T extends Element>(svg: SVGSVGElement | null, id: string) {
  if (!svg) return null;
  return Array.from(svg.querySelectorAll<T>("[id]")).find((element) => element.id === id) || null;
}

function getHeroMetrics(): HeroMetrics {
  const width = typeof window !== "undefined" ? window.innerWidth : 1440;

  if (width < 768) {
    return { stageScale: 1, stageY: 0, sukunshScale: 1 };
  }

  if (width < 1024) {
    return { stageScale: 1.28, stageY: 2, sukunshScale: 1 };
  }

  if (width < 1440) {
    return { stageScale: 1.38, stageY: 3, sukunshScale: 1 };
  }

  return { stageScale: 1.48, stageY: 4, sukunshScale: 1 };
}

export default function Hero({ profile, onOpenProjects, onOpenAIWork, onOpenAboutMe, onOpenContact }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [heroMetrics, setHeroMetrics] = useState<HeroMetrics>(() => getHeroMetrics());

  useEffect(() => {
    const updateHeroMetrics = () => setHeroMetrics(getHeroMetrics());
    updateHeroMetrics();
    window.addEventListener("resize", updateHeroMetrics);
    return () => window.removeEventListener("resize", updateHeroMetrics);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let cleanupHero: (() => void) | null = null;

    const setupHero = (svgMarkup: string) => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage || cancelled) return;

      stage.innerHTML = svgMarkup;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const svgElement = stage.querySelector("svg");
      if (!svgElement) return;
      svgElement.classList.add("hero-svg");

      const byId = <T extends SVGGraphicsElement>(id: string) => findSvgElement<T>(svgElement, id);
      const heroText = byId("Sukunsh");

      // Replace or configure background hero text to display "PORTFOLIO"
      // Centered at x=864.1 in 1728.2 viewBox so it's fully visible and never clipped
      if (heroText) {
        const textNode = heroText.querySelector("text");
        if (textNode) {
          textNode.textContent = "PORTFOLIO";
          textNode.setAttribute("class", "st1 st2 st3 hero-portfolio-text");
          textNode.setAttribute("letter-spacing", "0.015em");
          textNode.setAttribute("text-anchor", "middle");
          textNode.setAttribute("x", "864.1");
          textNode.setAttribute("y", "326.6");
          textNode.removeAttribute("transform");
        }
      }
      const head = byId("head-2");
      const leftEye = byId("eye_ball_left");
      const rightEye = byId("eyes_ball_right");
      const sitPose = byId("beetal_sit_posttion") || byId("beetal_sit_postion");
      const flyPose = byId("beeta_flying_postion");
      const wing1 = byId("flyinh_beetal_right-2");
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

      const characterElementIds = [
        "blue_pen-2", "pink", "paper-2", "ipad-2", "red_bag-2", "pentab-2",
        "Layer_136", "Layer_135", "Layer_134", "Layer_133", "Layer_152", "Layer_130", "Layer_129",
        "right_arm_with_pen-2", "Layer_253", "Layer_252", "head-2", "Layer_123", "shirt-2", "green_bag",
        "left_arm_and_details", "Layer_117", "Layer_118", "camera-2", "Layer_116", "Layer_114", "Layer_112",
        "Layer_109", "Layer_108"
      ];
      const charElements = characterElementIds.map((id) => byId(id)).filter(Boolean) as SVGGraphicsElement[];
      const characterGroup = byId("character_group") || (charElements.length > 0 ? wrapSvgElements("character_group", charElements) : null);

      const backgroundLayer = byId("Layer_38");
      if (heroText?.parentNode === svgElement && backgroundLayer?.parentNode === svgElement) {
        svgElement.insertBefore(heroText, backgroundLayer.nextSibling);
      }

      const sukunshParallax = heroText ? wrapSvgElements("sukunsh_parallax_group", [heroText]) : null;
      const characterParallax = characterGroup ? wrapSvgElements("character_parallax_group", [characterGroup]) : null;
      const flowerParallax = wrapSvgElements("flower_parallax_group", flowers);
      const leafParallax = wrapSvgElements("leaf_parallax_group", leaves);

      const cleanupFns: Array<() => void> = [];
      const timelines: gsap.core.Animation[] = [];
      let mainBeetleTimeline: gsap.core.Timeline | null = null;
      let wingTimeline: gsap.core.Timeline | null = null;
      let currentState: "landed" | "takeoff" | "flying" | "landing" | "dragging" | "returning" = "landed";
      let currentFlowerIndex = 0;
      let activeFooterFlowerId: string | null = null;
      let dragging = false;
      let pointerDragging = false;

      ctx = gsap.context(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.ticker.lagSmoothing(1000, 16);

        gsap.set(stage, { opacity: 1 });
        gsap.set(svgElement, { transformOrigin: "center bottom" });
        gsap.set([sukunshParallax, characterParallax, flowerParallax, leafParallax].filter(Boolean), {
          transformBox: "fill-box",
          transformOrigin: "50% 50%",
        });
        gsap.set(heroText, { transformOrigin: "center center" });
        gsap.set(characterGroup, { transformBox: "fill-box", transformOrigin: "50% 70%" });
        gsap.set(head, { transformBox: "fill-box", transformOrigin: "50% 95%" });
        gsap.set([leftEye, rightEye].filter(Boolean), { transformOrigin: "50% 50%" });
        gsap.set([...tagRects, ...tagTexts], { transformOrigin: "center center" });

        if (sitPose && flyPose) {
          svgElement.appendChild(sitPose);
          svgElement.appendChild(flyPose);
          gsap.set([sitPose, flyPose], {
            transformOrigin: "50% 50%",
            cursor: "grab",
            pointerEvents: "all",
          });
          gsap.set(sitPose, { autoAlpha: 1, pointerEvents: "all" });
          gsap.set(flyPose, { autoAlpha: 0, pointerEvents: "all" });
        }

        const getBox = (element?: SVGGraphicsElement | null) => {
          try {
            return element?.getBBox();
          } catch {
            return undefined;
          }
        };

        const pointInSvg = (element: SVGGraphicsElement, x: number, y: number) => {
          const point = svgElement.createSVGPoint();
          point.x = x;
          point.y = y;

          const elementMatrix = element.getCTM();
          const svgMatrix = svgElement.getCTM();
          if (!elementMatrix || !svgMatrix) return { x, y };

          const global = point.matrixTransform(elementMatrix);
          return global.matrixTransform(svgMatrix.inverse());
        };

        const bboxCenterSvg = (element: SVGGraphicsElement) => {
          const box = element.getBBox();
          return pointInSvg(element, box.x + box.width / 2, box.y + box.height / 2);
        };

        const flowerHeadSvg = (flower: SVGGraphicsElement) => {
          const box = flower.getBBox();
          return pointInSvg(flower, box.x + box.width / 2, box.y + box.height * 0.28);
        };

        const pointerSvgPoint = (event: PointerEvent) => {
          const point = svgElement.createSVGPoint();
          point.x = event.clientX;
          point.y = event.clientY;

          const screen = svgElement.getScreenCTM();
          if (!screen) return { x: 0, y: 0 };
          return point.matrixTransform(screen.inverse());
        };

        const getPosePosition = (pose: SVGGraphicsElement) => ({
          x: Number(gsap.getProperty(pose, "x")) || 0,
          y: Number(gsap.getProperty(pose, "y")) || 0,
        });

        const sitBase = sitPose ? bboxCenterSvg(sitPose) : { x: 0, y: 0 };
        const flyBase = flyPose ? bboxCenterSvg(flyPose) : { x: 0, y: 0 };
        const flowerPoint = (index: number, poseBase: { x: number; y: number }) => {
          const flower = flowers[index];
          if (!flower) return { x: 0, y: 0 };
          const point = flowerPerches[flower.id] || flowerHeadSvg(flower);
          const flowerX = Number(gsap.getProperty(flower, "x")) || 0;
          const flowerY = Number(gsap.getProperty(flower, "y")) || 0;
          return {
            x: point.x + flowerX - poseBase.x,
            y: point.y + flowerY - poseBase.y,
          };
        };

        const showPose = (pose?: SVGGraphicsElement | null) => {
          if (!pose) return;
          gsap.set(pose, { visibility: "visible", pointerEvents: "all" });
          gsap.to(pose, {
            opacity: 1,
            duration: 0.16,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const hidePose = (pose?: SVGGraphicsElement | null) => {
          if (!pose) return;
          gsap.to(pose, {
            opacity: 0,
            duration: 0.16,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => gsap.set(pose, { visibility: "hidden" }),
          });
        };

        if (!reduceMotion) {
          gsap.from(svgElement, {
            y: 18,
            scale: 0.985,
            duration: 0.9,
            ease: "power3.out",
          });

          const parallaxTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });

          parallaxTimeline
            .to(".hero-scroll-base", { yPercent: 0, ease: "none" }, 0)
            .to(sukunshParallax, { yPercent: -9, scale: 1.025, opacity: 0.86, ease: "none" }, 0)
            .to(characterParallax, { xPercent: 0.8, yPercent: -5, ease: "none" }, 0)
            .to(flowerParallax, { xPercent: -0.9, yPercent: -10, ease: "none" }, 0)
            .to(leafParallax, { xPercent: 1.1, yPercent: -8, ease: "none" }, 0);
          timelines.push(parallaxTimeline);

          if (characterGroup) {
            timelines.push(gsap.to(characterGroup, {
              y: -0.8,
              scale: 1.001,
              duration: 3.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              overwrite: "auto",
            }));
          }

          timelines.push(gsap.to(tagRects, {
            scale: 1.018,
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            stagger: 0.25,
            ease: "sine.inOut",
          }));

          timelines.push(gsap.from([...leaves, ...flowers], {
            autoAlpha: 0,
            y: 8,
            duration: 0.75,
            stagger: 0.025,
            ease: "power2.out",
            overwrite: "auto",
          }));
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

          const enterFlower = () => {
            gsap.to(flower, {
              scale: 1.06,
              duration: 0.28,
              ease: "back.out(1.6)",
              overwrite: "auto",
            });
          };
          const leaveFlower = () => {
            gsap.to(flower, {
              scale: 1,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          if (!isTouch) {
            flower.addEventListener("mouseenter", enterFlower);
            flower.addEventListener("mouseleave", leaveFlower);
            cleanupFns.push(
              () => flower.removeEventListener("mouseenter", enterFlower),
              () => flower.removeEventListener("mouseleave", leaveFlower),
            );
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

        const extraWing = flyPose
          ? Array.from(flyPose.querySelectorAll<SVGGraphicsElement>("ellipse,path")).find((node) => {
            if (node === wing1 || node === leftWing || node === rightWing) return false;
            const id = node.id || "";
            const name = node.getAttribute("data-name") || "";
            const className = node.getAttribute("class") || "";
            return /wing|fly|flying|flyinh|transparent|beetal/i.test(`${id} ${name} ${className}`);
          }) || null
          : null;
        const flutterWings = [wing1, extraWing].filter(Boolean) as SVGGraphicsElement[];
        const redWings = [leftWing, rightWing].filter(Boolean) as SVGGraphicsElement[];

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

        const openRedWings = () => {
          redWings.forEach((wing, index) => {
            gsap.to(wing, {
              rotation: index === 0 ? -24 : 24,
              duration: 0.28,
              ease: "power3.out",
              overwrite: "auto",
            });
          });
        };

        const closeRedWings = () => {
          redWings.forEach((wing) => {
            gsap.to(wing, {
              rotation: 0,
              duration: 0.32,
              ease: "power3.inOut",
              overwrite: "auto",
            });
          });
        };

        const startFlyWingFlutter = () => {
          openRedWings();
          if (!flutterWings.length) return;
          wingTimeline?.kill();

          flutterWings.forEach((wing, index) => {
            gsap.set(wing, {
              opacity: 0.55,
              transformOrigin: "50% 50%",
              x: index % 2 === 0 ? -0.6 : 0.6,
              y: -8,
            });
          });

          wingTimeline = gsap.timeline({ repeat: -1 });
          wingTimeline
            .to(flutterWings, {
              rotation: (index) => (index % 2 ? 22 : -22),
              scaleY: 0.45,
              scaleX: 0.9,
              opacity: 0.16,
              duration: 0.035,
              ease: "none",
              stagger: 0.01,
            })
            .to(flutterWings, {
              rotation: (index) => (index % 2 ? -22 : 22),
              scaleY: 1.25,
              scaleX: 1.08,
              opacity: 0.7,
              duration: 0.035,
              ease: "none",
              stagger: 0.01,
            });
        };

        const stopFlyWingFlutter = () => {
          wingTimeline?.kill();
          wingTimeline = null;
          closeRedWings();
          flutterWings.forEach((wing, index) => {
            gsap.to(wing, {
              opacity: 0,
              rotation: index % 2 === 0 ? -8 : 8,
              scaleY: 1,
              scaleX: 1,
              x: index % 2 === 0 ? -0.6 : 0.6,
              y: -8,
              duration: 0.18,
              overwrite: "auto",
            });
          });
        };

        const alignSitToFlower = (index: number) => {
          if (!sitPose) return;
          const point = flowerPoint(index, sitBase);
          gsap.set(sitPose, {
            x: point.x,
            y: point.y,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          });
        };

        const alignFlyToFlower = (index: number) => {
          if (!flyPose) return;
          const point = flowerPoint(index, flyBase);
          gsap.set(flyPose, {
            x: point.x,
            y: point.y,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          });
        };

        const switchToFly = (index: number, onComplete?: () => void) => {
          if (!sitPose || !flyPose) return;
          currentState = "takeoff";
          alignFlyToFlower(index);

          gsap
            .timeline({ onComplete })
            .to(sitPose, {
              y: "+=2",
              scale: 0.985,
              duration: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            })
            .call(() => {
              showPose(flyPose);
              hidePose(sitPose);
              startFlyWingFlutter();
            })
            .to(flyPose, {
              y: "-=8",
              scale: 1.02,
              duration: 0.18,
              ease: "power2.out",
              overwrite: "auto",
            });
        };

        const switchToSit = (index: number) => {
          if (!sitPose || !flyPose) return;
          currentState = "landing";
          stopFlyWingFlutter();
          alignSitToFlower(index);

          gsap
            .timeline({
              onComplete: () => {
                currentState = "landed";
              },
            })
            .call(() => {
              showPose(sitPose);
              hidePose(flyPose);
            })
            .fromTo(
              sitPose,
              { scale: 1.03 },
              {
                scale: 1,
                duration: 0.28,
                ease: "back.out(1.6)",
                overwrite: "auto",
              },
            );
        };

        const beetleTicker = () => {
          // No automatic ticker needed for direct cursor follow, but we keep the empty function in case of any external dependency
        };

        // -------------------------------------------------------------
        // Global Beetle setup (enables flying across the entire page!)
        // -------------------------------------------------------------
        let globalSvg = document.getElementById("global-beetle-svg") as unknown as SVGSVGElement | null;
        if (!globalSvg) {
          globalSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as unknown as SVGSVGElement;
          globalSvg.setAttribute("id", "global-beetle-svg");
          globalSvg.setAttribute("viewBox", svgElement.getAttribute("viewBox") || "0 0 1728.2 758.1");
          globalSvg.setAttribute("class", "fixed inset-0 w-screen h-screen pointer-events-none z-[99999] overflow-visible");
          document.body.appendChild(globalSvg);
        } else {
          globalSvg.setAttribute("viewBox", svgElement.getAttribute("viewBox") || "0 0 1728.2 758.1");
        }

        // Copy styles to make sure classes render perfectly
        const styleNode = svgElement.querySelector("style");
        if (styleNode) {
          let globalStyle = globalSvg.querySelector("style") as unknown as SVGStyleElement | null;
          if (!globalStyle) {
            globalStyle = document.createElementNS("http://www.w3.org/2000/svg", "style") as unknown as SVGStyleElement;
            globalSvg.appendChild(globalStyle);
          }
          globalStyle.textContent = styleNode.textContent;
        }

        // Copy defs so gradients and filters are available locally
        const defsNode = svgElement.querySelector("defs");
        if (defsNode) {
          let globalDefs = globalSvg.querySelector("defs");
          if (!globalDefs) {
            globalDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            globalSvg.appendChild(globalDefs);
          }
          globalDefs.innerHTML = defsNode.innerHTML;
        }

        if (sitPose && flyPose) {
          globalSvg.appendChild(sitPose);
          globalSvg.appendChild(flyPose);
          gsap.set([sitPose, flyPose], {
            transformOrigin: "50% 50%",
            pointerEvents: "none",
          });
        }

        const pointerSvgPointFromCoords = (clientX: number, clientY: number) => {
          if (!globalSvg) return null;
          const point = globalSvg.createSVGPoint();
          point.x = clientX;
          point.y = clientY;

          const screen = globalSvg.getScreenCTM();
          if (!screen) return null;
          return point.matrixTransform(screen.inverse());
        };

        const updateLandedBeetlePosition = () => {
          if (currentState !== "landed") return;

          let targetFlower: HTMLElement | null = null;
          let isFooter = false;

          if (currentFlowerIndex !== -1 && flowers[currentFlowerIndex]) {
            targetFlower = flowers[currentFlowerIndex] as unknown as HTMLElement;
          } else if (activeFooterFlowerId) {
            targetFlower = document.getElementById(activeFooterFlowerId);
            isFooter = true;
          }

          if (targetFlower && globalSvg && sitPose) {
            const rect = targetFlower.getBoundingClientRect();
            const screenX = rect.left + rect.width / 2;
            const screenY = isFooter ? (rect.top + rect.height * 0.5) : (rect.top + rect.height * 0.28);

            const pt = pointerSvgPointFromCoords(screenX, screenY);
            if (pt) {
              const rot = Number(gsap.getProperty(targetFlower, "rotation")) || 0;
              gsap.set(sitPose, {
                x: pt.x - sitBase.x,
                y: pt.y - sitBase.y,
                rotation: rot,
              });
            }
          }
        };

        gsap.ticker.add(updateLandedBeetlePosition);
        cleanupFns.push(() => {
          gsap.ticker.remove(updateLandedBeetlePosition);
        });

        let mouseMoveTimeout: any = null;
        let flyToFlowerTimeline: gsap.core.Timeline | null = null;
        let currentMouseSvgX = 0;
        let currentMouseSvgY = 0;

        const flyToFlowerAndSit = (flowerIndex: number) => {
          if (!flyPose || !sitPose || !globalSvg) return;
          currentState = "flying";

          const flower = flowers[flowerIndex];
          if (!flower) return;

          const rect = flower.getBoundingClientRect();
          const screenX = rect.left + rect.width / 2;
          const screenY = rect.top + rect.height * 0.28;

          const pt = pointerSvgPointFromCoords(screenX, screenY);
          if (!pt) return;

          const endFlyX = pt.x - flyBase.x;
          const endFlyY = pt.y - flyBase.y;
          const endSitX = pt.x - sitBase.x;
          const endSitY = pt.y - sitBase.y;

          const startFlyX = gsap.getProperty(flyPose, "x") as number || 0;
          const startFlyY = gsap.getProperty(flyPose, "y") as number || 0;

          const dx = endFlyX - startFlyX;
          const dy = endFlyY - startFlyY;
          const rotation = gsap.utils.clamp(-45, 45, Math.atan2(dy, dx) * (180 / Math.PI) + 90);

          const mid = {
            x: (startFlyX + endFlyX) / 2 + gsap.utils.random(-25, 25),
            y: Math.min(startFlyY, endFlyY) - gsap.utils.random(35, 60),
          };

          if (flyToFlowerTimeline) flyToFlowerTimeline.kill();

          flyToFlowerTimeline = gsap.timeline({
            onComplete: () => {
              currentFlowerIndex = flowerIndex;
              currentState = "landed";
              stopFlyWingFlutter();
              showPose(sitPose);
              hidePose(flyPose);
              
              gsap.set(sitPose, {
                x: endSitX,
                y: endSitY,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
              });
            },
          });

          flyToFlowerTimeline
            .to(flyPose, {
              x: mid.x,
              y: mid.y,
              rotation,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            })
            .to(flyPose, {
              x: endFlyX,
              y: endFlyY,
              rotation: 0,
              duration: 0.5,
              ease: "power2.inOut",
              overwrite: "auto",
            });
        };

        const landOnNearestAvailableFlower = () => {
          if (!flyPose || !sitPose || !globalSvg) return;
          currentState = "flying";

          const startFlyX = gsap.getProperty(flyPose, "x") as number || 0;
          const startFlyY = gsap.getProperty(flyPose, "y") as number || 0;

          const footerFlowerIds = ["yellow-flower", "red-flower", "white-flower-1"];
          const footerFlowers = footerFlowerIds
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

          let bestFlowerPt: { x: number; y: number } | null = null;
          let bestDist = Infinity;
          let isFooterFlower = false;
          let bestFlowerIndex = -1;
          let bestFooterFlowerId: string | null = null;

          // Check hero flowers
          flowers.forEach((flower, index) => {
            const rect = flower.getBoundingClientRect();
            const screenX = rect.left + rect.width / 2;
            const screenY = rect.top + rect.height * 0.28;
            const pt = pointerSvgPointFromCoords(screenX, screenY);
            if (pt) {
              const fx = pt.x - flyBase.x;
              const fy = pt.y - flyBase.y;
              const dist = Math.hypot(fx - startFlyX, fy - startFlyY);
              if (dist < bestDist) {
                bestDist = dist;
                bestFlowerPt = pt;
                bestFlowerIndex = index;
                isFooterFlower = false;
                bestFooterFlowerId = null;
              }
            }
          });

          // Check footer flowers
          footerFlowers.forEach((flower) => {
            const rect = flower.getBoundingClientRect();
            const screenX = rect.left + rect.width / 2;
            const screenY = rect.top + rect.height * 0.5;
            const pt = pointerSvgPointFromCoords(screenX, screenY);
            if (pt) {
              const fx = pt.x - flyBase.x;
              const fy = pt.y - flyBase.y;
              const dist = Math.hypot(fx - startFlyX, fy - startFlyY);
              if (dist < bestDist) {
                bestDist = dist;
                bestFlowerPt = pt;
                bestFlowerIndex = -1;
                isFooterFlower = true;
                bestFooterFlowerId = flower.id;
              }
            }
          });

          if (bestFlowerPt) {
            const endFlyX = bestFlowerPt.x - flyBase.x;
            const endFlyY = bestFlowerPt.y - flyBase.y;
            const endSitX = bestFlowerPt.x - sitBase.x;
            const endSitY = bestFlowerPt.y - sitBase.y;

            const dx = endFlyX - startFlyX;
            const dy = endFlyY - startFlyY;
            const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            if (flyToFlowerTimeline) flyToFlowerTimeline.kill();

            flyToFlowerTimeline = gsap.timeline({
              onComplete: () => {
                currentState = "landed";
                stopFlyWingFlutter();
                showPose(sitPose);
                hidePose(flyPose);
                if (!isFooterFlower) {
                  currentFlowerIndex = bestFlowerIndex;
                  activeFooterFlowerId = null;
                } else {
                  currentFlowerIndex = -1;
                  activeFooterFlowerId = bestFooterFlowerId;
                }
                gsap.set(sitPose, {
                  x: endSitX,
                  y: endSitY,
                  rotation: 0,
                  scaleX: 1,
                  scaleY: 1,
                });
              },
            });

            startFlyWingFlutter();

            flyToFlowerTimeline.to(flyPose, {
              x: endFlyX,
              y: endFlyY,
              rotation: rotation,
              duration: 0.9,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            currentState = "landed";
            stopFlyWingFlutter();
            showPose(sitPose);
            hidePose(flyPose);
          }
        };

        const handleFollowCursor = (event: PointerEvent) => {
          if (flyToFlowerTimeline) {
            flyToFlowerTimeline.kill();
            flyToFlowerTimeline = null;
          }

          const elementUnderCursor = document.elementFromPoint(event.clientX, event.clientY);
          const isInHero = elementUnderCursor ? !!elementUnderCursor.closest("#home") : false;
          const isInFooter = elementUnderCursor ? !!elementUnderCursor.closest("#contact") : false;

          if (!isInHero && !isInFooter) {
            if (currentState === "flying") {
              landOnNearestAvailableFlower();
            }
            return;
          }

          const pt = pointerSvgPointFromCoords(event.clientX, event.clientY);
          if (!pt) return;

          currentMouseSvgX = pt.x;
          currentMouseSvgY = pt.y;

          const targetFlyX = pt.x - flyBase.x;
          const targetFlyY = pt.y - flyBase.y;
          const targetSitX = pt.x - sitBase.x;
          const targetSitY = pt.y - sitBase.y;

          const currentX = gsap.getProperty(flyPose, "x") as number || 0;
          const currentY = gsap.getProperty(flyPose, "y") as number || 0;
          const dx = targetFlyX - currentX;
          const dy = targetFlyY - currentY;
          const dist = Math.hypot(dx, dy);

          if (dist > 1.0) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            if (currentState !== "flying") {
              currentState = "flying";
              showPose(flyPose);
              hidePose(sitPose);
              startFlyWingFlutter();
            }

            gsap.to(flyPose, {
              x: targetFlyX,
              y: targetFlyY,
              rotation: angle,
              duration: 1.8,
              ease: "power2.out",
              overwrite: "auto",
            });

            gsap.to(sitPose, {
              x: targetSitX,
              y: targetSitY,
              rotation: angle,
              duration: 1.8,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
          mouseMoveTimeout = setTimeout(() => {
            if (currentState === "flying") {
              landOnNearestAvailableFlower();
            }
          }, 800);
        };

        const handlePointerLeave = () => {
          if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
          if (currentState === "flying") {
            landOnNearestAvailableFlower();
          }
        };

        if (sitPose && flyPose && flowers.length && section) {
          currentState = "landed";
          showPose(sitPose);
          hidePose(flyPose);

          setTimeout(() => {
            const flower = flowers[0];
            if (flower) {
              const rect = flower.getBoundingClientRect();
              const screenX = rect.left + rect.width / 2;
              const screenY = rect.top + rect.height * 0.28;
              const pt = pointerSvgPointFromCoords(screenX, screenY);
              if (pt) {
                gsap.set(sitPose, {
                  x: pt.x - sitBase.x,
                  y: pt.y - sitBase.y,
                  rotation: 0,
                  scaleX: 1,
                  scaleY: 1
                });
              }
            }
          }, 100);

          window.addEventListener("pointermove", handleFollowCursor);
          window.addEventListener("pointerleave", handlePointerLeave);
          cleanupFns.push(() => {
            window.removeEventListener("pointermove", handleFollowCursor);
            window.removeEventListener("pointerleave", handlePointerLeave);
            if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
            if (flyToFlowerTimeline) flyToFlowerTimeline.kill();

            if (sitPose && sitPose.parentNode) sitPose.parentNode.removeChild(sitPose);
            if (flyPose && flyPose.parentNode) flyPose.parentNode.removeChild(flyPose);
            const gSvg = document.getElementById("global-beetle-svg");
            if (gSvg && gSvg.parentNode && !gSvg.querySelector("g")) {
              gSvg.parentNode.removeChild(gSvg);
            }
          });
        }

        const resumeHeroAnimations = () => {
          gsap.globalTimeline.resume();
          gsap.ticker.wake();
          mainBeetleTimeline?.resume();
        };

        window.addEventListener("scroll", resumeHeroAnimations, { passive: true });
        window.addEventListener("focus", resumeHeroAnimations);
        window.addEventListener("pageshow", resumeHeroAnimations);
        document.addEventListener("visibilitychange", resumeHeroAnimations);
        cleanupFns.push(
          () => window.removeEventListener("scroll", resumeHeroAnimations),
          () => window.removeEventListener("focus", resumeHeroAnimations),
          () => window.removeEventListener("pageshow", resumeHeroAnimations),
          () => document.removeEventListener("visibilitychange", resumeHeroAnimations),
        );

        cleanupHero = () => {
          cleanupFns.forEach((cleanup) => cleanup());
          timelines.forEach((timeline) => timeline.kill());
          mainBeetleTimeline?.kill();
          wingTimeline?.kill();
        };
      }, stage);
    };

    fetch(SVG_URL)
      .then((response) => response.text())
      .then((svg) => {
        const stage = stageRef.current;
        const svgMarkup = cleanSvg(svg);
        if (stage && !cancelled) stage.innerHTML = svgMarkup;

        try {
          setupHero(svgMarkup);
        } catch (error) {
          console.error("Hero animation setup failed; keeping static artwork.", error);
        }
      })
      .catch((error) => {
        console.error("Hero SVG failed to load.", error);
        const stage = stageRef.current;
        if (stage && !cancelled) stage.innerHTML = "";
      });

    return () => {
      cancelled = true;
      cleanupHero?.();
      ctx?.revert();
      if (stageRef.current) stageRef.current.innerHTML = "";
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      data-cursor-tag="Home"
      className="hero relative h-[100dvh] md:h-screen min-h-[100dvh] md:min-h-screen max-h-[100dvh] md:max-h-none overflow-hidden bg-[#050505] text-white select-none"
    >
      {/* Central Interactive Artwork Canvas with Character & PORTFOLIO Typography */}
      <div className="hero-inner relative flex h-full min-h-[100dvh] md:min-h-screen max-h-[100dvh] md:max-h-none items-center justify-center px-0 pt-0 md:pt-16">
        <div className="hero-art relative flex justify-center items-center w-full">
          <div
            ref={stageRef}
            className="svg-stage relative mb-0 aspect-[1728.2/758.1] origin-center overflow-visible"
            style={{
              "--svg-scale-multiplier": heroMetrics.stageScale,
              "--svg-y-offset": `${heroMetrics.stageY}vh`,
              "--sukunsh-scale": heroMetrics.sukunshScale,
            } as React.CSSProperties}
          />
        </div>
      </div>
    </section>
  );
}
