"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import OptionWheel from "@/components/reactbits/OptionWheel";
import type { TemplateCardData } from "@/lib/types";

/**
 * Template showcase for one category: a React Bits OptionWheel of template
 * names (scroll, drag, click or arrow keys) beside a large preview of the
 * selected template.
 */
export function TemplateWheel({ items, label }: { items: TemplateCardData[]; label: string }) {
  const [index, setIndex] = useState(0);
  const t = items[index];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      {/* The mask melts the names into the page at the top and bottom. */}
      <div className="relative h-[260px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] sm:h-[340px] lg:h-[460px]">
        <OptionWheel
          items={items.map((i) => i.name)}
          defaultSelected={0}
          label={`${label} templates`}
          textColor="#b9b6ae"
          activeColor="#1a1a19"
          side="left"
          fontSize={3.25}
          spacing={1.45}
          curve={1}
          tilt={9}
          blur={1.5}
          fade={0.28}
          smoothing={110}
          inset={4}
          loop={false}
          draggable
          onChange={(i) => setIndex(i)}
          className="tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        />
      </div>

      <div>
        <Link href={`/t/${t.slug}`} prefetch className="group block rounded-xl outline-offset-4">
          <div className="overflow-hidden rounded-xl border border-line bg-card shadow-[0_24px_60px_-34px_rgb(0_0_0/0.35)]">
            <div className="flex h-8 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={t.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Image
                    src={t.thumbnail}
                    alt={`${t.name} template homepage`}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover object-top transition-transform duration-700 ease-(--ease-out-quart) group-hover:scale-[1.015]"
                    loading="eager"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Link>

        <div className="mt-6 flex flex-col gap-5" aria-live="polite">
          <div className="min-w-0">
            <p className="text-[17px] font-medium">{t.name}</p>
            <p className="mt-1 max-w-md text-[14px] leading-relaxed text-muted">{t.tagline}</p>
            <p className="mt-2 text-[13px] text-muted">{t.tags.join(" · ")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={`/preview/${t.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[14px] underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              Full screen <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
            <Link
              href={`/t/${t.slug}`}
              prefetch
              className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ink-2"
            >
              Open template <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <p className="mt-6 text-[13px] text-muted">
          {index + 1} of {items.length}. Scroll, drag or use the arrow keys on the list to switch.
        </p>
      </div>
    </div>
  );
}
