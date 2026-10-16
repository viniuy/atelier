import { AirVent, CalendarCheck, Gauge, Sparkles, Truck, Wrench, type LucideIcon } from "lucide-react";
import type { ServiceKind } from "./types";

export const serviceIcons: Record<ServiceKind, LucideIcon> = {
  installation: AirVent,
  cleaning: Sparkles,
  repair: Wrench,
  maintenance: CalendarCheck,
  freon: Gauge,
  relocation: Truck,
};
