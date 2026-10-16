"use client";

import { useState } from "react";
import Link from "next/link";
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

/**
 * Industry picker: a React Bits OptionWheel of categories (scroll, drag,
 * click or arrow keys) beside the selected category's templates.
 */
export function CategoryWheel({ categories }: { categories: WheelCategory[] }) {
  const [index, setIndex] = useState(0);
  const c = categories[index];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
      {/* The mask melts the names into the page at the top and bottom. */}
      <div className="relative h-[210px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] sm:h-[320px] lg:sticky lg:top-24 lg:h-[520px]">
        <OptionWheel
          items={categories.map((x) => x.name)}
          defaultSelected={0}
          label="Industries"
          textColor="#b9b6ae"
          activeColor="#1a1a19"
          side="left"
          fontSize={2.6}
          spacing={1.5}
          curve={1}
          tilt={9}
          blur={1.5}
          fade={0.24}
          smoothing={110}
          inset={4}
          loop={false}
          draggable
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
            <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="max-w-xl">
                <h3 className="text-[22px] font-semibold tracking-[-0.02em]">
                  {c.name}{" "}
                  <span className="font-normal text-muted">{c.live ? c.templates.length : "Coming soon"}</span>
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.description}</p>
              </div>
              {c.live && (
                <Link
                  href={`/c/${c.slug}`}
                  prefetch
                  className="text-[14px] text-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  Filter by style
                </Link>
              )}
            </div>

            {c.live ? (
              <TemplateStack items={c.templates} label={c.name} />
            ) : (
              <div className="rounded-xl border border-dashed border-line-strong px-6 py-16 sm:px-10">
                <p className="text-[17px] font-medium">{c.name} templates are still being designed.</p>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
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
