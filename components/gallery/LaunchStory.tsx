"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls, type MotionStyle, type MotionValue } from "motion/react";
import { DarkDots } from "./Backgrounds";
import { HeroHalftone } from "./HeroHalftone";

/**
 * The home page opens on this: a pinned, cinematic short, shot front-on.
 *
 *   0. Title card: the "Atelier" wordmark (the page's h1, halftone-printed).
 *      The first step shrinks it onto the TV as the set fades up behind.
 *   1. Two-shot: two people side by side, talking through what the site
 *      needs. The computer behind them is dark and out of focus.
 *   2. It lights up, focus racks to it, and the camera pushes past them into
 *      the screen, where the site is edited live for them.
 *   3. Pull back wide: they step in and shake hands.
 *   4. The site lifts off the screen, rolls up into a glowing ball and
 *      floats across to a ship waiting at its launch station.
 *   5. Lift-off. The camera rides up with it into the night, and the ship
 *      tows the wordmark up into frame on a line, then lets go and leaves:
 *      a bookend to the hero the page opens on.
 *
 * One line of narration runs underneath. The story moves in slides: while
 * it's pinned, a scroll gesture (one wheel notch, an arrow key, or a
 * swipe) plays through to the next finished beat (STOPS), so it never rests
 * half-way. At either end, scrolling carries on as normal.
 */

type Step = { title: string; body: string };

// ── Timing helpers ────────────────────────────────────────────────────
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Gentle ease-in-out (sine): the softest start and finish. */
const sine = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
/** 0 → 1 → 0 over [a, b]: a single soft swell. */
const swell = (v: number, a: number, b: number) => Math.sin(Math.PI * span(v, a, b));
/**
 * A smooth curve through keyframes (monotone cubic): velocity carries
 * through each keyframe instead of stopping, holds stay perfectly still,
 * and it never overshoots.
 */
function keys(v: number, at: number[], vals: number[]) {
  const n = at.length;
  if (v <= at[0]) return vals[0];
  if (v >= at[n - 1]) return vals[n - 1];
  let i = 0;
  while (v > at[i + 1]) i++;
  const slope = (j: number) => (vals[j + 1] - vals[j]) / (at[j + 1] - at[j]);
  const tangent = (j: number) => {
    if (j === 0 || j === n - 1) return 0;
    const a = slope(j - 1);
    const b = slope(j);
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  };
  const h = at[i + 1] - at[i];
  const t = (v - at[i]) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * vals[i] +
    (t3 - 2 * t2 + t) * h * tangent(i) +
    (-2 * t3 + 3 * t2) * vals[i + 1] +
    (t3 - t2) * h * tangent(i + 1)
  );
}

// ── The set (world units = view-box px at zoom 1) ─────────────────────
const FLOOR = 560;
// The website, drawn once in design pixels and used three times: on the
// monitor, full size while it's edited, and rolled up into the ball.
const DW = 1280;
const DH = 840;
/** The monitor's screen. */
const SCR = { x: 432, y: 236, w: 336, h: (336 * DH) / DW };
const SCX = SCR.x + SCR.w / 2;
const SCY = SCR.y + SCR.h / 2;
const DESK = { x0: 380, x1: 820, top: 478 };

/** Where the two people stand (feet), and how far each steps in to shake hands. */
const PA = 400;
const PB = 800;
const STEP_IN = 73;
const PEOPLE_Y = 700;
const SHOULDER = { dx: 40, y: -262 };
const UPPER = 70;
const FORE = 62;

/** The ship on its station, out on the right of the set. */
const SHIP = { x: 1540, base: 545, h: 300 };
const HATCH = { x: SHIP.x, y: SHIP.base - 168 };
const TOWER = { x: SHIP.x - 118, w: 40, h: 350 };
const ARM_Y = HATCH.y;

/** Ball: the site rolled up, in its own units (the screen's size). */
const BALL_D = SCR.h;
const BALL_SIZE = 46; // world px once rolled up
const BALL_UP = { x: 660, y: 200 }; // where it hovers after leaving the screen
const BALL_CTRL = { x: 1160, y: 40 }; // arc control point on the way to the hatch

const T = {
  skin: "#c9baa6",
  skinShade: "#a99a87",
  hair: "#2e2924",
  shirtA: "#e4e0d6",
  shirtAShade: "#bdb8ad",
  pantsA: "#4c4a46",
  shirtB: "#7d786f",
  shirtBShade: "#625e57",
  pantsB: "#33312e",
  shoe: "#1f1e1c",
};

// ── Beats ─────────────────────────────────────────────────────────────
const B = {
  boot: [0.215, 0.255], // the monitor lights up
  focus: [0.22, 0.265], // focus racks from the people to the screen
  overlayIn: [0.312, 0.322], // full-size site appears over the zoomed screen
  flatten: [0.322, 0.365], // …and grows to fill the view
  typing: [0.372, 0.42],
  image: [0.455, 0.48],
  logo: [0.488, 0.505],
  cta: [0.522, 0.54],
  cards: [0.545, 0.57],
  unflatten: [0.59, 0.635],
  overlayOut: [0.635, 0.645],
  walk: [0.655, 0.695],
  reach: [0.69, 0.715],
  shake: [0.712, 0.745],
  release: [0.755, 0.78],
  roll: [0.755, 0.79], // site leaves the screen and rolls into a ball
  fly: [0.79, 0.84], // …floats across
  dock: [0.838, 0.852], // …and into the hatch
  arm: [0.865, 0.885], // access arm swings away
  ignite: [0.878, 0.905],
  liftoff: [0.9, 1],
  track: [0.895, 0.935], // camera locks onto the ship
  pull: [0.94, 0.975], // the wordmark is towed up into place
  letGo: [0.972, 0.986],
} satisfies Record<string, [number, number]>;

const BUBBLES: { who: "a" | "b"; text: string; at: [number, number, number, number] }[] = [
  { who: "a", text: "We need online booking.", at: [0.015, 0.04, 0.075, 0.09] },
  { who: "b", text: "And honest prices, upfront.", at: [0.08, 0.105, 0.14, 0.155] },
  { who: "a", text: "Plus photos of real jobs.", at: [0.15, 0.175, 0.215, 0.23] },
];

const LINES: { text: string; range: [number, number] }[] = [
  { text: "It starts with a conversation,", range: [0.01, 0.24] },
  { text: "then it's tailored to every detail of your brand,", range: [0.33, 0.625] },
  { text: "sealed with a handshake,", range: [0.655, 0.8] },
  { text: "and launched to the world.", range: [0.805, 0.93] },
];

/** The title card takes the first stretch of the slider (p); everything
 *  after it runs on the story's own clock (q), which starts where it ends. */
const OPEN = 0.05;
const toQ = (v: number) => clamp01((v - OPEN) / (1 - OPEN));
/** Finished beats of the story (q): three lines of the conversation, the
 *  screen lit, headline typed, image and logo in, fully edited, the
 *  handshake, the ball on board, and the wordmark. */
const BEATS = [0.06, 0.125, 0.195, 0.27, 0.425, 0.51, 0.575, 0.75, 0.86, 1];
/** Where the slider rests (p): the title card, the two-shot with the name on
 *  the TV, then every beat. */
const STOPS = [0, OPEN, ...BEATS.map((b) => OPEN + b * (1 - OPEN))];
/** Wheel distance (px) that counts as one step: one notch on most mice;
 *  finer wheels and trackpads add up over a short window. */
const WHEEL_STEP = 90;
/** Seconds to play into each stop, so every beat gets the time it needs
 *  (the roll-and-fly and the launch are long takes). Going back is quicker. */
const STEP_SECONDS = [1, 2.8, 1.8, 1.8, 1.8, 2.2, 3.2, 2.2, 2.2, 3.4, 3.8, 8];
/** The wordmark as it sits on the TV: 60% of the screen's width. */
const TV_WORD = { w: SCR.w * 0.6, size: 73 };

const HEAD = ["Cool rooms,", "honest prices."];

// ── Camera ────────────────────────────────────────────────────────────
/** Narrow screens show the whole frame width (meet) instead of filling it,
 *  and push in closer on the close shots so the people stay readable. */
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
/** View-box px → screen px, and where the view box's top sits on screen. */
const viewScale = (w: number, h: number) => (w <= NARROW_PX ? Math.min(w / 1200, h / 800) : Math.max(w / 1200, h / 800));
const viewTop = (w: number, h: number) => (h - 800 * viewScale(w, h)) / 2;
/** Extra zoom per shot on narrow screens (keyed by the shot's own zoom): a
 *  lot for the station, a little less for the close shots, none in flight. */
const narrowBoost = (z: number, w: number) => (w <= NARROW_PX ? keys(z, [0.5, 0.6, 0.85, 1.0, 1.3], [1, 1, 1.8, 1.6, 1.5]) : 1);

/** Ship height above its pad: a slow, heavy start, then speed. */
const lift = (v: number) => -9000 * span(v, ...B.liftoff) ** 2.4;
/** Rumble on the pad, fading once it's flying. */
const shake = (v: number) => 2.2 * smooth(span(v, 0.884, 0.9)) * (1 - smooth(span(v, 0.915, 0.94)));

/** Screen y (px) of the ship's tail while the camera rides with it, and the
 *  towline's length. The line is long enough that the wordmark starts just
 *  under the frame, and it arrives exactly where the hero's sits. */
function tow(v: number, H: number, restTop: number) {
  const line = 0.45 * H + 12;
  const ride = 0.56 * H;
  const t = sine(span(v, ...B.pull));
  let tail = lerp(ride, restTop - line, t);
  if (v > B.pull[1]) tail = lerp(restTop - line, -1.4 * H, span(v, B.pull[1], 1) ** 1.6);
  return { tail, line };
}

/** The station shot: the ship and its station, centred in frame. */
const WIDE = { fx: SHIP.x, fy: 390, z: 0.85 };

/** Camera: focus point in world coordinates and zoom. */
function camera(v: number, W = 1200, H = 800, restTop = 0) {
  const at = [0, 0.06, 0.2, 0.27, 0.315, 0.6, 0.68, 0.755, 0.83, 0.86];
  let fx = keys(v, at, [600, 600, 600, 600, SCX, SCX, 600, 600, WIDE.fx, WIDE.fx]);
  let fy = keys(v, at, [445, 432, 428, 415, SCY, SCY, 440, 425, WIDE.fy, WIDE.fy]);
  const base = keys(v, at, [1.26, 1.38, 1.42, 1.45, 2.9, 2.9, 1.0, 0.95, WIDE.z, WIDE.z]);
  let z = base * narrowBoost(base, W);
  if (v > 0.88) {
    z = lerp(z, 0.5, smooth(span(v, 0.9, 0.95)));
    // Ride with the ship: solve for the focus that puts its tail where the
    // tow wants it on screen.
    const follow = smooth(span(v, ...B.track));
    const s = viewScale(W, H);
    const vy = (tow(v, H, restTop).tail - viewTop(W, H)) / s;
    const tailY = SHIP.base + lift(v);
    fx = lerp(fx, SHIP.x, follow);
    fy = lerp(fy, tailY - (vy - 400) / z, follow);
    const a = shake(v);
    fx += a * Math.sin(v * 2900);
    fy += a * Math.cos(v * 4100);
  }
  return { fx, fy, z, base };
}

/** People stand nearer the lens, so when the camera pushes in past the
 *  two-shot they grow faster and slide out of frame (parallax). */
const nearZoom = (z: number, base: number) => z * Math.max(1, base / 1.45) ** 0.6;

// ── Hooks and small pieces ────────────────────────────────────────────
function useP(p: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(p, input, output, { clamp: true, ease: sine });
}

const blurOf = (px: number) => (px < 0.05 ? "none" : `blur(${px.toFixed(2)}px)`);

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
  const c0 = useTransform(p, (v) => sine(span(v, B.cards[0], B.cards[0] + 0.015)));
  const c1 = useTransform(p, (v) => sine(span(v, B.cards[0] + 0.005, B.cards[0] + 0.02)));
  const c2 = useTransform(p, (v) => sine(span(v, B.cards[0] + 0.01, B.cards[1])));
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
  { label: "Heading", box: [664, 226, 560, 150], hold: [0.36, 0.43] },
  { label: "Image", box: [48, 198, 584, 454], hold: [0.445, 0.5] },
  { label: "Button", box: [668, 466, 274, 94], hold: [0.515, 0.545] },
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
  const on = useP(p, [0.355, 0.37, 0.545, 0.56], [0, 1, 1, 0]);
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

// ── People ────────────────────────────────────────────────────────────
/** Arm angles in radians from hanging straight down; positive swings
 *  toward +x. [upper arm, forearm]. */
type Arm = [number, number];
type Pose = { dx: number; bob: number; near: Arm; far: Arm };

const REST_NEAR = 0.08;
const REST_FAR = 0.06;
/** Talking: the near hand comes up in front of the chest and moves a little. */
const talkArm = (g: number, v: number): Arm => [lerp(REST_NEAR, 0.35, g), lerp(0.03, 2.15 + 0.14 * Math.sin(v * 260) * g, g)];
/** Handshake: the near arm reaches forward to meet the other's hand. */
const SHAKE_ARM: Arm = [0.55, 1.2];

/** Pose for a person, mirrored for B (who faces left), so +angles point
 *  toward the other person for both. */
function pose(v: number, who: "a" | "b"): Pose {
  const talk = BUBBLES.filter((b) => b.who === who).reduce((g, b) => Math.max(g, smooth(span(v, b.at[0], b.at[1])) * (1 - smooth(span(v, b.at[2], b.at[3])))), 0);
  const walk = span(v, ...B.walk);
  const reach = sine(span(v, ...B.reach)) * (1 - sine(span(v, ...B.release)));
  const pump = 0.13 * Math.sin(span(v, ...B.shake) * Math.PI * 4) * (1 - span(v, B.shake[1] - 0.008, B.shake[1]));
  const talking = talkArm(talk, v);
  const near: Arm = [lerp(talking[0], SHAKE_ARM[0], reach), lerp(talking[1], SHAKE_ARM[1] + pump, reach)];
  return {
    dx: STEP_IN * sine(walk),
    bob: -Math.abs(Math.sin(walk * Math.PI * 3)) * 5,
    near,
    far: [REST_FAR, 0.02],
  };
}

function limbs(sx: number, sy: number, [u, f]: Arm, dir: number) {
  const ex = sx + dir * UPPER * Math.sin(u);
  const ey = sy + UPPER * Math.cos(u);
  const hx = ex + dir * FORE * Math.sin(f);
  const hy = ey + FORE * Math.cos(f);
  return { ex, ey, hx, hy };
}

function ArmShape({ d, shirt }: { d: MotionValue<{ ex: number; ey: number; hx: number; hy: number; sx: number; sy: number }>; shirt: string }) {
  const upper = useTransform(d, (a) => `M${a.sx.toFixed(1)} ${a.sy.toFixed(1)} L${a.ex.toFixed(1)} ${a.ey.toFixed(1)}`);
  const fore = useTransform(d, (a) => `M${a.ex.toFixed(1)} ${a.ey.toFixed(1)} L${a.hx.toFixed(1)} ${a.hy.toFixed(1)}`);
  const hx = useTransform(d, (a) => a.hx);
  const hy = useTransform(d, (a) => a.hy);
  return (
    <g>
      <motion.path d={fore} stroke={T.skin} strokeWidth={13} strokeLinecap="round" fill="none" />
      <motion.path d={upper} stroke={shirt} strokeWidth={18} strokeLinecap="round" fill="none" />
      <motion.circle cx={hx} cy={hy} r={8.5} fill={T.skin} />
    </g>
  );
}

/** A person standing at x (feet), three-quarter view, facing the other. */
function Person({ p, x, who, shirt, shirtShade, pants, rim }: { p: MotionValue<number>; x: number; who: "a" | "b"; shirt: string; shirtShade: string; pants: string; rim: MotionValue<number> }) {
  const face = who === "a" ? 1 : -1;
  const P = useTransform(p, (v) => pose(v, who));
  const tx = useTransform(P, (q) => x + face * q.dx);
  const ty = useTransform(P, (q) => PEOPLE_Y + q.bob);
  const nearArm = useTransform(P, (q) => ({ sx: face * SHOULDER.dx, sy: SHOULDER.y, ...limbs(face * SHOULDER.dx, SHOULDER.y, q.near, face) }));
  const farArm = useTransform(P, (q) => ({ sx: -face * SHOULDER.dx, sy: SHOULDER.y, ...limbs(-face * SHOULDER.dx, SHOULDER.y, q.far, -face) }));

  return (
    <motion.g style={{ x: tx, y: ty }}>
      <ellipse cx={0} cy={0} rx={70} ry={12} fill="rgba(0,0,0,0.4)" />
      {/* Legs and shoes */}
      <rect x={-27} y={-142} width={22} height={140} rx={9} fill={pants} />
      <rect x={5} y={-142} width={22} height={140} rx={9} fill={pants} />
      <ellipse cx={-16 + face * 5} cy={-3} rx={16} ry={7} fill={T.shoe} />
      <ellipse cx={16 + face * 5} cy={-3} rx={16} ry={7} fill={T.shoe} />
      {/* Far arm sits behind the body */}
      <ArmShape d={farArm} shirt={shirtShade} />
      {/* Torso */}
      <path d="M-36 -128 L-45 -250 Q-47 -274 -24 -276 L24 -276 Q47 -274 45 -250 L36 -128 Z" fill={shirt} />
      <path d={`M${-face * 36} -128 L${-face * 45} -250 Q${-face * 47} -274 ${-face * 24} -276 L${-face * 12} -276 L${-face * 22} -128 Z`} fill={shirtShade} opacity={0.6} />
      {/* Neck and head */}
      <rect x={-9} y={-294} width={18} height={22} fill={T.skinShade} />
      <ellipse cx={face * 3} cy={-320} rx={27} ry={31} fill={T.skin} />
      <path d={`M${-face * 29} -318 Q${-face * 31} -354 ${face * 2} -354 Q${face * 30} -352 ${face * 28} -330 Q${face * 6} -340 ${-face * 10} -326 L${-face * 22} -300 Z`} fill={T.hair} />
      <circle cx={face * 17} cy={-318} r={2.6} fill="#2b2a27" />
      {/* Rim light from the screen behind them */}
      <motion.path
        d={`M${-face * 44} -248 Q${-face * 46} -272 ${-face * 22} -276 M${-face * 26} -322 Q${-face * 26} -352 ${face * 2} -352`}
        fill="none"
        stroke="#f3efe6"
        strokeOpacity={0.5}
        strokeWidth={1.5}
        strokeLinecap="round"
        style={{ opacity: rim }}
      />
      <ArmShape d={nearArm} shirt={shirt} />
    </motion.g>
  );
}

/** A speech bubble over a head, in world coordinates. It leans in toward
 *  the middle of the frame (so it stays in shot on narrow screens), with
 *  its tail over the speaker. */
function Bubble({ p, text, x, at }: { p: MotionValue<number>; text: string; x: number; at: [number, number, number, number] }) {
  const o = useP(p, at, [0, 1, 1, 0]);
  const y = useP(p, at, [10, 0, 0, -6]);
  const w = Math.round(text.length * 8.4 + 40);
  const top = 280;
  const tail = x + Math.sign(600 - x) * 12;
  const cx = x + Math.sign(600 - x) * 60;
  return (
    <motion.g style={{ opacity: o, y }}>
      <rect x={cx - w / 2} y={top} width={w} height={46} rx={16} fill="#efebe2" />
      <path d={`M${tail - 8} ${top + 45} L${tail} ${top + 58} L${tail + 8} ${top + 45} Z`} fill="#efebe2" />
      <text x={cx} y={top + 29} fontSize={17} fontWeight={500} textAnchor="middle" fill="#2b2a27">
        {text}
      </text>
    </motion.g>
  );
}

// ── The station ───────────────────────────────────────────────────────
/** Lattice launch tower: two rails with cross-bracing. */
function Tower() {
  const { x, w, h } = TOWER;
  const top = SHIP.base - h;
  const bays = Math.floor(h / 35);
  return (
    <g stroke="#6b675f" strokeWidth={2.5} fill="none">
      <path d={`M${x} ${SHIP.base} V${top} M${x + w} ${SHIP.base} V${top}`} strokeWidth={4} />
      {Array.from({ length: bays }, (_, i) => {
        const y0 = SHIP.base - i * 35;
        const y1 = y0 - 35;
        return <path key={i} d={`M${x} ${y0} L${x + w} ${y1} M${x + w} ${y0} L${x} ${y1} M${x} ${y1} H${x + w}`} opacity={0.75} />;
      })}
      <rect x={x - 6} y={top - 10} width={w + 12} height={10} fill="#4c4a46" stroke="none" />
    </g>
  );
}

const SHIP_BODY = `M0 -${SHIP.h} C 40 -${SHIP.h - 50} 48 -150 40 -40 L 40 -10 L -40 -10 L -40 -40 C -48 -150 -40 -${SHIP.h - 50} 0 -${SHIP.h} Z`;
const SHIP_NOSE = `M0 -${SHIP.h} C 20 -${SHIP.h - 26} 30 -${SHIP.h - 62} 33 -${SHIP.h - 76} L -33 -${SHIP.h - 76} C -30 -${SHIP.h - 62} -20 -${SHIP.h - 26} 0 -${SHIP.h} Z`;

/** Smoke puffs (offset from the pad, and size), rolling outward along the ground. */
const SMOKE: [number, number, number][] = [
  [-150, 14, 30],
  [-100, 4, 36],
  [-50, 12, 40],
  [0, 2, 44],
  [50, 12, 40],
  [100, 4, 36],
  [150, 14, 30],
  [-75, -16, 28],
  [75, -16, 28],
];

function SmokePuff({ dx, dy, r, spread, scale }: { dx: number; dy: number; r: number; spread: MotionValue<number>; scale: MotionValue<number> }) {
  const x = useTransform(spread, (t) => dx * 1.4 * t);
  const cx = SHIP.x + dx * 0.35;
  const cy = SHIP.base + 10 + dy;
  return (
    <motion.ellipse
      cx={cx}
      cy={cy}
      rx={r}
      ry={r * 0.58}
      fill={dy < 0 ? "#57554f" : "#6b675f"}
      style={{ x, scale, originX: `${cx}px`, originY: `${cy}px`, transformBox: "view-box" }}
    />
  );
}

/** Deterministic star field (x, y, opacity) for the flight. */
const STARS: [number, number, number][] = Array.from({ length: 52 }, (_, i) => {
  const r = (k: number) => {
    const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return [Math.round(r(1) * 1200), Math.round(r(2) * 800), Math.round((0.25 + r(3) * 0.6) * 100) / 100];
});

const viewOrigin = (x: number, y: number) => ({ originX: `${x}px`, originY: `${y}px`, transformBox: "view-box" as const });

export function LaunchStory({ steps, title, wordmark, tagline }: { steps: Step[]; title: React.ReactNode; wordmark: string; tagline: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const p = useMotionValue(0);
  /** The story's clock, after the title card. */
  const q = useTransform(p, toQ);
  const narrow = useNarrow();
  const sw = useMotionValue(1200);
  const sh = useMotionValue(800);
  /** Where the tops of the wordmark's letters rest (px from the stage
   *  top) once it's in the hero's spot; the towline meets them there. */
  const restTop = useMotionValue(300);
  /** The wordmark's layout box at rest (untransformed). */
  const wordTop = useMotionValue(300);
  const wordH = useMotionValue(256);
  const wordW = useMotionValue(700);

  useEffect(() => {
    const el = stage.current;
    const word = wordRef.current;
    if (!el || !word) return;
    const ro = new ResizeObserver(() => {
      sw.set(el.clientWidth);
      sh.set(el.clientHeight);
      // Offsets ignore transforms, so this holds while the word is moving.
      // leading-none: the line box is the font size; ascenders start ~15% in.
      restTop.set(word.offsetTop + word.offsetHeight * 0.15);
      wordTop.set(word.offsetTop);
      wordH.set(word.offsetHeight);
      wordW.set(word.offsetWidth);
    });
    ro.observe(el);
    ro.observe(word);
    return () => ro.disconnect();
  }, [sw, sh, restTop, wordTop, wordH, wordW]);

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
    let startedAt = 0;
    let duration = 0;
    let queued = 0;
    let acc = 0;
    let accTimer: ReturnType<typeof setTimeout> | undefined;
    let quietUntil = 0;
    let inside = false;
    let anim: AnimationPlaybackControls | undefined;
    let touchY: number | null = null;
    let fired = false;

    const geo = () => {
      const start = box.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(st).top) || 0);
      const range = Math.max(1, box.offsetHeight - st.offsetHeight);
      return { start, range };
    };
    // A few px of slack: at the very top of the page the story can sit a
    // pixel or two below its sticky offset (header border, rounding).
    const pinned = () => {
      const { start, range } = geo();
      return window.scrollY >= start - 8 && window.scrollY <= start + range + 1;
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
      queued = 0;
      // The launch is one long take; every other step glides in and out on
      // a sine curve: no sudden start, no sudden stop.
      const forward = to > p.get();
      const launch = i === last && forward;
      duration = forward ? STEP_SECONDS[i] : Math.max(1.4, STEP_SECONDS[i + 1] * 0.5);
      startedAt = performance.now();
      anim = animate(p, to, {
        duration,
        ease: launch ? [0.3, 0, 0.6, 1] : [0.37, 0, 0.63, 1],
        onComplete: () => {
          busy = false;
          acc = 0;
          if (launch) return;
          // A step asked for near the end plays straight after.
          if (queued) go(idx + queued);
        },
      });
    };
    /** True when this direction should leave the story and scroll the page. */
    const leaving = (d: number) => !busy && ((idx <= 0 && d < 0) || (idx === last && d > 0));
    /** While a step plays, a deliberate input in its second half is queued
     *  (trackpad momentum arrives early and is ignored). */
    const queue = (d: number) => {
      if ((performance.now() - startedAt) / 1000 > duration * 0.45) queued = d;
    };

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
      const px = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * 800 : e.deltaY;
      if (busy) {
        if (Math.abs(px) >= 50) queue(d);
        return;
      }
      acc += px;
      clearTimeout(accTimer);
      accTimer = setTimeout(() => (acc = 0), 900);
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
      if (busy) queue(d);
      else go(idx + d);
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

    // Check again once layout settles, so a page that opens on the story
    // plays its opening slide.
    const ro = new ResizeObserver(() => onScroll());
    ro.observe(box);
    const retry = setTimeout(onScroll, 400);
    window.addEventListener("load", onScroll);
    // Blocking (non-passive) wheel/touch listeners make the browser wait for
    // JavaScript before every scroll, so they're attached only while the
    // story is on screen; the rest of the page scrolls freely.
    let blocking = false;
    const setBlocking = (on: boolean) => {
      if (on === blocking) return;
      blocking = on;
      if (on) {
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
      } else {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchmove", onTouchMove);
      }
    };
    const io = new IntersectionObserver(([e]) => setBlocking(e.isIntersecting));
    io.observe(box);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    onScroll();
    return () => {
      anim?.stop();
      ro.disconnect();
      clearTimeout(retry);
      window.removeEventListener("load", onScroll);
      clearTimeout(accTimer);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      setBlocking(false);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [p]);

  // Motion keeps the transform origin at the view-box centre (600, 400), so
  // scale(s) translate(centre - focus) puts the focus point dead centre.
  const cam = useTransform([q, sw, sh, restTop], ([v, w, h, r]) => camera(Number(v), Number(w), Number(h), Number(r)));
  const cameraT = useTransform(cam, (c) => `scale(${c.z}) translate(${600 - c.fx}px, ${400 - c.fy}px)`);
  const nearT = useTransform(cam, (c) => `scale(${nearZoom(c.z, c.base)}) translate(${600 - c.fx}px, ${400 - c.fy}px)`);

  // ── Act 1: the conversation, then the screen lights up ──────────────
  const screenOff = useP(q, [B.boot[0] + 0.01, B.boot[1]], [1, 0]);
  const bootFlash = useTransform(q, (v) => 0.85 * swell(v, ...B.boot));
  const screenGlow = useP(q, [B.boot[0], B.boot[1]], [0, 1]);
  const rim = useP(q, [B.boot[0] + 0.01, B.boot[1]], [0, 1]);
  // Rack focus: the set starts soft behind the people, then the people soften.
  const setBlur = useTransform(q, (v) => blurOf(2.4 * (1 - sine(span(v, ...B.focus)))));
  const nearBlur = useTransform(q, (v) => blurOf(1.4 * sine(span(v, ...B.focus)) * (1 - sine(span(v, 0.6, 0.66))) + 5 * sine(span(v, 0.27, 0.305)) * (1 - sine(span(v, 0.6, 0.64)))));
  // The camera pushes past them into the screen, and back out again. After
  // the handshake they fade away as the ball lifts off, so the flight to the
  // ship has the frame to itself.
  const people = useP(q, [0.28, 0.305, 0.62, 0.655, B.release[1] - 0.012, B.fly[0]], [1, 0, 0, 1, 1, 0]);

  // ── Act 2: full-size site, edited live ───────────────────────────────
  const site = useSite(q);
  const overlayO = useTransform(q, (v) => sine(span(v, ...B.overlayIn)) * (1 - sine(span(v, ...B.overlayOut))));
  const overlayT = useTransform([q, sw, sh], ([pv, wv, hv]) => {
    const v = Number(pv);
    const W = Number(wv);
    const H = Number(hv);
    const flat = smooth(span(v, ...B.flatten)) * (1 - smooth(span(v, ...B.unflatten)));
    // Start: exactly where the screen sits in the zoomed scene.
    const k = (viewScale(W, H) * camera(v, W, H).z * SCR.w) / DW;
    // End: as large as fits between the title and the narration.
    const top = 72;
    const bottom = Math.max(H * 0.2, 110);
    const gx = Math.max(16, W * 0.05);
    const fit = Math.min((W - 2 * gx) / DW, (H - top - bottom) / DH);
    const a = lerp(k, fit, flat);
    const cx = W / 2;
    const cy = lerp(H / 2, top + (H - top - bottom) / 2, flat);
    return `matrix(${a}, 0, 0, ${a}, ${cx - a * (DW / 2)}, ${cy - a * (DH / 2)})`;
  });
  const sceneDim = useP(q, [0.322, 0.35, 0.59, 0.635], [1, 0.25, 0.25, 1]);

  // ── Act 4: the site rolls into a ball and flies to the ship ─────────
  const onScreen = useP(q, [B.roll[0], B.roll[0] + 0.004], [1, 0]);
  // The desk and monitor fade with the people as the ball rises.
  const studio = useP(q, [B.release[1] - 0.012, B.fly[0]], [1, 0]);
  const ballOn = useTransform(q, (v): number => (v >= B.roll[0] && v < B.dock[1] ? 1 : 0));
  const roll = useTransform(q, (v) => sine(span(v, ...B.roll)));
  const ballPos = useTransform(q, (v) => {
    const r = sine(span(v, ...B.roll));
    let x = lerp(SCX, BALL_UP.x, r);
    let y = lerp(SCY, BALL_UP.y, r);
    const f = sine(span(v, ...B.fly));
    if (f > 0) {
      const q = 1 - f;
      x = q * q * BALL_UP.x + 2 * q * f * BALL_CTRL.x + f * f * HATCH.x;
      y = q * q * BALL_UP.y + 2 * q * f * BALL_CTRL.y + f * f * HATCH.y;
    }
    // A gentle float while it hovers and travels.
    y += 6 * Math.sin(v * 180) * swell(v, B.roll[0] + 0.02, B.fly[1]);
    return { x, y };
  });
  const ballX = useTransform(ballPos, (b) => b.x);
  const ballY = useTransform(ballPos, (b) => b.y);
  const ballScale = useTransform(q, (v) => lerp(1, BALL_SIZE / BALL_D, sine(span(v, ...B.roll))) * (1 - sine(span(v, ...B.dock))));
  const clipW = useTransform(roll, (m) => lerp(SCR.w, BALL_D, m));
  const clipH = useTransform(roll, (m) => lerp(SCR.h, BALL_D, m));
  const clipX = useTransform(clipW, (w) => -w / 2);
  const clipY = useTransform(clipH, (h) => -h / 2);
  const clipR = useTransform(roll, (m) => lerp(4, BALL_D / 2, m));
  const sphere = useTransform(roll, (m) => smooth(span(m, 0.35, 1)));
  const hatchGlow = useP(q, [B.dock[0], B.dock[1] + 0.006], [0, 1]);

  // ── Act 5: lift-off, then the wordmark on a towline ─────────────────
  const armSwing = useP(q, B.arm, [0, -78]);
  const beacon = useP(q, [0.74, 0.78], [0, 1]);
  const flame = useP(q, B.ignite, [0, 1]);
  const flameLen = useTransform(q, (v) => span(v, ...B.ignite) * (1 + 1.8 * smooth(span(v, 0.9, 0.95))));
  const liftY = useTransform(q, (v) => lift(v) + shake(v) * Math.sin(v * 5300));
  const groundGlow = useP(q, [0.88, 0.9, 0.93, 0.96], [0, 1, 1, 0]);
  const smoke = useP(q, [0.885, 0.97], [0.3, 2.8]);
  const smokeSpread = useP(q, [0.885, 0.97], [0, 1]);
  const smokeOpacity = useP(q, [0.885, 0.9, 0.97], [0, 0.65, 0]);
  const trail = useTransform(q, (v) => Math.min(1600, -lift(v) * 0.6));
  const trailO = useP(q, [0.905, 0.92, 0.93, 0.94], [0, 0.85, 0.85, 0]);
  const night = useP(q, [0.9, 0.95], [0, 1]);
  const setGone = useP(q, [0.925, 0.95], [1, 0]);
  const peopleO = useTransform([people, setGone], ([a, b]) => Number(a) * Number(b));
  // Stars stream past while the camera climbs.
  const starsY = useTransform(cam, (c) => ((((-c.fy * c.z * 0.06) % 800) + 800) % 800));
  // Gone before the wordmark rises (its halftone prints on solid paper).
  const starsO = useP(q, [0.915, 0.93, 0.94, 0.955], [0, 1, 1, 0]);
  const starLen = useTransform(q, (v) => (4 + 50 * swell(v, 0.92, 1)) / 54);

  // A bridle from both fin tips to the top of the word, clear of the flame.
  const bridle = useTransform([q, sw, sh, restTop], ([pv, wv, hv, rv]) => {
    const [v, W, H, R] = [Number(pv), Number(wv), Number(hv), Number(rv)];
    const { tail, line } = tow(v, H, R);
    const fin = 74 * camera(v, W, H, R).z * viewScale(W, H);
    const mid = W / 2;
    return `M${(mid - fin).toFixed(1)} ${tail.toFixed(1)} L${mid} ${(tail + line).toFixed(1)} L${(mid + fin).toFixed(1)} ${tail.toFixed(1)}`;
  });
  const cableO = useTransform(q, (v) => (v < B.pull[0] - 0.008 ? 0 : 1 - sine(span(v, ...B.letGo))));
  // The wordmark: on the title card it shrinks onto the TV (where an SVG
  // copy takes over, so it sits in the set and softens with it); at the end
  // it hangs off the towline until it arrives, then stays.
  const wordMove = useTransform([p, sw, sh, restTop, wordTop, wordH, wordW], ([pv, wv, hv, rv, tv, hh, ww]) => {
    const [v, W, H, R] = [Number(pv), Number(wv), Number(hv), Number(rv)];
    if (v < OPEN) {
      const o = sine(span(v, 0, OPEN * 0.85));
      const c = camera(0, W, H, R);
      const k = c.z * viewScale(W, H);
      const cx = W / 2 + (SCX - c.fx) * k;
      const cy = H / 2 + (SCY - c.fy) * k;
      return { x: o * (cx - W / 2), y: o * (cy - (Number(tv) + Number(hh) / 2)), s: lerp(1, (TV_WORD.w * k) / Number(ww), o) };
    }
    const t = toQ(v);
    if (t >= B.pull[1]) return { x: 0, y: 0, s: 1 };
    const { tail, line } = tow(t, H, R);
    return { x: 0, y: tail + line - R, s: 1 };
  });
  const wordX = useTransform(wordMove, (m) => m.x);
  const wordY = useTransform(wordMove, (m) => m.y);
  const wordS = useTransform(wordMove, (m) => m.s);
  const wordO = useTransform(p, (v): number => (v < OPEN ? 1 - span(v, OPEN * 0.8, OPEN) : toQ(v) >= B.pull[0] - 0.01 ? 1 : 0));
  // Crisp letters while the word moves over the set; the halftone (on its
  // solid paper) only when it's settled on the night colour.
  const crisp = useTransform(p, (v) => (v < OPEN ? span(v, 0, OPEN * 0.12) : 1 - span(toQ(v), 0.985, 1)));
  const tvWord = useTransform(p, (v) => span(v, OPEN * 0.8, OPEN) * (1 - span(toQ(v), B.boot[0], B.boot[0] + 0.012)));
  const tagEnd = useP(q, [0.978, 1], [0, 1]);
  const tagO = useTransform([p, tagEnd], ([v, e]) => Math.max(Number(e), 1 - sine(span(Number(v), 0, OPEN * 0.4))));
  // The set fades up from the hero's colour as the title shrinks away.
  const opened = useP(p, [OPEN * 0.15, OPEN * 0.9], [0, 1]);
  const curtain = useTransform(opened, (t) => 1 - t);
  const chromeEnd = useP(q, [0.92, 0.95], [1, 0]);
  const chrome = useTransform([chromeEnd, opened], ([a, b]) => Number(a) * Number(b));

  return (
    <div ref={ref} className="relative" style={{ height: `calc(100svh - 3.5rem + ${(STOPS.length - 1) * 45}vh)` }}>
      <div ref={stage} className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <DarkDots />
        </div>
        {/* The sky deepens into the hero's colour as it climbs. */}
        <motion.div aria-hidden="true" className="absolute inset-0 bg-[#120f17]" style={{ opacity: night }} />

        {/* The title stays small; the steps are kept for screen readers. */}
        <motion.div className="absolute top-6 left-0 z-10 w-full" style={{ opacity: chrome }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">{title}</div>
        </motion.div>
        <ol className="sr-only">
          {steps.map((s) => (
            <li key={s.title}>
              {s.title}: {s.body}
            </li>
          ))}
        </ol>

        {/* Stars, in screen space */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
          style={{ opacity: starsO }}
        >
          {[0, -800].map((off) => (
            <motion.g key={off} style={{ y: starsY }}>
              {STARS.map(([x, y, o], k) => (
                <motion.rect
                  key={k}
                  x={x}
                  y={y + off}
                  width={1.6}
                  height={54}
                  rx={0.8}
                  fill="#e9e7e1"
                  opacity={o}
                  style={{ scaleY: starLen, originY: 0, transformBox: "fill-box" }}
                />
              ))}
            </motion.g>
          ))}
        </motion.svg>

        {/* The set: floor, desk and monitor, the ball, the station */}
        <motion.svg
          viewBox="0 0 1200 800"
          preserveAspectRatio={narrow ? "xMidYMid meet" : "xMidYMid slice"}
          className="absolute inset-0 size-full font-sans"
          style={{ opacity: sceneDim, filter: setBlur }}
          role="img"
          aria-label="Two people talk through a website, it's tailored to their brand, they shake hands, and the site is launched on a ship"
        >
          <defs>
            <linearGradient id="ls-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#262523" />
              <stop offset="0.4" stopColor="#1c1b1a" />
              <stop offset="1" stopColor="#1a1a19" stopOpacity="0" />
            </linearGradient>
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
            <linearGradient id="ls-trail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff8ea" stopOpacity="0.9" />
              <stop offset="0.25" stopColor="#d8d3c8" stopOpacity="0.35" />
              <stop offset="1" stopColor="#8f8a80" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ls-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3efe6" stopOpacity="0.16" />
              <stop offset="1" stopColor="#f3efe6" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="ls-fire">
              <stop offset="0" stopColor="#f6dfb0" stopOpacity="0.55" />
              <stop offset="1" stopColor="#f6dfb0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ls-glow">
              <stop offset="0" stopColor="#f3efe6" stopOpacity="0.3" />
              <stop offset="1" stopColor="#f3efe6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ls-sphere" cx="0.36" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#fffdf8" stopOpacity="0.9" />
              <stop offset="0.45" stopColor="#efebe2" stopOpacity="0.35" />
              <stop offset="1" stopColor="#3b3a36" stopOpacity="0.85" />
            </radialGradient>
            <clipPath id="ls-ball-clip">
              <motion.rect x={clipX} y={clipY} width={clipW} height={clipH} rx={clipR} />
            </clipPath>
          </defs>

          <motion.g style={{ transform: cameraT, originX: 0.5, originY: 0.5, transformBox: "view-box" }}>
            {/* Everything but the ship, faded once it has cleared the set */}
            <motion.g style={{ opacity: setGone }}>
              {/* Floor */}
              <rect x={-2000} y={FLOOR} width={6000} height={1400} fill="url(#ls-floor)" />
              <rect x={-2000} y={FLOOR} width={6000} height={1} fill="#3a3935" />

              {/* The studio: desk and monitor, gone once the site has left the screen */}
              <motion.g style={{ opacity: studio }}>
                {/* Light from the screen, once it's on */}
                <motion.g style={{ opacity: screenGlow }}>
                  <ellipse cx={SCX} cy={SCY + 20} rx={520} ry={330} fill="url(#ls-glow)" />
                  <ellipse cx={SCX} cy={FLOOR + 30} rx={420} ry={60} fill="url(#ls-glow)" />
                </motion.g>

                {/* Desk */}
                <rect x={DESK.x0 + 26} y={DESK.top + 10} width={14} height={FLOOR - DESK.top - 10} fill="#2e2d2a" />
                <rect x={DESK.x1 - 40} y={DESK.top + 10} width={14} height={FLOOR - DESK.top - 10} fill="#2e2d2a" />
                <rect x={DESK.x0} y={DESK.top} width={DESK.x1 - DESK.x0} height={14} rx={3} fill="#3b3a36" />
                <rect x={DESK.x0} y={DESK.top} width={DESK.x1 - DESK.x0} height={3} rx={1.5} fill="#4c4a46" />

                {/* Monitor */}
                <path d={`M${SCX - 12} ${SCR.y + SCR.h + 8} h24 l6 ${DESK.top - SCR.y - SCR.h - 12} h-36 Z`} fill="#3a3935" />
                <ellipse cx={SCX} cy={DESK.top - 2} rx={46} ry={5} fill="#3a3935" />
                <rect x={SCR.x - 10} y={SCR.y - 10} width={SCR.w + 20} height={SCR.h + 20} rx={12} fill="#2a2926" stroke="#3d3c39" strokeWidth={1.5} />
                <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={3} fill="#3b3a36" />
                <motion.g style={{ opacity: onScreen }}>
                  <g transform={`translate(${SCR.x} ${SCR.y}) scale(${SCR.w / DW})`}>
                    <SiteArt s={site} />
                  </g>
                </motion.g>
                <motion.rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={3} fill="#121211" style={{ opacity: screenOff }} />
                <motion.rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={3} fill="#fffdf8" style={{ opacity: bootFlash }} />
                <motion.text
                  x={SCX}
                  y={SCY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={TV_WORD.size}
                  fontWeight={700}
                  letterSpacing={-0.06 * TV_WORD.size}
                  fill="#f4f1ea"
                  style={{ opacity: tvWord }}
                >
                  {wordmark}
                </motion.text>
              </motion.g>

              {/* The station: floodlights, tower, tanks, pad */}
              <g>
                {[SHIP.x - 260, SHIP.x + 260].map((x, i) => (
                  <g key={x}>
                    <polygon
                      points={`${x},${SHIP.base - 210} ${SHIP.x + (i ? 40 : -40)},${SHIP.base - SHIP.h - 30} ${SHIP.x + (i ? -10 : 10)},${SHIP.base}`}
                      fill="url(#ls-beam)"
                    />
                    <rect x={x - 2} y={SHIP.base - 210} width={4} height={210} fill="#3a3935" />
                    <rect x={x - 12} y={SHIP.base - 218} width={24} height={10} rx={3} fill="#9d988e" />
                  </g>
                ))}
                <Tower />
                {/* Beacon on the tower, blinking once the ball is on its way */}
                <motion.circle
                  cx={TOWER.x + TOWER.w / 2}
                  cy={SHIP.base - TOWER.h - 18}
                  r={5}
                  fill="#f2d9a8"
                  style={{ opacity: beacon }}
                  className="motion-safe:animate-[atelier-beacon_1.6s_ease-in-out_infinite]"
                />
                {/* Fuel tanks */}
                {[SHIP.x + 120, SHIP.x + 178].map((x) => (
                  <g key={x}>
                    <rect x={x} y={SHIP.base - 96} width={44} height={96} rx={22} fill="#4c4a46" />
                    <rect x={x + 6} y={SHIP.base - 88} width={8} height={78} rx={4} fill="#5c5a55" />
                  </g>
                ))}
                <path d={`M${SHIP.x + 120} ${SHIP.base - 30} H${SHIP.x + 40}`} stroke="#5c5a55" strokeWidth={5} />
                {/* Pad */}
                <rect x={SHIP.x - 150} y={SHIP.base} width={340} height={22} rx={3} fill="#3b3a36" />
                <rect x={SHIP.x - 150} y={SHIP.base} width={340} height={3} fill="#4c4a46" />
                <rect x={SHIP.x - 46} y={SHIP.base} width={92} height={22} fill="#1d1c1a" />
              </g>
              <motion.ellipse cx={SHIP.x} cy={SHIP.base + 10} rx={380} ry={170} fill="url(#ls-fire)" style={{ opacity: groundGlow }} />

              {/* Access arm: reaches the hatch, then swings away before ignition */}
              <motion.g style={{ rotate: armSwing, ...viewOrigin(TOWER.x + TOWER.w, ARM_Y) }}>
                <rect x={TOWER.x + TOWER.w} y={ARM_Y - 7} width={HATCH.x - 30 - TOWER.x - TOWER.w} height={14} fill="#5c5a55" />
                <path
                  d={Array.from({ length: 5 }, (_, i) => {
                    const x0 = TOWER.x + TOWER.w + i * 13;
                    return `M${x0} ${ARM_Y + 7} L${x0 + 13} ${ARM_Y - 7}`;
                  }).join(" ")}
                  stroke="#3a3935"
                  strokeWidth={2}
                />
              </motion.g>

            </motion.g>

            {/* The ship */}
            <motion.g style={{ y: liftY }}>
              <motion.rect x={SHIP.x - 9} y={SHIP.base} width={18} height={trail} rx={9} fill="url(#ls-trail)" style={{ opacity: trailO }} />
              <motion.g style={{ opacity: flame, scaleY: flameLen, ...viewOrigin(SHIP.x, SHIP.base) }}>
                <path
                  d={`M${SHIP.x - 24} ${SHIP.base - 2} Q${SHIP.x} ${SHIP.base + 170} ${SHIP.x + 24} ${SHIP.base - 2} Z`}
                  fill="url(#ls-flame)"
                  className="origin-top [transform-box:fill-box] motion-safe:animate-[atelier-flicker_.12s_ease-in-out_infinite_alternate]"
                />
              </motion.g>
              <g transform={`translate(${SHIP.x} ${SHIP.base})`}>
                <path d={`M-40 -95 L-74 -8 L-74 6 L-40 -16 Z`} fill="#8f8a80" />
                <path d={`M40 -95 L74 -8 L74 6 L40 -16 Z`} fill="#6b675f" />
                <path d={SHIP_BODY} fill="url(#ls-rocket)" />
                <path d={SHIP_NOSE} fill="#3b3a36" />
                <rect x={-41} y={-118} width={82} height={4} fill="#bdb8ad" />
                <path d="M-6 -70 L6 -70 L8 6 L-8 6 Z" fill="#4c4a46" />
                <rect x={-26} y={-12} width={52} height={14} rx={3} fill="#4c4a46" />
                {/* Hatch: dark, then lit once the ball is aboard */}
                <circle cx={0} cy={HATCH.y - SHIP.base} r={22} fill="#4c4a46" />
                <circle cx={0} cy={HATCH.y - SHIP.base} r={16} fill="#1d1c1a" />
                <motion.circle cx={0} cy={HATCH.y - SHIP.base} r={16} fill="#f6efe0" style={{ opacity: hatchGlow }} />
                <motion.circle cx={0} cy={HATCH.y - SHIP.base} r={40} fill="url(#ls-glow)" style={{ opacity: hatchGlow }} />
              </g>
            </motion.g>
            <motion.g style={{ opacity: smokeOpacity }}>
              {SMOKE.map(([dx, dy, r], i) => (
                <SmokePuff key={i} dx={dx} dy={dy} r={r} spread={smokeSpread} scale={smoke} />
              ))}
            </motion.g>

            {/* The ball: the site, rolled up */}
            <motion.g style={{ x: ballX, y: ballY, opacity: ballOn }}>
              <motion.g style={{ scale: ballScale, ...viewOrigin(0, 0) }}>
                <motion.circle r={BALL_D * 0.95} fill="url(#ls-glow)" style={{ opacity: sphere }} />
                <g clipPath="url(#ls-ball-clip)">
                  <g transform={`scale(${SCR.w / DW}) translate(${-DW / 2} ${-DH / 2})`}>
                    <SiteArt s={site} />
                  </g>
                  <motion.circle r={BALL_D / 2} fill="url(#ls-sphere)" style={{ opacity: sphere }} />
                </g>
              </motion.g>
            </motion.g>
          </motion.g>
        </motion.svg>

        {/* The people, nearest the lens, on their own layer for parallax and focus */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 1200 800"
          preserveAspectRatio={narrow ? "xMidYMid meet" : "xMidYMid slice"}
          className="pointer-events-none absolute inset-0 size-full font-sans"
          style={{ opacity: peopleO, filter: nearBlur }}
        >
          <motion.g style={{ transform: nearT, originX: 0.5, originY: 0.5, transformBox: "view-box" }}>
            <Person p={q} x={PA} who="a" shirt={T.shirtA} shirtShade={T.shirtAShade} pants={T.pantsA} rim={rim} />
            <Person p={q} x={PB} who="b" shirt={T.shirtB} shirtShade={T.shirtBShade} pants={T.pantsB} rim={rim} />
            {BUBBLES.map((b) => (
              <Bubble key={b.text} p={q} text={b.text} x={b.who === "a" ? PA : PB} at={b.at} />
            ))}
          </motion.g>
        </motion.svg>

        {/* A soft fade so the narration always sits on calm ground. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-ink via-ink/70 to-ink/0"
          style={{ opacity: chrome }}
        />
        {/* Title card ground: the hero's colour, lifting as the set fades up */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#120f17]" style={{ opacity: curtain }} />
        {/* The same site, full size, while it's edited */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 overflow-hidden rounded-[24px] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          style={{ width: DW, height: DH, opacity: overlayO, transform: overlayT, transformOrigin: "0 0" }}
        >
          <svg viewBox={`0 0 ${DW} ${DH}`} width={DW} height={DH} className="block font-sans">
            <SiteArt s={site} />
            <Editor p={q} />
          </svg>
        </motion.div>

        {/* Cinematic narration */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[7%] mx-auto h-[3em] max-w-4xl px-6">
          {LINES.map((l) => (
            <Line key={l.text} p={q} text={l.text} range={l.range} />
          ))}
        </div>

        {/* The towline, and the wordmark: the title card the page opens on,
            and the one the ship pulls up at the end. */}
        <motion.svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 size-full" style={{ opacity: cableO }}>
          <motion.path d={bridle} fill="none" stroke="#f4f1ea" strokeOpacity={0.55} strokeWidth={1.5} strokeLinejoin="round" />
        </motion.svg>
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center text-[#f4f1ea]">
          <motion.h1
            ref={wordRef}
            data-morph="word"
            data-morph-rest="hide"
            data-morph-color="#f4f1ea"
            className="pointer-events-auto relative text-[clamp(5.5rem,22vw,16rem)] leading-none font-bold tracking-[-0.06em] transition-colors duration-500"
            style={{ x: wordX, y: wordY, scale: wordS, opacity: wordO, "--crisp": crisp } as MotionStyle}
          >
            {wordmark}
            <HeroHalftone />
          </motion.h1>
          <motion.p className="relative z-10 mt-6 text-[13px] tracking-[0.32em] text-[#f4f1ea]/60 uppercase sm:text-[14px]" style={{ opacity: tagO }}>
            {tagline}
          </motion.p>
          <motion.span aria-hidden="true" className="absolute bottom-8 flex flex-col items-center gap-3 text-[12px] tracking-[0.2em] text-[#f4f1ea]/60 uppercase" style={{ opacity: tagO }}>
            Scroll
            <span className="h-10 w-px bg-[#f4f1ea]/30" />
          </motion.span>
        </div>
      </div>
    </div>
  );
}
