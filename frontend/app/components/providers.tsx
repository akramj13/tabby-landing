"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { EmailGateProvider } from "./email-gate";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <EmailGateProvider>{children}</EmailGateProvider>
    </LazyMotion>
  );
}
