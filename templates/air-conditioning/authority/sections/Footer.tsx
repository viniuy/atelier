"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/templates/_kit/BrandIcons";
import type { contactLinks } from "../../_shared/links";
import type { AuthorityContent } from "../content";
import { AirLines, Arrow, L } from "../ui";
import { Wordmark } from "./Top";

type Links = ReturnType<typeof contactLinks>;

export function Footer({ c, links }: { c: AuthorityContent; links: Links }) {
  const b = c.business;
  const [joined, setJoined] = useState(false);
  const socials = [
    { href: b.socials.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: b.socials.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: b.socials.tiktok, Icon: TikTokIcon, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden pt-20">
      <AirLines className="absolute inset-x-0 top-0 h-72 w-full text-(--c-cyan)/60" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Wordmark name={b.shortName} />
            <p className="mt-6 max-w-xs text-[1.05rem] leading-relaxed text-(--c-navy)">
              {b.name}
              <br />
              {b.address.street}, {b.address.city}, {b.address.province}
            </p>
            <ul className="mt-6 flex gap-5 text-(--c-navy)">
              {socials.map(({ href, Icon, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-(--c-cyan)">
                    <Icon className="size-7" />
                    <span className="sr-only">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ul className="space-y-5 text-[1.05rem] font-medium text-(--c-navy)">
            {[
              ["For Homes", "#homes"],
              ["For Businesses", "#business"],
              ["About", "#why"],
              ["Packages", "#pricing"],
            ].map(([t, h]) => (
              <li key={t}>
                <a href={h} className="hover:text-(--c-cyan)">{t}</a>
              </li>
            ))}
          </ul>
          <ul className="space-y-5 text-[1.05rem] font-medium text-(--c-navy)">
            <li>
              <a href="#book" className="inline-flex items-center gap-1.5 hover:text-(--c-cyan)">
                Book a Home Service <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={links.tel} className="hover:text-(--c-cyan)">{b.landline ?? b.phone.display}</a>
            </li>
            <li>
              <a href={links.email} className="hover:text-(--c-cyan)">{b.email}</a>
            </li>
            {b.hours.map((h) => (
              <li key={h.days} className="font-normal">
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid items-center gap-8 border-t border-(--c-cyan)/50 py-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-[2.2rem] font-light text-(--c-navy)">{c.newsletter.title}</h2>
            <p className="mt-2 text-[1.05rem] text-(--c-ink)">{c.newsletter.body}</p>
          </div>
          {joined ? (
            <p className="text-[1.1rem] text-(--c-navy)" role="status">
              You&rsquo;re on the list. Salamat!
            </p>
          ) : (
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setJoined(true);
              }}
            >
              <label htmlFor="au-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="au-newsletter"
                type="email"
                required
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-full border border-(--c-navy)/20 px-6 py-4 text-[1.05rem] focus:border-(--c-cyan) focus:outline-none"
              />
              <button
                type="submit"
                className={`${L} inline-flex items-center justify-center gap-2.5 rounded-full bg-(--c-navy) px-9 py-4 text-[1.1rem] font-medium text-white hover:bg-(--c-cyan)`}
              >
                Subscribe <Arrow />
              </button>
            </form>
          )}
        </div>

        <p className={`${L} flex flex-wrap gap-x-6 gap-y-2 pb-10 text-[1.05rem] text-(--c-navy)`}>
          <span>© {b.name}. All rights reserved.</span>
          <a href="#faq" className="hover:underline">Privacy Notice</a>
          <a href="#faq" className="hover:underline">Terms and Conditions</a>
        </p>
      </div>
      <div className="h-6 bg-(--c-navy)" />
    </footer>
  );
}
