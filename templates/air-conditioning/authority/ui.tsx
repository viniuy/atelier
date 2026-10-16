import { ArrowRight } from "lucide-react";

/** Condensed label face, used for kickers and buttons. */
export const L = "font-(family-name:--font-au-label)";

export const pillNavy = `${L} inline-flex items-center gap-2.5 rounded-full bg-(--c-navy) px-8 py-4 text-[1.1rem] font-medium text-white transition-colors hover:bg-(--c-cyan)`;

export function Arrow({ className = "size-5" }: { className?: string }) {
  return <ArrowRight className={className} strokeWidth={2} aria-hidden="true" />;
}

/** Round navy arrow button used on image tiles. */
export function RoundArrow() {
  return (
    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-(--c-navy) text-white transition-transform duration-300 group-hover:translate-x-1">
      <Arrow />
    </span>
  );
}

/** Small uppercase kicker + light, large heading with the last words in cyan. */
export function Title({
  id,
  label,
  title,
  accent,
  light = false,
}: {
  id?: string;
  label: string;
  title: string;
  accent?: string;
  light?: boolean;
}) {
  return (
    <div>
      <p className={`${L} text-[1.2rem] font-medium tracking-[0.04em] uppercase ${light ? "text-white" : "text-(--c-ink)"}`}>{label}</p>
      <h2
        id={id}
        className={`mt-2 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] font-light tracking-[-0.02em] ${light ? "text-white" : "text-(--c-navy)"}`}
      >
        {title} {accent && <span className={light ? "" : "text-(--c-cyan)"}>{accent}</span>}
      </h2>
    </div>
  );
}

/**
 * Fine flowing lines, the "airflow" motif. Pure geometry, drawn once and
 * reused in the hero, the warranty block and the footer.
 */
export function AirLines({ className = "" }: { className?: string }) {
  const lines = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className={className} aria-hidden="true">
      {lines.map((i) => (
        <path
          key={i}
          d={`M0 ${120 + i * 4} C 360 ${40 + i * 5}, 720 ${260 - i * 3}, 1080 ${150 + i * 3} S 1440 ${90 + i * 4}, 1440 ${90 + i * 4}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity={0.5 - i * 0.025}
        />
      ))}
    </svg>
  );
}
