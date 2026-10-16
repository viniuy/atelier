"use client";

import { CircleCheck, Loader2 } from "lucide-react";
import { useBookingForm, type BookingField } from "../../_shared/useBookingForm";
import type { AuthorityContent } from "../content";
import { Arrow, L, Title } from "../ui";

const input =
  "mt-2 block w-full rounded-full border border-(--c-navy)/20 bg-white px-6 py-4 text-[1.05rem] text-(--c-navy) placeholder:text-(--c-ink)/50 focus:border-(--c-cyan) focus:ring-2 focus:ring-(--c-cyan)/20 focus:outline-none aria-invalid:border-[#C53030]";

export function Booking({ c, tel }: { c: AuthorityContent; tel: string }) {
  const form = useBookingForm();

  const label = (name: BookingField, text: string) => (
    <label htmlFor={form.labelFor(name)} className={`${L} pl-6 text-[1rem] font-medium text-(--c-ink)`}>
      {text}
    </label>
  );
  const error = (name: BookingField) =>
    form.errors[name] ? (
      <p id={form.errorId(name)} className="mt-1.5 pl-6 text-[0.9rem] text-[#C53030]">
        {form.errors[name]}
      </p>
    ) : null;

  return (
    <section id="book" className="scroll-mt-24 bg-(--c-mist) py-24" aria-labelledby="au-book">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Title id="au-book" label="Book a service" title={c.finalCta.headline} />
          <p className="mt-6 max-w-md text-[1.15rem] leading-relaxed text-(--c-ink)">{c.finalCta.subheadline}</p>
          <p className="mt-10 text-(--c-ink)">Prefer to call?</p>
          <a href={tel} className="mt-1 block text-[2rem] font-light text-(--c-navy) hover:text-(--c-cyan)">
            {c.business.landline ?? c.business.phone.display}
          </a>
          {c.business.landline && <p className="text-(--c-ink)">Mobile {c.business.phone.display}</p>}
        </div>

        <div className="bg-white p-6 sm:p-10">
          {form.status === "success" && form.result ? (
            <div className="py-10" role="status">
              <CircleCheck className="size-14 text-(--c-cyan)" strokeWidth={1.25} aria-hidden="true" />
              <h3 className="mt-6 text-[2.2rem] leading-tight font-light text-(--c-navy)">Thank you, {form.result.values.name.split(" ")[0]}.</h3>
              <p className="mt-4 max-w-md text-[1.1rem] text-(--c-ink)">
                Your request <strong className="font-medium text-(--c-navy)">{form.result.reference}</strong> is in. Our customer
                care team will call {form.result.values.phone} within one business day.
              </p>
              <button type="button" onClick={form.reset} className="mt-8 font-medium text-(--c-navy) underline underline-offset-4">
                Book another service
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={form.onSubmit} className="grid gap-6 sm:grid-cols-2">
              <div>
                {label("name", "Full name")}
                <input {...form.field("name")} type="text" autoComplete="name" className={input} />
                {error("name")}
              </div>
              <div>
                {label("phone", "Mobile number")}
                <input {...form.field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" className={input} />
                {error("phone")}
              </div>
              <div className="sm:col-span-2">
                {label("address", "Service address")}
                <input {...form.field("address")} type="text" autoComplete="street-address" className={input} />
                {error("address")}
              </div>
              <div>
                {label("service", "Service")}
                <select {...form.field("service")} defaultValue="" className={input}>
                  <option value="" disabled>
                    Select a service
                  </option>
                  {c.services.map((s) => (
                    <option key={s.kind} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Commercial consultation">Commercial consultation</option>
                </select>
                {error("service")}
              </div>
              <div>
                {label("date", "Preferred date")}
                <input {...form.field("date")} type="date" className={input} />
                {error("date")}
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={form.status === "submitting"}
                  className={`${L} inline-flex items-center gap-2.5 rounded-full bg-(--c-navy) px-9 py-4 text-[1.1rem] font-medium text-white transition-colors hover:bg-(--c-cyan) disabled:opacity-60`}
                >
                  {form.status === "submitting" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Sending
                    </>
                  ) : (
                    <>
                      Book an appointment <Arrow />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
