"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import OptionWheel from "@/components/reactbits/OptionWheel";
import type { TemplateCardData } from "@/lib/types";
import { TemplateStack } from "./TemplateStack";

export type WheelCategory = {
  slug: string;
  name: string;
  description: string;
  live: boolean;
  templates: TemplateCardData[];
  /** Prefilled contact link for categories that aren't live yet */
  askHref: string;
};

// Wheel geometry, shared with the dial so the arc follows the names exactly.
const FONT_REM = 2.6;
const SPACING = 1.5;
const TILT_DEG = 9;
const INSET = 44;
/** OptionWheel lays names on a circle of this radius (px, at a 16px root). */
const RADIUS = (FONT_REM * SPACING * 16) / ((TILT_DEG * Math.PI) / 180);
/** Gap between the dial line and the names. */
const DIAL_GAP = 22;

/**
 * Industry picker: a React Bits OptionWheel of categories (scroll, drag,
 * click or arrow keys) beside the selected category's templates.
 */
export function CategoryWheel({ categories }: { categories: WheelCategory[] }) {
  const [index, setIndex] = useState(0);
  const c = categories[index];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
      {/* The mask melts the names and the dial into the page at the top and bottom. */}
      <div className="relative h-[260px] [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)] sm:h-[340px] lg:h-[520px]">
        {/* Dial: an arc concentric with the path the names travel on, plus a
            marker at the selected position, so the wheel reads as an object. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 rounded-full border border-line-strong"
          style={{
            width: 2 * (RADIUS - DIAL_GAP),
            height: 2 * (RADIUS - DIAL_GAP),
            left: INSET - RADIUS - (RADIUS - DIAL_GAP),
            transform: "translateY(-50%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
          style={{ left: INSET - DIAL_GAP }}
        />
        <OptionWheel
          items={categories.map((x) => x.name)}
          defaultSelected={0}
          label="Industries"
          textColor="#b9b6ae"
          activeColor="#1a1a19"
          side="left"
          fontSize={FONT_REM}
          spacing={SPACING}
          curve={1}
          tilt={TILT_DEG}
          blur={1.5}
          fade={0.24}
          smoothing={110}
          inset={INSET}
          loop={false}
          draggable
          touchAction="pan-y"
          onChange={(i) => setIndex(i)}
          className="tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        />
      </div>

      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            {c.live ? (
              <TemplateStack items={c.templates} label={c.name} />
            ) : (
              <div className="rounded-xl border border-dashed border-line-strong px-6 py-16 sm:px-10">
                <p className="text-[17px] font-medium">{c.name} templates are still being designed.</p>
                <p className="mt-1 text-[15px] text-muted">{c.description}</p>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                  Need a {c.name.toLowerCase()} site sooner? We can design one from scratch or adapt a live template.
                </p>
                <a
                  href={c.askHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink-2"
                >
                  Ask about {c.name} <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
