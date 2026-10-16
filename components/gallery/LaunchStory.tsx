"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { DarkDots } from "./Backgrounds";

/**
 * "From preview to launch" as a pinned, scroll-scrubbed 2.5D story:
 *
 *   1. Two people talk over a website in an isometric miniature world.
 *   2. The camera dives into the screen until the site fills the view, and
 *      it's edited live: headline typed, image, logo, button, sections.
 *   3. The site shrinks back into the scene (the people have gone), boards a
 *      rocket, and the rocket flies up with the camera following.
 *   4. The camera pushes through the porthole into the Atelier wordmark.
 *
 * One cinematic line of text narrates it. The story moves in slides: while
 * it's pinned, a scroll gesture (about two wheel notches, an arrow key, or a
 * swipe) plays the animation through to the next finished beat (STOPS), so
 * it never rests half-way. At either end, scrolling carries on as normal.
 */

type Step = { title: string; body: string };

// ── Isometric projection ──────────────────────────────────────────────
const U = 34; // px per world unit
const OX = 600; // screen origin
const OY = 410;
const C30 = Math.cos(Math.PI / 6);
const proj = (x: number, y: number, z: number): [number, number] => [OX + (x - y) * U * C30, OY + (x + y) * U * 0.5 - z * U];
const pts = (list: [number, number, number][]) => list.map((q) => proj(...q).map((v) => v.toFixed(1)).join(",")).join(" ");

type Tone = { top: string; left: string; right: string };

/** An axis-aligned block: the three faces a viewer can see, shaded. */
function Block({
  x,
  y,
  z,
  w,
  d,
  h,
  tone,
  edge = "rgba(255,255,255,0.06)",
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  tone: Tone;
  edge?: string;
}) {
  const [x0, x1, y0, y1, z0, z1] = [x, x + w, y, y + d, z, z + h];
  return (
    <g stroke={edge} strokeWidth={0.8} strokeLinejoin="round">
      <polygon points={pts([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill={tone.left} />
      <polygon points={pts([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])} fill={tone.right} />
      <polygon points={pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill={tone.top} />
    </g>
  );
}

const T = {
  slab: { top: "#2c2b28", left: "#232220", right: "#1c1b1a" },
  slabEdge: { top: "#34332f", left: "#2a2926", right: "#21201e" },
  frame: { top: "#4a4843", left: "#3a3935", right: "#2e2d2a" },
  pad: { top: "#3b3a36", left: "#2f2e2b", right: "#262523" },
  skin: { top: "#d2c4b2", left: "#bcae9c", right: "#a39684" },
  hair: { top: "#3a332d", left: "#2e2924", right: "#25211d" },
  shirtA: { top: "#ece8df", left: "#d6d1c6", right: "#bdb8ad" },
  pantsA: { top: "#5a5853", left: "#4c4a46", right: "#403e3a" },
  shirtB: { top: "#8f8a80", left: "#7d786f", right: "#6b675f" },
  pantsB: { top: "#3d3b37", left: "#33312e", right: "#2a2926" },
};

/** A voxel-style person standing at (x, y), facing the viewer. */
function Person({ x, y, shirt, pants, arm }: { x: number; y: number; shirt: Tone; pants: Tone; arm: React.ReactNode }) {
  const [sx, sy] = proj(x + 0.4, y + 0.25, 0);
  return (
    <g>
      <ellipse cx={sx} cy={sy} rx={30} ry={11} fill="rgba(0,0,0,0.35)" />
      <Block x={x} y={y} z={0} w={0.32} d={0.4} h={1.25} tone={pants} />
      <Block x={x + 0.48} y={y} z={0} w={0.32} d={0.4} h={1.25} tone={pants} />
      <Block x={x - 0.04} y={y - 0.03} z={1.2} w={0.88} d={0.48} h={1.35} tone={shirt} />
      <Block x={x - 0.3} y={y} z={1.45} w={0.24} d={0.36} h={1.05} tone={shirt} />
      {arm}
      <Block x={x + 0.12} y={y} z={2.6} w={0.62} d={0.48} h={0.62} tone={T.skin} />
      <Block x={x + 0.08} y={y - 0.04} z={3.12} w={0.7} d={0.56} h={0.2} tone={T.hair} />
    </g>
  );
}

// ── The website ───────────────────────────────────────────────────────
// Drawn once in design pixels (DW × DH) and used twice: on the screen in the
// scene (through an isometric matrix) and full size while it's edited.
const DW = 1280;
const DH = 840;
/** Design px per world unit, so the screen is 6.4 × 4.2 units. */
const DPU = 200;
const PANEL = { x0: -3.2, x1: 3.2, y: -1.2, z0: 1.4, z1: 5.6 };
const PW = PANEL.x1 - PANEL.x0;
const PH = PANEL.z1 - PANEL.z0;
const [POX, POY] = proj(PANEL.x0, PANEL.y + 0.16, PANEL.z1);
const panelMatrix = `matrix(${((U * C30) / DPU).toFixed(5)} ${((U * 0.5) / DPU).toFixed(5)} 0 ${(U / DPU).toFixed(5)} ${POX.toFixed(2)} ${POY.toFixed(2)})`;
/** Centre of the screen's face, in scene coordinates. */
const SCX = POX + (PW / 2) * U * C30;
const SCY = POY + (PW / 2) * U * 0.5 + (PH / 2) * U;

// Launch pad and rocket, front centre.
const PAD = { x: 1.5, y: 2.1 };
const padTop = proj(PAD.x + 0.9, PAD.y + 0.9, 0.35);
const ROCKET_H = 250;
const PORT_Y = -ROCKET_H * 0.56;
const PORT_R = 15;

const PA = { x: -4.6, y: 0.6 };
const PB = { x: 3.7, y: 0.4 };

// ── Timing helpers ────────────────────────────────────────────────────
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
/** Piecewise interpolation through keyframes, eased within each segment. */
function keys(v: number, at: number[], vals: number[]) {
  if (v <= at[0]) return vals[0];
  for (let i = 1; i < at.length; i++) {
    if (v <= at[i]) return lerp(vals[i - 1], vals[i], smooth((v - at[i - 1]) / (at[i] - at[i - 1])));
  }
  return vals[vals.length - 1];
}

/** Rocket lift (scene px, negative is up). */
const lift = (v: number) => -1500 * span(v, 0.81, 0.95) ** 2;

/** Camera: focus point in scene coordinates and zoom. */
function camera(v: number) {
  const at = [0, 0.1, 0.24, 0.27, 0.62, 0.7, 0.8];
  let fx = keys(v, at, [600, 600, SCX, SCX, SCX, 600, padTop[0]]);
  let fy = keys(v, at, [400, 390, SCY, SCY, SCY, 380, padTop[1] - 130]);
  let z = keys(v, at, [1.08, 1.12, 2.2, 2.6, 2.6, 1.15, 1.35]);
  if (v > 0.8) {
    // Follow the porthole up, then push in through it.
    const follow = smooth(span(v, 0.8, 0.85));
    fx = lerp(fx, padTop[0], follow);
    fy = lerp(fy, padTop[1] + PORT_Y + lift(v), follow);
    z = lerp(1.35, 18, span(v, 0.86, 0.965) ** 3);
  }
  return { fx, fy, z };
}

/** Narrow screens show the whole scene (meet) and zoom the camera a bit more. */
const NARROW_PX = 640;
const NARROW = `(max-width: ${NARROW_PX}px)`;
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(NARROW);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
}
/** Scene px → screen px, and the extra zoom on narrow screens. */
const viewScale = (w: number, h: number) => (w <= NARROW_PX ? Math.min(w / 1200, h / 800) : Math.max(w / 1200, h / 800));
const zoomBoost = (w: number) => (w <= NARROW_PX ? 1.5 : 1);

// ── Story beats ───────────────────────────────────────────────────────
const B = {
  overlayIn: [0.262, 0.272], // full-size site appears over the zoomed screen
  flatten: [0.272, 0.33], // …and un-skews to fill the view
  unflatten: [0.56, 0.62],
  overlayOut: [0.62, 0.63],
  typing: [0.335, 0.39],
  image: [0.41, 0.44],
  logo: [0.46, 0.475],
  cta: [0.49, 0.505],
  cards: [0.515, 0.54],
  reveal: [0.945, 0.99],
} satisfies Record<string, [number, number]>;

const LINES: { text: string; range: [number, number] }[] = [
  { text: "Turning your ideas", range: [0.02, 0.26] },
  { text: "into a website your customers will love,", range: [0.31, 0.43] },
  { text: "tailored to every detail of your brand,", range: [0.44, 0.6] },
  { text: "and launched to the world.", range: [0.69, 0.87] },
];

/** Finished beats the story rests on: talking, "that one", headline typed,
 *  fully edited, rocket built, boarded, and the wordmark. */
const STOPS = [0.1, 0.22, 0.395, 0.555, 0.72, 0.79, 1];
/** Wheel distance (px) that counts as one step: about two notches. */
const WHEEL_STEP = 150;

const HEAD = ["Cool rooms,", "honest prices."];

function useP(p: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(p, input, output, { clamp: true });
}

type SiteState = {
  head1: MotionValue<string>;
  head2: MotionValue<string>;
  placeholder: MotionValue<number>;
  typedOn: MotionValue<number>;
  image: MotionValue<number>;
  logo: MotionValue<number>;
  logoOff: MotionValue<number>;
  cta: MotionValue<number>;
  ctaOff: MotionValue<number>;
  card: MotionValue<number>[];
  cardY: MotionValue<number>[];
};

function useSite(p: MotionValue<number>): SiteState {
  const total = HEAD[0].length + HEAD[1].length;
  const typed = useTransform(p, (v) => Math.round(span(v, ...B.typing) * total));
  const c0 = useTransform(p, (v) => span(v, B.cards[0], B.cards[0] + 0.015));
  const c1 = useTransform(p, (v) => span(v, B.cards[0] + 0.005, B.cards[0] + 0.02));
  const c2 = useTransform(p, (v) => span(v, B.cards[0] + 0.01, B.cards[1]));
  const logo = useP(p, B.logo, [0, 1]);
  const cta = useP(p, B.cta, [0, 1]);
  return {
    head1: useTransform(typed, (n) => HEAD[0].slice(0, n)),
    head2: useTransform(typed, (n) => HEAD[1].slice(0, Math.max(0, n - HEAD[0].length))),
    placeholder: useTransform(typed, (n): number => (n === 0 ? 1 : 0)),
    typedOn: useTransform(typed, (n): number => (n === 0 ? 0 : 1)),
    image: useP(p, B.image, [0, 1]),
    logo,
    logoOff: useTransform(logo, (t) => 1 - t),
    cta,
    ctaOff: useTransform(cta, (t) => 1 - t),
    card: [c0, c1, c2],
    cardY: [
      useTransform(c0, (t) => (1 - smooth(t)) * 40),
      useTransform(c1, (t) => (1 - smooth(t)) * 40),
      useTransform(c2, (t) => (1 - smooth(t)) * 40),
    ],
  };
}

/** The website's artwork, in design pixels. */
function SiteArt({ s }: { s: SiteState }) {
  const ink = "#1f1e1c";
  return (
    <g>
      <rect width={DW} height={DH} rx={24} fill="#efebe2" />
      {/* Browser bar */}
      <path d={`M24 0 H${DW - 24} Q${DW} 0 ${DW} 24 V84 H0 V24 Q0 0 24 0 Z`} fill="#d9d4ca" />
      {[50, 92, 134].map((cx) => (
        <circle key={cx} cx={cx} cy={42} r={11} fill="#9d988e" />
      ))}
      <rect x={250} y={22} width={700} height={40} rx={20} fill="#eae6dd" />
      <text x={280} y={49} fontSize={19} fill="#6d6a63">
        yourbusiness.ph
      </text>

      {/* Nav */}
      <motion.rect x={60} y={120} width={180} height={40} rx={8} fill="#d6d1c6" style={{ opacity: s.logoOff }} />
      <motion.text x={60} y={152} fontSize={32} fontWeight={700} letterSpacing={-1} fill={ink} style={{ opacity: s.logo }}>
        Ayos Aircon
      </motion.text>
      {(
        [
          ["Services", 830],
          ["Pricing", 960],
          ["Contact", 1080],
        ] as const
      ).map(([t, x]) => (
        <text key={t} x={x} y={148} fontSize={19} fill="#6d6a63">
          {t}
        </text>
      ))}

      {/* Hero image: an empty frame, then a wall-mounted unit cooling a room */}
      <rect x={60} y={210} width={560} height={430} rx={18} fill="#dcd7cd" />
      <path d="M260 470 l70 -80 l50 55 l30 -30 l70 75 Z" fill="none" stroke="#bdb8ad" strokeWidth={6} strokeLinejoin="round" />
      <circle cx={420} cy={360} r={20} fill="none" stroke="#bdb8ad" strokeWidth={6} />
      <motion.g style={{ opacity: s.image }}>
        <rect x={60} y={210} width={560} height={430} rx={18} fill="#3b3a36" />
        <path d="M60 560 H620 V622 Q620 640 602 640 H78 Q60 640 60 622 Z" fill="#33322f" />
        <rect x={150} y={280} width={380} height={110} rx={22} fill="#efebe2" />
        <rect x={150} y={352} width={380} height={38} rx={0} fill="#d9d4ca" />
        <path d="M150 352 H530 V368 Q530 390 508 390 H172 Q150 390 150 368 Z" fill="#d9d4ca" />
        <rect x={180} y={366} width={320} height={5} rx={2.5} fill="#bdb8ad" />
        <circle cx={500} cy={310} r={6} fill="#6d6a63" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${230 + i * 110} 420 q 22 36 0 70 q -22 36 0 70`}
            fill="none"
            stroke="#6d6a63"
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
      </motion.g>

      {/* Headline, typed in */}
      <motion.text x={680} y={292} fontSize={58} fontWeight={700} letterSpacing={-2} fill="#bdb8ad" style={{ opacity: s.placeholder }}>
        Your headline
      </motion.text>
      <motion.text x={680} y={292} fontSize={58} fontWeight={700} letterSpacing={-2} fill={ink} style={{ opacity: s.typedOn }}>
        {s.head1}
      </motion.text>
      <motion.text x={680} y={358} fontSize={58} fontWeight={700} letterSpacing={-2} fill={ink}>
        {s.head2}
      </motion.text>
      <rect x={680} y={398} width={430} height={14} rx={7} fill="#bdb8ad" />
      <rect x={680} y={424} width={350} height={14} rx={7} fill="#cfcac0" />

      {/* Button */}
      <rect x={680} y={478} width={250} height={70} rx={35} fill="none" stroke="#9d988e" strokeWidth={2.5} />
      <motion.text x={805} y={520} fontSize={21} textAnchor="middle" fill="#9d988e" style={{ opacity: s.ctaOff }}>
        Button
      </motion.text>
      <motion.g style={{ opacity: s.cta }}>
        <rect x={680} y={478} width={250} height={70} rx={35} fill={ink} />
        <text x={805} y={520} fontSize={21} textAnchor="middle" fill="#f4f1ea">
          Book a service
        </text>
      </motion.g>

      {/* Services row */}
      <rect x={60} y={688} width={1160} height={2} fill="#d6d1c6" />
      {[60, 453, 846].map((x, i) => (
        <motion.g key={x} style={{ opacity: s.card[i], y: s.cardY[i] }}>
          <rect x={x} y={714} width={374} height={100} rx={16} fill="#e3dfd5" />
          <rect x={x + 24} y={738} width={52} height={52} rx={12} fill="#cfcac0" />
          <rect x={x + 96} y={744} width={170} height={14} rx={7} fill="#6d6a63" />
          <rect x={x + 96} y={770} width={220} height={11} rx={5.5} fill="#bdb8ad" />
        </motion.g>
      ))}
    </g>
  );
}

/** What gets selected while the site is edited (design px). */
const EDITS: { label: string; box: [number, number, number, number]; hold: [number, number] }[] = [
  { label: "Heading", box: [664, 226, 560, 150], hold: [0.32, 0.395] },
  { label: "Image", box: [48, 198, 584, 454], hold: [0.405, 0.445] },
  { label: "Logo", box: [48, 108, 270, 64], hold: [0.455, 0.475] },
  { label: "Button", box: [668, 466, 274, 94], hold: [0.485, 0.505] },
  { label: "Section", box: [48, 702, 1184, 124], hold: [0.515, 0.545] },
];
const EDIT_AT = EDITS.flatMap((e) => e.hold);
const editVal = (v: number, k: number) =>
  keys(
    v,
    EDIT_AT,
    EDITS.flatMap((e) => [e.box[k], e.box[k]]),
  );

function Handle({ x, y, w, h, hx, hy }: { x: MotionValue<number>; y: MotionValue<number>; w: MotionValue<number>; h: MotionValue<number>; hx: number; hy: number }) {
  const px = useTransform([x, w], ([a, b]) => Number(a) + Number(b) * hx - 6);
  const py = useTransform([y, h], ([a, b]) => Number(a) + Number(b) * hy - 6);
  return <motion.rect width={12} height={12} fill="#efebe2" stroke="#1f1e1c" strokeWidth={2} x={px} y={py} />;
}

/** Selection outline, its label, and a cursor that moves between edits. */
function Editor({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, (v) => editVal(v, 0));
  const y = useTransform(p, (v) => editVal(v, 1));
  const w = useTransform(p, (v) => editVal(v, 2));
  const h = useTransform(p, (v) => editVal(v, 3));
  const on = useP(p, [0.318, 0.33, 0.54, 0.548], [0, 1, 1, 0]);
  const label = useTransform(p, (v) => [...EDITS].reverse().find((e) => v >= e.hold[0] - 0.005)?.label ?? EDITS[0].label);
  // The cursor leads the selection slightly, like a hand doing the work.
  const cx = useTransform(p, (v) => editVal(v + 0.006, 0) + editVal(v + 0.006, 2) * 0.72);
  const cy = useTransform(p, (v) => editVal(v + 0.006, 1) + editVal(v + 0.006, 3) * 0.7);

  return (
    <motion.g style={{ opacity: on }}>
      <motion.rect x={x} y={y} width={w} height={h} rx={6} fill="rgba(31,30,28,0.03)" stroke="#1f1e1c" strokeWidth={2} />
      {(
        [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ] as const
      ).map(([hx, hy]) => (
        <Handle key={`${hx}${hy}`} x={x} y={y} w={w} h={h} hx={hx} hy={hy} />
      ))}
      <motion.g style={{ x, y }}>
        <rect x={0} y={-40} width={112} height={30} rx={8} fill="#1f1e1c" />
        <motion.text x={14} y={-19.5} fontSize={15} fill="#f4f1ea">
          {label}
        </motion.text>
      </motion.g>
      <motion.g style={{ x: cx, y: cy }}>
        <path d="M0 0 L0 30 L8 23 L14 36 L20 33 L14 21 L25 21 Z" fill="#1f1e1c" stroke="#f4f1ea" strokeWidth={2} strokeLinejoin="round" />
      </motion.g>
    </motion.g>
  );
}

function Line({ p, text, range: [a, b] }: { p: MotionValue<number>; text: string; range: [number, number] }) {
  const f = 0.03;
  const opacity = useP(p, [a, a + f, b - f, b], [0, 1, 1, 0]);
  const blur = useP(p, [a, a + f, b - f, b], [10, 0, 0, 8]);
  const y = useP(p, [a, a + f, b - f, b], [18, 0, 0, -12]);
  const filter = useTransform(blur, (v) => `blur(${v.toFixed(2)}px)`);
  return (
    <motion.p
      className="absolute inset-x-0 bottom-0 text-center text-[clamp(1.5rem,3.4vw,2.9rem)] leading-tight font-light tracking-[-0.025em] text-balance text-paper"
      style={{ opacity, y, filter }}
    >
      {text}
    </motion.p>
  );
}

function Bubble({ o, at, kind }: { o: MotionValue<number>; at: [number, number]; kind: "lines" | "dots" | "check" }) {
  return (
    <motion.g style={{ opacity: o, scale: o, originX: `${at[0]}px`, originY: `${at[1] + 26}px`, transformBox: "view-box" }}>
      <g transform={`translate(${at[0] - 52} ${at[1] - 34})`}>
        <rect width={104} height={48} rx={14} fill="#efebe2" />
        <path d="M44 46 L52 60 L60 46 Z" fill="#efebe2" />
        {kind === "check" && (
          <path d="M38 24 l10 10 l20 -20" fill="none" stroke="#2b2a27" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {kind === "dots" && [36, 52, 68].map((cx) => <circle key={cx} cx={cx} cy={24} r={4.5} fill="#5c5a55" />)}
        {kind === "lines" && (
          <>
            <rect x={18} y={15} width={68} height={7} rx={3.5} fill="#8f8a80" />
            <rect x={18} y={28} width={46} height={7} rx={3.5} fill="#b9b4aa" />
          </>
        )}
      </g>
    </motion.g>
  );
}

export function LaunchStory({ steps, title, brand }: { steps: Step[]; title: React.ReactNode; brand: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const p = useMotionValue(0);
  const narrow = useNarrow();
  const sw = useMotionValue(1200);
  const sh = useMotionValue(800);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      sw.set(e.contentRect.width);
      sh.set(e.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [sw, sh]);

  // Slides: while the stage is pinned, input steps between STOPS and each
  // step plays out on its own clock. The page is scrolled to match the
  // slide (invisible, since the stage is sticky) so leaving at either end
  // continues naturally.
  useEffect(() => {
    const box = ref.current;
    const st = stage.current;
    if (!box || !st) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const last = STOPS.length - 1;
    let idx = -1;
    let busy = false;
    let acc = 0;
    let accTimer: ReturnType<typeof setTimeout> | undefined;
    let quietUntil = 0;
    let inside = false;
    let anim: AnimationPlaybackControls | undefined;
    let touchY: number | null = null;
    let fired = false;

    const geo = () => {
      const start = box.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(st).top || "0");
      const range = Math.max(1, box.offsetHeight - st.offsetHeight);
      return { start, range };
    };
    const pinned = () => {
      const { start, range } = geo();
      return window.scrollY >= start - 1 && window.scrollY <= start + range + 1;
    };
    const holdScroll = (i: number) => {
      const { start, range } = geo();
      quietUntil = performance.now() + 120;
      window.scrollTo({ top: start + (range * i) / last, behavior: "instant" });
    };
    const go = (i: number, instant = false) => {
      i = Math.max(0, Math.min(last, i));
      holdScroll(i);
      if (i === idx) return;
      idx = i;
      anim?.stop();
      const to = STOPS[i];
      if (instant || reduce) {
        p.jump(to);
        return;
      }
      busy = true;
      anim = animate(p, to, {
        duration: Math.min(2, Math.max(0.7, Math.abs(to - p.get()) * 7)),
        ease: [0.65, 0, 0.35, 1],
        onComplete: () => {
          // A short grace period swallows trackpad momentum.
          setTimeout(() => {
            busy = false;
            acc = 0;
          }, 220);
        },
      });
    };
    /** True when this direction should leave the story and scroll the page. */
    const leaving = (d: number) => !busy && ((idx <= 0 && d < 0) || (idx === last && d > 0));

    const onScroll = () => {
      if (performance.now() < quietUntil) return;
      if (!pinned()) {
        inside = false;
        return;
      }
      const { start, range } = geo();
      const n = Math.round(((window.scrollY - start) / range) * last);
      if (!inside) {
        // Entering: from above, play the opening; from below or a jump, land on that slide.
        inside = true;
        go(n, n !== 0);
      } else if (n !== idx) {
        // Scrollbar drag, keys or momentum: one slide at a time.
        if (busy) holdScroll(idx);
        else go(idx + Math.sign(n - idx));
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (idx < 0 || !pinned() || e.ctrlKey) return;
      const d = Math.sign(e.deltaY);
      if (!d || leaving(d)) return;
      e.preventDefault();
      if (busy) return;
      acc += e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * 800 : e.deltaY;
      clearTimeout(accTimer);
      accTimer = setTimeout(() => (acc = 0), 400);
      if (Math.abs(acc) >= WHEEL_STEP) {
        acc = 0;
        go(idx + d);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (idx < 0 || !pinned() || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      const down = ["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
      const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      const d = down ? 1 : up ? -1 : 0;
      if (!d || leaving(d)) return;
      e.preventDefault();
      if (!busy) go(idx + d);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
      fired = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null || idx < 0 || !pinned()) return;
      const dy = touchY - (e.touches[0]?.clientY ?? touchY);
      const d = Math.sign(dy);
      if (!d || (!fired && leaving(d))) return;
      e.preventDefault();
      if (!fired && !busy && Math.abs(dy) > 36) {
        fired = true;
        go(idx + d);
      }
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    onScroll();
    return () => {
      anim?.stop();
      clearTimeout(accTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [p]);

  // Motion keeps the transform origin at the view-box centre (600, 400), so
  // scale(s) translate(centre - focus) puts the focus point dead centre.
  const cameraT = useTransform([p, sw], ([v, w]) => {
    const c = camera(Number(v));
    return `scale(${c.z * zoomBoost(Number(w))}) translate(${600 - c.fx}px, ${400 - c.fy}px)`;
  });

  // ── Act 1: talking, then "that one" ──────────────────────────────────
  const screenDim = useP(p, [0.02, 0.1], [0.85, 0]);
  const bubbleA = useP(p, [0.04, 0.07, 0.1, 0.12], [0, 1, 1, 0]);
  const bubbleB = useP(p, [0.1, 0.13, 0.16, 0.18], [0, 1, 1, 0]);
  const point = useP(p, [0.15, 0.18, 0.24, 0.26], [0, 1, 1, 0]);
  const pointRest = useTransform(point, (v) => 1 - v);
  const bubbleThat = useP(p, [0.18, 0.21, 0.24, 0.26], [0, 1, 1, 0]);
  const selected = useP(p, [0.17, 0.2, 0.25, 0.265], [0, 1, 1, 0]);
  // The people step out while the site fills the view.
  const people = useP(p, [0.27, 0.28], [1, 0]);

  // ── Act 2: full-size site, edited live ───────────────────────────────
  const site = useSite(p);
  const overlayO = useTransform(p, (v) => span(v, ...B.overlayIn) * (1 - span(v, ...B.overlayOut)));
  const overlayT = useTransform([p, sw, sh], ([pv, wv, hv]) => {
    const v = Number(pv);
    const W = Number(wv);
    const H = Number(hv);
    const flat = smooth(span(v, ...B.flatten)) * (1 - smooth(span(v, ...B.unflatten)));
    // Start: exactly where the screen sits in the zoomed scene, skewed.
    const k = (viewScale(W, H) * camera(v).z * zoomBoost(W) * U) / DPU;
    // End: as large as fits between the title and the narration.
    const top = 72;
    const bottom = Math.max(H * 0.2, 110);
    const gx = Math.max(16, W * 0.05);
    const fit = Math.min((W - 2 * gx) / DW, (H - top - bottom) / DH);
    const a = lerp(C30 * k, fit, flat);
    const b = lerp(0.5 * k, 0, flat);
    const d = lerp(k, fit, flat);
    const cx = W / 2;
    const cy = lerp(H / 2, top + (H - top - bottom) / 2, flat);
    return `matrix(${a}, ${b}, 0, ${d}, ${cx - a * (DW / 2)}, ${cy - b * (DW / 2) - d * (DH / 2)})`;
  });
  const sceneDim = useP(p, [0.272, 0.3, 0.56, 0.62], [1, 0.25, 0.25, 1]);

  // ── Act 3: board the rocket, lift off ────────────────────────────────
  const rocketBuild = useP(p, [0.66, 0.72], [0, 1]);
  const board = useP(p, [0.72, 0.78], [0, 1]);
  const panelScale = useTransform(board, (t) => 1 - 0.93 * smooth(t));
  const panelOpacity = useP(p, [0.765, 0.785], [1, 0]);
  const boardX = useTransform(board, (t) => (padTop[0] - SCX) * smooth(t));
  const boardY = useTransform(board, (t) => (padTop[1] + PORT_Y - SCY) * smooth(t));
  const porthole = useP(p, [0.77, 0.79], [0, 1]);
  const flame = useP(p, [0.79, 0.815], [0, 1]);
  const liftY = useTransform(p, (v) => lift(v));
  const smoke = useP(p, [0.8, 0.9], [0.2, 1.6]);
  const smokeOpacity = useP(p, [0.8, 0.84, 0.92], [0, 0.55, 0]);

  // ── Act 4: through the porthole, into the wordmark ───────────────────
  const reveal = useTransform([p, sw, sh], ([pv, wv, hv]) => {
    const v = Number(pv);
    const W = Number(wv);
    const H = Number(hv);
    if (v <= B.reveal[0]) return "circle(0px at 50% 50%)";
    const r0 = PORT_R * camera(v).z * zoomBoost(W) * viewScale(W, H);
    const r = lerp(r0, Math.hypot(W, H) / 2 + 2, span(v, ...B.reveal) ** 1.6);
    return `circle(${r.toFixed(1)}px at 50% 50%)`;
  });
  const markO = useP(p, [0.955, 0.99], [0, 1]);
  const markScale = useP(p, [0.945, 1], [0.86, 1]);
  // The porthole darkens as the camera reaches it, so the reveal is seamless.
  const portDark = useP(p, [0.9, 0.935], [0, 1]);

  const viewOrigin = (x: number, y: number) => ({ originX: `${x}px`, originY: `${y}px`, transformBox: "view-box" as const });

  return (
    <div ref={ref} className="relative" style={{ height: `calc(100svh - 3.5rem + ${(STOPS.length - 1) * 45}vh)` }}>
      <div ref={stage} className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <DarkDots />
        </div>

        {/* The title stays small; the steps are kept for screen readers. */}
        <div className="absolute top-6 left-0 z-10 w-full">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">{title}</div>
        </div>
        <ol className="sr-only">
          {steps.map((s) => (
            <li key={s.title}>
              {s.title}: {s.body}
            </li>
          ))}
        </ol>

        <motion.svg
          viewBox="0 0 1200 800"
          preserveAspectRatio={narrow ? "xMidYMid meet" : "xMidYMid slice"}
          className="absolute inset-0 size-full font-sans"
          style={{ opacity: sceneDim }}
          role="img"
          aria-label="Two people choose a website, it's tailored to their brand, then launched on a rocket"
        >
          <defs>
            <linearGradient id="ls-rocket" x1="0" x2="1">
              <stop offset="0" stopColor="#f3efe6" />
              <stop offset="0.55" stopColor="#d8d3c8" />
              <stop offset="1" stopColor="#9d988e" />
            </linearGradient>
            <linearGradient id="ls-flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff8ea" />
              <stop offset="0.5" stopColor="#f2d9a8" stopOpacity="0.9" />
              <stop offset="1" stopColor="#f2d9a8" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="ls-glow">
              <stop offset="0" stopColor="#f3efe6" stopOpacity="0.22" />
              <stop offset="1" stopColor="#f3efe6" stopOpacity="0" />
            </radialGradient>
          </defs>

          <motion.g style={{ transform: cameraT, originX: 0.5, originY: 0.5, transformBox: "view-box" }}>
            {/* Platform */}
            <ellipse cx={600} cy={560} rx={440} ry={150} fill="rgba(0,0,0,0.3)" />
            <Block x={-6} y={-4} z={-0.7} w={12} d={9} h={0.7} tone={T.slab} />
            <Block x={-6} y={-4} z={0} w={12} d={0.25} h={0.08} tone={T.slabEdge} />

            {/* Website screen: stand, frame, and the site itself */}
            <motion.g style={{ opacity: panelOpacity, scale: panelScale, x: boardX, y: boardY, ...viewOrigin(SCX, SCY) }}>
              <Block x={-0.25} y={PANEL.y - 0.05} z={0} w={0.5} d={0.3} h={PANEL.z0} tone={T.frame} />
              <Block x={-1.1} y={PANEL.y - 0.4} z={0} w={2.2} d={1} h={0.12} tone={T.frame} />
              <Block x={PANEL.x0 - 0.12} y={PANEL.y - 0.06} z={PANEL.z0 - 0.12} w={PW + 0.24} d={0.22} h={PH + 0.24} tone={T.frame} />
              <ellipse cx={SCX} cy={SCY} rx={280} ry={200} fill="url(#ls-glow)" />
              <g transform={panelMatrix}>
                <SiteArt s={site} />
                <motion.rect width={DW} height={DH} rx={24} fill="#1a1a19" style={{ opacity: screenDim }} />
                <motion.rect
                  x={-24}
                  y={-24}
                  width={DW + 48}
                  height={DH + 48}
                  rx={40}
                  fill="none"
                  stroke="#f3efe6"
                  strokeWidth={12}
                  strokeDasharray="44 32"
                  style={{ opacity: selected }}
                />
              </g>
            </motion.g>

            {/* Launch pad; the rocket assembles on it, then lifts off */}
            <Block x={PAD.x} y={PAD.y} z={0} w={1.8} d={1.8} h={0.35} tone={T.pad} />
            <motion.g style={{ y: liftY }}>
              <motion.g style={{ opacity: flame, scaleY: flame, ...viewOrigin(padTop[0], padTop[1]) }}>
                <path
                  d={`M${padTop[0] - 22} ${padTop[1] - 4} Q${padTop[0]} ${padTop[1] + 150} ${padTop[0] + 22} ${padTop[1] - 4} Z`}
                  fill="url(#ls-flame)"
                  className="origin-top [transform-box:fill-box] motion-safe:animate-[atelier-flicker_.12s_ease-in-out_infinite_alternate]"
                />
              </motion.g>
              <motion.g style={{ scale: rocketBuild, opacity: rocketBuild, ...viewOrigin(padTop[0], padTop[1]) }}>
                <g transform={`translate(${padTop[0]} ${padTop[1]})`}>
                  <path d="M-34 -70 L-62 -6 L-62 4 L-30 -14 Z" fill="#8f8a80" />
                  <path d="M34 -70 L62 -6 L62 4 L30 -14 Z" fill="#6b675f" />
                  <path d={`M0 -${ROCKET_H} C 46 -${ROCKET_H - 60} 50 -90 38 -8 L -38 -8 C -50 -90 -46 -${ROCKET_H - 60} 0 -${ROCKET_H} Z`} fill="url(#ls-rocket)" />
                  <path
                    d={`M0 -${ROCKET_H} C 22 -${ROCKET_H - 36} 30 -${ROCKET_H - 80} 32 -${ROCKET_H - 92} L -32 -${ROCKET_H - 92} C -30 -${ROCKET_H - 80} -22 -${ROCKET_H - 36} 0 -${ROCKET_H} Z`}
                    fill="#3b3a36"
                  />
                  <path d="M-6 -60 L6 -60 L8 6 L-8 6 Z" fill="#4c4a46" />
                  <rect x={-30} y={-14} width={60} height={10} rx={3} fill="#4c4a46" />
                  <circle cx={0} cy={PORT_Y} r={21} fill="#4c4a46" />
                  <circle cx={0} cy={PORT_Y} r={PORT_R} fill="#1d1c1a" />
                  <motion.g style={{ opacity: porthole }}>
                    <circle cx={0} cy={PORT_Y} r={PORT_R} fill="#efebe2" />
                    <rect x={-8} y={PORT_Y - 6} width={16} height={12} rx={1.5} fill="#3b3a36" />
                    <rect x={-8} y={PORT_Y - 6} width={16} height={3} fill="#9d988e" />
                  </motion.g>
                  <motion.circle cx={0} cy={PORT_Y} r={PORT_R} fill="#120f17" style={{ opacity: portDark }} />
                </g>
              </motion.g>
            </motion.g>
            <motion.g style={{ opacity: smokeOpacity }}>
              {[-90, -45, 0, 45, 90].map((dx, i) => (
                <motion.ellipse
                  key={dx}
                  cx={padTop[0] + dx}
                  cy={padTop[1] + 8 + (i % 2) * 6}
                  rx={34}
                  ry={20}
                  fill="#6b675f"
                  style={{ scale: smoke, ...viewOrigin(padTop[0] + dx, padTop[1] + 8) }}
                />
              ))}
            </motion.g>

            <motion.g style={{ opacity: people }}>
              {/* Person A (left), whose arm swings up to point at the screen */}
              <Person
                x={PA.x}
                y={PA.y}
                shirt={T.shirtA}
                pants={T.pantsA}
                arm={
                  <>
                    <motion.g style={{ opacity: pointRest }}>
                      <Block x={PA.x + 0.86} y={PA.y} z={1.45} w={0.24} d={0.36} h={1.05} tone={T.shirtA} />
                    </motion.g>
                    <motion.g style={{ opacity: point }}>
                      <Block x={PA.x + 0.86} y={PA.y} z={2.2} w={1.15} d={0.32} h={0.26} tone={T.shirtA} />
                      <Block x={PA.x + 1.98} y={PA.y + 0.02} z={2.2} w={0.22} d={0.28} h={0.24} tone={T.skin} />
                    </motion.g>
                  </>
                }
              />
              {/* Person B (right) */}
              <Person
                x={PB.x}
                y={PB.y}
                shirt={T.shirtB}
                pants={T.pantsB}
                arm={<Block x={PB.x + 0.86} y={PB.y} z={1.45} w={0.24} d={0.36} h={1.05} tone={T.shirtB} />}
              />
              <Bubble o={bubbleA} at={proj(PA.x + 0.4, PA.y + 0.2, 4.2)} kind="lines" />
              <Bubble o={bubbleB} at={proj(PB.x + 0.4, PB.y + 0.2, 4.2)} kind="dots" />
              <Bubble o={bubbleThat} at={proj(PB.x + 0.4, PB.y + 0.2, 4.2)} kind="check" />
            </motion.g>
          </motion.g>
        </motion.svg>

        {/* A soft fade so the narration always sits on calm ground. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-ink via-ink/70 to-ink/0" />
        {/* The same site, full size, while it's edited */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 overflow-hidden rounded-[24px] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          style={{ width: DW, height: DH, opacity: overlayO, transform: overlayT, transformOrigin: "0 0" }}
        >
          <svg viewBox={`0 0 ${DW} ${DH}`} width={DW} height={DH} className="block font-sans">
            <SiteArt s={site} />
            <Editor p={p} />
          </svg>
        </motion.div>

        {/* Cinematic narration */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[7%] mx-auto h-[3em] max-w-4xl px-6">
          {LINES.map((l) => (
            <Line key={l.text} p={p} text={l.text} range={l.range} />
          ))}
        </div>

        {/* Through the porthole: the Atelier wordmark */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#120f17]"
          style={{ clipPath: reveal }}
        >
          <motion.div className="flex flex-col items-center" style={{ opacity: markO, scale: markScale }}>
            <span className="text-[clamp(5.5rem,22vw,16rem)] leading-none font-bold tracking-[-0.06em] text-[#f4f1ea]">{brand}</span>
            <span className="mt-6 text-[13px] tracking-[0.32em] text-[#f4f1ea]/60 uppercase sm:text-[14px]">Website library</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
