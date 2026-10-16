"use client";

import { motion } from "motion/react";

/** Re-mounts on every gallery navigation: a short, quiet fade-up. */
export default function GalleryTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}
