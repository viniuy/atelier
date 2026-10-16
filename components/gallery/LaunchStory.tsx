"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { DarkDots } from "./Backgrounds";

type Step = { title: string; body: string };

/**
 * "From preview to launch" as a scroll-driven story. The band pins while you
 * scroll through it and one progress value (0 to 1) drives the scene:
 *
 *   0.00 – 0.25  Browse together: two people chat beside a website
 *   0.25 – 0.45  Pick one: one points at it, "that one"
 *   0.45 – 0.65  Swap in their details: the site fills in
 *   0.65 – 1.00  Launch: a rocket rises, the button is pressed, the site
 *                boards through the porthole and the rocket takes off
 *
 * The step list highlights in sync. Everything is scrubbed, so scrolling
 * back rewinds it.
 */
const STOPS = [0, 0.25, 0.45, 0.65];

const INK = "#e9e7e1";
const DIM = "#a8a6a0";
const PANEL = "#242320";

function useP(p: MotionValue<number>, input: number[], output: number[]) {
  return useTransform(p, input, output, { clamp: true });
}

export function LaunchStory({ steps, title }: { steps: Step[]; title: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    let i = 0;
    STOPS.forEach((s, k) => {
      if (v >= s) i = k;
    });
    setActive(i);
  });

  // ── Scene 1: chatting ────────────────────────────────────────────────
  const bubbleA = useP(p, [0.02, 0.06, 0.13, 0.16], [0, 1, 1, 0]);
  const bubbleB = useP(p, [0.12, 0.16, 0.24, 0.27], [0, 1, 1, 0]);
  const cardIn = useP(p, [0, 0.06], [0, 1]);
  const cardFloat = useP(p, [0, 0.25], [12, 0]);

  // ── Scene 2: "that one" ──────────────────────────────────────────────
  const pointA = useP(p, [0.26, 0.32, 0.42, 0.46], [0, -62, -62, 0]);
  const pick = useP(p, [0.3, 0.35], [0, 1]);
  const bubbleThat = useP(p, [0.3, 0.34, 0.42, 0.45], [0, 1, 1, 0]);

  // ── Scene 3: details fill in ─────────────────────────────────────────
  const fill1 = useP(p, [0.46, 0.52], [0.25, 1]);
  const fill2 = useP(p, [0.5, 0.56], [0.2, 1]);
  const fill3 = useP(p, [0.54, 0.6], [0.15, 1]);
  const logo = useP(p, [0.56, 0.62], [0, 1]);
  const heroFill = useP(p, [0.48, 0.6], [0.08, 0.9]);

  // ── Scene 4: launch ──────────────────────────────────────────────────
  const rocketRise = useP(p, [0.64, 0.72], [230, 0]);
  const pressB = useP(p, [0.72, 0.75, 0.78], [0, 48, 30]);
  const buttonDown = useP(p, [0.74, 0.76], [0, 4]);
  const buttonGlow = useP(p, [0.74, 0.77], [0, 1]);
  // The site shrinks and travels into the porthole.
  const boardX = useP(p, [0.76, 0.83], [0, 0]);
  const boardY = useP(p, [0.76, 0.83], [0, 92]);
  const boardScale = useP(p, [0.76, 0.83], [1, 0.16]);
  const boardFade = useP(p, [0.82, 0.84], [1, 0]);
  const portholeLit = useP(p, [0.82, 0.85], [0, 1]);
  const flame = useP(p, [0.84, 0.88], [0, 1]);
  // Lift-off accelerates (ease-in) and clears the top of the stage.
  const lift = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.87) / 0.12));
    return -760 * t * t;
  });
  const smoke = useP(p, [0.86, 0.96], [0, 1]);
  const smokeFade = useP(p, [0.86, 0.9, 1], [0, 0.7, 0]);
  const lookUp = useP(p, [0.88, 0.95], [0, -14]);
  const live = useP(p, [0.95, 0.99], [0, 1]);
  const streaks = useP(p, [0.88, 0.93, 1], [0, 1, 0.4]);
  const lookUpB = useTransform(lookUp, (v) => -v);
  const cardOpacity = useTransform([cardIn, boardFade], ([a, b]) => Number(a) * Number(b));
  const cardY = useTransform([cardFloat, boardY], ([a, b]) => Number(a) + Number(b));
  const liveY = useTransform(live, [0, 1], [10, 0]);

  return (
    <div ref={ref} className="relative h-[460vh]">
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <DarkDots />
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
          <div>
            {title}
            <ol className="mt-8 space-y-1 md:mt-12">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className={cn(
                    "border-l-2 py-3 pl-5 transition-[opacity,border-color] duration-500 md:py-4",
                    i === active ? "border-paper opacity-100" : "border-white/10 opacity-40",
                    // On phones only the active step shows, to save height.
                    i === active ? "block" : "hidden md:block",
                  )}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="font-mono text-[13px] text-[#a8a6a0]">{i + 1}</span>
                  <h3 className="mt-1 font-medium">{s.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#a8a6a0]">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <svg
            viewBox="0 0 640 440"
            className="w-full overflow-visible"
            role="img"
            aria-label="Two people pick a website together, press launch, and the site flies off on a rocket"
          >
            <defs>
              {/* Everything above the ground line: the rocket rises up through it. */}
              <clipPath id="launch-above-ground">
                <rect x={-200} y={-1200} width={1040} height={1582} />
              </clipPath>
            </defs>
            <g fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              {/* Stars and launch streaks */}
              {[
                [70, 60],
                [190, 30],
                [560, 50],
                [470, 100],
                [600, 160],
                [40, 170],
                [300, 40],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={1.4} fill={DIM} stroke="none" />
              ))}
              <motion.g style={{ opacity: streaks }} stroke={DIM} strokeWidth={1.2}>
                {[250, 280, 360, 390].map((x, i) => (
                  <line key={x} x1={x} y1={20 + i * 14} x2={x} y2={110 + i * 14} />
                ))}
              </motion.g>

              {/* Ground */}
              <line x1={30} y1={380} x2={610} y2={380} stroke={DIM} strokeWidth={1.2} />

              {/* Rocket (behind the people, rises from below the ground) */}
              <g clipPath="url(#launch-above-ground)">
              <motion.g style={{ y: rocketRise }}>
                <motion.g style={{ y: lift }}>
                  {/* Flame */}
                  <motion.g style={{ opacity: flame, scaleY: flame, originY: 0 }}>
                    <path
                      d="M306 372 Q320 430 334 372 Q320 392 306 372Z"
                      fill={INK}
                      stroke="none"
                      className="origin-top [transform-box:fill-box] motion-safe:animate-[atelier-flicker_.12s_ease-in-out_infinite_alternate]"
                    />
                    <path d="M300 370 Q320 456 340 370" stroke={DIM} strokeWidth={1.4} />
                  </motion.g>
                  <path d="M320 196 C 352 232 356 300 348 356 L 292 356 C 284 300 288 232 320 196Z" fill={PANEL} />
                  <path d="M292 330 L 270 368 L 296 356" fill={PANEL} />
                  <path d="M348 330 L 370 368 L 344 356" fill={PANEL} />
                  <path d="M304 356 L 308 370 L 332 370 L 336 356" fill={PANEL} />
                  <circle cx={320} cy={276} r={17} fill={PANEL} />
                  <motion.circle cx={320} cy={276} r={11} fill={INK} stroke="none" style={{ opacity: portholeLit }} />
                  <motion.rect x={314} y={271} width={12} height={9} rx={1.5} fill={PANEL} stroke="none" style={{ opacity: portholeLit }} />
                </motion.g>
              </motion.g>
              </g>

              {/* Smoke at lift-off */}
              <motion.g style={{ opacity: smokeFade }} stroke={DIM} strokeWidth={1.4}>
                {[
                  [-38, 0],
                  [38, 0],
                  [-70, 6],
                  [70, 6],
                  [0, 8],
                ].map(([dx, dy], i) => (
                  <motion.circle
                    key={i}
                    cx={320 + dx}
                    cy={370 + dy}
                    r={18}
                    style={{ scale: smoke, originX: "50%", originY: "50%" }}
                  />
                ))}
              </motion.g>

              {/* Launch pedestal beside person B: a sloped panel with one big button */}
              <path d="M414 380 L420 346 L456 336 L456 380 Z" fill={PANEL} />
              <line x1={426} y1={366} x2={448} y2={366} stroke={DIM} strokeWidth={1.4} />
              <motion.g style={{ y: buttonDown }}>
                <ellipse cx={438} cy={338} rx={11} ry={5} fill={PANEL} />
                <path d="M427 338 v-5 a11 5 0 0 1 22 0 v5" fill={PANEL} />
                <motion.ellipse cx={438} cy={333} rx={8} ry={3.5} fill={INK} stroke="none" style={{ opacity: buttonGlow }} />
              </motion.g>

              {/* Person A (left) */}
              <g>
                <line x1={140} y1={334} x2={135} y2={380} />
                <line x1={160} y1={334} x2={165} y2={380} />
                <rect x={126} y={252} width={48} height={88} rx={22} fill={PANEL} />
                <line x1={132} y1={268} x2={118} y2={318} />
                <motion.line x1={168} y1={268} x2={190} y2={318} style={{ rotate: pointA, originX: 0, originY: 0 }} />
                <motion.g style={{ rotate: lookUp, originX: "50%", originY: "100%" }}>
                  <circle cx={150} cy={228} r={19} fill={PANEL} />
                  <circle cx={157} cy={225} r={1.8} fill={INK} stroke="none" />
                </motion.g>
              </g>

              {/* Person B (right) */}
              <g>
                <line x1={480} y1={334} x2={475} y2={380} />
                <line x1={500} y1={334} x2={505} y2={380} />
                <rect x={466} y={252} width={48} height={88} rx={22} fill={PANEL} />
                <line x1={508} y1={268} x2={522} y2={318} />
                <motion.line x1={472} y1={268} x2={450} y2={318} style={{ rotate: pressB, originX: 1, originY: 0 }} />
                <motion.g style={{ rotate: lookUpB, originX: "50%", originY: "100%" }}>
                  <circle cx={490} cy={228} r={19} fill={PANEL} />
                  <circle cx={483} cy={225} r={1.8} fill={INK} stroke="none" />
                </motion.g>
              </g>

              {/* Speech bubbles */}
              <motion.g style={{ opacity: bubbleA, scale: bubbleA, originX: "0%", originY: "100%" }}>
                <path d="M176 190 h96 a10 10 0 0 0 10 -10 v-28 a10 10 0 0 0 -10 -10 h-86 a10 10 0 0 0 -10 10 v38 l-10 10Z" fill={PANEL} />
                <line x1={188} y1={158} x2={262} y2={158} stroke={DIM} />
                <line x1={188} y1={170} x2={240} y2={170} stroke={DIM} />
              </motion.g>
              <motion.g style={{ opacity: bubbleB, scale: bubbleB, originX: "100%", originY: "100%" }}>
                <path d="M464 190 h-96 a10 10 0 0 1 -10 -10 v-28 a10 10 0 0 1 10 -10 h86 a10 10 0 0 1 10 10 v38 l10 10Z" fill={PANEL} />
                {[390, 410, 430].map((x) => (
                  <circle key={x} cx={x} cy={166} r={3.2} fill={INK} stroke="none" />
                ))}
              </motion.g>
              <motion.g style={{ opacity: bubbleThat, scale: bubbleThat, originX: "100%", originY: "100%" }}>
                <path d="M464 190 h-96 a10 10 0 0 1 -10 -10 v-28 a10 10 0 0 1 10 -10 h86 a10 10 0 0 1 10 10 v38 l10 10Z" fill={PANEL} />
                <path d="M392 166 l10 10 l22 -22" stroke={INK} strokeWidth={3} />
              </motion.g>

              {/* The website */}
              <motion.g
                style={{
                  opacity: cardOpacity,
                  y: cardY,
                  x: boardX,
                  scale: boardScale,
                  originX: "50%",
                  originY: "50%",
                }}
              >
                <rect x={234} y={124} width={172} height={120} rx={10} fill={PANEL} />
                <line x1={234} y1={142} x2={406} y2={142} />
                {[246, 256, 266].map((x) => (
                  <circle key={x} cx={x} cy={133} r={2.2} fill={DIM} stroke="none" />
                ))}
                {/* Picked: a ring around the site */}
                <motion.rect
                  x={226}
                  y={116}
                  width={188}
                  height={136}
                  rx={14}
                  stroke={INK}
                  strokeWidth={1.4}
                  strokeDasharray="6 6"
                  style={{ opacity: pick }}
                />
                {/* Content that fills in */}
                <motion.rect x={248} y={154} width={70} height={50} rx={4} fill={INK} stroke="none" style={{ opacity: heroFill }} />
                <motion.rect x={248} y={154} width={70} height={50} rx={4} />
                <motion.line x1={330} y1={160} x2={394} y2={160} style={{ scaleX: fill1, originX: 0 }} />
                <motion.line x1={330} y1={174} x2={384} y2={174} style={{ scaleX: fill2, originX: 0 }} />
                <motion.line x1={330} y1={188} x2={372} y2={188} style={{ scaleX: fill3, originX: 0 }} />
                <motion.rect x={330} y={202} width={34} height={12} rx={6} fill={INK} stroke="none" style={{ opacity: logo }} />
                <line x1={248} y1={224} x2={394} y2={224} stroke={DIM} />
              </motion.g>

              {/* It's live */}
              <motion.g style={{ opacity: live, y: liveY }}>
                <rect x={196} y={170} width={248} height={44} rx={22} fill={PANEL} />
                <circle cx={222} cy={192} r={6} fill={INK} stroke="none" />
                <text x={238} y={197.5} fill={INK} stroke="none" fontSize={15} fontFamily="var(--font-geist), sans-serif">
                  yourbusiness.ph is live
                </text>
              </motion.g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
