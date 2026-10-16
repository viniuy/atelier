import type { Metadata } from "next";
import { getInspiration, getWork } from "@/data/showcase";
import { SiteCard } from "@/components/gallery/SiteCard";

export const metadata: Metadata = {
  title: "Real sites",
  description: "Live client websites and the real sites our templates take their cues from.",
};

export default function SitesPage() {
  const work = getWork();
  const inspiration = getInspiration();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="mt-16 mb-14 max-w-2xl md:mt-24">
        <h1 className="text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]">Real sites</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Websites that are live today: ones we built for clients, and the real businesses whose sites shaped our
          templates.
        </p>
      </header>

      {(work.length > 0 || process.env.NODE_ENV === "development") && (
        <section aria-labelledby="work" className="border-t border-line pt-12 pb-16">
          <h2 id="work" className="mb-10 text-[22px] font-semibold tracking-[-0.02em]">
            Client work <span className="font-normal text-muted">{work.length}</span>
          </h2>
          {work.length > 0 ? (
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {work.map((s) => (
                <li key={s.slug}>
                  <SiteCard site={s} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-md text-[14px] leading-relaxed text-muted">
              No client sites yet. Add them in <code className="font-mono text-ink">data/showcase.ts</code> with{" "}
              <code className="font-mono text-ink">kind: &quot;work&quot;</code>. This note only shows in development.
            </p>
          )}
        </section>
      )}

      {inspiration.length > 0 && (
        <section aria-labelledby="inspiration" className="border-t border-line pt-12">
          <div className="mb-10 max-w-2xl">
            <h2 id="inspiration" className="text-[22px] font-semibold tracking-[-0.02em]">
              Inspiration <span className="font-normal text-muted">{inspiration.length}</span>
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              Sites by other businesses that we studied for layout and structure. We didn&rsquo;t build these; each
              links to the original.
            </p>
          </div>
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {inspiration.map((s) => (
              <li key={s.slug}>
                <SiteCard site={s} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
