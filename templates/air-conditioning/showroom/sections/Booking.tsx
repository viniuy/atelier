"use client";

import { Loader2 } from "lucide-react";
import { useBookingForm, type BookingField } from "../../_shared/useBookingForm";
import type { ShowroomContent } from "../content";
import { D, pillSolid } from "./Top";

const input =
  "mt-2 block w-full rounded-lg border border-(--c-line) bg-white px-4 py-3.5 text-[1rem] text-(--c-black) placeholder:text-(--c-gray) focus:border-(--c-black) focus:outline-none aria-invalid:border-[#C4161C]";

export function Booking({ c, tel }: { c: ShowroomContent; tel: string }) {
  const form = useBookingForm();

  const label = (name: BookingField, text: string) => (
    <label htmlFor={form.labelFor(name)} className="text-[0.9rem] font-bold">
      {text}
    </label>
  );
  const error = (name: BookingField) =>
    form.errors[name] ? (
      <p id={form.errorId(name)} className="mt-1.5 text-[0.85rem] text-[#C4161C]">
        {form.errors[name]}
      </p>
    ) : null;

  return (
    <section id="book" className="scroll-mt-24 border-t border-(--c-line) py-20" aria-labelledby="sr-book">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="sr-book" className={`${D} text-[2rem] font-bold tracking-[-0.02em] md:text-[2.5rem]`}>
            Book a service
          </h2>
          <p className="mt-4 max-w-md text-[1.05rem] text-(--c-ink)">
            Installation, cleaning or repair. Tell us when, and we&rsquo;ll confirm the schedule and price by text.
          </p>
          <dl className="mt-10 space-y-5 text-[0.95rem]">
            <div>
              <dt className="text-(--c-gray)">Call or text</dt>
              <dd>
                <a href={tel} className="text-[1.3rem] font-bold hover:underline">
                  {c.business.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-(--c-gray)">Showroom</dt>
              <dd>
                {c.business.address.street}, {c.business.address.city}
              </dd>
            </div>
            {c.business.hours.map((h) => (
              <div key={h.days}>
                <dt className="text-(--c-gray)">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-(--c-tile) p-6 sm:p-10">
          {form.status === "success" && form.result ? (
            <div className="py-12" role="status">
              <p className="text-[0.9rem] text-(--c-gray)">Request {form.result.reference}</p>
              <h3 className={`${D} mt-2 text-[2rem] font-bold`}>We got it, {form.result.values.name.split(" ")[0]}.</h3>
              <p className="mt-4 max-w-md text-(--c-ink)">
                We&rsquo;ll text {form.result.values.phone} to confirm your {form.result.values.service.toLowerCase()} on{" "}
                {form.result.values.date}.
              </p>
              <button type="button" onClick={form.reset} className="mt-8 border-b-2 border-current pb-0.5 text-[14px] font-bold">
                Book another
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={form.onSubmit} className="grid gap-6 sm:grid-cols-2">
              <div>
                {label("name", "Name")}
                <input {...form.field("name")} type="text" autoComplete="name" className={input} />
                {error("name")}
              </div>
              <div>
                {label("phone", "Mobile number")}
                <input {...form.field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="09XX XXX XXXX" className={input} />
                {error("phone")}
              </div>
              <div className="sm:col-span-2">
                {label("address", "Address")}
                <input {...form.field("address")} type="text" autoComplete="street-address" className={input} />
                {error("address")}
              </div>
              <div>
                {label("service", "Service")}
                <select {...form.field("service")} defaultValue="" className={input}>
                  <option value="" disabled>
                    Select
                  </option>
                  {c.services.map((s) => (
                    <option key={s.kind} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Unit purchase + installation">Unit purchase + installation</option>
                </select>
                {error("service")}
              </div>
              <div>
                {label("date", "Preferred date")}
                <input {...form.field("date")} type="date" className={input} />
                {error("date")}
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button type="submit" disabled={form.status === "submitting"} className={`${pillSolid} gap-2 px-8 py-3 text-[15px] disabled:opacity-60`}>
                  {form.status === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                  {form.status === "submitting" ? "Sending" : "Request booking"}
                </button>
                <p className="text-[0.8rem] text-(--c-gray)">We only use your number for this booking.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
