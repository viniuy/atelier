"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { DarkDots } from "./Backgrounds";

/**
 * "From preview to launch" as a pinned, scroll-scrubbed 2.5D scene: an
 * isometric miniature world (shaded blocks, voxel-style people) with a
 * camera that zooms in on the website as it's chosen and tailored, pulls
 * back for the rocket, then follows the launch. One cinematic line of text
 * at a time narrates it. Scrolling back rewinds everything.
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
  button: { top: "#ece8df", left: "#cfcac0", right: "#b7b2a8" },
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

// Website panel: a vertical screen on the X–Z plane, facing the viewer.
const PANEL = { x0: -3.2, x1: 3.2, y: -1.2, z0: 1.4, z1: 5.6 };
const PW = PANEL.x1 - PANEL.x0;
const PH = PANEL.z1 - PANEL.z0;
/** Maps panel content units (0..PW across, 0..PH down) onto its face. */
const panelMatrix = (() => {
  const [ox, oy] = proj(PANEL.x0, PANEL.y + 0.16, PANEL.z1);
  return `matrix(${(U * C30).toFixed(3)} ${(U * 0.5).toFixed(3)} 0 ${U} ${ox.toFixed(2)} ${oy.toFixed(2)})`;
})();
const panelCenter = proj((PANEL.x0 + PANEL.x1) / 2, PANEL.y, (PANEL.z0 + PANEL.z1) / 2);

// Launch pad and rocket, front centre.
const PAD = { x: 0.6, y: 3.0 };
const padTop = proj(PAD.x + 0.9, PAD.y + 0.9, 0.35);
const ROCKET_H = 250;
const PORT_Y = -ROCKET_H * 0.56;

const PA = { x: -4.6, y: 0.6 };
const PB = { x: 3.7, y: 0.4 };
const buttonAt = proj(3.1, 2.45, 1.32);

/** Narrow screens: show the whole scene (meet) and zoom the camera a bit more. */
const NARROW = "(max-width: 640px)";
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

function useP(p: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(p, input, output, { clamp: true });
}

const LINES: { text: string; range: [number, number] }[] = [
  { text: "Turning your ideas", range: [0.02, 0.22] },
  { text: "into a website your customers will love,", range: [0.25, 0.45] },
  { text: "tailored to every detail of your brand,", range: [0.48, 0.66] },
  { text: "and launched to the world.", range: [0.7, 0.92] },
];

function Line({ p, text, range: [a, b] }: { p: MotionValue<number>; text: string; range: [number, number] }) {
  const f = 0.035;
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

export function LaunchStory({ steps, title }: { steps: Step[]; title: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const narrow = useNarrow();

  // ── Camera: focus point (scene coords) and zoom ────────────────────────
  const cam = [0, 0.08, 0.3, 0.5, 0.64, 0.74, 0.86, 1];
  const fx = useP(p, cam, [600, 600, panelCenter[0], panelCenter[0], panelCenter[0], 600, 600, 600]);
  const fy = useP(p, cam, [400, 390, panelCenter[1], panelCenter[1] + 6, panelCenter[1], 400, 380, 290]);
  const zoom = useP(p, cam, [1.08, 1.12, 1.6, 2.05, 1.7, 1.2, 1.18, 1.02]);
  // Motion keeps the transform origin at the view-box centre (600, 400), so
  // scale(s) translate(centre - focus) puts the focus point dead centre.
  const camera = useTransform(
    [fx, fy, zoom],
    ([x, y, s]) => `scale(${Number(s) * (narrow ? 1.5 : 1)}) translate(${600 - Number(x)}px, ${400 - Number(y)}px)`,
  );

  // ── Act 1: talking ────────────────────────────────────────────────────
  const bubbleA = useP(p, [0.05, 0.09, 0.15, 0.18], [0, 1, 1, 0]);
  const bubbleB = useP(p, [0.14, 0.18, 0.25, 0.28], [0, 1, 1, 0]);
  const screenOn = useP(p, [0.02, 0.1], [0.15, 1]);

  // ── Act 2: "that one" ────────────────────────────────────────────────
  const point = useP(p, [0.28, 0.32, 0.44, 0.48], [0, 1, 1, 0]);
  const pointRest = useTransform(point, (v) => 1 - v);
  const selected = useP(p, [0.3, 0.36], [0, 1]);
  const bubbleThat = useP(p, [0.33, 0.37, 0.44, 0.47], [0, 1, 1, 0]);

  // ── Act 3: tailoring ─────────────────────────────────────────────────
  const logo = useP(p, [0.5, 0.55], [0, 1]);
  const heroFill = useP(p, [0.48, 0.56], [0, 1]);
  const line1 = useP(p, [0.5, 0.56], [0.15, 1]);
  const line2 = useP(p, [0.53, 0.59], [0.1, 1]);
  const line3 = useP(p, [0.56, 0.62], [0.1, 1]);
  const cta = useP(p, [0.59, 0.64], [0, 1]);

  // ── Act 4: launch ────────────────────────────────────────────────────
  const rocketBuild = useP(p, [0.64, 0.72], [0, 1]);
  const reach = useP(p, [0.72, 0.75, 0.79, 0.8], [0, 1, 1, 0]);
  const reachRest = useTransform(reach, (v) => 1 - v);
  const press = useP(p, [0.745, 0.765], [0, 5]);
  const glow = useP(p, [0.75, 0.78], [0, 0.35]);
  const panelScale = useP(p, [0.77, 0.84], [1, 0.08]);
  const panelOpacity = useP(p, [0.82, 0.845], [1, 0]);
  const board = useP(p, [0.77, 0.84], [0, 1]);
  const boardX = useTransform(board, (t) => (padTop[0] - panelCenter[0]) * t);
  const boardY = useTransform(board, (t) => (padTop[1] + PORT_Y - panelCenter[1]) * t);
  const porthole = useP(p, [0.83, 0.86], [0, 1]);
  const flame = useP(p, [0.85, 0.88], [0, 1]);
  const lift = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.87) / 0.11));
    return -900 * t * t;
  });
  const smoke = useP(p, [0.86, 0.97], [0.2, 1.4]);
  const smokeOpacity = useP(p, [0.86, 0.9, 1], [0, 0.55, 0]);
  const live = useP(p, [0.95, 0.99], [0, 1]);
  const liveY = useTransform(live, [0, 1], [12, 0]);

  const viewOrigin = (x: number, y: number) => ({ originX: `${x}px`, originY: `${y}px`, transformBox: "view-box" as const });

  return (
    <div ref={ref} className="relative h-[520vh]">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
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

        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio={narrow ? "xMidYMid meet" : "xMidYMid slice"}
          className="absolute inset-0 size-full"
          role="img"
          aria-label="Two people choose a website together, tailor it, and launch it on a rocket"
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

          <motion.g style={{ transform: camera, originX: 0.5, originY: 0.5, transformBox: "view-box" }}>
            {/* Platform */}
            <ellipse cx={600} cy={560} rx={440} ry={150} fill="rgba(0,0,0,0.3)" />
            <Block x={-6} y={-4} z={-0.7} w={12} d={9} h={0.7} tone={T.slab} />
            <Block x={-6} y={-4} z={0} w={12} d={0.25} h={0.08} tone={T.slabEdge} />

            {/* Website panel: stand, frame, and the screen with its content */}
            <motion.g style={{ opacity: panelOpacity, scale: panelScale, x: boardX, y: boardY, ...viewOrigin(panelCenter[0], panelCenter[1]) }}>
              <Block x={-0.25} y={PANEL.y - 0.05} z={0} w={0.5} d={0.3} h={PANEL.z0} tone={T.frame} />
              <Block x={-1.1} y={PANEL.y - 0.4} z={0} w={2.2} d={1} h={0.12} tone={T.frame} />
              <Block x={PANEL.x0 - 0.12} y={PANEL.y - 0.06} z={PANEL.z0 - 0.12} w={PW + 0.24} d={0.22} h={PH + 0.24} tone={T.frame} />
              <ellipse cx={panelCenter[0]} cy={panelCenter[1]} rx={280} ry={200} fill="url(#ls-glow)" />
              <g transform={panelMatrix}>
                <motion.rect x={0} y={0} width={PW} height={PH} rx={0.12} fill="#efebe2" style={{ opacity: screenOn }} />
                <rect x={0} y={0} width={PW} height={PH} rx={0.12} fill="none" stroke="#5c5a55" strokeWidth={0.04} />
                <rect x={0} y={0} width={PW} height={0.42} fill="#d9d4ca" />
                {[0.28, 0.5, 0.72].map((cx) => (
                  <circle key={cx} cx={cx} cy={0.21} r={0.07} fill="#9d988e" />
                ))}
                <rect x={1.2} y={0.11} width={3.6} height={0.2} rx={0.1} fill="#eae6dd" />
                <motion.rect x={0.3} y={0.62} width={0.9} height={0.22} rx={0.05} fill="#2b2a27" style={{ opacity: logo }} />
                {[3.6, 4.3, 5.0].map((x) => (
                  <rect key={x} x={x} y={0.68} width={0.5} height={0.09} rx={0.04} fill="#b9b4aa" />
                ))}
                <rect x={0.3} y={1.1} width={2.8} height={2.1} rx={0.08} fill="#d9d4ca" />
                <motion.g style={{ opacity: heroFill }}>
                  <rect x={0.3} y={1.1} width={2.8} height={2.1} rx={0.08} fill="#3b3a36" />
                  <circle cx={2.4} cy={1.65} r={0.28} fill="#d9d4ca" />
                  <path d="M0.4 3.1 L1.4 2.1 L2.1 2.7 L2.5 2.4 L3.0 3.1Z" fill="#6d6a63" />
                </motion.g>
                <motion.rect x={3.4} y={1.15} width={2.6} height={0.34} rx={0.06} fill="#2b2a27" style={{ scaleX: line1, originX: 0 }} />
                <motion.rect x={3.4} y={1.65} width={2.2} height={0.14} rx={0.05} fill="#8f8a80" style={{ scaleX: line2, originX: 0 }} />
                <motion.rect x={3.4} y={1.92} width={1.9} height={0.14} rx={0.05} fill="#8f8a80" style={{ scaleX: line3, originX: 0 }} />
                <motion.rect x={3.4} y={2.45} width={1.2} height={0.36} rx={0.18} fill="#2b2a27" style={{ opacity: cta }} />
                <rect x={0.3} y={3.5} width={5.8} height={0.1} rx={0.05} fill="#d0cbc1" />
                <motion.rect
                  x={-0.12}
                  y={-0.12}
                  width={PW + 0.24}
                  height={PH + 0.24}
                  rx={0.2}
                  fill="none"
                  stroke="#f3efe6"
                  strokeWidth={0.06}
                  strokeDasharray="0.22 0.16"
                  style={{ opacity: selected }}
                />
              </g>
            </motion.g>

            {/* Launch pad; the rocket assembles on it, then lifts off */}
            <Block x={PAD.x} y={PAD.y} z={0} w={1.8} d={1.8} h={0.35} tone={T.pad} />
            <motion.g style={{ y: lift }}>
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
                  <circle cx={0} cy={PORT_Y} r={15} fill="#1d1c1a" />
                  <motion.g style={{ opacity: porthole }}>
                    <circle cx={0} cy={PORT_Y} r={15} fill="#efebe2" />
                    <rect x={-8} y={PORT_Y - 6} width={16} height={12} rx={1.5} fill="#3b3a36" />
                    <rect x={-8} y={PORT_Y - 6} width={16} height={3} fill="#9d988e" />
                  </motion.g>
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

            {/* Launch pedestal beside person B */}
            <Block x={2.75} y={2.1} z={0} w={0.7} d={0.7} h={1.15} tone={T.frame} />
            <motion.g style={{ y: press }}>
              <Block x={2.92} y={2.27} z={1.15} w={0.36} d={0.36} h={0.16} tone={T.button} />
            </motion.g>
            <motion.ellipse cx={buttonAt[0]} cy={buttonAt[1]} rx={22} ry={10} fill="#f3efe6" style={{ opacity: glow }} />

            {/* Person B (right), who reaches out to press launch */}
            <Person
              x={PB.x}
              y={PB.y}
              shirt={T.shirtB}
              pants={T.pantsB}
              arm={
                <>
                  <motion.g style={{ opacity: reachRest }}>
                    <Block x={PB.x + 0.86} y={PB.y} z={1.45} w={0.24} d={0.36} h={1.05} tone={T.shirtB} />
                  </motion.g>
                  <motion.g style={{ opacity: reach }}>
                    <Block x={PB.x - 0.3} y={PB.y + 0.22} z={1.55} w={0.26} d={1.5} h={0.26} tone={T.shirtB} />
                  </motion.g>
                </>
              }
            />

            <Bubble o={bubbleA} at={proj(PA.x + 0.4, PA.y + 0.2, 4.2)} kind="lines" />
            <Bubble o={bubbleB} at={proj(PB.x + 0.4, PB.y + 0.2, 4.2)} kind="dots" />
            <Bubble o={bubbleThat} at={proj(PB.x + 0.4, PB.y + 0.2, 4.2)} kind="check" />

            {/* It's live */}
            <motion.g style={{ opacity: live, y: liveY }}>
              <rect x={470} y={150} width={260} height={52} rx={26} fill="#efebe2" />
              <circle cx={500} cy={176} r={7} fill="#2b2a27" />
              <text x={518} y={182.5} fill="#2b2a27" fontSize={18} fontFamily="var(--font-geist), sans-serif">
                yourbusiness.ph is live
              </text>
            </motion.g>
          </motion.g>
        </svg>

        {/* A soft fade so the narration always sits on calm ground. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-linear-to-t from-ink via-ink/70 to-ink/0" />
        {/* Cinematic narration */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[8%] mx-auto h-[3em] max-w-4xl px-6">
          {LINES.map((l) => (
            <Line key={l.text} p={p} text={l.text} range={l.range} />
          ))}
        </div>
      </div>
    </div>
  );
}
