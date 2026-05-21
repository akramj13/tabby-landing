"use client";

import type { ReactNode } from "react";
import { EmailGateProvider } from "./email-gate";

export function Providers({ children }: { children: ReactNode }) {
  return <EmailGateProvider>{children}</EmailGateProvider>;
}
