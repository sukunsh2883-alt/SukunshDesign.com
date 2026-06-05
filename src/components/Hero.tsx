import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

interface HeroProps {
  onWatchShowreel: () => void;
  profile: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
}

const SVG_URL = "/artwork/main artwork.svg";

const flowerSelectors = Array.from({ length: 9 }, (_, index) => `#flower_${index + 1}`);
const leafSelectors = Array.from({ length: 11 }, (_, index) => `#leaf_${index + 1}`);
const draggableSelectors = ["#right_arm_with_pen-2", "#pentab-2", "#ipad-2", "#blue_pen-2", "#pink"];

function cleanSvg(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

function beetleMarkup() {
  return `
    <div class="beetle-wrap">
      <svg class="beetle-svg" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
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

export default function Hero(_: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(SVG_URL)
      .then((response) => response.text())
      .then((svg) => {
        if (!cancelled) setSvgMarkup(cleanSvg(svg));
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup("");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!svgMarkup) return;

    gsap.registerPlugin(Draggable);

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scopedSelector = gsap.utils.selector(stage);
    const flowers = flowerSelectors.flatMap((selector) => scopedSelector(selector));
    const leaves = leafSelectors.flatMap((selector) => scopedSelector(selector));
    const dragItems = draggableSelectors.flatMap((selector) => scopedSelector(selector));
    const head = scopedSelector("#head-2")[0] || scopedSelector("#head")[0];
    const bigPen = scopedSelector("#right_arm_with_pen-2")[0];
    const shirt = scopedSelector("#shirt-2")[0];
    const collar = scopedSelector("#coler")[0];
    const collarTwo = scopedSelector("#coler_2")[0];
    const allDraggables: Draggable[] = [];
    let ticker: (() => void) | null = null;
    let beetleFlight: gsap.core.Timeline | null = null;
    let beetleWings: gsap.core.Timeline | null = null;

    if (!stage.querySelector(".beetle-wrap")) {
      stage.insertAdjacentHTML("beforeend", beetleMarkup());
    }

    const beetle = stage.querySelector<HTMLElement>(".beetle-wrap");

    const motion = {
      flowerAmp: 1,
      leafAmp: 1,
      flowerHover: 1,
      leafHover: 1,
    };

    const ctx = gsap.context(() => {
      gsap.set(stage, { opacity: 1 });
      gsap.set(flowers, { transformOrigin: "center bottom" });
      gsap.set(leaves, { transformOrigin: "center bottom" });
      gsap.set(dragItems, { transformOrigin: "center center" });

      if (head) gsap.set(head, { transformOrigin: "center bottom" });
      if (bigPen) gsap.set(bigPen, { transformOrigin: "left center" });
      if (shirt) gsap.set(shirt, { transformOrigin: "center center" });
      if (collar) gsap.set(collar, { transformOrigin: "center center" });
      if (collarTwo) gsap.set(collarTwo, { transformOrigin: "center center" });

      if (!reduceMotion) {
        gsap.from(stage.querySelector("svg"), {
          opacity: 0,
          y: 30,
          scale: 0.985,
          duration: 1,
          ease: "power3.out",
        });

        if (head) {
          gsap.to(head, {
            rotation: 1.4,
            x: 0.8,
            y: -1.4,
            duration: 4.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        if (bigPen) {
          gsap.to(bigPen, {
            rotation: 0.45,
            x: 0.6,
            y: -0.4,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        if (shirt) {
          gsap.to(shirt, {
            y: -0.8,
            scaleY: 1.003,
            duration: 5.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        if (collar) {
          gsap.to(collar, {
            y: -0.45,
            rotation: 0.35,
            duration: 4.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        if (collarTwo) {
          gsap.to(collarTwo, {
            y: -0.45,
            rotation: -0.35,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
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

      stage.addEventListener("mouseenter", strengthenMotion);
      stage.addEventListener("mouseleave", softenMotion);

      flowers.forEach((flower) => {
        (flower as HTMLElement).style.pointerEvents = "all";
        flower.addEventListener("mouseenter", () => {
          gsap.to(motion, { flowerHover: 1.55, duration: 0.9, ease: "power3.out" });
        });
        flower.addEventListener("mouseleave", () => {
          gsap.to(motion, { flowerHover: 1, duration: 1.2, ease: "power3.out" });
        });
      });

      leaves.forEach((leaf) => {
        (leaf as HTMLElement).style.pointerEvents = "all";
        leaf.addEventListener("mouseenter", () => {
          gsap.to(motion, { leafHover: 1.5, duration: 0.9, ease: "power3.out" });
        });
        leaf.addEventListener("mouseleave", () => {
          gsap.to(motion, { leafHover: 1, duration: 1.2, ease: "power3.out" });
        });
      });

      if (!reduceMotion) {
        ticker = () => {
          const time = performance.now() / 1000;

          flowers.forEach((flower, index) => {
            const speed = 0.72 + index * 0.045;
            const wave = Math.sin(time * speed + index * 0.9);
            const softWave = Math.cos(time * speed * 0.8 + index);
            const amp = motion.flowerAmp * motion.flowerHover;

            gsap.set(flower, {
              x: softWave * 1.4 * amp,
              y: wave * 3.8 * amp,
              rotation: wave * 3.6 * amp,
              scale: 1 + Math.abs(wave) * 0.01 * amp,
            });
          });

          leaves.forEach((leaf, index) => {
            const speed = 0.62 + index * 0.04;
            const wave = Math.sin(time * speed + index * 0.7);
            const amp = motion.leafAmp * motion.leafHover;

            gsap.set(leaf, {
              x: wave * 2.2 * amp,
              rotation: wave * 5.8 * amp,
            });
          });
        };

        gsap.ticker.add(ticker);
      }

      dragItems.forEach((item) => {
        const element = item as unknown as SVGGraphicsElement;
        (element as unknown as HTMLElement).style.pointerEvents = "all";
        (element as unknown as HTMLElement).style.cursor = "grab";

        const draggable = Draggable.create(element, {
          type: "x,y",
          dragResistance: 0.7,
          edgeResistance: 1,
          liveSnap: {
            x: (value) => gsap.utils.clamp(-10, 10, value),
            y: (value) => gsap.utils.clamp(-8, 8, value),
          },
          onPress() {
            (this.target as HTMLElement).style.cursor = "grabbing";
            gsap.to(this.target, {
              scale: 1.01,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
          onDrag() {
            gsap.to(this.target, {
              rotation: gsap.utils.clamp(-1.8, 1.8, this.x * 0.06),
              duration: 0.18,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
          onRelease() {
            (this.target as HTMLElement).style.cursor = "grab";
            gsap.to(this.target, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.9,
              ease: "elastic.out(1, 0.55)",
              overwrite: "auto",
            });
          },
        })[0];

        allDraggables.push(draggable);
      });

      if (beetle) {
        const wings = gsap.utils.toArray<SVGElement>(".beetle-wing");
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

          gsap.to("#beetle", {
            y: -1,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        beetleWings = gsap.timeline({ repeat: -1, paused: true });
        beetleWings
          .set(wings, { opacity: 1 })
          .to(".wing-left", { scaleX: 0.35, rotation: -22, duration: 0.06, ease: "power1.inOut" }, 0)
          .to(".wing-right", { scaleX: 0.35, rotation: 22, duration: 0.06, ease: "power1.inOut" }, 0)
          .to(".wing-left", { scaleX: 1, rotation: 0, duration: 0.06, ease: "power1.inOut" }, 0.06)
          .to(".wing-right", { scaleX: 1, rotation: 0, duration: 0.06, ease: "power1.inOut" }, 0.06);

        const beetleHome = { x: 0, y: 0, rotation: -8, scale: 1 };
        const setBeetleHome = (x: number, y: number, rotation: number, scale: number) => {
          beetleHome.x = x;
          beetleHome.y = y;
          beetleHome.rotation = rotation;
          beetleHome.scale = scale;
        };

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
            duration: 0.9,
            ease: "power3.out",
            onComplete: () => {
              stopFly();
              beetleFlight?.resume();
            },
          });
        };

        if (!reduceMotion) {
          beetleFlight = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
          beetleFlight
            .call(() => {
              stopFly();
              setBeetleHome(0, 0, -8, 1);
            })
            .to(beetle, { x: 0, y: 0, rotation: -8, scale: 1, duration: 1.2, ease: "sine.inOut" })
            .call(startFly)
            .to(beetle, { x: 120, y: -95, rotation: 16, scale: 1.08, duration: 1.25, ease: "power2.inOut" })
            .to(beetle, { x: 250, y: -42, rotation: -10, scale: 1.03, duration: 1.1, ease: "power2.inOut" })
            .call(() => setBeetleHome(318, 18, 5, 0.96))
            .to(beetle, { x: 318, y: 18, rotation: 5, scale: 0.96, duration: 0.75, ease: "power3.out" })
            .call(stopFly)
            .to(beetle, { y: 15, duration: 1.3, ease: "sine.inOut" })
            .call(startFly)
            .to(beetle, { x: 210, y: -118, rotation: -18, scale: 1.08, duration: 1.2, ease: "power2.inOut" })
            .to(beetle, { x: -65, y: -58, rotation: 14, scale: 1.02, duration: 1.45, ease: "power2.inOut" })
            .call(() => setBeetleHome(-128, 28, -7, 0.96))
            .to(beetle, { x: -128, y: 28, rotation: -7, scale: 0.96, duration: 0.8, ease: "power3.out" })
            .call(stopFly)
            .to(beetle, { y: 25, duration: 1.3, ease: "sine.inOut" })
            .call(startFly)
            .to(beetle, { x: -20, y: -82, rotation: 16, scale: 1.06, duration: 1.2, ease: "power2.inOut" })
            .call(() => setBeetleHome(0, 0, -8, 1))
            .to(beetle, { x: 0, y: 0, rotation: -8, scale: 1, duration: 0.9, ease: "power3.out" })
            .call(stopFly);
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

      return () => {
        stage.removeEventListener("mouseenter", strengthenMotion);
        stage.removeEventListener("mouseleave", softenMotion);
      };
    }, stage);

    return () => {
      if (ticker) gsap.ticker.remove(ticker);
      allDraggables.forEach((draggable) => draggable.kill());
      beetleFlight?.kill();
      beetleWings?.kill();
      stage.querySelector(".beetle-wrap")?.remove();
      ctx.revert();
    };
  }, [svgMarkup]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-end justify-center overflow-hidden bg-[#0f0f0e] px-3 pt-10 md:px-8"
    >
      <div
        ref={stageRef}
        className="svg-stage relative mb-[-6vh] aspect-[1358.17/730.78] w-[min(122vw,1480px)] origin-bottom overflow-visible md:mb-[-9vh] md:w-[min(96vw,1560px)]"
        dangerouslySetInnerHTML={svgMarkup ? { __html: svgMarkup } : undefined}
      />
    </section>
  );
}
