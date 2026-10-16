import type { CSSProperties } from "react";

/** Tiny className joiner — falsy values are dropped. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 1500 → "₱1,500" */
export function formatPeso(amount: number) {
  return peso.format(amount);
}

/** Turns a palette record into CSS variables: { ice: "#..." } → { "--c-ice": "#..." } */
export function paletteVars(palette: Record<string, string>): CSSProperties {
  return Object.fromEntries(
    Object.entries(palette).map(([name, hex]) => [`--c-${name}`, hex]),
  ) as CSSProperties;
}
