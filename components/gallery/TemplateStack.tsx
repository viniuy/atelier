"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CardSwap, { Card, stackBounds } from "@/components/reactbits/CardSwap";
import type { TemplateCardData } from "@/lib/types";

const W = 560;
const IMG_H = Math.round((W * 10) / 16);
const H = IMG_H + 38;

const DECK = {
  cardDistance: 54,
  verticalDistance: 40,
  depth: 80,
  skewAmount: 0,
  hoverSpread: 0.05,
} as const;
const MAX_VISIBLE = 4;

/** The footprint of a full four-card deck. Every category gets this frame. */
const FRAME = stackBounds({ width: W, height: H, ...DECK, visible: MAX_VISIBLE });

/**
 * A deck-sized box with an action row under it. Categories with fewer cards
 * (or none yet) keep the same height, so the section never jumps.
 */
export function StackFrame({ children, action }: { children: ReactNode; action: ReactNode }) {
  return (
    <div>
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: FRAME.width, aspectRatio: `${FRAME.width} / ${FRAME.height}` }}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
      <div className="mt-8 flex justify-center">{action}</div>
    </div>
  );
}

/**
 * A category's templates as a React Bits CardSwap deck. Drag the front card
 * away (or use the arrow keys) to flip through; clicks do nothing, so the
 * "Open template" button is the one way in.
 */
export function TemplateStack({ items, label }: { items: TemplateCardData[]; label: string }) {
  const [front, setFront] = useState(0);
  const t = items[front] ?? items[0];

  return (
    <StackFrame
      action={
        <Link
          href={`/t/${t.slug}`}
          prefetch
          aria-label={`Open template: ${t.name}`}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink-2"
        >
          Open template <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      }
    >
      <CardSwap
        width={W}
        height={H}
        theme="light"
        label={`${label} templates`}
        {...DECK}
        visibleCards={Math.min(MAX_VISIBLE, items.length)}
        cardRadius={14}
        delay={4000}
        speed={0.75}
        bounce={0.35}
        parallax={0.1}
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
    </StackFrame>
  );
}
