import Link from "next/link";
import { categories } from "@/data/categories";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-[14px] sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-xs">
          <p className="text-[17px] font-semibold tracking-[-0.02em]">{site.name}</p>
          <p className="mt-3 leading-relaxed text-muted">{site.description}</p>
        </div>
        <div>
          <h2 className="font-medium">Industries</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-muted md:grid-cols-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} className="transition-colors hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-medium">Contact</h2>
          <ul className="mt-4 space-y-2 text-muted">
            <li>
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-ink">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`https://m.me/${site.contact.messenger}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                Messenger
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-[13px] text-muted sm:px-6">
          © {site.studio}. Businesses, prices and reviews inside the templates are sample content.
        </p>
      </div>
    </footer>
  );
}
