import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AIFilm, DesignProject, VideoCard } from "../portfolioData";

interface HorizontalGalleryProps {
  projects: DesignProject[];
  videos: VideoCard[];
  films: AIFilm[];
}

export default function HorizontalGallery({ projects, videos, films }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const rows = useMemo(() => {
    const projectItems = projects.slice(0, 6).map((project) => ({
      id: project.id,
      title: project.title,
      image: project.image,
      meta: project.type,
      kind: "image" as const,
    }));
    const aiItems = [
      ...videos.slice(0, 4).map((video) => ({
        id: video.id,
        title: video.title,
        image: video.thumbnail,
        videoUrl: video.videoUrl,
        meta: video.type,
        kind: "video" as const,
      })),
      ...films.slice(0, 4).map((film) => ({
        id: film.id,
        title: film.title,
        image: film.thumbnail,
        videoUrl: film.videoUrl,
        meta: film.category,
        kind: "video" as const,
      })),
    ];

    return [projectItems, aiItems];
  }, [projects, videos, films]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      media.add("(min-width: 769px)", () => {
        const rowOne = section.querySelector<HTMLElement>(".gallery-row-one");
        const rowTwo = section.querySelector<HTMLElement>(".gallery-row-two");
        if (!rowOne || !rowTwo) return undefined;

        const distanceOne = () => Math.max(0, rowOne.scrollWidth - window.innerWidth + 160);
        const distanceTwo = () => Math.max(0, rowTwo.scrollWidth - window.innerWidth + 160);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(distanceOne(), distanceTwo()) + window.innerHeight * 0.7}`,
            scrub: 0.9,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(".horizontal-gallery-heading", { y: 44, opacity: 0, filter: "blur(14px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.35, ease: "power3.out" }, 0)
          .to(rowOne, { x: () => -distanceOne(), ease: "none", duration: 1 }, 0)
          .fromTo(rowTwo, { x: () => -distanceTwo() }, { x: 0, ease: "none", duration: 1 }, 0);

        return () => timeline.kill();
      });
    }, section);

    const refreshMedia = Array.from(section.querySelectorAll("img, video")) as Array<HTMLImageElement | HTMLVideoElement>;
    const refresh = () => ScrollTrigger.refresh();
    refreshMedia.forEach((mediaElement) => mediaElement.addEventListener("load", refresh, { once: true }));
    const refreshTimer = window.setTimeout(refresh, 350);

    return () => {
      window.clearTimeout(refreshTimer);
      refreshMedia.forEach((mediaElement) => mediaElement.removeEventListener("load", refresh));
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-gallery overflow-hidden bg-[#191816] px-6 py-24 text-[#f3ead7] md:px-8 md:py-28">
      <div className="horizontal-gallery-heading mx-auto mb-10 flex max-w-[1520px] items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-sm font-medium tracking-normal text-[#b8ad9b]">Archive motion</p>
          <h2 className="font-serif text-5xl font-normal leading-[0.95] tracking-normal md:text-8xl">
            Moving worlds.
          </h2>
        </div>
        <p className="hidden max-w-xs text-sm leading-[1.45] text-[#b8ad9b] md:block">
          Projects, AI films, visual systems, and moving-image studies drifting through one cinematic reel.
        </p>
      </div>

      <div className="space-y-5 md:space-y-6">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`horizontal-gallery-row ${rowIndex === 0 ? "gallery-row-one" : "gallery-row-two"} flex w-max gap-5 md:gap-6`}
          >
            {row.map((item) => (
              <article key={`${rowIndex}-${item.id}`} className="horizontal-gallery-card group">
                <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-[#f3ead7]/16 bg-[#25231f]">
                  {"videoUrl" in item && item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.image}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#191816]/86 to-transparent p-5">
                    <h3 className="text-lg font-medium tracking-normal text-[#f3ead7]">{item.title}</h3>
                    <p className="mt-1 text-xs font-medium tracking-normal text-[#b8ad9b]">{item.meta}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
