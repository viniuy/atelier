"use client";

import { useEffect, useRef, useState } from "react";
import HalftoneReveal from "@/components/reactbits/HalftoneReveal";

/**
 * The hero wordmark printed as a halftone (React Bits HalftoneReveal): the
 * word is drawn into an image in the page's own font, then shown as ink
 * dots; the cursor wipes the halftone away to reveal the crisp word.
 *
 * It sits inside the hero <h1> (whose real text stays for screen readers and
 * search). MorphField sets --morph-leave on that h1 as the particles take
 * over on scroll, and this layer fades out at the same moment.
 */
export function HeroHalftone({ paper = "#120f17", ink = "#f4f1ea" }: { paper?: string; ink?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string>();
  // Dot size follows the word size: 6px (as specified) on desktop, finer on
  // phones so the small word stays readable.
  const [cell, setCell] = useState(6);
  // Mounted up front (its WebGL set-up would stall a scroll if done on
  // arrival); the vendored component holds the intro until it's first seen.
  // Until then the crisp word shows, and it fades as the dots print in.
  // Afterwards the parent can bring the crisp word back with --crisp (0..1),
  // e.g. while it moves the word over other things: the halftone prints on
  // solid paper, which would show as a box.
  const [printing, setPrinting] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [word, setWord] = useState("");

  useEffect(() => {
    const box = boxRef.current;
    const h1 = box?.parentElement;
    if (!box || !h1) return;
    let cancelled = false;

    const draw = () => {
      // Layout size (ignores transforms: the story scales the wordmark).
      const r = { width: box.offsetWidth, height: box.offsetHeight };
      if (r.width < 10 || r.height < 10) return;
      const scale = 2;
      const c = document.createElement("canvas");
      c.width = Math.round(r.width * scale);
      c.height = Math.round(r.height * scale);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const cs = getComputedStyle(h1);
      setWord(h1.textContent?.trim() ?? "");
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.scale(scale, scale);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      // Sit the word on the same baseline as the real text: the h1 is one
      // line box centred in this box, with the font's ascent and descent
      // centred in that line (CSS half-leading).
      const text = h1.textContent?.trim() ?? "";
      const m = ctx.measureText(text);
      const line = h1.offsetHeight;
      const baseline = (r.height - line) / 2 + (line - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, r.width / 2, baseline);
      if (cancelled) return;
      setCell(Math.min(6, Math.max(3.5, parseFloat(cs.fontSize) / 30)));
      setSrc(c.toDataURL("image/png"));
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(draw, 150);
    });
    document.fonts.ready.then(() => {
      if (cancelled) return;
      draw();
      ro.observe(box);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [paper, ink]);

  return (
    <>
    {/* Drawn as generated content, so the h1's text (read by the halftone
        and the particles) stays the word once. */}
    <span
      aria-hidden="true"
      data-word={word}
      className={`pointer-events-none absolute inset-0 z-10 before:content-[attr(data-word)] ${printed ? "" : "transition-opacity duration-[1200ms] ease-[cubic-bezier(0.37,0,0.63,1)]"}`}
      style={{ color: ink, opacity: printing ? "calc(var(--crisp, 0) * (1 - var(--morph-leave, 0) * 6))" : "calc(1 - var(--morph-leave, 0) * 6)" }}
    />
    <div
      ref={boxRef}
      aria-hidden="true"
      className="absolute -inset-x-[8%] -inset-y-[14%] transition-opacity duration-150"
      style={{ opacity: "calc((1 - var(--morph-leave, 0) * 6) * (1 - var(--crisp, 0)))" }}
    >
      {src && (
        <HalftoneReveal
          src={src}
          mode="mono"
          shape="dot"
          cellSize={cell}
          angle={45}
          inkColor={ink}
          paperColor={paper}
          revealRadius={160}
          dotScale={1}
          contrast={1.1}
          brightness={0}
          invert={false}
          roughness={0}
          misregistration={0}
          fit="contain"
          accentColor="#ff4f2a"
          softness={0.6}
          linger={1.2}
          reverse={false}
          wander={false}
          clickBurst
          intro
          onIntro={() => {
            setPrinting(true);
            setTimeout(() => setPrinted(true), 1300);
          }}
        />
      )}
    </div>
    </>
  );
}
