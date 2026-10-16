import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { categories, getCategory } from "@/data/categories";
import { getTemplatesByCategory, toCardData } from "@/data/templates";
import { contactHrefForCategory } from "@/data/site";
import { TemplateGrid } from "@/components/gallery/TemplateGrid";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/c/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return { title: `${c.name} website templates`, description: c.description };
}

// `params` sits under a Suspense boundary so client navigations get an
// instant App Shell (Partial Prefetching); the full page still prerenders
// for every value from generateStaticParams.
export default function CategoryPage(props: PageProps<"/c/[category]">) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[60vh] max-w-6xl px-4 sm:px-6" />}>
      <CategoryPageContent params={props.params} />
    </Suspense>
  );
}

async function CategoryPageContent({ params }: Pick<PageProps<"/c/[category]">, "params">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = getTemplatesByCategory(slug).map(toCardData);
  const live = category.status === "live" && items.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Link
        href="/#industries"
        className="mt-8 inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> All industries
      </Link>

      <header className="mt-8 mb-12 max-w-2xl">
        <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
          {category.name}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{category.description}</p>
      </header>

      {live ? (
        <TemplateGrid items={items} />
      ) : (
        <div className="border-t border-line pt-12">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Not ready yet.</h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            {category.name} templates are still being designed. If you need a {category.name.toLowerCase()} site now,
            we can design one from scratch or adapt a live template.
          </p>
          <a
            href={contactHrefForCategory(category.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink-2"
          >
            Ask about {category.name}
          </a>
        </div>
      )}
    </div>
  );
}
