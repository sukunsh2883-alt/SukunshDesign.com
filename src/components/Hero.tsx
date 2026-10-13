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

const flowerIds = Array.from({ length: 9 }, (_, index) => `flower_${index + 1}`);
const leafIds = [...Array.from({ length: 11 }, (_, index) => `leaf_${index + 1}`), "leaf_10-2"];
const flowerPerches: Record<string, { x: number; y: number }> = {
  flower_1: { x: 695, y: 526 },
  flower_2: { x: 752, y: 570 },
  flower_3: { x: 898, y: 615 },
  flower_4: { x: 1201, y: 624 },
  flower_5: { x: 824, y: 560 },
  flower_6: { x: 1254, y: 592 },
  flower_7: { x: 1350, y: 542 },
  flower_8: { x: 1443, y: 526 },
  flower_9: { x: 1385, y: 585 },
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

        // Keep Beetle directly in svgElement (shared SVG coordinate system with flowers)
        if (sitPose && flyPose) {
          if (sitPose.parentNode !== svgElement) svgElement.appendChild(sitPose);
          if (flyPose.parentNode !== svgElement) svgElement.appendChild(flyPose);
          gsap.set([sitPose, flyPose], {
            transformOrigin: "50% 50%",
            cursor: "grab",
            pointerEvents: "all",
          });
        }

        const pointerSvgPointFromCoords = (clientX: number, clientY: number) => {
          if (!svgElement) return null;
          const point = svgElement.createSVGPoint();
          point.x = clientX;
          point.y = clientY;

          const screen = svgElement.getScreenCTM();
          if (!screen) return null;
          return point.matrixTransform(screen.inverse());
        };

        // Exact SVG coordinate centers for sit and fly poses
        const BEETLE_SIT_ORIGIN = { x: 765, y: 588 };
        const BEETLE_FLY_ORIGIN = { x: 883, y: 467 };

        let currentFlyX = flowerPerches["flower_1"].x;
        let currentFlyY = flowerPerches["flower_1"].y;
        let targetSvgX = currentFlyX;
        let targetSvgY = currentFlyY;
        let currentRot = 0;
        let isLanding = false;
        let idleTimer: any = null;
        let flyToFlowerTimeline: gsap.core.Timeline | null = null;

        const updateBeetleFrame = () => {
          if (currentState === "landed" && sitPose) {
            const flower = flowers[currentFlowerIndex];
            if (flower) {
              const perch = flowerPerches[flower.id] || flowerPerches["flower_1"];
              const rot = Number(gsap.getProperty(flower, "rotation")) || 0;
              const fy = Number(gsap.getProperty(flower, "y")) || 0;
              // Track flower sway naturally around ground base
              const rad = (rot * Math.PI) / 180;
              const arm = Math.max(80, 750 - perch.y);
              const swayX = Math.sin(rad) * arm * 0.7;
              const swayY = fy + (1 - Math.cos(rad)) * arm * 0.7;
              gsap.set(sitPose, {
                x: perch.x - BEETLE_SIT_ORIGIN.x + swayX,
                y: perch.y - BEETLE_SIT_ORIGIN.y + swayY,
                rotation: rot,
              });
            }
          } else if (currentState === "flying" && flyPose && !isLanding) {
            // Silky smooth damped lerp toward mouse cursor
            const dx = targetSvgX - currentFlyX;
            const dy = targetSvgY - currentFlyY;
            const dist = Math.hypot(dx, dy);

            // Responsive damping factor
            const lerpFactor = dist > 250 ? 0.16 : 0.11;
            currentFlyX += dx * lerpFactor;
            currentFlyY += dy * lerpFactor;

            // Organic heading angle interpolation
            if (dist > 3) {
              const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
              let diff = (targetAngle - currentRot) % 360;
              if (diff > 180) diff -= 360;
              if (diff < -180) diff += 360;
              currentRot += diff * 0.16;
            }

            gsap.set(flyPose, {
              x: currentFlyX - BEETLE_FLY_ORIGIN.x,
              y: currentFlyY - BEETLE_FLY_ORIGIN.y,
              rotation: currentRot,
            });
          }
        };

        gsap.ticker.add(updateBeetleFrame);
        cleanupFns.push(() => {
          gsap.ticker.remove(updateBeetleFrame);
        });

        const landOnNearestAvailableFlower = () => {
          if (!flyPose || !sitPose || !svgElement) return;
          if (currentState !== "flying" || isLanding) return;

          isLanding = true;

          // Find the flower blossom strictly closest to current beetle flight position
          let bestIndex = 0;
          let bestDist = Infinity;

          flowers.forEach((flower, index) => {
            const perch = flowerPerches[flower.id] || flowerPerches["flower_1"];
            if (isMobileMode && (perch.x < 840 || perch.x > 1660)) {
              return;
            }
            const dist = Math.hypot(perch.x - currentFlyX, perch.y - currentFlyY);
            if (dist < bestDist) {
              bestDist = dist;
              bestIndex = index;
            }
          });

          const flower = flowers[bestIndex];
          const perch = flowerPerches[flower?.id] || (isMobileMode ? { x: 1201, y: 624 } : { x: 695, y: 526 });
          const targetFlyX = perch.x - BEETLE_FLY_ORIGIN.x;
          const targetFlyY = perch.y - BEETLE_FLY_ORIGIN.y;
          const targetSitX = perch.x - BEETLE_SIT_ORIGIN.x;
          const targetSitY = perch.y - BEETLE_SIT_ORIGIN.y;

          const dx = targetFlyX - (currentFlyX - BEETLE_FLY_ORIGIN.x);
          const dy = targetFlyY - (currentFlyY - BEETLE_FLY_ORIGIN.y);
          const rot = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

          if (flyToFlowerTimeline) flyToFlowerTimeline.kill();
          startFlyWingFlutter();

          flyToFlowerTimeline = gsap.timeline({
            onComplete: () => {
              currentState = "landed";
              isLanding = false;
              currentFlowerIndex = bestIndex;
              stopFlyWingFlutter();
              gsap.set(sitPose, {
                x: targetSitX,
                y: targetSitY,
                rotation: (gsap.getProperty(flower, "rotation") as number) || 0,
                opacity: 1,
                visibility: "visible",
              });
              gsap.set(flyPose, { opacity: 0, visibility: "hidden" });
            },
          });

          flyToFlowerTimeline.to(flyPose, {
            x: targetFlyX,
            y: targetFlyY,
            rotation: rot,
            duration: 0.55,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const takeOffAndFollow = (svgX: number, svgY: number) => {
          const wasLanding = isLanding;
          if (flyToFlowerTimeline) {
            flyToFlowerTimeline.kill();
            flyToFlowerTimeline = null;
          }
          isLanding = false;

          if (currentState !== "flying" || wasLanding) {
            currentState = "flying";
            if (wasLanding && flyPose) {
              currentFlyX = (gsap.getProperty(flyPose, "x") as number) + BEETLE_FLY_ORIGIN.x;
              currentFlyY = (gsap.getProperty(flyPose, "y") as number) + BEETLE_FLY_ORIGIN.y;
            } else if (sitPose) {
              const curSitX = (gsap.getProperty(sitPose, "x") as number) || 0;
              const curSitY = (gsap.getProperty(sitPose, "y") as number) || 0;
              currentFlyX = curSitX + BEETLE_SIT_ORIGIN.x;
              currentFlyY = curSitY + BEETLE_SIT_ORIGIN.y;
            }
            gsap.set(flyPose, {
              x: currentFlyX - BEETLE_FLY_ORIGIN.x,
              y: currentFlyY - BEETLE_FLY_ORIGIN.y,
              rotation: currentRot,
              opacity: 1,
              visibility: "visible",
              pointerEvents: "all",
            });
            if (sitPose) gsap.set(sitPose, { opacity: 0, visibility: "hidden" });
            startFlyWingFlutter();
          }

          targetSvgX = svgX;
          targetSvgY = svgY;
        };

        const handleFollowCursor = (event: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          const isInsideHero =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

          if (!isInsideHero) {
            if (currentState === "flying" && !isLanding) {
              landOnNearestAvailableFlower();
            }
            return;
          }

          const pt = pointerSvgPointFromCoords(event.clientX, event.clientY);
          if (!pt) return;

          takeOffAndFollow(pt.x, pt.y);

          // When cursor stops, sit on flowers only
          if (idleTimer) clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
            if (currentState === "flying" && !isLanding) {
              landOnNearestAvailableFlower();
            }
          }, 950);
        };

        const handlePointerLeave = () => {
          if (currentState === "flying" && !isLanding) {
            landOnNearestAvailableFlower();
          }
        };

        if (sitPose && flyPose && flowers.length && section) {
          currentState = "landed";
          const prefMobileIdx = flowers.findIndex((f) => f.id === "flower_4" || f.id === "flower_6");
          currentFlowerIndex = isMobileMode && prefMobileIdx >= 0 ? prefMobileIdx : 0;
          isLanding = false;
          showPose(sitPose);
          hidePose(flyPose);
          const activeFlower = flowers[currentFlowerIndex];
          const p0 = flowerPerches[activeFlower?.id] || (isMobileMode ? { x: 1201, y: 624 } : { x: 695, y: 526 });
          currentFlyX = p0.x;
          currentFlyY = p0.y;
          targetSvgX = p0.x;
          targetSvgY = p0.y;
          gsap.set(sitPose, {
            x: p0.x - BEETLE_SIT_ORIGIN.x,
            y: p0.y - BEETLE_SIT_ORIGIN.y,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          });

          window.addEventListener("pointermove", handleFollowCursor);
          window.addEventListener("pointerdown", handleFollowCursor);
          window.addEventListener("pointerleave", handlePointerLeave);
          document.addEventListener("mouseleave", handlePointerLeave);
          cleanupFns.push(() => {
            window.removeEventListener("pointermove", handleFollowCursor);
            window.removeEventListener("pointerdown", handleFollowCursor);
            window.removeEventListener("pointerleave", handlePointerLeave);
            document.removeEventListener("mouseleave", handlePointerLeave);
            if (idleTimer) clearTimeout(idleTimer);
            if (flyToFlowerTimeline) flyToFlowerTimeline.kill();
          });
        }

        const resumeHeroAnimations = () => {
          gsap.globalTimeline.resume();
          gsap.ticker.wake();
          mainBeetleTimeline?.resume();
        };

        const handleResize = () => {
          resumeHeroAnimations();
          ScrollTrigger.refresh();
          updateBeetleFrame();
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
          mainBeetleTimeline?.kill();
          wingTimeline?.kill();
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
    </section>
  );
}
