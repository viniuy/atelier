"use client";

import { CircleCheck, Loader2, Phone } from "lucide-react";
import { useBookingForm, type BookingField } from "../../_shared/useBookingForm";
import type { ContractorContent } from "../content";
import { H } from "./Top";

const input =
  "mt-1.5 block w-full rounded-md border-2 border-(--c-cloud) bg-(--c-cloud) px-4 py-3 text-(--c-ink) placeholder:text-(--c-ink)/45 focus:border-(--c-royal) focus:bg-white focus:outline-none aria-invalid:border-[#C53030]";

export function Booking({ c }: { c: ContractorContent }) {
  const form = useBookingForm();

  const label = (name: BookingField, text: string) => (
    <label htmlFor={form.labelFor(name)} className="text-[0.95rem] font-bold text-(--c-navy)">
      {text}
    </label>
  );
  const error = (name: BookingField) =>
    form.errors[name] ? (
      <p id={form.errorId(name)} className="mt-1 text-[0.9rem] text-[#C53030]">
        {form.errors[name]}
      </p>
    ) : null;

  return (
    <section id="inquire" className="scroll-mt-28 bg-(--c-cloud) py-20" aria-labelledby="ct-inquire">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 id="ct-inquire" className={`${H} text-[clamp(2.2rem,5vw,3.4rem)] leading-none text-(--c-navy)`}>
            Inquire Now
          </h2>
          <p className="mt-5 text-[1.1rem] leading-relaxed text-(--c-ink)">
            Send your inquiry and our office will call you back to schedule an inspection or service.
          </p>
          <ul className="mt-8 space-y-3">
            {c.lines.map((l) => (
              <li key={l.label}>
                <a href={l.tel} className="flex items-center gap-3 text-[1.15rem] font-bold text-(--c-navy) hover:text-(--c-royal)">
                  <Phone className="size-5 text-(--c-royal)" aria-hidden="true" />
                  <span className="w-20 text-[0.9rem] font-semibold text-(--c-ink)">{l.label}</span>
                  {l.display}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 shadow-[0_2px_12px_rgb(6_34_96/0.1)] sm:p-8">
          {form.status === "success" && form.result ? (
            <div className="py-10 text-center" role="status">
              <CircleCheck className="mx-auto size-14 text-(--c-royal)" strokeWidth={1.5} aria-hidden="true" />
              <h3 className={`${H} mt-5 text-[1.8rem] text-(--c-navy)`}>Inquiry Received</h3>
              <p className="mx-auto mt-3 max-w-sm text-(--c-ink)">
                Thank you, {form.result.values.name.split(" ")[0]}. We will call {form.result.values.phone} within 30 minutes
                during office hours.
              </p>
              <p className="mt-5 text-[0.95rem] text-(--c-ink)">
                Reference no. <strong className="text-(--c-navy)">{form.result.reference}</strong>
              </p>
              <button type="button" onClick={form.reset} className="mt-6 font-bold text-(--c-royal) underline">
                Send another inquiry
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={form.onSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                {label("name", "Name *")}
                <input {...form.field("name")} type="text" autoComplete="name" className={input} />
                {error("name")}
              </div>
              <div>
                {label("phone", "Mobile No. *")}
                <input {...form.field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="09XX XXX XXXX" className={input} />
                {error("phone")}
              </div>
              <div className="sm:col-span-2">
                {label("address", "Address *")}
                <input {...form.field("address")} type="text" autoComplete="street-address" placeholder="Street, barangay, city" className={input} />
                {error("address")}
              </div>
              <div>
                {label("service", "Service *")}
                <select {...form.field("service")} defaultValue="" className={input}>
                  <option value="" disabled>
                    Select service
                  </option>
                  {c.services.map((s) => (
                    <option key={s.kind} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Supply and installation quotation">Supply and installation quotation</option>
                </select>
                {error("service")}
              </div>
              <div>
                {label("date", "Preferred Date *")}
                <input {...form.field("date")} type="date" className={input} />
                {error("date")}
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={form.status === "submitting"}
                  className={`${H} inline-flex w-full items-center justify-center gap-2 rounded-md bg-(--c-royal) px-6 py-4 tracking-[0.08em] text-white hover:bg-(--c-navy) disabled:opacity-70`}
                >
                  {form.status === "submitting" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Sending
                    </>
                  ) : (
                    "Submit Inquiry"
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
