import { Barlow_Semi_Condensed, Geist } from "next/font/google";

export const sans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-au-sans",
  display: "swap",
});

export const label = Barlow_Semi_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-au-label",
  display: "swap",
});
