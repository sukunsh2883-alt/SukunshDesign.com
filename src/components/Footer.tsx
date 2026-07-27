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
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute left-[-1%] bottom-[4%] h-[36%] w-[40%] opacity-95"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        >
          <motion.span
            className="absolute left-[2%] bottom-[12%] h-[92px] w-[18px] rounded-full bg-[#d8be66]"
            animate={{ rotate: [-2, 6, -2], y: [0, -4, 0] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.span
            className="absolute left-[8%] bottom-[3%] h-[110px] w-[16px] rounded-full bg-[#c9b15b]"
            animate={{ rotate: [5, -3, 5], y: [0, -7, 0] }}
            transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.span
            className="absolute left-[16%] bottom-[8%] h-[76px] w-[15px] rounded-full bg-[#b89f4d]"
            animate={{ rotate: [-5, 4, -5], y: [0, -5, 0] }}
            transition={{ duration: 8.5, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.div
            className="absolute left-[6%] bottom-[18%] h-18 w-18"
            animate={{ rotate: [0, 8, 0], y: [0, -6, 0] }}
            transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
          >
            <span className="absolute left-[27%] top-0 h-[28px] w-[16px] rounded-full bg-[#f1eddc] rotate-[20deg]" />
            <span className="absolute right-[27%] top-0 h-[28px] w-[16px] rounded-full bg-[#f1eddc] -rotate-[20deg]" />
            <span className="absolute left-0 top-[32%] h-[28px] w-[16px] rounded-full bg-[#f1eddc] rotate-[108deg]" />
            <span className="absolute right-0 top-[32%] h-[28px] w-[16px] rounded-full bg-[#f1eddc] -rotate-[108deg]" />
            <span className="absolute left-[34%] top-[34%] h-[14px] w-[14px] rounded-full bg-[#ea6f2a]" />
          </motion.div>
          <motion.div
            className="absolute left-[20%] bottom-[24%] h-16 w-16"
            animate={{ rotate: [0, -6, 0], y: [0, -5, 0] }}
            transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
          >
            <span className="absolute left-[27%] top-0 h-[26px] w-[14px] rounded-full bg-[#f4f0e2] rotate-[18deg]" />
            <span className="absolute right-[27%] top-0 h-[26px] w-[14px] rounded-full bg-[#f4f0e2] -rotate-[18deg]" />
            <span className="absolute left-0 top-[35%] h-[26px] w-[14px] rounded-full bg-[#f4f0e2] rotate-[108deg]" />
            <span className="absolute right-0 top-[35%] h-[26px] w-[14px] rounded-full bg-[#f4f0e2] -rotate-[108deg]" />
            <span className="absolute left-[36%] top-[36%] h-[13px] w-[13px] rounded-full bg-[#ea6f2a]" />
          </motion.div>
        </motion.div>
      </div>
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
