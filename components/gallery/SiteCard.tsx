import Image from "next/image";
import Link from "next/link";
import type { ShowcaseSite } from "@/lib/types";

export function hostOf(url: string) {
  return new URL(url).host.replace(/^www\./, "");
}

/** A real site: screenshot in a slim browser frame, name, domain and label. */
export function SiteCard({ site, sizes = "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" }: { site: ShowcaseSite; sizes?: string }) {
  return (
    <article className="group">
      <Link href={`/sites/${site.slug}`} prefetch className="block rounded-xl outline-offset-4">
        <div className="overflow-hidden rounded-xl border border-line bg-card">
          <div className="flex h-7 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="size-2 rounded-full bg-line-strong" />
            <span className="ml-2 truncate font-mono text-[11px] text-muted">{hostOf(site.url)}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
            <Image
              src={site.screenshot}
              alt=""
              fill
              sizes={sizes}
              className="object-cover object-top transition-transform duration-700 ease-(--ease-out-quart) group-hover:scale-[1.015]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-[17px] font-medium tracking-[-0.01em] underline-offset-4 group-hover:underline">{site.name}</h3>
          <p className="shrink-0 text-[13px] text-muted">{site.kind === "work" ? (site.year ?? "Client work") : "Inspiration"}</p>
        </div>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">{site.summary}</p>
      </Link>
    </article>
  );
}
