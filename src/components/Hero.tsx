import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

const SVG_URL = "/artwork/main artwork.svg";

const flowerIds = Array.from({ length: 9 }, (_, index) => `flower_${index + 1}`);
const leafIds = Array.from({ length: 11 }, (_, index) => `leaf_${index + 1}`);
const characterPartIds = [
  "blue_pen-2",
  "pink",
  "ipad-2",
  "paper-2",
  "red_bag-2",
  "pentab-2",
  "Layer_136",
  "Layer_135",
  "Layer_134",
  "Layer_133",
  "Layer_152",
  "Layer_130",
  "Layer_129",
  "right_arm_with_pen-2",
  "Layer_253",
  "Layer_252",
  "head-2",
  "Layer_123",
  "shirt-2",
  "green_bag",
  "Layer_119",
  "Layer_153",
  "Layer_118",
  "Layer_117",
  "camera-2",
  "Layer_116",
  "Layer_114",
  "Layer_112",
  "Layer_109",
  "Layer_108",
];

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

export default function Hero({ profile, onOpenProjects, onOpenAIWork }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let cleanupHero: (() => void) | null = null;

    const setupHero = (svgMarkup: string) => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage || cancelled) return;

      gsap.registerPlugin(Draggable, ScrollTrigger);
      stage.innerHTML = svgMarkup;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const svgElement = stage.querySelector("svg");
      if (!svgElement) return;

      const byId = <T extends SVGGraphicsElement>(id: string) => findSvgElement<T>(svgElement, id);
      const heroText = byId("Sukunsh");
      const head = byId("head-2");
      const leftEye = byId("eye_ball_left");
      const rightEye = byId("eyes_ball_right");
      const penArm = byId("right_arm_with_pen-2");
      const sitPose = byId("beetal_sit_posttion") || byId("beetal_sit_postion");
      const flyPose = byId("beeta_flying_postion");
      const wing1 = byId("flyinh_beetal_right-2");
      const leftWing = byId("beetal_left_wing-2");
      const rightWing = byId("beetal_right_wing-2");
      const flowers = flowerIds.map((id) => byId(id)).filter(Boolean) as SVGGraphicsElement[];
      const leaves = leafIds.map((id) => byId(id)).filter(Boolean) as SVGGraphicsElement[];
      const tagRects = Array.from(svgElement.querySelectorAll("#Layer_147 rect")) as SVGGraphicsElement[];
      const tagTexts = Array.from(svgElement.querySelectorAll("#Layer_148 text")) as SVGGraphicsElement[];

      const characterGroup = (() => {
        if (heroText) {
          heroText.setAttribute("id", "sukunsh_text");
          const backgroundLayer = byId("Layer_38");
          if (heroText.parentNode === svgElement && backgroundLayer?.parentNode === svgElement) {
            svgElement.insertBefore(heroText, backgroundLayer.nextSibling);
          }
        }

        const existing = byId("character_group");
        if (existing) return existing;

        const parts = characterPartIds
          .map((id) => findSvgElement<SVGGElement>(svgElement, id))
          .filter(Boolean) as SVGGElement[];
        if (!parts.length) return null;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", "character_group");
        const firstTopLevelPart = parts.find((part) => part.parentNode === svgElement) || null;
        svgElement.insertBefore(group, firstTopLevelPart);
        parts.forEach((part) => group.appendChild(part));
        const sukunshText = byId("sukunsh_text");
        const backgroundLayer = byId("Layer_38");
        if (sukunshText?.parentNode === svgElement && backgroundLayer?.parentNode === svgElement) {
          svgElement.insertBefore(sukunshText, backgroundLayer.nextSibling);
        }
        return group as unknown as SVGGraphicsElement;
      })();

      const artworkLayers = (Array.from(svgElement.querySelectorAll("svg > g > g")) as SVGGElement[]).filter(
        (layer) =>
          layer.id !== "sukunsh_text" &&
          layer.id !== "Layer_38" &&
          layer.id !== "character_group" &&
          layer.id !== "beetal_sit_posttion" &&
          layer.id !== "beetal_sit_postion" &&
          layer.id !== "beeta_flying_postion" &&
          !layer.id.startsWith("flower_") &&
          !layer.id.startsWith("leaf_") &&
          layer.id !== "Layer_147" &&
          layer.id !== "Layer_148",
      );

      const cleanupFns: Array<() => void> = [];
      const timelines: gsap.core.Animation[] = [];
      let mainBeetleTimeline: gsap.core.Timeline | null = null;
      let wingTimeline: gsap.core.Timeline | null = null;
      let currentState: "landed" | "takeoff" | "flying" | "landing" | "dragging" | "returning" = "landed";
      let currentFlowerIndex = 0;
      let dragging = false;
      let pointerDragging = false;

      ctx = gsap.context(() => {
        gsap.ticker.lagSmoothing(1000, 16);

        gsap.set(stage, { opacity: 1 });
        gsap.set(svgElement, { transformOrigin: "center bottom" });
        gsap.set(heroText, { transformOrigin: "center center" });
        gsap.set(artworkLayers, { transformOrigin: "center bottom" });
        gsap.set(characterGroup, { transformBox: "fill-box", transformOrigin: "50% 70%" });
        gsap.set(head, { transformBox: "fill-box", transformOrigin: "50% 95%" });
        gsap.set(penArm, { transformBox: "fill-box", transformOrigin: "80% 55%" });
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
          const point = flowerHeadSvg(flower);
          return {
            x: point.x - poseBase.x,
            y: point.y - poseBase.y + 8,
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
            opacity: 0,
            y: 30,
            scale: 0.985,
            duration: 1,
            ease: "power3.out",
          });

          if (artworkLayers.length) {
            timelines.push(
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.6,
                    invalidateOnRefresh: true,
                  },
                })
                .to(artworkLayers, { y: -42, scale: 0.992, ease: "none" }, 0),
            );
          }

          if (characterGroup) {
            timelines.push(gsap.to(characterGroup, {
              y: -1,
              scale: 1.0015,
              duration: 3.6,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              overwrite: "auto",
            }));
          } else {
            [head, penArm, byId("camera-2")].filter(Boolean).forEach((part, index) => {
              timelines.push(gsap.to(part, {
                y: -1 * (index === 0 ? 1 : 0.6),
                duration: 3.6 + index * 0.12,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                overwrite: "auto",
              }));
            });
          }

          timelines.push(gsap.to(tagRects, {
            scale: 1.018,
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            stagger: 0.25,
            ease: "sine.inOut",
          }));

          const growTimeline = gsap.timeline({ delay: 0.18 });
          gsap.set(leaves, { autoAlpha: 0, scaleY: 0.12, y: 10 });
          gsap.set(flowers, { autoAlpha: 0, scale: 0.18, y: 8 });
          growTimeline
            .to(leaves, {
              autoAlpha: 1,
              scaleY: 1,
              y: 0,
              duration: 1.15,
              stagger: 0.035,
              ease: "expo.out",
              overwrite: "auto",
            }, 0)
            .to(flowers, {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 1,
              stagger: 0.045,
              ease: "back.out(1.45)",
              overwrite: "auto",
            }, 0.22);
          timelines.push(growTimeline);
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
        const penX = quickTo(penArm, "x", 0.65);
        const penY = quickTo(penArm, "y", 0.65);
        const penRotation = quickTo(penArm, "rotation", 0.65);

        const moveCharacterDetails = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          leftEyeX?.(x * 3.6);
          rightEyeX?.(x * 3.6);
          leftEyeY?.(y * 2.4);
          rightEyeY?.(y * 2.4);
          headRotation?.(x * 0.35);
          penX?.(x * 0.6);
          penY?.(y * 0.4);
          penRotation?.(x * -1);
        };

        const resetCharacterDetails = () => {
          leftEyeX?.(0);
          leftEyeY?.(0);
          rightEyeX?.(0);
          rightEyeY?.(0);
          headRotation?.(0);
          penX?.(0);
          penY?.(0);
          penRotation?.(0);
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
          if (currentState !== "landed" || dragging) return;
          alignSitToFlower(currentFlowerIndex);
        };

        const flyTo = (index: number) => {
          if (!flyPose) return;
          switchToFly(currentFlowerIndex, () => {
            currentState = "flying";
            const start = getPosePosition(flyPose);
            const end = flowerPoint(index, flyBase);
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const rotation = gsap.utils.clamp(-45, 45, Math.atan2(dy, dx) * (180 / Math.PI) + 90);
            const mid = {
              x: (start.x + end.x) / 2 + gsap.utils.random(-35, 35),
              y: Math.min(start.y, end.y) - gsap.utils.random(55, 90),
            };

            gsap
              .timeline({
                onComplete: () => {
                  currentFlowerIndex = index;
                  switchToSit(index);
                },
              })
              .to(flyPose, {
                x: mid.x,
                y: mid.y,
                rotation,
                scaleX: 1,
                scaleY: 1,
                duration: 0.72,
                ease: "power2.out",
                overwrite: "auto",
              })
              .to(flyPose, {
                x: end.x,
                y: end.y,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                duration: 0.72,
                ease: "power2.inOut",
                overwrite: "auto",
              });
          });
        };

        const nearestFlowerFromPoint = (x: number, y: number) => {
          let nearest = 0;
          let best = Infinity;

          flowers.forEach((_, index) => {
            const point = flowerPoint(index, flyBase);
            const distance = Math.hypot(x - point.x, y - point.y);
            if (distance < best) {
              best = distance;
              nearest = index;
            }
          });

          return nearest;
        };

        const moveManualDrag = (event: PointerEvent) => {
          if (!pointerDragging || !flyPose) return;
          const point = pointerSvgPoint(event);
          gsap.set(flyPose, {
            x: point.x - flyBase.x,
            y: point.y - flyBase.y,
            scaleX: 1,
          });
        };

        const stopManualDrag = () => {
          if (!flyPose) return;
          pointerDragging = false;
          dragging = false;
          currentState = "returning";
          window.removeEventListener("pointermove", moveManualDrag);
          window.removeEventListener("pointerup", stopManualDrag);

          const position = getPosePosition(flyPose);
          const nearest = nearestFlowerFromPoint(position.x, position.y);
          const point = flowerPoint(nearest, flyBase);

          gsap.to(flyPose, {
            x: point.x,
            y: point.y,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.45)",
            overwrite: "auto",
            onComplete: () => {
              currentFlowerIndex = nearest;
              switchToSit(nearest);
              mainBeetleTimeline?.resume();
            },
          });
        };

        const startManualDrag = (event: PointerEvent) => {
          if (!sitPose || !flyPose) return;
          event.preventDefault();
          dragging = true;
          pointerDragging = true;
          currentState = "dragging";
          mainBeetleTimeline?.pause();

          const currentSit = getPosePosition(sitPose);
          gsap.set(flyPose, {
            x: currentSit.x,
            y: currentSit.y,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          });

          showPose(flyPose);
          hidePose(sitPose);
          startFlyWingFlutter();
          moveManualDrag(event);
          window.addEventListener("pointermove", moveManualDrag);
          window.addEventListener("pointerup", stopManualDrag);
        };

        if (sitPose && flyPose && flowers.length) {
          alignSitToFlower(0);
          currentFlowerIndex = 0;
          currentState = "landed";
          showPose(sitPose);
          hidePose(flyPose);

          if (!reduceMotion) {
            mainBeetleTimeline = gsap.timeline({ repeat: -1 });
            for (let index = 1; index <= flowers.length; index += 1) {
              const next = index % flowers.length;
              mainBeetleTimeline
                .to({}, { duration: 1.5 })
                .call(() => {
                  if (!dragging && currentState === "landed") flyTo(next);
                })
                .to({}, { duration: 2.45 });
            }
          }

          sitPose.addEventListener("pointerdown", startManualDrag);
          flyPose.addEventListener("pointerdown", startManualDrag);
          cleanupFns.push(
            () => sitPose.removeEventListener("pointerdown", startManualDrag),
            () => flyPose.removeEventListener("pointerdown", startManualDrag),
          );
          gsap.ticker.add(beetleTicker);
          cleanupFns.push(() => gsap.ticker.remove(beetleTicker));
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
          () => window.removeEventListener("pointermove", moveManualDrag),
          () => window.removeEventListener("pointerup", stopManualDrag),
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

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero relative overflow-hidden bg-[#050505]"
    >
      <div className="hero-inner relative flex min-h-screen items-end justify-center px-0 pt-10">
        <div className="hero-content hidden">
          <p className="text-sm font-medium tracking-[-0.025em] text-white/62">
            Hello I’m Multidisciplinary Designer.
          </p>
          <h1 className="mt-2 text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-white">
            {profile?.brandName || "Sukunsh"}.
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenProjects}
              className="bg-white px-5 py-3 text-xs font-semibold tracking-[-0.02em] text-black"
            >
              View Work
            </button>
            <button
              type="button"
              onClick={onOpenAIWork}
              className="border border-white/20 px-5 py-3 text-xs font-semibold tracking-[-0.02em] text-white"
            >
              AI Films
            </button>
          </div>
        </div>

        <div className="hero-art relative flex justify-center">
          <div
            ref={stageRef}
            className="svg-stage relative mb-[-8vh] aspect-[1358.17/730.78] w-[min(150vw,1880px)] origin-bottom overflow-visible md:mb-[-12vh] md:w-[min(118vw,1960px)]"
          />
        </div>
      </div>
    </section>
  );
}
