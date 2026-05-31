"use client";

import { m, useReducedMotion } from "framer-motion";

export function GiantWordmarkSection() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-hidden="true"
      className="-mx-3 -mb-14 select-none overflow-hidden sm:-mx-4 sm:-mb-16 lg:-mx-6 lg:-mb-20"
    >
      <m.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
        style={{
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
        }}
      >
        {/*
          SVG text with textLength="100" stretches "cotabby" to fill the full
          viewBox width exactly, so it always spans edge-to-edge regardless of
          glyph metrics — no clipping like a vw-sized line would cause.
        */}
        <svg
          viewBox="0 0 100 30"
          preserveAspectRatio="xMidYMax meet"
          className="block w-full text-ink/35"
        >
          <text
            x="50"
            y="25"
            textAnchor="middle"
            textLength="99"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-0.045em",
            }}
          >
            cotabby
          </text>
        </svg>
      </m.div>
    </section>
  );
}
