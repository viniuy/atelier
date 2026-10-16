"use client";

import { CircleCheck, Loader2, Phone } from "lucide-react";
import { useBookingForm, type BookingField } from "../../_shared/useBookingForm";
import type { DispatchContent } from "../content";

const input =
  "mt-1.5 block w-full rounded-[5px] border border-black/15 bg-white px-4 py-3 text-(--c-ink) placeholder:text-black/40 focus:border-(--c-blue) focus:ring-2 focus:ring-(--c-blue)/20 focus:outline-none aria-invalid:border-red-500";

export function Booking({ c, tel }: { c: DispatchContent; tel: string }) {
  const form = useBookingForm();

  const label = (name: BookingField, text: string) => (
    <label htmlFor={form.labelFor(name)} className="text-sm font-semibold text-(--c-ink)">
      {text}
    </label>
  );
  const error = (name: BookingField) =>
    form.errors[name] ? (
      <p id={form.errorId(name)} className="mt-1 text-sm text-red-600">
        {form.errors[name]}
      </p>
    ) : null;

  return (
    <section id="book" className="scroll-mt-20 py-20" aria-labelledby="dp-book">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[2fr_3fr]">
        <div>
          <h2 id="dp-book" className="text-[2.5rem] leading-tight font-semibold text-black">
            Book a Service
          </h2>
          <p className="mt-4 max-w-sm text-[1.05rem] leading-relaxed text-(--c-ink)/85">
            Tell us your unit and preferred date. We confirm your technician and price by text within 15 minutes.
          </p>
          <ol className="mt-8 space-y-3 text-(--c-ink)">
            {["Submit your request", "Get your technician's name and photo", "Pay after the job is done"].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-(--c-ice) text-sm font-bold text-(--c-blue)">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-(--c-ink)/70">Rather call?</p>
          <a href={tel} className="mt-1 inline-flex items-center gap-2 text-2xl font-bold text-(--c-blue) hover:underline">
            <Phone className="size-5" aria-hidden="true" /> {c.business.phone.display}
          </a>
        </div>

        <div className="rounded-[5px] border border-black/10 bg-white p-6 shadow-[0_2px_10px_rgb(0_0_0/0.06)] sm:p-8">
          {form.status === "success" && form.result ? (
            <div className="py-10 text-center" role="status">
              <CircleCheck className="mx-auto size-14 text-(--c-blue)" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-5 text-2xl font-bold text-black">Booking received</h3>
              <p className="mx-auto mt-3 max-w-sm text-(--c-ink)/85">
                Thanks, {form.result.values.name.split(" ")[0]}! We&rsquo;ll text{" "}
                <strong>{form.result.values.phone}</strong> with your technician&rsquo;s name and arrival window.
              </p>
              <p className="mt-6 inline-block rounded-[3px] bg-(--c-mist) px-4 py-2 text-sm">
                Booking no. <strong className="tabular-nums">{form.result.reference}</strong>
              </p>
              <div>
                <button type="button" onClick={form.reset} className="mt-6 text-sm font-semibold text-(--c-blue) hover:underline">
                  Book another unit
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={form.onSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                {label("name", "Full name")}
                <input {...form.field("name")} type="text" autoComplete="name" placeholder="Juan dela Cruz" className={input} />
                {error("name")}
              </div>
              <div>
                {label("phone", "Mobile number")}
                <input
                  {...form.field("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0917 123 4567"
                  className={input}
                />
                {error("phone")}
              </div>
              <div className="sm:col-span-2">
                {label("address", "Service address")}
                <input
                  {...form.field("address")}
                  type="text"
                  autoComplete="street-address"
                  placeholder="House no., street, barangay, city"
                  className={input}
                />
                {error("address")}
              </div>
              <div>
                {label("service", "Service")}
                <select {...form.field("service")} defaultValue="" className={input}>
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {c.services.map((s) => (
                    <option key={s.kind} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Annual maintenance plan">Annual maintenance plan</option>
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-(--c-blue) px-6 py-4 text-[1.1rem] font-semibold text-white transition-colors hover:bg-(--c-ink) disabled:opacity-70"
                >
                  {form.status === "submitting" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Booking…
                    </>
                  ) : (
                    "Book a Service"
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-(--c-ink)/60">
                  No payment needed now. You pay the technician after the job.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
