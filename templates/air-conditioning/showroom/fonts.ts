import { Hanken_Grotesk, Outfit } from "next/font/google";

export const display = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-sr-display",
  display: "swap",
});

export const body = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sr-body",
  display: "swap",
});
