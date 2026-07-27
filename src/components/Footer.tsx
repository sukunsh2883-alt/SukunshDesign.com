import { motion } from "motion/react";

interface FooterProps {
  profile: any;
  onNavigate?: (id: string) => void;
}

export default function Footer({ profile, onNavigate }: FooterProps) {
  return (
    <footer id="contact" className="relative min-h-[620px] overflow-hidden bg-[#111111] text-[#f3f4f4] md:min-h-[680px] select-none">
      <motion.img
        src="/last.svg"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <button
        type="button"
        onClick={() => onNavigate?.("#scroll-demo")}
        className="absolute left-[48.5%] top-[52%] z-30 h-10 w-[20%] cursor-pointer rounded-sm bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Work"
      />
      <button
        type="button"
        onClick={() => onNavigate?.("#about-me-modal")}
        className="absolute left-[48.5%] top-[61%] z-30 h-10 w-[20%] cursor-pointer rounded-sm bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="About"
      />
      <a
        href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
        className="absolute left-[48.5%] top-[70%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Contact"
      />
      <a
        href={profile?.instagram || "https://instagram.com/sukunsh"}
        target="_blank"
        rel="noreferrer"
        className="absolute left-[70.5%] top-[52%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Instagram"
      />
      <a
        href={profile?.linkedin || "https://www.linkedin.com/in/sukunsh"}
        target="_blank"
        rel="noreferrer"
        className="absolute left-[70.5%] top-[61%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="LinkedIn"
      />
      <a
        href={profile?.behance || "https://www.behance.net/sukunshsharma"}
        target="_blank"
        rel="noreferrer"
        className="absolute left-[70.5%] top-[70%] z-30 h-10 w-[20%] rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Behance"
      />
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-[8%] right-[9%] z-30 h-9 w-32 cursor-pointer rounded-sm bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Scroll back to top"
      />
    </footer>
  );
}
