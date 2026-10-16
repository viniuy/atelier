"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageSlot } from "@/lib/types";
import { SlotImage } from "@/templates/_kit/SlotImage";
import type { AuthorityContent } from "../content";
import { L } from "../ui";

/**
 * The template's one scroll moment: on large screens the big headline stays
 * pinned while the reasons scroll past, and swaps to whichever reason is in
 * the middle of the viewport. On small screens each reason simply stacks.
 */
export function Why({ c, images }: { c: AuthorityContent; images: Record<string, ImageSlot> }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of items.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  const name = c.business.shortName;

  return (
    <section id="why" className="scroll-mt-24 bg-linear-to-b from-(--c-sky) via-white to-white py-24" aria-labelledby="au-why">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-40 lg:h-[60vh] lg:self-start">
          <p className={`${L} text-[1.2rem] font-medium tracking-[0.04em] text-(--c-ink) uppercase`}>Why choose {name}?</p>
          <h2 id="au-why" className="sr-only">
            Why choose {name}
          </h2>
          <p
            key={active}
            className="mt-3 hidden text-[clamp(3rem,6vw,5.25rem)] leading-[1.02] font-light tracking-[-0.03em] text-(--c-navy) motion-safe:animate-[atelier-pop_.5s_ease-out] lg:block"
            aria-hidden="true"
          >
            {c.reasons[active].title}.
          </p>
          <ol className="mt-10 hidden gap-2 lg:flex" aria-hidden="true">
            {c.reasons.map((r, i) => (
              <li key={r.title} className={`h-1 w-10 rounded-full transition-colors ${i === active ? "bg-(--c-navy)" : "bg-(--c-navy)/15"}`} />
            ))}
          </ol>
        </div>
        <ol className="space-y-16 lg:space-y-[28vh] lg:py-[10vh]">
          {c.reasons.map((r, i) => (
            <li
              key={r.title}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-index={i}
              className={`max-w-sm ${i % 2 ? "lg:ml-auto" : ""}`}
            >
              <h3 className="mb-6 text-[2.4rem] leading-tight font-light text-(--c-navy) lg:sr-only">{r.title}.</h3>
              <div className="relative aspect-[40/27] overflow-hidden">
                <SlotImage image={images[r.image]} sizes="(min-width: 1024px) 24rem, 100vw" className="absolute inset-0 size-full object-cover" />
              </div>
              <p className="mt-6 text-[1.9rem] leading-tight text-(--c-navy)">{r.caption}</p>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-(--c-ink)">{r.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
