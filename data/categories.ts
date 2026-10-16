import {
  AirVent,
  Camera,
  Coffee,
  Dumbbell,
  Scissors,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import type { Category } from "@/lib/types";

/**
 * Every category the gallery knows about. Order here is display order.
 * Set `status: "live"` once at least one template in data/templates.ts
 * points at the category.
 */
export const categories: Category[] = [
  {
    slug: "air-conditioning",
    name: "Air Conditioning",
    description:
      "Aircon cleaning, installation and repair services, from corporate HVAC contractors to the family-run shop down the street.",
    status: "live",
    icon: AirVent,
  },
  {
    slug: "coffee-shop",
    name: "Coffee Shop",
    description: "Menus, opening hours and that third-wave cozy feeling.",
    status: "coming-soon",
    icon: Coffee,
  },
  {
    slug: "barber",
    name: "Barber",
    description: "Walk-ins, bookings and a wall of fresh fades.",
    status: "coming-soon",
    icon: Scissors,
  },
  {
    slug: "salon",
    name: "Salon",
    description: "Hair, nails and lashes with online booking front and center.",
    status: "coming-soon",
    icon: Sparkles,
  },
  {
    slug: "fitness",
    name: "Fitness",
    description: "Gyms, studios and coaches: class schedules and membership plans.",
    status: "coming-soon",
    icon: Dumbbell,
  },
  {
    slug: "restaurant",
    name: "Restaurant",
    description: "Menus, reservations and the dishes people drive across town for.",
    status: "coming-soon",
    icon: UtensilsCrossed,
  },
  {
    slug: "photography",
    name: "Photography",
    description: "Portfolio-first layouts for wedding, portrait and event shooters.",
    status: "coming-soon",
    icon: Camera,
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
