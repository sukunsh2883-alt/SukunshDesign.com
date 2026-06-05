(function () {
  gsap.registerPlugin(Draggable);

  /* ===============================
     HELPERS
  ================================ */

  const $ = (s) => document.querySelector(s);
  const has = (s) => !!document.querySelector(s);
  const getId = (id) => document.getElementById(id);

  /* ===============================
     INJECT BEETLE CSS AUTOMATICALLY
  ================================ */

  const style = document.createElement("style");
  style.innerHTML = `
    .svg-stage {
      position: relative;
    }

    .beetle-wrap {
      position: absolute;
      z-index: 99999;
      width: 48px;
      height: auto;
      left: 34%;
      top: 70%;
      pointer-events: auto !important;
      cursor: grab;
      touch-action: none;
      user-select: none;
      transform-origin: center center;
    }

    .beetle-wrap:active {
      cursor: grabbing;
    }

    .beetle-svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
      pointer-events: none;
    }

    .beetle-leg,
    .beetle-antenna {
      stroke: #111111;
      stroke-width: 5;
      stroke-linecap: round;
      fill: none;
    }

    .beetle-wing {
      fill: rgba(255, 245, 210, 0.2);
      stroke: rgba(255, 245, 210, 0.55);
      stroke-width: 1.5;
      opacity: 0;
      transform-origin: center center;
    }
  `;
  document.head.appendChild(style);

  /* ===============================
     CREATE BEETLE AUTOMATICALLY
  ================================ */

  const svgStage = document.querySelector(".svg-stage");

  if (svgStage && !document.querySelector(".beetle-wrap")) {
    const beetleHTML = `
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

    svgStage.insertAdjacentHTML("beforeend", beetleHTML);
  }

  /* ===============================
     SVG IDS
  ================================ */

  const flowers = [
    "#flower_1",
    "#flower_2",
    "#flower_3",
    "#flower_4",
    "#flower_5",
    "#flower_6",
    "#flower_7",
    "#flower_8",
    "#flower_9"
  ].filter(has);

  const leaves = [
    "#leaf_1",
    "#leaf_2",
    "#leaf_3",
    "#leaf_4",
    "#leaf_5",
    "#leaf_6",
    "#leaf_7",
    "#leaf_8",
    "#leaf_9",
    "#leaf_10",
    "#leaf_11"
  ].filter(has);

  const head =
    document.querySelector("#head-2") ||
    document.querySelector("#head") ||
    document.querySelector("#Head");

  const bigPen = "#right_arm_with_pen-2";

  const dragItems = [
    "#right_arm_with_pen-2",
    "#pentab-2",
    "#ipad-2",
    "#blue_pen-2",
    "#pink"
  ].filter(has);

  const shirt = getId("shirt-2");
  const coler = getId("coler");
  const coler2 = getId("coler_2");

  /* ===============================
     SET ORIGINS
  ================================ */

  gsap.set(flowers, { transformOrigin: "center bottom" });
  gsap.set(leaves, { transformOrigin: "center bottom" });
  gsap.set(dragItems, { transformOrigin: "center center" });

  if (head) {
    gsap.set(head, { transformOrigin: "center bottom" });
  }

  if (has(bigPen)) {
    gsap.set(bigPen, { transformOrigin: "left center" });
  }

  if (shirt) {
    gsap.set(shirt, { transformOrigin: "center center" });
  }

  if (coler) {
    gsap.set(coler, { transformOrigin: "center center" });
  }

  if (coler2) {
    gsap.set(coler2, { transformOrigin: "center center" });
  }

  /* ===============================
     INTRO
  ================================ */

  gsap.from(".svg-stage > svg:not(.beetle-svg)", {
    opacity: 0,
    y: 30,
    scale: 0.98,
    duration: 1,
    ease: "power3.out"
  });

  /* ===============================
     HEAD ANIMATION
  ================================ */

  if (head) {
    gsap.to(head, {
      rotation: 1.4,
      x: 0.8,
      y: -1.4,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  /* ===============================
     BIG PEN MINIMUM MOVEMENT
  ================================ */

  if (has(bigPen)) {
    gsap.to(bigPen, {
      rotation: 0.45,
      x: 0.6,
      y: -0.4,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  /* ===============================
     SHIRT + COLLAR
  ================================ */

  if (shirt) {
    gsap.to(shirt, {
      y: -0.8,
      scaleY: 1.003,
      duration: 5.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  if (coler) {
    gsap.to(coler, {
      y: -0.45,
      rotation: 0.35,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  if (coler2) {
    gsap.to(coler2, {
      y: -0.45,
      rotation: -0.35,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  /* ===============================
     FLOWER + LEAF ULTRA SMOOTH
  ================================ */

  const motion = {
    flowerAmp: 1,
    leafAmp: 1,
    flowerHover: 1,
    leafHover: 1
  };

  const stage = document.querySelector(".svg-stage");

  if (stage) {
    stage.addEventListener("mouseenter", () => {
      gsap.to(motion, {
        flowerAmp: 2.35,
        leafAmp: 2.25,
        duration: 1.4,
        ease: "power3.out"
      });
    });

    stage.addEventListener("mouseleave", () => {
      gsap.to(motion, {
        flowerAmp: 1,
        leafAmp: 1,
        duration: 1.8,
        ease: "power3.out"
      });
    });
  }

  flowers.forEach((flower) => {
    const el = document.querySelector(flower);
    if (!el) return;

    el.style.pointerEvents = "all";

    el.addEventListener("mouseenter", () => {
      gsap.to(motion, {
        flowerHover: 1.55,
        duration: 0.9,
        ease: "power3.out"
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(motion, {
        flowerHover: 1,
        duration: 1.2,
        ease: "power3.out"
      });
    });
  });

  leaves.forEach((leaf) => {
    const el = document.querySelector(leaf);
    if (!el) return;

    el.style.pointerEvents = "all";

    el.addEventListener("mouseenter", () => {
      gsap.to(motion, {
        leafHover: 1.5,
        duration: 0.9,
        ease: "power3.out"
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(motion, {
        leafHover: 1,
        duration: 1.2,
        ease: "power3.out"
      });
    });
  });

  gsap.ticker.add(() => {
    const time = performance.now() / 1000;

    flowers.forEach((flower, i) => {
      const speed = 0.72 + i * 0.045;
      const wave = Math.sin(time * speed + i * 0.9);
      const softWave = Math.cos(time * speed * 0.8 + i);
      const amp = motion.flowerAmp * motion.flowerHover;

      gsap.set(flower, {
        x: softWave * 1.4 * amp,
        y: wave * 3.8 * amp,
        rotation: wave * 3.6 * amp,
        scale: 1 + Math.abs(wave) * 0.01 * amp
      });
    });

    leaves.forEach((leaf, i) => {
      const speed = 0.62 + i * 0.04;
      const wave = Math.sin(time * speed + i * 0.7);
      const amp = motion.leafAmp * motion.leafHover;

      gsap.set(leaf, {
        x: wave * 2.2 * amp,
        rotation: wave * 5.8 * amp
      });
    });
  });

  /* ===============================
     SOFT LIMITED DRAG TOOLS
  ================================ */

  dragItems.forEach((item) => {
    const el = $(item);
    if (!el) return;

    el.style.pointerEvents = "all";
    el.style.cursor = "grab";

    Draggable.create(item, {
      type: "x,y",
      dragResistance: 0.7,
      edgeResistance: 1,

      liveSnap: {
        x: (value) => gsap.utils.clamp(-10, 10, value),
        y: (value) => gsap.utils.clamp(-8, 8, value)
      },

      onPress: function () {
        this.target.style.cursor = "grabbing";

        gsap.to(this.target, {
          scale: 1.01,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto"
        });
      },

      onDrag: function () {
        gsap.to(this.target, {
          rotation: gsap.utils.clamp(-1.8, 1.8, this.x * 0.06),
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto"
        });
      },

      onRelease: function () {
        this.target.style.cursor = "grab";

        gsap.to(this.target, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.9,
          ease: "elastic.out(1, 0.55)",
          overwrite: "auto"
        });
      }
    });
  });

  /* ===============================
     BEETLE FLIGHT + DRAG BACK
  ================================ */

  const beetleWrap = document.querySelector(".beetle-wrap");

  if (beetleWrap) {
    gsap.set(".beetle-wrap", {
      x: 0,
      y: 0,
      rotation: -8,
      scale: 1,
      transformOrigin: "center center"
    });

    gsap.set("#beetle", { transformOrigin: "center center" });
    gsap.set([".wing-left", ".wing-right"], { transformOrigin: "center center" });
    gsap.set(["#beetle_antenna_left", "#beetle_antenna_right"], {
      transformOrigin: "center bottom"
    });

    gsap.to("#beetle_antenna_left", {
      rotation: 7,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to("#beetle_antenna_right", {
      rotation: -7,
      duration: 0.85,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to("#beetle", {
      y: -1,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    const beetleWings = gsap.timeline({
      repeat: -1,
      paused: true
    });

    beetleWings
      .set(".beetle-wing", { opacity: 1 })
      .to(".wing-left", {
        scaleX: 0.35,
        rotation: -22,
        duration: 0.06,
        ease: "power1.inOut"
      }, 0)
      .to(".wing-right", {
        scaleX: 0.35,
        rotation: 22,
        duration: 0.06,
        ease: "power1.inOut"
      }, 0)
      .to(".wing-left", {
        scaleX: 1,
        rotation: 0,
        duration: 0.06,
        ease: "power1.inOut"
      }, 0.06)
      .to(".wing-right", {
        scaleX: 1,
        rotation: 0,
        duration: 0.06,
        ease: "power1.inOut"
      }, 0.06);

    function beetleStartFly() {
      beetleWings.play();

      gsap.to(".beetle-wing", {
        opacity: 1,
        duration: 0.15,
        ease: "power2.out"
      });
    }

    function beetleStopFly() {
      beetleWings.pause();

      gsap.to(".beetle-wing", {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out"
      });

      gsap.to([".wing-left", ".wing-right"], {
        scaleX: 1,
        rotation: 0,
        duration: 0.25,
        ease: "power2.out"
      });
    }

    const beetleHome = {
      x: 0,
      y: 0,
      rotation: -8,
      scale: 1
    };

    function setBeetleHome(x, y, rotation, scale) {
      beetleHome.x = x;
      beetleHome.y = y;
      beetleHome.rotation = rotation;
      beetleHome.scale = scale;
    }

    function returnBeetleHome() {
      beetleStartFly();

      gsap.to(".beetle-wrap", {
        x: beetleHome.x,
        y: beetleHome.y,
        rotation: beetleHome.rotation,
        scale: beetleHome.scale,
        duration: 0.9,
        ease: "power3.out",
        onComplete: () => {
          beetleStopFly();
          beetleFlight.resume();
        }
      });
    }

    const beetleFlight = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.4
    });

    beetleFlight
      .call(() => {
        beetleStopFly();
        setBeetleHome(0, 0, -8, 1);
      })
      .to(".beetle-wrap", {
        x: 0,
        y: 0,
        rotation: -8,
        scale: 1,
        duration: 1.2,
        ease: "sine.inOut"
      })

      .call(beetleStartFly)
      .to(".beetle-wrap", {
        x: 120,
        y: -95,
        rotation: 16,
        scale: 1.08,
        duration: 1.25,
        ease: "power2.inOut"
      })
      .to(".beetle-wrap", {
        x: 250,
        y: -42,
        rotation: -10,
        scale: 1.03,
        duration: 1.1,
        ease: "power2.inOut"
      })
      .call(() => setBeetleHome(318, 18, 5, 0.96))
      .to(".beetle-wrap", {
        x: 318,
        y: 18,
        rotation: 5,
        scale: 0.96,
        duration: 0.75,
        ease: "power3.out"
      })
      .call(beetleStopFly)
      .to(".beetle-wrap", {
        y: 15,
        duration: 1.3,
        ease: "sine.inOut"
      })

      .call(beetleStartFly)
      .to(".beetle-wrap", {
        x: 210,
        y: -118,
        rotation: -18,
        scale: 1.08,
        duration: 1.2,
        ease: "power2.inOut"
      })
      .to(".beetle-wrap", {
        x: -65,
        y: -58,
        rotation: 14,
        scale: 1.02,
        duration: 1.45,
        ease: "power2.inOut"
      })
      .call(() => setBeetleHome(-128, 28, -7, 0.96))
      .to(".beetle-wrap", {
        x: -128,
        y: 28,
        rotation: -7,
        scale: 0.96,
        duration: 0.8,
        ease: "power3.out"
      })
      .call(beetleStopFly)
      .to(".beetle-wrap", {
        y: 25,
        duration: 1.3,
        ease: "sine.inOut"
      })

      .call(beetleStartFly)
      .to(".beetle-wrap", {
        x: -20,
        y: -82,
        rotation: 16,
        scale: 1.06,
        duration: 1.2,
        ease: "power2.inOut"
      })
      .call(() => setBeetleHome(0, 0, -8, 1))
      .to(".beetle-wrap", {
        x: 0,
        y: 0,
        rotation: -8,
        scale: 1,
        duration: 0.9,
        ease: "power3.out"
      })
      .call(beetleStopFly);

    Draggable.create(".beetle-wrap", {
      type: "x,y",
      bounds: ".svg-stage",
      allowNativeTouchScrolling: false,

      onPress: function () {
        beetleFlight.pause();
        beetleStartFly();

        this.target.style.cursor = "grabbing";

        gsap.to(this.target, {
          scale: 1.14,
          duration: 0.25,
          ease: "power2.out"
        });
      },

      onDrag: function () {
        gsap.to(this.target, {
          rotation: gsap.utils.clamp(-25, 25, this.x * 0.05),
          duration: 0.12,
          ease: "power2.out"
        });
      },

      onRelease: function () {
        this.target.style.cursor = "grab";
        returnBeetleHome();
      }
    });
  }
})();