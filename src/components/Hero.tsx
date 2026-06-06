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
  "Layer_151",
  "Layer_228",
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
  "Layer_113",
  "Layer_112",
  "Layer_111",
  "Layer_109",
  "Layer_108",
];

function cleanSvg(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

function beetleMarkup() {
  return `
    <div class="beetle-wrap">
      <svg class="beetle-svg" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g id="beetle">
          <path class="beetle-wing wing-left" d="M64 42 C38 14 14 34 30 62 C44 86 66 70 64 42Z" />
          <path class="beetle-wing wing-right" d="M76 42 C104 14 128 36 110 64 C96 88 75 70 76 42Z" />
          <path class="beetle-leg" d="M52 61 C37 67 27 76 18 86" />
          <path class="beetle-leg" d="M59 69 C48 78 42 88 37 96" />
          <path class="beetle-leg" d="M88 61 C103 67 113 76 122 86" />
          <path class="beetle-leg" d="M82 69 C93 78 99 88 104 96" />
          <path id="beetle_antenna_left" class="beetle-antenna" d="M55 29 C42 10 27 9 18 21" />
          <path id="beetle_antenna_right" class="beetle-antenna" d="M65 25 C57 6 66 0 80 6" />
          <ellipse cx="60" cy="39" rx="20" ry="18" fill="#111111" />
          <ellipse cx="82" cy="51" rx="40" ry="29" fill="#d94b24" />
          <path d="M82 24 C80 41 80 60 82 78" stroke="#8f2418" stroke-width="3" fill="none" stroke-linecap="round" />
          <circle cx="70" cy="40" r="5" fill="#101010" />
          <circle cx="94" cy="40" r="5" fill="#101010" />
          <circle cx="66" cy="58" r="4.5" fill="#101010" />
          <circle cx="99" cy="59" r="4.5" fill="#101010" />
          <circle cx="83" cy="68" r="4" fill="#101010" />
          <ellipse cx="72" cy="33" rx="17" ry="6" fill="rgba(255,255,255,0.22)" />
        </g>
      </svg>
    </div>
  `;
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
      stage.insertAdjacentHTML("beforeend", beetleMarkup());

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isMobile = window.innerWidth < 768;
      const scopedSelector = gsap.utils.selector(stage);
      const flowers = flowerSelectors.flatMap((selector) => scopedSelector(selector));
      const leaves = leafSelectors.flatMap((selector) => scopedSelector(selector));
      const tagRects = scopedSelector("#Layer_147 rect") as unknown as SVGGraphicsElement[];
      const tagTexts = scopedSelector("#Layer_148 text") as unknown as SVGGraphicsElement[];
      const svgElement = stage.querySelector("svg");
      const heroText = scopedSelector("#Sukunsh")[0] as unknown as SVGGraphicsElement | undefined;
      const selectFirst = (selectors: string[]) =>
        selectors.flatMap((selector) => scopedSelector(selector))[0] as unknown as SVGGraphicsElement | undefined;
      const neutralHead = selectFirst(["#HEAD_WITH_SMILE"]);
      const extraHeads = [
        selectFirst(["#HEAD"]),
        selectFirst(["#HEAD_WITH_NORMAL_EXPRESION"]),
      ].filter(Boolean) as SVGGraphicsElement[];
      const pupils = [
        selectFirst(["#pupil_left"]),
        selectFirst(["#pupil_right"]),
      ].filter(Boolean) as SVGGraphicsElement[];
      const characterGroup = (() => {
        if (!svgElement) return null;
        const rootGroup = svgElement.querySelector(":scope > g");
        if (!rootGroup) return null;
        if (heroText) heroText.setAttribute("id", "sukunsh_text");

        const parts = characterPartIds
          .map((id) => svgElement.querySelector<SVGGElement>(`#${CSS.escape(id)}`))
          .filter(Boolean) as SVGGElement[];
        if (!parts.length) return null;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", "character_group");
        rootGroup.insertBefore(group, parts[0]);
        parts.forEach((part) => group.appendChild(part));
        return group as unknown as SVGGraphicsElement;
      })();
      const faceFocusGroup = (() => {
        if (!svgElement || !characterGroup) return null;
        const rootGroup = svgElement.querySelector(":scope > g");
        if (!rootGroup) return null;

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
          layer.id !== "HEAD" &&
          layer.id !== "HEAD_WITH_NORMAL_EXPRESION" &&
          !layer.id.startsWith("flower_") &&
          !layer.id.startsWith("leaf_") &&
          layer.id !== "Layer_147" &&
          layer.id !== "Layer_148",
      );
      const beetle = stage.querySelector<HTMLElement>(".beetle-wrap");
      const headFocusTarget = neutralHead || characterGroup || svgElement;
      const allDraggables: Draggable[] = [];
      const cleanupFns: Array<() => void> = [];
      const timelines: gsap.core.Animation[] = [];
      let beetleFlight: gsap.core.Timeline | null = null;
      let beetleWings: gsap.core.Timeline | null = null;

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
        gsap.set(extraHeads, { autoAlpha: 0, pointerEvents: "none" });
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
        const headRotateTo = neutralHead
          ? gsap.quickTo(neutralHead, "rotation", { duration: 0.45, ease: "power3.out" })
          : undefined;
        const headXTo = neutralHead
          ? gsap.quickTo(neutralHead, "x", { duration: 0.42, ease: "power3.out" })
          : undefined;
        const headYTo = neutralHead
          ? gsap.quickTo(neutralHead, "y", { duration: 0.42, ease: "power3.out" })
          : undefined;

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
          headRotateTo?.(0);
          headXTo?.(0);
          headYTo?.(0);
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

          headRotateTo?.(dx * 2);
          headXTo?.(dx * 0.65);
          headYTo?.(dy * 0.45);
          pupilXTo(dx * 0.95);
          pupilYTo(dy * 0.62);
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
            (flower as HTMLElement).style.pointerEvents = "all";
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
            (leaf as HTMLElement).style.pointerEvents = "all";
            leaf.addEventListener("mouseenter", enterLeaf);
            leaf.addEventListener("mouseleave", leaveLeaf);
            cleanupFns.push(
              () => leaf.removeEventListener("mouseenter", enterLeaf),
              () => leaf.removeEventListener("mouseleave", leaveLeaf),
            );
          }
        });

        if (beetle) {
          const wings = gsap.utils.toArray<SVGElement>(".beetle-wing");
          const svgBox = svgElement?.viewBox?.baseVal;
          const headBox = getBox(neutralHead);
          if (svgBox && headBox) {
            beetle.style.left = `${((headBox.x + headBox.width * 0.72) / svgBox.width) * 100}%`;
            beetle.style.top = `${((headBox.y + headBox.height * 0.18) / svgBox.height) * 100}%`;
          }

          gsap.set(beetle, {
            x: 0,
            y: 0,
            rotation: -8,
            scale: 1,
            transformOrigin: "center center",
          });
          gsap.set("#beetle", { transformOrigin: "center center" });
          gsap.set([".wing-left", ".wing-right"], { transformOrigin: "center center" });
          gsap.set(["#beetle_antenna_left", "#beetle_antenna_right"], {
            transformOrigin: "center bottom",
          });

          if (!reduceMotion) {
            gsap.to("#beetle_antenna_left", {
              rotation: 7,
              duration: 0.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            gsap.to("#beetle_antenna_right", {
              rotation: -7,
              duration: 0.85,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            timelines.push(gsap.to("#beetle", {
              y: -1,
              duration: 1.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            }));
          }

          beetleWings = gsap.timeline({ repeat: -1, paused: true });
          beetleWings
            .set(wings, { opacity: 1 })
            .to(".wing-left", { scaleX: 0.35, rotation: -22, duration: 0.06, ease: "power1.inOut" }, 0)
            .to(".wing-right", { scaleX: 0.35, rotation: 22, duration: 0.06, ease: "power1.inOut" }, 0)
            .to(".wing-left", { scaleX: 1, rotation: 0, duration: 0.06, ease: "power1.inOut" }, 0.06)
            .to(".wing-right", { scaleX: 1, rotation: 0, duration: 0.06, ease: "power1.inOut" }, 0.06);

          const beetleHome = { x: 0, y: 0, rotation: -8, scale: 1 };

          const startFly = () => {
            beetleWings?.play();
            gsap.to(wings, { opacity: 1, duration: 0.15, ease: "power2.out" });
          };

          const stopFly = () => {
            beetleWings?.pause();
            gsap.to(wings, { opacity: 0, duration: 0.25, ease: "power2.out" });
            gsap.to([".wing-left", ".wing-right"], {
              scaleX: 1,
              rotation: 0,
              duration: 0.25,
              ease: "power2.out",
            });
          };

          const returnBeetleHome = () => {
            startFly();
            gsap.to(beetle, {
              x: beetleHome.x,
              y: beetleHome.y,
              rotation: beetleHome.rotation,
              scale: beetleHome.scale,
              duration: 0.8,
              ease: "elastic.out(1, 0.45)",
              overwrite: "auto",
              onComplete: () => {
                beetleFlight?.resume();
              },
            });
          };

          if (!reduceMotion) {
            startFly();
            beetleFlight = gsap.timeline({ repeat: -1 });
            beetleFlight
              .to(beetle, { x: 22, y: -20, rotation: 14, scale: 1.08, duration: 1.55, ease: "sine.inOut", overwrite: "auto" })
              .to(beetle, { x: 42, y: 6, rotation: -8, scale: 1.02, duration: 1.3, ease: "sine.inOut", overwrite: "auto" })
              .to(beetle, { x: 12, y: 24, rotation: 10, scale: 0.98, duration: 1.45, ease: "sine.inOut", overwrite: "auto" })
              .to(beetle, { x: -16, y: 4, rotation: -12, scale: 1.04, duration: 1.4, ease: "sine.inOut", overwrite: "auto" })
              .to(beetle, { x: 0, y: 0, rotation: -8, scale: 1, duration: 1.2, ease: "sine.inOut", overwrite: "auto" });
          }

          const beetleDraggable = Draggable.create(beetle, {
            type: "x,y",
            bounds: stage,
            allowNativeTouchScrolling: false,
            onPress() {
              beetleFlight?.pause();
              startFly();
              (this.target as HTMLElement).style.cursor = "grabbing";
              gsap.to(this.target, {
                scale: 1.14,
                duration: 0.25,
                ease: "power2.out",
              });
            },
            onDrag() {
              gsap.to(this.target, {
                rotation: gsap.utils.clamp(-25, 25, this.x * 0.05),
                duration: 0.12,
                ease: "power2.out",
              });
            },
            onRelease() {
              (this.target as HTMLElement).style.cursor = "grab";
              returnBeetleHome();
            },
          })[0];

          allDraggables.push(beetleDraggable);
        }

        cleanupHero = () => {
          gsap.ticker.remove(tickerFn);
          cleanupFns.forEach((cleanup) => cleanup());
          allDraggables.forEach((draggable) => draggable.kill());
          timelines.forEach((timeline) => timeline.kill());
          beetleFlight?.kill();
          beetleWings?.kill();
        };
      }, stage);
    };

    fetch(SVG_URL)
      .then((response) => response.text())
      .then((svg) => setupHero(cleanSvg(svg)))
      .catch(() => {
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
