import type { TemplateCardData, TemplateEntry } from "@/lib/types";
import { categories, getCategory } from "@/data/categories";

import dispatch from "@/templates/air-conditioning/dispatch/meta";
import showroom from "@/templates/air-conditioning/showroom/meta";
import authority from "@/templates/air-conditioning/authority/meta";
import contractor from "@/templates/air-conditioning/contractor/meta";

/**
 * The template registry. One entry per template: its meta file plus a lazy
 * import of its folder. Order here is display order within a category.
 */
export const templates: TemplateEntry[] = [
  { ...dispatch, load: () => import("@/templates/air-conditioning/dispatch") },
  { ...showroom, load: () => import("@/templates/air-conditioning/showroom") },
  { ...authority, load: () => import("@/templates/air-conditioning/authority") },
  { ...contractor, load: () => import("@/templates/air-conditioning/contractor") },
];

// Catch config mistakes at build time instead of as a broken page.
{
  const seen = new Set<string>();
  for (const t of templates) {
    if (seen.has(t.slug)) throw new Error(`Duplicate template slug "${t.slug}"`);
    seen.add(t.slug);
    if (!getCategory(t.category)) {
      throw new Error(
        `Template "${t.slug}" uses unknown category "${t.category}". Add it to data/categories.ts.`,
      );
    }
  }
}

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(category: string) {
  return templates.filter((t) => t.category === category);
}

export function getFeaturedTemplates() {
  return templates.filter((t) => t.featured);
}

export function toCardData(t: TemplateEntry): TemplateCardData {
  return {
    slug: t.slug,
    name: t.name,
    tagline: t.tagline,
    tags: t.tags,
    thumbnail: t.thumbnail,
    palette: t.palette,
    category: t.category,
    categoryName: getCategory(t.category)?.name ?? t.category,
  };
}

export function countByCategory() {
  return Object.fromEntries(
    categories.map((c) => [c.slug, getTemplatesByCategory(c.slug).length]),
  );
}
