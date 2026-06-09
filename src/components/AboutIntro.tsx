import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const phrases = [
  {
    text: "I’m a Delhi-based visual artist,",
    className: "about-intro-phrase about-intro-left",
    from: { x: -160, y: 120, rotation: -5 },
  },
  {
    text: "rooted in Bihar’s rich cultural heritage,",
    className: "about-intro-phrase about-intro-right",
    from: { x: 160, y: 135, rotation: 4 },
  },
  {
    text: "with a background in Fine Art and Design.",
    className: "about-intro-phrase about-intro-center",
    from: { x: 0, y: 170, rotation: 0 },
  },
];

export default function AboutIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const phraseNodes = gsap.utils.toArray<HTMLElement>(".about-intro-phrase");

      if (reduceMotion) {
        gsap.set(phraseNodes, { opacity: 1, x: 0, y: 0, rotation: 0, filter: "blur(0px)" });
        return;
      }

      gsap.set(phraseNodes, {
        opacity: 0,
        filter: "blur(18px)",
        transformOrigin: "50% 70%",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=125%",
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      phraseNodes.forEach((node, index) => {
        const config = phrases[index];
        timeline
          .fromTo(
            node,
            {
              ...config.from,
              opacity: 0,
              scale: 0.94,
              filter: "blur(20px)",
            },
            {
              x: index === 0 ? 18 : index === 1 ? -18 : 0,
              y: -22,
              rotation: index === 0 ? 1.3 : index === 1 ? -1.2 : 0,
              opacity: 0.82,
              scale: 1.02,
              filter: "blur(5px)",
              duration: 0.85,
              ease: "power2.out",
            },
            index === 0 ? 0 : "-=0.28",
          )
          .to(node, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "elastic.out(1, 0.62)",
          });
      });

      timeline
        .to(".about-intro-mist-one", { x: 120, y: -40, opacity: 0.36, duration: 1.4, ease: "none" }, 0)
        .to(".about-intro-mist-two", { x: -140, y: 30, opacity: 0.28, duration: 1.4, ease: "none" }, 0)
        .to(phraseNodes, { y: -10, duration: 0.4, ease: "sine.inOut" }, "+=0.15");

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });
      cleanupFns.push(() => window.removeEventListener("load", refresh));
    }, section);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      window.clearTimeout(refreshTimer);
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <section id="about-intro" ref={sectionRef} className="about-intro-section relative overflow-hidden bg-[#f4f1e8] text-[#151512]">
      <div className="about-intro-mist about-intro-mist-one" />
      <div className="about-intro-mist about-intro-mist-two" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-center gap-7 px-6 py-24 md:px-10">
        {phrases.map((phrase) => (
          <p key={phrase.text} className={phrase.className}>
            {phrase.text}
          </p>
        ))}
      </div>
    </section>
  );
}
