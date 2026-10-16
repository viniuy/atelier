import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTemplate, templates } from "@/data/templates";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/preview/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  // Standalone previews are for sharing with clients, not for search engines.
  return { title: { absolute: `${t.name} preview` }, robots: { index: false, follow: false } };
}

/** The template rendered on its own, with no gallery chrome. Safe to send to clients. */
// `params` sits under a Suspense boundary so client navigations get an
// instant App Shell (Partial Prefetching); the full page still prerenders
// for every value from generateStaticParams.
export default function PreviewPage(props: PageProps<"/preview/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <PreviewPageContent params={props.params} />
    </Suspense>
  );
}

async function PreviewPageContent({ params }: Pick<PageProps<"/preview/[slug]">, "params">) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();

  const { default: Template } = await t.load();
  return <Template />;
}
