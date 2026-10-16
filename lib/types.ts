import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * A named image slot inside a template. Every slot points at a file under
 * /public/placeholders/<category>/<slug>/ so real images can be dropped in
 * later with the same filename. Width/height are the intrinsic size of the
 * file you'll generate; they reserve layout space (no CLS).
 */
export type ImageSlot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Suggested generation prompt (e.g. for Higgsfield). Not rendered. */
  prompt: string;
};

export type TemplateMeta = {
  slug: string;
  name: string;
  /** Must match a slug in data/categories.ts */
  category: string;
  /** One line, shown on cards */
  tagline: string;
  /** A short paragraph, shown on the detail page */
  description: string;
  /** Style tags, used for filtering on the category page */
  tags: string[];
  /**
   * Named colors. The template root exposes each as a CSS variable
   * `--c-<name>`, so editing a hex here recolors the template.
   */
  palette: Record<string, string>;
  fonts: { heading: string; body: string; accent?: string };
  bestFor: string[];
  features: string[];
  /** Card image for gallery grids (16:10 works best) */
  thumbnail: string;
  /** Optional phone-sized screenshot (393×852), shown in iPhone mockups */
  thumbnailMobile?: string;
  /** Every image the template renders, keyed by slot name */
  images: Record<string, ImageSlot>;
  featured?: boolean;
};

export type TemplateEntry = TemplateMeta & {
  /** Lazy import of the template's root component (default export). */
  load: () => Promise<{ default: ComponentType }>;
};

export type CategoryStatus = "live" | "coming-soon";

export type Category = {
  slug: string;
  name: string;
  description: string;
  status: CategoryStatus;
  icon: LucideIcon;
};

/** Serializable template summary, safe to pass to client components. */
export type TemplateCardData = Pick<
  TemplateMeta,
  "slug" | "name" | "tagline" | "tags" | "thumbnail" | "palette" | "category"
> & { categoryName: string };

/** A real website shown in the gallery (see data/showcase.ts). */
export type ShowcaseSite = {
  slug: string;
  name: string;
  url: string;
  /** "work": built by you for a client. "inspiration": someone else's site, used as a reference. */
  kind: "work" | "inspiration";
  /** Category slug from data/categories.ts */
  category: string;
  summary: string;
  /** What's worth borrowing (inspiration) or what was built (work) */
  notes?: string[];
  /** Related Atelier template slug: what it was built from, or what it inspired */
  template?: string;
  client?: string;
  year?: number;
  /** 1440×900 screenshot under /public */
  screenshot: string;
  /** True only if the site can be shown in an iframe (live device preview) */
  embeddable?: boolean;
};
