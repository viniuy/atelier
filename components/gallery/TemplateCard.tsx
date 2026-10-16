import Image from "next/image";
import Link from "next/link";
import type { TemplateCardData } from "@/lib/types";

/** A template thumbnail with its name underneath. The screenshot does the talking. */
export function TemplateCard({
  template: t,
  eager = false,
  showCategory = false,
  sizes = "(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw",
}: {
  template: TemplateCardData;
  eager?: boolean;
  showCategory?: boolean;
  sizes?: string;
}) {
  return (
    <article className="group">
      <Link href={`/t/${t.slug}`} prefetch className="block rounded-xl outline-offset-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-paper-2">
          <Image
            src={t.thumbnail}
            alt=""
            fill
            sizes={sizes}
            className="object-cover object-top transition-transform duration-700 ease-(--ease-out-quart) group-hover:scale-[1.015]"
            loading={eager ? "eager" : "lazy"}
          />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-[17px] font-medium tracking-[-0.01em] underline-offset-4 group-hover:underline">
            {t.name}
          </h3>
          {showCategory && <p className="shrink-0 text-[13px] text-muted">{t.categoryName}</p>}
        </div>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">{t.tagline}</p>
      </Link>
    </article>
  );
}
