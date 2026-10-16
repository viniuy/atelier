"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import CardSwap, { Card } from "@/components/reactbits/CardSwap";
import type { TemplateCardData } from "@/lib/types";

const W = 560;
const IMG_H = Math.round((W * 10) / 16);
const H = IMG_H + 38;

/**
 * A category's templates as a React Bits CardSwap deck. Drag the front card
 * away (or use the arrow keys) to flip through; clicks do nothing, so the
 * "Open template" button is the one way in.
 */
export function TemplateStack({ items, label }: { items: TemplateCardData[]; label: string }) {
  const [front, setFront] = useState(0);
  const t = items[front] ?? items[0];

  return (
    <div>
      <CardSwap
        width={W}
        height={H}
        theme="light"
        label={`${label} templates`}
        cardDistance={54}
        verticalDistance={40}
        depth={80}
        skewAmount={0}
        visibleCards={Math.min(4, items.length)}
        cardRadius={14}
        delay={4000}
        speed={0.75}
        bounce={0.35}
        parallax={0.1}
        hoverSpread={0.05}
        dim={0.95}
        autoplay={false}
        pauseOnHover
        draggable
        onChange={setFront}
        clickable={false}
        className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ink"
      >
        {items.map((item, i) => (
          <Card key={item.slug}>
            <div className="flex h-full flex-col p-1.5">
              <div className="flex h-[30px] items-center gap-2 px-1.5">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-2 rounded-full bg-black/15" />
                  <span className="size-2 rounded-full bg-black/15" />
                  <span className="size-2 rounded-full bg-black/15" />
                </span>
                <span className="ml-1 truncate text-[13px] font-medium tracking-[-0.01em]">{item.name}</span>
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[9px] bg-paper-2">
                <Image
                  src={item.thumbnail}
                  alt={`${item.name} template homepage`}
                  fill
                  sizes={`${W}px`}
                  draggable={false}
                  className="pointer-events-none object-cover object-top select-none"
                  loading={i < 2 ? "eager" : "lazy"}
                />
              </div>
            </div>
          </Card>
        ))}
      </CardSwap>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between" aria-live="polite">
        <div className="min-w-0">
          <p className="text-[17px] font-medium">
            {t.name} <span className="font-normal text-muted">{front + 1} / {items.length}</span>
          </p>
          <p className="mt-1 max-w-md text-[14px] leading-relaxed text-muted">{t.tagline}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-5">
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
      <p className="mt-5 text-[13px] text-muted">
        Drag the front card away to see the next one, or use the arrow keys.
      </p>
    </div>
  );
}
