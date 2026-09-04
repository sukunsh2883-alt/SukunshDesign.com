import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutMist() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const headingWords = gsap.utils.toArray<HTMLElement>(".about-heading-word");
      const descWords = gsap.utils.toArray<HTMLElement>(".about-desc-word");
      const leftElements = gsap.utils.toArray<HTMLElement>(".about-left-el");

      if (reduceMotion) {
        gsap.set([...headingWords, ...descWords, ...leftElements], { opacity: 1, y: 0 });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "bottom 68%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          leftElements,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.1, ease: "power2.out" },
          0
        )
        .fromTo(
          headingWords,
          { opacity: 0, y: 25, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.035,
            ease: "power2.out",
          },
          0.05
        )
        .fromTo(
          descWords,
          { opacity: 0, y: 18, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.015,
            ease: "power2.out",
          },
          0.12
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const descText = "Blending fine art sensibilities with contemporary design, crafting evocative visual stories through motion, typography and creative precision.";

  return (
    <section
      ref={sectionRef}
      id="about-me"
      className="about-mist w-full bg-white py-28 md:py-44 px-6 md:px-[7vw] flex flex-col justify-center min-h-[90svh] select-none"
    >
      <div className="mx-auto w-full max-w-[1180px] grid grid-cols-1 md:grid-cols-[1fr_2.4fr] gap-10 md:gap-16 items-start">
        
        {/* Left Column: Horizontal line and "About me" label */}
        <div className="flex flex-col items-start gap-4 pt-4 md:pt-6">
          <div className="about-left-el w-[90px] h-[1px] bg-neutral-300" />
          <span className="about-left-el text-sm md:text-base font-medium tracking-tight text-neutral-800 font-sans">
            About me
          </span>
        </div>

        {/* Right Column: Title and narrative paragraph */}
        <div className="flex flex-col items-start max-w-[820px]">
          {/* Main Large Title */}
          <h2 className="text-[34px] sm:text-5xl md:text-[62px] lg:text-[72px] font-sans leading-[1.05] tracking-[-0.03em] text-black">
            <span className="block flex flex-wrap gap-x-[0.24em] mb-1">
              {"I'm a".split(" ").map((word, idx) => (
                <span key={`i-am-${idx}`} className="about-heading-word font-normal">
                  {word}
                </span>
              ))}
              {"Delhi-based".split(" ").map((word, idx) => (
                <span key={`delhi-${idx}`} className="about-heading-word font-bold">
                  {word}
                </span>
              ))}
            </span>
            <span className="block flex flex-wrap gap-x-[0.24em]">
              {"Web Designer".split(" ").map((word, idx) => (
                <span key={`web-${idx}`} className="about-heading-word font-medium">
                  {word}
                </span>
              ))}
            </span>
          </h2>

          {/* Description Paragraph */}
          <p className="mt-8 md:mt-12 text-[20px] sm:text-2xl md:text-[28px] lg:text-[34px] leading-[1.3] md:leading-[1.28] tracking-[-0.025em] text-neutral-700 font-sans font-light max-w-[740px] flex flex-wrap gap-x-[0.24em]">
            {descText.split(" ").map((word, idx) => (
              <span key={`desc-${idx}`} className="about-desc-word">
                {word}
              </span>
            ))}
          </p>
        </div>

      </div>
    </section>
  );
}


