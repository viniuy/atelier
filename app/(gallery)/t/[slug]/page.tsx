import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategory } from "@/data/categories";
import { absoluteUrl, contactHref, site } from "@/data/site";
import { getTemplate, getTemplatesByCategory, templates, toCardData } from "@/data/templates";
import { CopyLinkButton } from "@/components/gallery/CopyLinkButton";
import { DevicePreview } from "@/components/gallery/DevicePreview";
import { TemplateCard } from "@/components/gallery/TemplateCard";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/t/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return {
    title: `${t.name}: ${getCategory(t.category)?.name} template`,
    description: t.description,
    openGraph: { images: [t.thumbnail] },
  };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className="text-[15px] leading-relaxed">{children}</dd>
    </div>
  );
}

// `params` sits under a Suspense boundary so client navigations get an
// instant App Shell (Partial Prefetching); the full page still prerenders
// for every value from generateStaticParams.
export default function TemplateDetailPage(props: PageProps<"/t/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[80vh] max-w-6xl px-4 sm:px-6" />}>
      <TemplateDetailPageContent params={props.params} />
    </Suspense>
  );
}

async function TemplateDetailPageContent({ params }: Pick<PageProps<"/t/[slug]">, "params">) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();

  const category = getCategory(t.category);
  const previewPath = `/preview/${t.slug}`;
  const displayUrl = absoluteUrl(previewPath).replace(/^https?:\/\//, "");
  const more = getTemplatesByCategory(t.category).filter((x) => x.slug !== t.slug).map(toCardData);
  const ctaNote = site.contact.method === "messenger" ? "Opens Messenger" : "Opens your email app";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Link
        href={`/c/${t.category}`}
        className="mt-8 inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> {category?.name}
      </Link>

      <header className="mt-8 mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]">{t.name}</h1>
          <p className="mt-3 text-[17px] text-muted">{t.tagline}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <CopyLinkButton path={previewPath} />
          <a
            href={contactHref(t)}
            target="_blank"
            rel="noopener noreferrer"
            title={`${ctaNote} with this template prefilled`}
            className="inline-flex items-center rounded-md bg-ink px-5 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-ink-2"
          >
            I like this one
          </a>
        </div>
      </header>

      <DevicePreview previewPath={previewPath} displayUrl={displayUrl} title={`${t.name} live preview`} />

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <dl>
          <Row label="About">{t.description}</Row>
          <Row label="Best for">
            <ul className="space-y-1">
              {t.bestFor.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Row>
          <Row label="Included">
            <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {t.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Row>
          <Row label="Typefaces">
            {t.fonts.heading}
            {t.fonts.body !== t.fonts.heading && <> / {t.fonts.body}</>}
            {t.fonts.accent && <> / {t.fonts.accent}</>}
          </Row>
          <Row label="Palette">
            <ul className="flex flex-wrap gap-x-5 gap-y-3">
              {Object.entries(t.palette).map(([name, hex]) => (
                <li key={name} className="flex items-center gap-2 text-[13px]">
                  <span className="size-4 rounded-sm border border-black/10" style={{ backgroundColor: hex }} aria-hidden="true" />
                  <span className="text-muted">{name}</span>
                  <span className="font-mono text-[12px] text-muted uppercase">{hex}</span>
                </li>
              ))}
            </ul>
          </Row>
          <Row label="Style">{t.tags.join(", ")}</Row>
        </dl>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-card p-6">
            <h2 className="font-medium">Want this one?</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              We rebuild it with your business name, services, prices and photos.
            </p>
            <a
              href={contactHref(t)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink-2"
            >
              I like this one
            </a>
            <p className="mt-2 text-center text-[12px] text-muted">{ctaNote} with this template prefilled</p>
            <CopyLinkButton path={previewPath} className="mt-4 w-full" />
            <a
              href={previewPath}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              Open full screen
            </a>
          </div>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="mt-24 border-t border-line pt-14" aria-labelledby="more">
          <h2 id="more" className="text-[22px] font-semibold tracking-[-0.02em]">
            Other {category?.name} templates
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}>
                <TemplateCard template={m} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
