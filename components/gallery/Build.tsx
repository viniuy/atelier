"use client";

import { Children, isValidElement, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * "Building itself" section transitions. One vocabulary, in a fixed order
 * per section: a hairline draws in, the heading rises word by word out of a
 * mask, media wipes open, then copy and buttons fade up. Each plays once as
 * the section scrolls into view.
 *
 * Reduced motion is handled in CSS (globals.css, [data-build]) rather than
 * by branching here, so server and client render identical markup.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

/** A full-width hairline that draws from the left, with a "+" mark where it starts. */
export function BuildRule({ className, dark = false }: { className?: string; dark?: boolean }) {
  const tone = dark ? "bg-white/15" : "bg-line";
  return (
    <div aria-hidden="true" className={cn("pointer-events-none relative h-px w-full", className)}>
      <motion.span data-build
        className={cn("absolute inset-0 origin-left", tone)}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <motion.span data-build
        className={cn("absolute top-1/2 left-4 -translate-y-1/2 text-[13px] leading-none sm:left-6", dark ? "text-white/40" : "text-muted")}
        initial={{ opacity: 0, rotate: -90 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className={cn("block px-1.5", dark ? "bg-ink" : "bg-paper")}>+</span>
      </motion.span>
    </div>
  );
}

const rise: Variants = {
  hidden: { y: "110%" },
  shown: (i: number) => ({ y: "0%", transition: { duration: 0.9, ease: EASE, delay: 0.15 + i * 0.06 } }),
};

/**
 * Heading text that rises word by word from behind a mask. Strings are split
 * into words; elements (e.g. a highlighted span) rise as one piece, so their
 * own attributes and refs survive.
 */
export function RiseText({ children, className }: { children: ReactNode; className?: string }) {
  const pieces: ReactNode[] = [];
  Children.toArray(children).forEach((child) => {
    if (typeof child === "string") {
      child.split(/(\s+)/).forEach((w) => {
        if (w) pieces.push(w);
      });
    } else if (isValidElement(child)) pieces.push(child);
  });

  let n = 0;
  return (
    <motion.span data-build className={className} initial="hidden" whileInView="shown" viewport={VIEW}>
      {pieces.map((p, k) =>
        typeof p === "string" && /^\s+$/.test(p) ? (
          " "
        ) : (
          // Padding + negative margin give descenders room inside the mask.
          <span key={k} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span data-build className="inline-block" variants={rise} custom={n++}>
              {p}
            </motion.span>
          </span>
        ),
      )}
    </motion.span>
  );
}

/** Media that wipes open from the bottom and settles from a slight zoom. */
export function Wipe({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div data-build
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.03 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
      viewport={VIEW}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Copy and buttons: a short fade-up after the heading. */
export function FadeUp({ children, className, delay = 0.35 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div data-build
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A list whose items build in one after another. */
export function Stagger({
  items,
  className,
  itemClassName,
  step = 0.08,
  delay = 0.2,
}: {
  items: { key: string; node: ReactNode }[];
  className?: string;
  itemClassName?: string;
  step?: number;
  delay?: number;
}) {
  return (
    <ul className={className}>
      {items.map((it, i) => (
        <motion.li data-build
          key={it.key}
          className={itemClassName}
          initial={{ opacity: 0, y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
          whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={VIEW}
          transition={{ duration: 0.9, ease: EASE, delay: delay + i * step }}
        >
          {it.node}
        </motion.li>
      ))}
    </ul>
  );
}

/**
 * A band that builds out to full width as it scrolls in: it starts as an
 * inset, rounded panel and expands edge to edge, scrubbed by scroll.
 */
export function BandReveal({ children, className, id, labelledBy }: { children: ReactNode; className?: string; id?: string; labelledBy?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  // Side inset shrinks to 0; capped so it never reaches into the content on
  // narrow screens: min(7%, the gutter outside the 72rem content column).
  const clipPath = useTransform(scrollYProgress, (p) => {
    const k = (1 - p).toFixed(4);
    const side = `calc(${k} * min(7%, max(12px, (100% - 72rem) / 2)))`;
    return `inset(0px ${side} 0px ${side} round ${(1 - p) * 32}px)`;
  });

  return (
    <motion.section data-build ref={ref} id={id} aria-labelledby={labelledBy} className={className} style={{ clipPath }}>
      {children}
    </motion.section>
  );
}
