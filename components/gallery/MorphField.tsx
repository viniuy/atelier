"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Scroll-driven particle morph for the home page.
 *
 * Any element marked `data-morph="<shape>"` is an anchor. Particles assemble
 * into that anchor's shape, sized to its box and glued to it as it scrolls.
 * When the next anchor enters the viewport, the particles break apart (left
 * to right, with a scatter cloud) and reform as the next shape; the morph is
 * scrubbed by scroll position, so scrolling back reverses it.
 *
 *   data-morph="word"      the element's own text (it is hidden once drawn)
 *   data-morph="browser" | "globe" | "grid" | "steps"
 *   data-morph-color="#1a1a19"   particle color at this anchor
 *   data-morph-size="2.4"        particle size (CSS px) at this anchor
 *
 * Anchors with no size (e.g. `hidden md:block` on phones) are skipped.
 * Reduced motion: shapes swap without the flight or the scatter.
 */

type Shape = "word" | "browser" | "globe" | "grid" | "steps";
type Pt = { x: number; y: number };
type Anchor = { el: HTMLElement; shape: Shape; color: number[]; size: number; points: Pt[]; w: number; h: number };

/** Deterministic PRNG so the shuffle is stable across resizes. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Paint a shape into a w×h mask (white on transparent). */
function paint(ctx: CanvasRenderingContext2D, shape: Shape, w: number, h: number, el: HTMLElement) {
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const s = Math.min(w, h);

  if (shape === "word") {
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(el.textContent?.trim() ?? "", w / 2, h / 2 + parseFloat(cs.fontSize) * 0.04);
    return;
  }

  const lw = Math.max(3, s * 0.035);
  ctx.lineWidth = lw;
  const pad = lw;

  if (shape === "browser") {
    const r = s * 0.06;
    ctx.beginPath();
    ctx.roundRect(pad, pad, w - pad * 2, h - pad * 2, r);
    ctx.stroke();
    const bar = h * 0.18;
    ctx.beginPath();
    ctx.moveTo(pad, pad + bar);
    ctx.lineTo(w - pad, pad + bar);
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(pad + bar * 0.5 + i * bar * 0.45, pad + bar / 2, bar * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
    const inner = { x: pad + w * 0.07, y: pad + bar + h * 0.1, w: w - pad * 2 - w * 0.14 };
    ctx.fillRect(inner.x, inner.y, inner.w * 0.45, h * 0.32);
    for (let i = 0; i < 3; i++) ctx.fillRect(inner.x + inner.w * 0.55, inner.y + i * h * 0.12, inner.w * (i === 2 ? 0.28 : 0.45), lw * 1.1);
    ctx.fillRect(inner.x, inner.y + h * 0.42, inner.w, lw * 1.1);
    return;
  }

  if (shape === "globe") {
    const cx = w / 2;
    const cy = h / 2;
    const R = s / 2 - pad;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    for (const k of [0.45, 0.85]) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * k, R, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx, cy - R);
    ctx.lineTo(cx, cy + R);
    for (const k of [-0.5, 0, 0.5]) {
      const y = cy + R * k;
      const half = Math.sqrt(R * R - (R * k) ** 2);
      ctx.moveTo(cx - half, y);
      ctx.lineTo(cx + half, y);
    }
    ctx.stroke();
    return;
  }

  if (shape === "grid") {
    // One tile per industry; the first (the live one) is filled.
    const count = Number(el.dataset.morphCount ?? 7);
    const cols = 4;
    const rows = Math.ceil(count / cols);
    const gap = s * 0.08;
    const tile = Math.min((w - pad * 2 - gap * (cols - 1)) / cols, (h - pad * 2 - gap * (rows - 1)) / rows);
    const ox = (w - (tile * cols + gap * (cols - 1))) / 2;
    const oy = (h - (tile * rows + gap * (rows - 1))) / 2;
    for (let i = 0; i < count; i++) {
      const x = ox + (i % cols) * (tile + gap);
      const y = oy + Math.floor(i / cols) * (tile + gap);
      ctx.beginPath();
      ctx.roundRect(x, y, tile, tile, tile * 0.18);
      if (i === 0) ctx.fill();
      else ctx.stroke();
    }
    return;
  }

  // steps: four nodes on a rising line, the last one filled (launch)
  const n = 4;
  const R = s * 0.11;
  const pts = Array.from({ length: n }, (_, i) => ({
    x: pad + R + (i * (w - pad * 2 - R * 2)) / (n - 1),
    y: h - pad - R - (i * (h - pad * 2 - R * 2)) / (n - 1),
  }));
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.stroke();
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    if (i === n - 1) ctx.fill();
    else {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
      ctx.restore();
      ctx.stroke();
    }
  });
}

/** Sample ~n points from the painted mask. */
function sample(shape: Shape, w: number, h: number, el: HTMLElement, n: number, seed: number): Pt[] {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  paint(ctx, shape, c.width, c.height, el);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;

  let filled = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;
  if (!filled) return [];
  const step = Math.max(1.5, Math.sqrt(filled / n));

  const pts: Pt[] = [];
  const rand = mulberry32(seed);
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      const jx = x + (rand() - 0.5) * step * 0.3;
      const jy = y + (rand() - 0.5) * step * 0.3;
      const px = Math.min(c.width - 1, Math.max(0, Math.round(jx)));
      const py = Math.min(c.height - 1, Math.max(0, Math.round(jy)));
      if (data[(py * c.width + px) * 4 + 3] > 128) pts.push({ x: jx, y: jy });
    }
  }
  // Shuffle, then pad or trim to exactly n so every shape maps 1:1.
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  const out = pts.slice(0, n);
  while (out.length < n && pts.length) out.push(pts[out.length % pts.length]);
  return out;
}

const noop = () => () => {};

export function MorphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Portal to <body>: the page-transition wrapper uses a transform, which
  // would turn `position: fixed` into "fixed to the wrapper".
  const host = useSyncExternalStore(
    noop,
    () => document.body,
    () => null,
  );

  useEffect(() => {
    if (!host) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = window.innerWidth < 768 ? 1600 : 3400;
    const rand = mulberry32(7);
    // Per-particle constants: scatter direction/radius and alpha.
    const seedDir = Array.from({ length: N }, () => {
      const a = rand() * Math.PI * 2;
      const r = 60 + rand() * 260;
      return { dx: Math.cos(a) * r, dy: Math.sin(a) * r - 40, alpha: 0.7 + rand() * 0.3, jitter: rand() };
    });
    const pos = new Float32Array(N * 2);
    let anchors: Anchor[] = [];
    let ready = false;
    let raf = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999 };
    const hidden: HTMLElement[] = [];

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(window.innerWidth * dpr);
      canvas!.height = Math.round(window.innerHeight * dpr);
    }

    function build() {
      const els = [...document.querySelectorAll<HTMLElement>("[data-morph]")];
      anchors = els
        .map((el, k) => {
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) return null;
          const shape = el.dataset.morph as Shape;
          return {
            el,
            shape,
            color: hexToRgb(el.dataset.morphColor ?? "#1a1a19"),
            size: Number(el.dataset.morphSize ?? 2.2),
            points: sample(shape, r.width, r.height, el, N, 11 + k),
            w: r.width,
            h: r.height,
          } satisfies Anchor;
        })
        .filter((a): a is Anchor => !!a && a.points.length > 0);

      if (!ready && anchors[0]) {
        // Start assembled on the first anchor.
        const r = anchors[0].el.getBoundingClientRect();
        anchors[0].points.forEach((p, i) => {
          pos[i * 2] = r.left + p.x;
          pos[i * 2 + 1] = r.top + p.y;
        });
      }
      // The real text stays in the DOM for screen readers and search; hide
      // it visually only once the particle version is drawn.
      for (const a of anchors) {
        if (a.shape === "word" && !hidden.includes(a.el)) {
          a.el.style.color = "transparent";
          hidden.push(a.el);
        }
      }
      ready = anchors.length > 0;
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!ready) return;
      const vh = window.innerHeight;
      const rects = anchors.map((a) => a.el.getBoundingClientRect());
      const centers = rects.map((r) => r.top + r.height / 2);

      // Active pair: the last anchor that has entered the bottom of the view.
      const enter = vh * 0.95;
      const settle = vh * 0.45;
      let k = 0;
      for (let i = 0; i < anchors.length; i++) if (centers[i] < enter) k = i;
      let from = k;
      const to = k;
      let t = 1;
      if (k > 0) {
        from = k - 1;
        t = clamp01((enter - centers[k]) / (enter - settle));
      }
      if (reduce) t = t >= 0.5 ? 1 : 0;

      const A = anchors[from];
      const B = anchors[to];
      const ra = rects[from];
      const rb = rects[to];
      const col = A.color.map((c, i) => Math.round(c + (B.color[i] - c) * smooth(t)));
      const size = (A.size + (B.size - A.size) * smooth(t)) * dpr;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;

      for (let i = 0; i < N; i++) {
        const pa = A.points[i];
        const pb = B.points[i];
        // Break apart left to right: each particle starts after a delay
        // proportional to its x within the departing shape.
        const delay = (pa.x / Math.max(1, A.w)) * 0.35 + seedDir[i].jitter * 0.1;
        const ti = reduce ? t : smooth(clamp01((t - delay) / (1 - 0.45)));
        const lift = reduce ? 0 : Math.sin(Math.PI * ti);
        let tx = ra.left + pa.x + (rb.left + pb.x - (ra.left + pa.x)) * ti + seedDir[i].dx * lift;
        let ty = ra.top + pa.y + (rb.top + pb.y - (ra.top + pa.y)) * ti + seedDir[i].dy * lift;

        // Gentle push away from the cursor.
        if (!reduce) {
          const ddx = tx - pointer.x;
          const ddy = ty - pointer.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < 8100) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 90) * 22;
            tx += (ddx / d) * f;
            ty += (ddy / d) * f;
          }
        }

        const ease = reduce ? 1 : 0.2;
        const x = (pos[i * 2] += (tx - pos[i * 2]) * ease);
        const y = (pos[i * 2 + 1] += (ty - pos[i * 2 + 1]) * ease);
        if (y < -20 || y > vh + 20) continue;
        ctx!.globalAlpha = seedDir[i].alpha * (1 - 0.45 * lift);
        ctx!.fillRect(x * dpr, y * dpr, size, size);
      }
      ctx!.globalAlpha = 1;
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        build();
      }, 150);
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    resize();
    let cancelled = false;
    // Sample the word only after the web font has loaded, or the particle
    // letters would use the fallback font's shapes.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      build();
      raf = requestAnimationFrame(frame);
    });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const el of hidden) el.style.color = "";
    };
  }, [host]);

  if (!host) return null;
  return createPortal(
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 size-full" />,
    host,
  );
}
