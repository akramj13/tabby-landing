"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GiantWordmarkSection() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-hidden="true"
      className="-mx-3 -mb-14 select-none overflow-hidden sm:-mx-4 sm:-mb-16 lg:-mx-6 lg:-mb-20"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full justify-center"
        style={{
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
        }}
      >
        <span className="tabby-display block translate-y-[12%] whitespace-nowrap text-[23vw] font-bold leading-[0.78] tracking-tighter text-ink/15">
          cotabby
        </span>
      </motion.div>
    </section>
  );
}
