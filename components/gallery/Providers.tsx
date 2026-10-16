"use client";

import { MotionConfig } from "motion/react";

/** Motion follows the visitor's OS "reduce motion" setting. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
