import Link from "next/link";
import { site } from "@/data/site";

const links = [
  { href: "/#templates", label: "Templates" },
  { href: "/#industries", label: "Industries" },
  { href: "/#process", label: "Process" },
];

export function contactUrl() {
  return site.contact.method === "messenger"
    ? `https://m.me/${site.contact.messenger}`
    : `mailto:${site.contact.email}`;
}

/** Plain sticky bar: wordmark, three anchors, one contact link. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="text-[17px] font-semibold tracking-[-0.02em]" aria-label={`${site.name} home`}>
          {site.name}
        </Link>
        <nav aria-label="Primary" className="ml-auto hidden sm:block">
          <ul className="flex items-center gap-7 text-[14px] text-muted">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={contactUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
