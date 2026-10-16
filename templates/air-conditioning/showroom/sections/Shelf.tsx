"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ImageSlot } from "@/lib/types";
import { formatPeso } from "@/lib/utils";
import { SlotImage } from "@/templates/_kit/SlotImage";
import type { ShowroomContent } from "../content";
import { D } from "./Top";

/** "Recommended for you" product shelf: scroll-snap row, progress bar, arrow buttons. */
export function Shelf({ c, images }: { c: ShowroomContent; images: Record<string, ImageSlot> }) {
  const track = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ start: 0, size: 1, atStart: true, atEnd: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setState({
        size: el.clientWidth / el.scrollWidth,
        start: max > 0 ? (el.scrollLeft / el.scrollWidth) : 0,
        atStart: el.scrollLeft <= 2,
        atEnd: el.scrollLeft >= max - 2,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section id="units" className="scroll-mt-24 py-20" aria-labelledby="sr-units">
      <h2 id="sr-units" className={`${D} px-6 text-[2rem] font-bold tracking-[-0.02em] md:px-[max(1.5rem,calc((100vw-1392px)/2))] md:text-[2.5rem]`}>
        Recommended for you
      </h2>
      <ul
        ref={track}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory scroll-px-6 gap-2 overflow-x-auto scroll-smooth px-6 md:scroll-px-[max(1.5rem,calc((100vw-1392px)/2))] md:px-[max(1.5rem,calc((100vw-1392px)/2))]"
      >
        {c.products.map((p) => (
          <li key={p.name} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-3rem)/4.3)]">
            <a href="#book" className="group block">
              <span className="relative block aspect-square bg-(--c-tile)">
                <SlotImage
                  image={images[p.type]}
                  sizes="(min-width: 1024px) 23vw, 70vw"
                  className="absolute inset-[15%] size-[70%] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-5 line-clamp-2 block text-[1.15rem] leading-snug font-medium text-(--c-black)">{p.name}</span>
              <span className="mt-4 flex flex-wrap items-baseline gap-x-2">
                <span className="text-[1.15rem] font-bold text-(--c-black) tabular-nums">{formatPeso(p.price)}</span>
                {p.was && (
                  <span className="text-[0.9rem] font-bold text-(--c-blue) tabular-nums">Save {formatPeso(p.was - p.price)}</span>
                )}
              </span>
              {p.was && (
                <span className="block text-[0.9rem] text-(--c-gray) line-through tabular-nums">{formatPeso(p.was)}</span>
              )}
              <span className="mt-1 block text-[0.9rem] text-(--c-gray)">{p.note}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-10 flex max-w-3xl items-center gap-8 px-6">
        <div className="relative h-0.5 flex-1 bg-(--c-line)" aria-hidden="true">
          <span
            className="absolute inset-y-0 bg-(--c-black) transition-[left] duration-150"
            style={{ left: `${state.start * 100}%`, width: `${state.size * 100}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={state.atStart}
            aria-label="Previous products"
            className="grid size-10 place-items-center rounded-full border border-(--c-line) bg-white shadow-sm disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={state.atEnd}
            aria-label="Next products"
            className="grid size-10 place-items-center rounded-full border border-(--c-line) bg-white shadow-sm disabled:opacity-40"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
