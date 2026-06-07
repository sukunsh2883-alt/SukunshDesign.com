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

const flowerSelectors = Array.from({ length: 9 }, (_, index) => `#flower_${index + 1}`);
const leafSelectors = Array.from({ length: 11 }, (_, index) => `#leaf_${index + 1}`);
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
      const isMobile = window.innerWidth < 768;
      const scopedSelector = gsap.utils.selector(stage);
      const flowers = flowerSelectors.flatMap((selector) => scopedSelector(selector)) as unknown as SVGGraphicsElement[];
      const leaves = leafSelectors.flatMap((selector) => scopedSelector(selector)) as unknown as SVGGraphicsElement[];
      const tagRects = scopedSelector("#Layer_147 rect") as unknown as SVGGraphicsElement[];
      const tagTexts = scopedSelector("#Layer_148 text") as unknown as SVGGraphicsElement[];
      const svgElement = stage.querySelector("svg");
      const rootGroup = (Array.from(svgElement?.children || []).find(
        (child) => child instanceof SVGGElement,
      ) || null) as SVGGElement | null;
      const heroText = scopedSelector("#Sukunsh")[0] as unknown as SVGGraphicsElement | undefined;
      const selectFirst = (selectors: string[]) =>
        selectors.flatMap((selector) => scopedSelector(selector))[0] as unknown as SVGGraphicsElement | undefined;
      const neutralHead = selectFirst(["#head-2"]);
      const pupils = [
        selectFirst(["#eye_ball_left"]),
        selectFirst(["#eyes_ball_right"]),
      ].filter(Boolean) as SVGGraphicsElement[];
      const characterGroup = (() => {
        if (!svgElement || !rootGroup) return null;
        if (heroText) heroText.setAttribute("id", "sukunsh_text");

        const parts = characterPartIds
          .map((id) => findSvgElement<SVGGElement>(svgElement, id))
          .filter(Boolean) as SVGGElement[];
        if (!parts.length) return null;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", "character_group");
        const firstTopLevelPart = parts.find((part) => part.parentNode === rootGroup) || null;
        rootGroup.insertBefore(group, firstTopLevelPart);
        parts.forEach((part) => group.appendChild(part));
        return group as unknown as SVGGraphicsElement;
      })();
      const faceFocusGroup = (() => {
        if (!svgElement || !rootGroup || !characterGroup) return null;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", "face_focus_group");
        rootGroup.insertBefore(group, characterGroup);
        group.appendChild(characterGroup as unknown as SVGGElement);
        return group as unknown as SVGGraphicsElement;
      })();
      const artworkLayers = (Array.from(stage.querySelectorAll("svg > g > g")) as SVGGElement[]).filter(
        (layer) =>
          layer.id !== "sukunsh_text" &&
          layer.id !== "Layer_38" &&
          layer.id !== "face_focus_group" &&
          layer.id !== "character_group" &&
          layer.id !== "beetal-2" &&
          !layer.id.startsWith("flower_") &&
          !layer.id.startsWith("leaf_") &&
          layer.id !== "Layer_147" &&
          layer.id !== "Layer_148",
      );
      const beetle = selectFirst(["#beetal-2"]);
      const beetleBody = selectFirst(["#beetal_body"]);
      const beetleLeftWing = selectFirst(["#beetal_left_wing"]);
      const beetleRightWing = selectFirst(["#beetal_right_wing"]);
      const beetleFlyingWing = selectFirst(["#flyinh_beetal_right"]);
      const beetleWingParts = [beetleLeftWing, beetleRightWing, beetleFlyingWing].filter(Boolean) as SVGGraphicsElement[];
      const headFocusTarget = neutralHead || characterGroup || svgElement;
      const allDraggables: Draggable[] = [];
      const cleanupFns: Array<() => void> = [];
      const timelines: gsap.core.Animation[] = [];
      let beetleFlight: gsap.core.Timeline | null = null;
      let beetleWingTimeline: gsap.core.Timeline | null = null;
      let currentPerchFlower: SVGGraphicsElement | null = null;
      let currentPerchIndex = 0;
      let beetleState: "landed" | "flying" | "dragging" = "landed";
      const beetleBase = { x: 0, y: 0 };

      const motion = {
        flowerAmp: isMobile || isTouch ? 0.75 : 1,
        leafAmp: isMobile || isTouch ? 0.75 : 1,
        flowerHover: 1,
        leafHover: 1,
        growth: reduceMotion ? 1 : 0,
      };

      const tickerFn = () => {
        const time = performance.now() / 1000;

        flowers.forEach((flower, index) => {
          const speed = 0.72 + index * 0.045;
          const wave = Math.sin(time * speed + index * 0.9);
          const softWave = Math.cos(time * speed * 0.8 + index);
          const amp = motion.flowerAmp * motion.flowerHover;
          const growth = motion.growth;

          gsap.set(flower, {
            x: softWave * 1.4 * amp * growth,
            y: wave * 3.8 * amp * growth,
            rotation: wave * 3.6 * amp * growth,
            scale: growth * (1 + Math.abs(wave) * 0.01 * amp),
          });
        });

        leaves.forEach((leaf, index) => {
          const speed = 0.62 + index * 0.04;
          const wave = Math.sin(time * speed + index * 0.7);
          const amp = motion.leafAmp * motion.leafHover;
          const growth = motion.growth;

          gsap.set(leaf, {
            x: wave * 2.2 * amp * growth,
            rotation: wave * 5.8 * amp * growth,
            scaleY: growth,
          });
        });

        if (beetle && beetleState === "landed" && currentPerchFlower) {
          const flowerX = Number(gsap.getProperty(currentPerchFlower, "x")) || 0;
          const flowerY = Number(gsap.getProperty(currentPerchFlower, "y")) || 0;
          const flowerRotation = Number(gsap.getProperty(currentPerchFlower, "rotation")) || 0;

          gsap.set(beetle, {
            x: beetleBase.x + flowerX,
            y: beetleBase.y + flowerY,
            rotation: flowerRotation * 0.12,
          });
        }
      };

      const resumeHeroAnimations = () => {
        motion.growth = 1;
        gsap.globalTimeline.resume();
        gsap.ticker.wake();
        beetleFlight?.resume();
      };

      ctx = gsap.context(() => {
        gsap.ticker.lagSmoothing(1000, 16);

        if (svgElement) gsap.set(svgElement, { transformOrigin: "center bottom" });
        gsap.set(stage, { opacity: 1 });
        gsap.set(heroText, { transformOrigin: "center center" });
        gsap.set(faceFocusGroup, { transformBox: "fill-box", transformOrigin: "center 50%" });
        gsap.set(artworkLayers, { transformOrigin: "center bottom" });
        gsap.set(flowers, { transformOrigin: "center bottom" });
        gsap.set(leaves, { transformOrigin: "center bottom" });
        gsap.set([...tagRects, ...tagTexts], { transformOrigin: "center center" });
        gsap.set(characterGroup, { transformBox: "fill-box", transformOrigin: "center 72%" });
        gsap.set(neutralHead, { autoAlpha: 1, transformBox: "fill-box", transformOrigin: "center 82%" });
        gsap.set(pupils, { transformOrigin: "center center" });

        const getBox = (element?: SVGGraphicsElement) => {
          try {
            return element?.getBBox();
          } catch {
            return undefined;
          }
        };

        const pupilXTo = gsap.quickTo(pupils, "x", { duration: 0.28, ease: "power3.out" });
        const pupilYTo = gsap.quickTo(pupils, "y", { duration: 0.28, ease: "power3.out" });

        const resetHeadFocus = () => {
          if (faceFocusGroup) {
            gsap.to(faceFocusGroup, {
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
          gsap.to(pupils, {
            x: 0,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        const moveHeadFocus = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const centerX = rect.left + rect.width * 0.5;
          const centerY = rect.top + rect.height * 0.42;
          const dx = gsap.utils.clamp(-1, 1, (event.clientX - centerX) / (rect.width * 0.38));
          const dy = gsap.utils.clamp(-1, 1, (event.clientY - centerY) / (rect.height * 0.36));

          pupilXTo(dx * 3);
          pupilYTo(dy * 2);
        };

        if (!isTouch && headFocusTarget && faceFocusGroup) {
          const focusBox = getBox(headFocusTarget as SVGGraphicsElement);
          const ownerSvg = (headFocusTarget as SVGGraphicsElement).ownerSVGElement;
          const headHitArea = focusBox && ownerSvg
            ? document.createElementNS("http://www.w3.org/2000/svg", "rect")
            : null;

          if (headHitArea && focusBox && ownerSvg) {
            headHitArea.setAttribute("x", String(focusBox.x - 18));
            headHitArea.setAttribute("y", String(focusBox.y - 18));
            headHitArea.setAttribute("width", String(focusBox.width + 36));
            headHitArea.setAttribute("height", String(focusBox.height + 36));
            headHitArea.setAttribute("fill", "transparent");
            headHitArea.setAttribute("pointer-events", "all");
            headHitArea.setAttribute("aria-hidden", "true");
            ownerSvg.appendChild(headHitArea);

            const enterHeadFocus = (event: PointerEvent) => {
              gsap.to(faceFocusGroup, {
                scale: 1.055,
                x: -12,
                y: 8,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
              });
              moveHeadFocus(event);
            };

            headHitArea.addEventListener("pointerenter", enterHeadFocus);
            headHitArea.addEventListener("pointermove", moveHeadFocus);
            headHitArea.addEventListener("pointerleave", resetHeadFocus);
            cleanupFns.push(
              () => headHitArea.removeEventListener("pointerenter", enterHeadFocus),
              () => headHitArea.removeEventListener("pointermove", moveHeadFocus),
              () => headHitArea.removeEventListener("pointerleave", resetHeadFocus),
              () => headHitArea.remove(),
            );
          }
        }

        if (!reduceMotion) {
          if (svgElement) {
            gsap.from(svgElement, {
              opacity: 0,
              y: 30,
              scale: 0.985,
              duration: 1,
              ease: "power3.out",
            });
          }

          gsap
            .timeline({ delay: 0.18 })
            .set([...leaves, ...flowers], { autoAlpha: 0 }, 0)
            .to(leaves, { autoAlpha: 1, duration: 0.7, stagger: 0.035, ease: "power2.out" }, 0)
            .to(flowers, { autoAlpha: 1, duration: 0.65, stagger: 0.045, ease: "power2.out" }, 0.16)
            .to(motion, { growth: 1, duration: 1.9, ease: "expo.out" }, 0);

          if (artworkLayers.length) {
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
              .to(artworkLayers, { y: -42, scale: 0.992, ease: "none" }, 0);
          }

          if (characterGroup) {
            timelines.push(gsap.to(characterGroup, {
              y: -3,
              scale: 1.01,
              duration: 3.2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              overwrite: "auto",
            }));
          }

          gsap.ticker.add(tickerFn);

          timelines.push(gsap.to(tagRects, {
            scale: 1.018,
            duration: 2.6,
            repeat: -1,
            yoyo: true,
            stagger: 0.25,
            ease: "sine.inOut",
          }));
        }

        const strengthenMotion = () => {
          gsap.to(motion, {
            flowerAmp: 2.35,
            leafAmp: 2.25,
            duration: 1.4,
            ease: "power3.out",
          });
        };

        const softenMotion = () => {
          gsap.to(motion, {
            flowerAmp: 1,
            leafAmp: 1,
            duration: 1.8,
            ease: "power3.out",
          });
        };

        if (!isTouch) {
          stage.addEventListener("mouseenter", strengthenMotion);
          stage.addEventListener("mouseleave", softenMotion);
          cleanupFns.push(
            () => stage.removeEventListener("mouseenter", strengthenMotion),
            () => stage.removeEventListener("mouseleave", softenMotion),
          );
        }
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
            (rect as unknown as HTMLElement).style.pointerEvents = "all";
            (rect as unknown as HTMLElement).style.cursor = "pointer";
            rect.addEventListener("mouseenter", enterTag);
            rect.addEventListener("mouseleave", leaveTag);
            cleanupFns.push(
              () => rect.removeEventListener("mouseenter", enterTag),
              () => rect.removeEventListener("mouseleave", leaveTag),
            );
          }
        });

        flowers.forEach((flower) => {
          const enterFlower = () => {
            gsap.to(motion, { flowerHover: 1.55, duration: 0.9, ease: "power3.out" });
          };
          const leaveFlower = () => {
            gsap.to(motion, { flowerHover: 1, duration: 1.2, ease: "power3.out" });
          };

          if (!isTouch) {
            flower.style.pointerEvents = "all";
            flower.addEventListener("mouseenter", enterFlower);
            flower.addEventListener("mouseleave", leaveFlower);
            cleanupFns.push(
              () => flower.removeEventListener("mouseenter", enterFlower),
              () => flower.removeEventListener("mouseleave", leaveFlower),
            );
          }
        });

        leaves.forEach((leaf) => {
          const enterLeaf = () => {
            gsap.to(motion, { leafHover: 1.5, duration: 0.9, ease: "power3.out" });
          };
          const leaveLeaf = () => {
            gsap.to(motion, { leafHover: 1, duration: 1.2, ease: "power3.out" });
          };

          if (!isTouch) {
            leaf.style.pointerEvents = "all";
            leaf.addEventListener("mouseenter", enterLeaf);
            leaf.addEventListener("mouseleave", leaveLeaf);
            cleanupFns.push(
              () => leaf.removeEventListener("mouseenter", enterLeaf),
              () => leaf.removeEventListener("mouseleave", leaveLeaf),
            );
          }
        });

        if (beetle) {
          if (rootGroup) rootGroup.appendChild(beetle as unknown as SVGGElement);

          const getCenter = (element?: SVGGraphicsElement | null) => {
            const box = getBox(element || undefined);
            return box ? { x: box.x + box.width / 2, y: box.y + box.height / 2 } : null;
          };
          const beetleCenter = getCenter(beetle);
          const perchFlowers = flowers.filter(Boolean) as SVGGraphicsElement[];
          const flowerCenters = perchFlowers.map((flower) => getCenter(flower));
          const validFlowerIndexes = flowerCenters
            .map((center, index) => (center ? index : -1))
            .filter((index) => index >= 0);
          const perchOffset = { x: 0, y: -9 };

          const setPerch = (index: number) => {
            if (!beetleCenter || !validFlowerIndexes.length) return;

            currentPerchIndex = validFlowerIndexes[index % validFlowerIndexes.length];
            currentPerchFlower = perchFlowers[currentPerchIndex];
            const target = flowerCenters[currentPerchIndex];
            if (!target) return;

            beetleBase.x = target.x - beetleCenter.x + perchOffset.x;
            beetleBase.y = target.y - beetleCenter.y + perchOffset.y;
          };

          const nearestPerch = () => {
            if (!beetleCenter || !validFlowerIndexes.length) return 0;

            const currentX = Number(gsap.getProperty(beetle, "x")) || 0;
            const currentY = Number(gsap.getProperty(beetle, "y")) || 0;
            const beetleX = beetleCenter.x + currentX;
            const beetleY = beetleCenter.y + currentY;

            return validFlowerIndexes.reduce((nearest, index) => {
              const center = flowerCenters[index];
              const nearestCenter = flowerCenters[nearest];
              if (!center || !nearestCenter) return nearest;

              const distance = Math.hypot(center.x - beetleX, center.y - beetleY);
              const nearestDistance = Math.hypot(nearestCenter.x - beetleX, nearestCenter.y - beetleY);
              return distance < nearestDistance ? index : nearest;
            }, validFlowerIndexes[0]);
          };

          const closeWings = () => {
            beetleWingTimeline?.pause(0);
            gsap.to(beetleWingParts, {
              autoAlpha: 0,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              duration: 0.28,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          const openWings = () => {
            gsap.to(beetleWingParts, {
              autoAlpha: 1,
              duration: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            });
            beetleWingTimeline?.play();
          };

          gsap.set(beetle, {
            transformBox: "fill-box",
            transformOrigin: "center center",
            cursor: "grab",
            pointerEvents: "all",
          });
          gsap.set(beetleBody, { transformBox: "fill-box", transformOrigin: "center center" });
          gsap.set(beetleLeftWing, { transformBox: "fill-box", transformOrigin: "right center" });
          gsap.set(beetleRightWing, { transformBox: "fill-box", transformOrigin: "left center" });
          gsap.set(beetleFlyingWing, { transformBox: "fill-box", transformOrigin: "center center" });

          beetleWingTimeline = gsap.timeline({ repeat: -1, paused: true });
          beetleWingTimeline
            .to(beetleLeftWing, { rotation: -18, scaleX: 0.72, duration: 0.055, ease: "power1.inOut" }, 0)
            .to(beetleRightWing, { rotation: 18, scaleX: 0.72, duration: 0.055, ease: "power1.inOut" }, 0)
            .to(beetleFlyingWing, { rotation: 8, scaleY: 0.68, duration: 0.055, ease: "power1.inOut" }, 0)
            .to(beetleLeftWing, { rotation: -4, scaleX: 1, duration: 0.055, ease: "power1.inOut" }, 0.055)
            .to(beetleRightWing, { rotation: 4, scaleX: 1, duration: 0.055, ease: "power1.inOut" }, 0.055)
            .to(beetleFlyingWing, { rotation: -8, scaleY: 1, duration: 0.055, ease: "power1.inOut" }, 0.055);

          setPerch(0);
          gsap.set(beetle, {
            x: beetleBase.x,
            y: beetleBase.y,
            rotation: -4,
            scale: 1,
          });
          closeWings();

          const flyToPerch = (index: number) => {
            if (!beetleCenter || !validFlowerIndexes.length) return;

            const routeIndex = validFlowerIndexes.indexOf(index) >= 0 ? index : validFlowerIndexes[0];
            const startX = Number(gsap.getProperty(beetle, "x")) || 0;
            const startY = Number(gsap.getProperty(beetle, "y")) || 0;
            setPerch(routeIndex);
            const targetX = beetleBase.x;
            const targetY = beetleBase.y;

            beetleState = "flying";
            currentPerchFlower = null;
            openWings();

            gsap
              .timeline({
                onComplete: () => {
                  beetleState = "landed";
                  closeWings();
                },
              })
              .to(beetle, {
                x: (startX + targetX) / 2,
                y: Math.min(startY, targetY) - 36,
                rotation: targetX > startX ? 14 : -14,
                scale: 1.07,
                duration: 0.72,
                ease: "sine.inOut",
                overwrite: "auto",
              })
              .to(beetle, {
                x: targetX,
                y: targetY,
                rotation: -4,
                scale: 1,
                duration: 0.78,
                ease: "power2.inOut",
                overwrite: "auto",
              });
          };

          if (!reduceMotion && validFlowerIndexes.length) {
            const route = [0, 2, 5, 8, 4, 1, 7, 3, 6]
              .map((index) => validFlowerIndexes[index % validFlowerIndexes.length]);
            beetleFlight = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
            route.forEach((index) => {
              beetleFlight
                ?.call(() => flyToPerch(index))
                .to({}, { duration: 2.35 });
            });
          }

          const returnBeetleToPerch = () => {
            const nearest = nearestPerch();
            setPerch(nearest);
            beetleState = "flying";
            openWings();

            gsap.to(beetle, {
              x: beetleBase.x,
              y: beetleBase.y,
              rotation: -4,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1, 0.45)",
              overwrite: "auto",
              onComplete: () => {
                beetleState = "landed";
                closeWings();
                beetleFlight?.resume();
              },
            });
          };

          const beetleDraggable = Draggable.create(beetle, {
            type: "x,y",
            allowNativeTouchScrolling: true,
            onPress() {
              beetleState = "dragging";
              beetleFlight?.pause();
              openWings();
              gsap.to(this.target, {
                scale: 1.12,
                duration: 0.22,
                ease: "power2.out",
                overwrite: "auto",
              });
            },
            onDrag() {
              gsap.to(this.target, {
                rotation: gsap.utils.clamp(-22, 22, this.x * 0.04),
                duration: 0.12,
                ease: "power2.out",
                overwrite: "auto",
              });
            },
            onRelease: returnBeetleToPerch,
          })[0];

          allDraggables.push(beetleDraggable);
        }

        cleanupHero = () => {
          gsap.ticker.remove(tickerFn);
          cleanupFns.forEach((cleanup) => cleanup());
          allDraggables.forEach((draggable) => draggable.kill());
          timelines.forEach((timeline) => timeline.kill());
          beetleFlight?.kill();
          beetleWingTimeline?.kill();
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
            Delhi Based<br />
            Multidisciplinary Designer.
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
