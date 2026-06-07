"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { AnimatedBeam } from "@/app/components/ui/animated-beam";
import { IconTile } from "@/app/components/ui/icon-tile";
import { SectionHeading } from "@/app/components/ui/section-heading";

// Scattered (x%, y%) positions inside the left "model cloud" area. Hand-tuned
// to look intentionally jumbled — no two on the same row, no two on the same
// column — while keeping each icon clear of its neighbours.
const MODELS = [
  {
    label: "Apple Intelligence",
    src: "/app-icons/Apple_Intelligence.webp",
    x: "10%",
    y: "6%",
  },
  { label: "Qwen", src: "/model-icons/qwen.webp", x: "58%", y: "0%" },
  { label: "DeepSeek", src: "/model-icons/deepseek.webp", x: "30%", y: "38%" },
  { label: "Gemma", src: "/model-icons/gemma.webp", x: "70%", y: "34%" },
  { label: "Kimi", src: "/model-icons/kimi.png", x: "8%", y: "70%" },
];

const GGUF_POS = { x: "52%", y: "68%" };

export function ModelsBeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const m0 = useRef<HTMLDivElement>(null);
  const m1 = useRef<HTMLDivElement>(null);
  const m2 = useRef<HTMLDivElement>(null);
  const m3 = useRef<HTMLDivElement>(null);
  const m4 = useRef<HTMLDivElement>(null);
  const ggufRef = useRef<HTMLDivElement>(null);
  const modelRefs = [m0, m1, m2, m3, m4];
  const allEndpointRefs = [...modelRefs, ggufRef];

  return (
    <div className="mx-auto max-w-content">
      <SectionHeading
        title="any model, one Cotabby"
        subtitle="Plug in Apple Intelligence or a local model like Qwen, DeepSeek, or Gemma — Cotabby routes them all through the same tab-complete."
      />

      <div className="mt-12">
        <div
          ref={containerRef}
          className="relative mx-auto h-[240px] w-full max-w-2xl sm:h-[280px]"
        >
          {/* Scattered model cloud — occupies the left ~52% of the area */}
          <div className="absolute inset-y-0 left-0 w-[52%]">
            {modelRefs.map((ref, i) => (
              <IconTile
                key={MODELS[i].label}
                ref={ref}
                size="2xl"
                tone="bg-white"
                className="absolute z-10 p-2.5"
                style={{ left: MODELS[i].x, top: MODELS[i].y }}
              >
                <Image
                  src={MODELS[i].src}
                  alt={MODELS[i].label}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </IconTile>
            ))}

            {/* "Bring your own" GGUF tile — dashed border, no shadow (intentional
                visual differentiation from the "real" model tiles). */}
            <div
              ref={ggufRef}
              className="absolute z-10 flex size-16 items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface-2 text-subtle sm:size-18"
              style={{ left: GGUF_POS.x, top: GGUF_POS.y }}
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </div>
          </div>

          {/* Cotabby destination — right-anchored, vertically centered. */}
          <IconTile
            ref={centerRef}
            size="3xl"
            tone="bg-white"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 sm:right-6"
          >
            <Image
              src="/app-icons/cotabby-icon.webp"
              alt="Cotabby"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </IconTile>

          {allEndpointRefs.map((ref, i) => {
            const mid = (allEndpointRefs.length - 1) / 2;
            const label = i < MODELS.length ? MODELS[i].label : "gguf";
            return (
              <AnimatedBeam
                key={label}
                containerRef={containerRef}
                fromRef={ref}
                toRef={centerRef}
                curvature={(i - mid) * 18}
                delay={i * 0.35}
                pathWidth={6}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
