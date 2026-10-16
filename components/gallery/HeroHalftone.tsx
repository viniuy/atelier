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
  // Mount the halftone the first time it comes into view, so its intro
  // plays where you can see it (the hero sits below the launch story).
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(box);
    return () => io.disconnect();
  }, []);

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
    <div
      ref={boxRef}
      aria-hidden="true"
      className="absolute -inset-x-[8%] -inset-y-[14%] transition-opacity duration-150"
      style={{ opacity: "calc(1 - var(--morph-leave, 0) * 6)" }}
    >
      {src && seen && (
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
        />
      )}
    </div>
  );
}
