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
 *   data-morph="word"      the element's own text (hidden while the particles sit on it)
 *   data-morph="browser" | "globe" | "grid" | "steps"
 *   data-morph-color="#1a1a19"   particle color at this anchor
 *   data-morph-size="2.4"        particle size (CSS px) at this anchor
 *
 * Anchors with no size (e.g. `hidden md:block` on phones) are skipped.
 * Reduced motion: shapes swap without the flight or the scatter.
 */

type Shape = "word" | "browser" | "globe" | "grid" | "steps";
type Pt = { x: number; y: number };
type Anchor = {
  el: HTMLElement;
  shape: Shape;
  color: number[];
  size: number;
  points: Pt[];
  w: number;
  h: number;
  /** data-morph-rest="hide": something else (e.g. a halftone) draws this shape at rest */
  restHidden: boolean;
  /** last --morph-leave written, to skip redundant style writes */
  leave: number;
};

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

  const lw = Math.max(5, s * 0.055);
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

/**
 * Sample the painted mask on an even grid, as dense as possible without
 * exceeding n points. A clean grid (no jitter, no random thinning) is what
 * makes the shapes read crisply. Returns the points plus the grid step,
 * which sets the dot size.
 */
function sample(shape: Shape, w: number, h: number, el: HTMLElement, n: number, seed: number): { points: Pt[]; step: number } {
  const empty = { points: [], step: 3 };
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return empty;
  paint(ctx, shape, c.width, c.height, el);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const on = (x: number, y: number) => data[(Math.round(y) * c.width + Math.round(x)) * 4 + 3] > 128;

  let filled = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;
  if (!filled) return empty;

  // Whole-pixel spacing keeps every gap identical. Start from the ideal
  // spacing and widen until the grid fits in n.
  let step = Math.max(3, Math.ceil(Math.sqrt(filled / n)));
  let pts: Pt[] = [];
  for (let tries = 0; tries < 40; tries++) {
    pts = [];
    const ox = Math.floor((c.width % step) / 2);
    const oy = Math.floor((c.height % step) / 2);
    for (let y = oy; y < c.height; y += step) {
      for (let x = ox; x < c.width; x += step) if (on(x, y)) pts.push({ x, y });
    }
    if (pts.length <= n) break;
    step += 1;
  }
  if (!pts.length) return empty;

  // Shuffle so the mapping between shapes is mixed (that's what makes the
  // cloud), then repeat points to reach exactly n. Repeats overlap exactly,
  // so they're invisible until the shape breaks apart.
  const rand = mulberry32(seed);
  for (let i = pts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  const out = pts.slice();
  for (let i = 0; out.length < n; i++) out.push(pts[i % pts.length]);
  return { points: out, step };
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
      return {
        dx: Math.cos(a) * r,
        dy: Math.sin(a) * r - 40,
        jitter: rand(),
        // Stiffness varies a little per dot, so a moving shape trails into a
        // soft cloud instead of sliding as one rigid block.
        k: 0.1 + rand() * 0.04,
        phase: rand() * Math.PI * 2,
      };
    });
    // Each dot is a damped spring chasing its target: soft follow with a
    // gentle settle, plus a tiny idle drift so shapes breathe.
    const pos = new Float32Array(N * 2);
    const vel = new Float32Array(N * 2);
    let placed = false;
    let last = performance.now();
    let anchors: Anchor[] = [];
    let ready = false;
    let raf = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999 };
    // Word anchors whose real text is currently hidden behind particles.
    const hidden = new Set<HTMLElement>();
    /**
     * The real text stays in the DOM for screen readers and search. It's
     * hidden only while the particles are sitting on it, and fades back in
     * as soon as they leave, so a sentence never reads with a gap.
     */
    function syncWords(covered: number) {
      anchors.forEach((a, j) => {
        if (a.shape !== "word") return;
        const hide = j === covered;
        if (hide === hidden.has(a.el)) return;
        a.el.style.color = hide ? "transparent" : "";
        if (hide) hidden.add(a.el);
        else hidden.delete(a.el);
      });
    }

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
          const { points, step } = sample(shape, r.width, r.height, el, N, 11 + k);
          return {
            el,
            shape,
            color: hexToRgb(el.dataset.morphColor ?? "#1a1a19"),
            // Dot size follows the grid spacing so every shape has the same
            // clean dot-to-gap ratio. data-morph-size overrides it.
            size: el.dataset.morphSize ? Number(el.dataset.morphSize) : Math.max(1, Math.round(step * 0.6)),
            points,
            w: r.width,
            restHidden: el.dataset.morphRest === "hide",
            leave: -1,
            h: r.height,
          } satisfies Anchor;
        })
        .filter((a): a is Anchor => !!a && a.points.length > 0);

      ready = anchors.length > 0;
    }

    function frame(now: number = performance.now()) {
      raf = requestAnimationFrame(frame);
      // Normalise to 60 fps so the spring feels the same on 120 Hz screens.
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      const time = now / 1000;
      if (!ready) return;
      const vh = window.innerHeight;
      const rects = anchors.map((a) => a.el.getBoundingClientRect());
      const centers = rects.map((r) => r.top + r.height / 2);

      // Active pair: the last anchor that has entered the bottom of the view.
      // A morph starts while the next anchor is still below the fold, so the
      // current shape visibly breaks apart before it scrolls out of view.
      // Each anchor's start line is capped just above where it sits when the
      // page is at the very top, so nothing starts moving before you scroll
      // (matters on short phone screens).
      const sy = window.scrollY;
      const settle = vh * 0.45;
      // The hero hand-off starts early (vh * 1.3) so the word breaks apart
      // while it's on screen; later morphs start as their anchor scrolls in.
      const enterAt = (i: number) =>
        Math.max(settle + 1, Math.min(i === 1 ? vh * 1.3 : vh * 0.95, centers[i] + sy - 40));
      let k = 0;
      for (let i = 0; i < anchors.length; i++) if (centers[i] < enterAt(i)) k = i;
      let from = k;
      const to = k;
      let t = 1;
      if (k > 0) {
        from = k - 1;
        const enter = enterAt(k);
        t = clamp01((enter - centers[k]) / (enter - settle));
      }
      if (reduce) t = t >= 0.5 ? 1 : 0;

      const A = anchors[from];
      const B = anchors[to];
      syncWords(t < 0.5 ? from : to);
      // How far the particles have left each anchor (0 = sitting on it,
      // 1 = gone), exposed as --morph-leave so an overlay can hand off.
      anchors.forEach((a, j) => {
        const leave = j === from && j !== to ? t : j === to ? (from === to ? 0 : 1 - t) : 1;
        const rounded = Math.round(leave * 1000) / 1000;
        if (rounded !== a.leave) {
          a.leave = rounded;
          a.el.style.setProperty("--morph-leave", String(rounded));
        }
      });
      const ra = rects[from];
      const rb = rects[to];
      const col = A.color.map((c, i) => Math.round(c + (B.color[i] - c) * smooth(t)));
      const size = (A.size + (B.size - A.size) * smooth(t)) * dpr;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
      const moving = !reduce && t > 0 && t < 1;
      // At rest on an anchor that draws itself (the halftone hero), keep the
      // physics running but don't paint the particles.
      const settled = !moving ? (from === to || t >= 1 ? B : A) : null;
      const skipPaint = !!settled?.restHidden;
      const half = size / dpr / 2;
      // At rest the particles sit on whichever shape is settled.
      const restOnB = from === to || t >= 1;
      const rest = restOnB ? B.points : A.points;
      const rr = restOnB ? rb : ra;

      for (let i = 0; i < N; i++) {
        const pa = A.points[i];
        const pb = B.points[i];
        let x: number;
        let y: number;
        let lift = 0;
        if (!moving) {
          // At rest: exactly on the anchor, on its grid.
          x = Math.round(rr.left) + rest[i].x;
          y = Math.round(rr.top) + rest[i].y;
        } else {
          // Break apart left to right: each particle starts after a delay
          // proportional to its x within the departing shape.
          const delay = (pa.x / Math.max(1, A.w)) * 0.35 + seedDir[i].jitter * 0.1;
          const ti = smooth(clamp01((t - delay) / (1 - 0.45)));
          // Full scatter cloud for the hero; a tighter one between sections
          // so it doesn't sprawl over the content in between.
          lift = Math.sin(Math.PI * ti) * (from === 0 ? 1 : 0.45);
          x = ra.left + pa.x + (rb.left + pb.x - (ra.left + pa.x)) * ti + seedDir[i].dx * lift;
          y = ra.top + pa.y + (rb.top + pb.y - (ra.top + pa.y)) * ti + seedDir[i].dy * lift;
        }

        if (!reduce) {
          // Idle float: a slow wave across the shape. Neighbouring dots move
          // together, so the grid stays clean while the shape breathes.
          const bx = rest[i].x;
          const by = rest[i].y;
          x += Math.sin(time * 0.7 + by * 0.018 + bx * 0.006) * 0.9;
          y += Math.sin(time * 0.9 + bx * 0.014) * 1.2;
          // Push away from the cursor.
          const ddx = x - pointer.x;
          const ddy = y - pointer.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < 10000) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 100) * 26;
            x += (ddx / d) * f;
            y += (ddy / d) * f;
          }
        }

        const ix = i * 2;
        const iy = ix + 1;
        if (reduce || !placed) {
          pos[ix] = x;
          pos[iy] = y;
          vel[ix] = vel[iy] = 0;
        } else {
          const k = seedDir[i].k * dt;
          // Close to critical damping: a soft glide that settles without
          // overshooting (no bounce).
          const damp = Math.pow(0.56, dt);
          vel[ix] = (vel[ix] + (x - pos[ix]) * k) * damp;
          vel[iy] = (vel[iy] + (y - pos[iy]) * k) * damp;
          pos[ix] += vel[ix] * dt;
          pos[iy] += vel[iy] * dt;
        }
        x = pos[ix];
        y = pos[iy];
        if (y < -20 || y > vh + 20) continue;

        if (skipPaint) continue;
        if (moving) ctx!.globalAlpha = 1 - 0.5 * lift;
        // Snap to device pixels so dots stay crisp.
        ctx!.fillRect((x - half) * dpr, (y - half) * dpr, size, size);
      }
      placed = true;
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
