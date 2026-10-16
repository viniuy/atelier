import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/gallery/Providers";
import { SiteHeader } from "@/components/gallery/SiteHeader";
import { SiteFooter } from "@/components/gallery/SiteFooter";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${geist.variable} ${geistMono.variable} flex min-h-dvh flex-col bg-paper font-sans text-ink selection:bg-ink selection:text-paper [&_:focus-visible]:outline-ink`}
    >
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-ink px-4 py-2 text-sm text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Providers>
        <SiteHeader />
        <main id="main" className="flex-1 pb-32 has-[#process]:pb-0">
          {children}
        </main>
        <SiteFooter />
      </Providers>
    </div>
  );
}
