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
export function HeroHalftone({ paper = "#f4f3ef", ink = "#1a1a19" }: { paper?: string; ink?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string>();
  // Dot size follows the word size: fine dots on phones, bolder on desktop.
  const [cell, setCell] = useState(7);

  useEffect(() => {
    const box = boxRef.current;
    const h1 = box?.parentElement;
    if (!box || !h1) return;
    let cancelled = false;

    const draw = () => {
      const r = box.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) return;
      const scale = 2;
      const c = document.createElement("canvas");
      c.width = Math.round(r.width * scale);
      c.height = Math.round(r.height * scale);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const cs = getComputedStyle(h1);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.scale(scale, scale);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(h1.textContent?.trim() ?? "", r.width / 2, r.height / 2 + parseFloat(cs.fontSize) * 0.04);
      if (cancelled) return;
      setCell(Math.min(7, Math.max(3.5, parseFloat(cs.fontSize) / 30)));
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
    <div
      ref={boxRef}
      aria-hidden="true"
      className="absolute -inset-x-[8%] -inset-y-[14%] transition-opacity duration-150"
      style={{ opacity: "calc(1 - var(--morph-leave, 0) * 6)" }}
    >
      {src && (
        <HalftoneReveal
          src={src}
          fit="contain"
          mode="mono"
          shape="dot"
          cellSize={cell}
          angle={45}
          dotScale={1.05}
          inkColor={ink}
          paperColor={paper}
          contrast={1.4}
          brightness={0.1}
          revealRadius={150}
          softness={0.6}
          linger={1.2}
          clickBurst={false}
          intro
        />
      )}
    </div>
  );
}
