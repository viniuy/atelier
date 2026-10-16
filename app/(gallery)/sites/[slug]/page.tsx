import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCategory } from "@/data/categories";
import { contactHrefForCategory } from "@/data/site";
import { getSite, showcase } from "@/data/showcase";
import { getTemplate, toCardData } from "@/data/templates";
import { DevicePreview } from "@/components/gallery/DevicePreview";
import { hostOf } from "@/components/gallery/SiteCard";
import { TemplateCard } from "@/components/gallery/TemplateCard";

export function generateStaticParams() {
  return showcase.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSite(slug);
  if (!s) return {};
  return { title: s.name, description: s.summary };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-[15px] leading-relaxed">{children}</dd>
    </div>
  );
}

// `params` sits under a Suspense boundary for Partial Prefetching; the page
// still prerenders for every slug in data/showcase.ts.
export default function SitePage(props: PageProps<"/sites/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[80vh] max-w-6xl px-4 sm:px-6" />}>
      <SitePageContent params={props.params} />
    </Suspense>
  );
}

async function SitePageContent({ params }: Pick<PageProps<"/sites/[slug]">, "params">) {
  const { slug } = await params;
  const s = getSite(slug);
  if (!s) notFound();

  const host = hostOf(s.url);
  const category = getCategory(s.category);
  const related = s.template ? getTemplate(s.template) : undefined;
  const isWork = s.kind === "work";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Link href="/sites" className="mt-8 inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> Real sites
      </Link>

      <header className="mt-8 mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[14px] text-muted">
            {isWork ? `Client work${s.year ? ` · ${s.year}` : ""}` : "Inspiration · not built by Atelier"}
          </p>
          <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]">{s.name}</h1>
          <p className="mt-3 text-[17px] text-muted">{s.summary}</p>
        </div>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-md bg-ink px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ink-2 md:self-auto"
        >
          Visit {host} <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </header>

      {s.embeddable ? (
        <DevicePreview previewPath={s.url} displayUrl={host} title={`${s.name} live site`} />
      ) : (
        <>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl bg-paper-2 p-3 sm:p-10">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[14px] border border-black/10 bg-card shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)]">
              <div className="flex h-11 items-center gap-4 px-4" aria-hidden="true">
                <span className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-black/15" />
                  <span className="size-3 rounded-full bg-black/15" />
                  <span className="size-3 rounded-full bg-black/15" />
                </span>
                <span className="mx-auto w-full max-w-md truncate rounded-lg bg-black/[0.06] px-3 py-1.5 text-center text-[13px] text-black/55">
                  {host}
                </span>
                <span className="hidden w-[54px] sm:block" />
              </div>
              <div className="relative aspect-[1440/900]">
                <Image
                  src={s.screenshot}
                  alt={`Homepage of ${s.name}`}
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
            <span className="sr-only">Open {host} in a new tab</span>
          </a>
          <p className="mt-3 text-[13px] text-muted">
            Homepage screenshot. This site doesn&rsquo;t allow live previews; click it to open the real site.
          </p>
        </>
      )}

      <dl className="mt-16 max-w-3xl">
        {s.notes && s.notes.length > 0 && (
          <Row label={isWork ? "What we built" : "Worth borrowing"}>
            <ul className="space-y-1">
              {s.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Row>
        )}
        {s.client && <Row label="Client">{s.client}</Row>}
        {category && (
          <Row label="Industry">
            <Link href={`/c/${category.slug}`} className="underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              {category.name}
            </Link>
          </Row>
        )}
      </dl>

      {related ? (
        <section className="mt-20 border-t border-line pt-14" aria-labelledby="related">
          <h2 id="related" className="text-[22px] font-semibold tracking-[-0.02em]">
            {isWork ? "Built from" : "The template it inspired"}
          </h2>
          <div className="mt-10 max-w-xl">
            <TemplateCard template={toCardData(related)} />
          </div>
        </section>
      ) : (
        category && (
          <p className="mt-16 text-[15px] text-muted">
            Want something like this?{" "}
            <a href={contactHrefForCategory(category.name)} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
              Ask us
            </a>
            .
          </p>
        )
      )}
    </div>
  );
}
