import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
  key?: string;
  profile?: any;
}

const phraseGroups = [
  ["Hello,"],
  ["I'm", "a"],
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
      const tittle = loader.querySelector<HTMLElement>(".loader-tittle");

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
          tittle,
          {
            scale: 520,
            backgroundColor: "#191816",
            duration: 1.05,
            ease: "power4.inOut",
          },
          "+=0.12",
        )
        .to(
          text,
          {
            scale: 1.08,
            opacity: 0,
            filter: "blur(18px)",
            duration: 0.55,
            ease: "expo.out",
          },
          "-=0.72",
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
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f3ead7] px-6 text-[#191816] select-none"
    >
      <div className="pointer-events-none absolute -left-[12vw] top-[18vh] h-[36vw] w-[36vw] rounded-full bg-[#f25a00]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-[10vw] bottom-[14vh] h-[34vw] w-[34vw] rounded-full bg-[#8b7cf2]/14 blur-3xl" />
      <p
        ref={textRef}
        className="relative z-10 flex max-w-[1160px] flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[clamp(2.2rem,6.6vw,6.6rem)] font-medium leading-[1.04] tracking-normal"
        aria-label="Hello, I'm a Delhi Based Multidisciplinary Designer."
      >
        {sentence.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="loader-word inline-flex whitespace-nowrap">
            {word.split("").map((letter, letterIndex) => (
              <span
                key={`${word}-${letterIndex}`}
                className={
                  word === "Multidisciplinary" && letter === "i" && letterIndex === 4
                    ? "loader-letter loader-letter-shell"
                    : "loader-letter"
                }
              >
                {letter}
                {word === "Multidisciplinary" && letter === "i" && letterIndex === 4 && (
                  <span className="loader-tittle" aria-hidden="true" />
                )}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
}
