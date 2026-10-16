import { Menu, Phone, X } from "lucide-react";
import type { DispatchContent } from "../content";

const nav = [
  { href: "#services", label: "Our Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#plan", label: "Maintenance Plan" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "Support" },
];

export function Logo({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <span className={`text-[2rem] leading-none font-bold tracking-[-0.04em] ${light ? "text-white" : "text-(--c-bright)"}`}>
      {name.toLowerCase()}
      <span className="text-(--c-amber)">.</span>
    </span>
  );
}

export function Header({ c, tel }: { c: DispatchContent; tel: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-8 px-5">
        <a href="#top" aria-label={`${c.business.name} home`}>
          <Logo name={c.business.shortName} />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-7 text-[15px] text-(--c-blue)">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:underline">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <a href={tel} className="hidden items-center gap-2 text-[15px] font-semibold text-(--c-ink) sm:flex">
            <Phone className="size-4 text-(--c-blue)" aria-hidden="true" />
            {c.business.phone.display}
          </a>
          <a
            href={tel}
            className="grid size-11 place-items-center rounded-[3px] text-(--c-blue) sm:hidden"
            aria-label={`Call ${c.business.phone.display}`}
          >
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <a
            href="#book"
            className="hidden rounded-[3px] bg-(--c-blue) px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-(--c-ink) sm:inline-flex"
          >
            Book a Service
          </a>
          <details className="group relative lg:hidden">
            <summary className="flex cursor-pointer items-center gap-2 rounded-[3px] border border-black/10 px-3.5 py-2 text-sm font-semibold text-(--c-ink)">
              <Menu className="size-4 group-open:hidden" aria-hidden="true" />
              <X className="hidden size-4 group-open:block" aria-hidden="true" />
              MENU
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute top-full right-0 mt-2 w-60 rounded-md border border-black/5 bg-white p-2 shadow-lg"
            >
              <ul>
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="block rounded px-3 py-2.5 text-(--c-ink) hover:bg-(--c-mist)">
                      {n.label}
                    </a>
                  </li>
                ))}
                <li className="mt-1 border-t border-black/5 pt-1">
                  <a href="#book" className="block rounded px-3 py-2.5 font-semibold text-(--c-blue) hover:bg-(--c-mist)">
                    Book a Service
                  </a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
