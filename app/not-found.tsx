import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6 text-ink">
      <div className="max-w-md">
        <p className="font-mono text-[13px] text-muted">404</p>
        <h1 className="mt-3 text-[2rem] leading-tight font-semibold tracking-[-0.03em]">
          That page isn&rsquo;t in the gallery.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink-2"
        >
          Back to all templates
        </Link>
      </div>
    </main>
  );
}
