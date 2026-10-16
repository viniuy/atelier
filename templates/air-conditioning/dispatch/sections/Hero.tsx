"use client";

import { useEffect, useState } from "react";
import type { ImageSlot } from "@/lib/types";
import { SlotImage } from "@/templates/_kit/SlotImage";
import type { DispatchContent } from "../content";

/**
 * Light studio hero with a cut-out technician on the right. The headline
 * cycles through the main services (paused for reduced-motion users and
 * whenever the visitor picks a slide).
 */
export function Hero({ c, image }: { c: DispatchContent; image: ImageSlot }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % c.slides.length), 5000);
    return () => clearInterval(t);
  }, [auto, c.slides.length]);

  const slide = c.slides[i];

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Services"
      className="relative overflow-hidden bg-linear-to-r from-[#e4e4e4] via-[#f1f1f1] to-[#f7f7f7]"
    >
      <div className="mx-auto grid max-w-6xl items-center px-5 md:min-h-[600px] md:grid-cols-2">
        <div className="relative z-10 py-16 md:py-24">
          <div key={i} className="motion-safe:animate-[atelier-pop_.5s_ease-out]" aria-live={auto ? "off" : "polite"}>
            <h1 className="max-w-md text-[2.5rem] leading-[1.25] font-bold text-(--c-ink) sm:text-[2.75rem]">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-sm text-[1.05rem] text-(--c-ink)/80">{slide.subtitle}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#book"
              className="inline-flex rounded-[5px] bg-(--c-blue) px-7 py-4 text-[1.2rem] font-semibold text-white shadow-[0_2px_4px_rgb(0_0_0/0.15)] transition-colors hover:bg-(--c-ink)"
            >
              {c.hero.primaryCta}
            </a>
          </div>
          <div className="mt-10 flex gap-2" role="group" aria-label="Choose slide">
            {c.slides.map((s, n) => (
              <button
                key={s.title}
                type="button"
                onClick={() => {
                  setI(n);
                  setAuto(false);
                }}
                aria-label={s.title}
                aria-current={n === i}
                className="grid h-6 w-8 place-items-center"
              >
                <span
                  className={`h-1 rounded-full transition-all duration-300 ${n === i ? "w-8 bg-(--c-blue)" : "w-4 bg-black/20"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="relative -mx-5 h-[340px] md:absolute md:inset-y-0 md:right-0 md:mx-0 md:h-auto md:w-[55%]">
          <SlotImage
            image={image}
            sizes="(min-width: 768px) 55vw, 100vw"
            className="size-full object-cover object-[70%_center]"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
