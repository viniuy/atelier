"use client";

import { useState } from "react";
import { Home, Mail, Phone, Smartphone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/templates/_kit/BrandIcons";
import type { contactLinks } from "../../_shared/links";
import type { ContractorContent } from "../content";
import { H, Logo } from "./Top";

type Links = ReturnType<typeof contactLinks>;

export function FinalCta({ c, tel }: { c: ContractorContent; tel: string }) {
  return (
    <section className="bg-(--c-navy) py-14 text-white" aria-labelledby="ct-final">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:text-left">
        <div>
          <h2 id="ct-final" className={`${H} text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight`}>
            {c.finalCta.headline}
          </h2>
          <p className="mt-2 text-white/85">{c.finalCta.subheadline}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={tel} className={`${H} rounded-md bg-white px-7 py-4 tracking-[0.08em] text-(--c-navy) hover:bg-(--c-cloud)`}>
            Call Now
          </a>
          <a href="#inquire" className={`${H} rounded-md border-2 border-white px-7 py-4 tracking-[0.08em] hover:bg-white hover:text-(--c-navy)`}>
            Inquire Now
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer({ c, links }: { c: ContractorContent; links: Links }) {
  const b = c.business;
  const [joined, setJoined] = useState(false);
  const mobiles = c.lines.filter((l) => l.label !== "Landline");
  const landline = c.lines.find((l) => l.label === "Landline");

  return (
    <footer>
      <div className="bg-linear-to-br from-(--c-royal) to-(--c-navy) py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1.5fr_1fr]">
          <div>
            <Logo c={c} light />
            <h2 className={`${H} mt-10 text-[1.5rem]`}>Contact Us</h2>
            <ul className="mt-5 space-y-4 text-[1.05rem]">
              <li className="flex gap-3">
                <Home className="size-6 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                {b.address.street}, {b.address.city}, {b.address.province}, Philippines
              </li>
              <li className="flex gap-3">
                <Mail className="size-6 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                <a href={links.email} className="hover:underline">{b.email}</a>
              </li>
              {landline && (
                <li className="flex gap-3">
                  <Phone className="size-6 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                  <a href={landline.tel} className="underline">{landline.display}</a>
                </li>
              )}
              <li className="flex gap-3">
                <Smartphone className="size-6 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                <span>
                  {mobiles.map((m, i) => (
                    <span key={m.label}>
                      {i > 0 && " / "}
                      <a href={m.tel} className="hover:underline">{m.display}</a>
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
          <div className="md:pt-24">
            <h2 className={`${H} text-[1.5rem]`}>Inquire Now</h2>
            {joined ? (
              <p className="mt-5" role="status">Thanks! We&rsquo;ll email you shortly.</p>
            ) : (
              <form
                className="mt-5 flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  setJoined(true);
                }}
              >
                <label htmlFor="ct-email" className="sr-only">Email</label>
                <input
                  id="ct-email"
                  type="email"
                  required
                  placeholder="Enter your email here*"
                  className="min-w-0 flex-1 border-2 border-(--c-sky) bg-transparent px-4 py-2.5 font-bold text-white placeholder:text-white/80 focus:bg-white/10 focus:outline-none"
                />
                <button type="submit" className="bg-(--c-sky) px-6 font-bold text-(--c-navy) hover:bg-white">
                  Join
                </button>
              </form>
            )}
            <ul className="mt-10 flex gap-3">
              {b.socials.facebook && (
                <li>
                  <a href={b.socials.facebook} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full bg-white text-(--c-navy)" aria-label="Facebook">
                    <FacebookIcon className="size-6" />
                  </a>
                </li>
              )}
              {b.socials.instagram && (
                <li>
                  <a href={b.socials.instagram} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full bg-white text-(--c-navy)" aria-label="Instagram">
                    <InstagramIcon className="size-5" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <p className="bg-white py-3 text-center text-[0.9rem] text-(--c-navy)">
        © {b.name}. Serving Metro Manila since {b.since}.
      </p>
    </footer>
  );
}
