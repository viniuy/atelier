"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { TemplateCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./TemplateCard";

/** Template grid with a plain text filter row for style tags. */
export function TemplateGrid({ items }: { items: TemplateCardData[] }) {
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of items) for (const tag of t.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [items]);

  const filtered = active ? items.filter((t) => t.tags.includes(active)) : items;

  return (
    <div>
      {tags.length > 1 && (
        <div className="no-scrollbar -mx-4 mb-10 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
          <ul className="flex w-max gap-6 text-[14px]" aria-label="Filter by style">
            {[null, ...tags].map((tag) => {
              const on = active === tag;
              return (
                <li key={tag ?? "all"}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(tag)}
                    className={cn(
                      "-mb-px border-b py-3 whitespace-nowrap transition-colors",
                      on ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
                    )}
                  >
                    {tag ?? "All"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} of {items.length} templates
      </p>

      <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((t, i) => (
            <motion.li
              key={t.slug}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            >
              <TemplateCard template={t} eager={i < 2} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
