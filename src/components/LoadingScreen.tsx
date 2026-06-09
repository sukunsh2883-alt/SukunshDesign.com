import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
}

const phraseGroups = [
  ["Hello"],
  ["I'm"],
  ["Delhi", "Based"],
  ["Multidisciplinary", "Designer."],
];

const sentence = phraseGroups.flat();

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const text = textRef.current;
    if (!loader || !text) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".loader-word");
      const letters = gsap.utils.toArray<HTMLElement>(".loader-letter");

      gsap.set(words, {
        y: 28,
        opacity: 0,
        filter: "blur(14px)",
      });
      gsap.set(letters, {
        display: "inline-block",
        transformOrigin: "50% 58%",
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete,
      });

      timeline
        .to(words, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.78,
          stagger: 0.18,
        })
        .to(
          letters,
          {
            scale: 1.18,
            y: -2,
            duration: 0.28,
            stagger: {
              each: 0.018,
              from: "start",
            },
            ease: "sine.out",
          },
          "+=0.18",
        )
        .to(letters, {
          scale: 1,
          y: 0,
          duration: 0.34,
          stagger: {
            each: 0.014,
            from: "start",
          },
          ease: "sine.inOut",
        })
        .to(
          text,
          {
            scale: 1.055,
            opacity: 0,
            filter: "blur(18px)",
            duration: 0.78,
            ease: "power3.inOut",
          },
          "+=0.2",
        )
        .to(
          loader,
          {
            opacity: 0,
            duration: 0.55,
            ease: "power2.inOut",
          },
          "-=0.3",
        );
    }, loader);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f4f1e8] px-6 text-[#151512] select-none"
    >
      <div className="pointer-events-none absolute -left-[12vw] top-[18vh] h-[36vw] w-[36vw] rounded-full bg-[#f25a00]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-[10vw] bottom-[14vh] h-[34vw] w-[34vw] rounded-full bg-[#8b7cf2]/14 blur-3xl" />
      <p
        ref={textRef}
        className="relative z-10 flex max-w-[1120px] flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[clamp(2.1rem,6.8vw,6.7rem)] font-medium leading-[1.02] tracking-[-0.01em]"
        aria-label="Hello I'm Delhi Based Multidisciplinary Designer."
      >
        {sentence.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="loader-word inline-flex whitespace-nowrap">
            {word.split("").map((letter, letterIndex) => (
              <span key={`${word}-${letterIndex}`} className="loader-letter">
                {letter}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
}
