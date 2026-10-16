import type { TemplateMeta } from "@/lib/types";
import { cn, paletteVars } from "@/lib/utils";

/**
 * Outermost element of every template. Exposes the meta palette as
 * --c-<name> CSS variables so templates style from `meta.ts` colors.
 */
export function TemplateRoot({
  meta,
  className,
  children,
}: {
  meta: Pick<TemplateMeta, "palette">;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={paletteVars(meta.palette)} className={cn("min-h-dvh overflow-x-clip", className)}>
      {children}
    </div>
  );
}
