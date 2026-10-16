"use client";

import { useId, useRef, useState, type FocusEvent, type FormEvent } from "react";

export type BookingField = "name" | "phone" | "address" | "service" | "date";
export type BookingStatus = "idle" | "submitting" | "success";
export type BookingValues = Record<BookingField, string>;

/** 09171234567, 0917 123 4567, +63 917-123-4567, 639171234567 */
const PH_MOBILE = /^(?:\+?63|0)9\d{9}$/;

function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function validate(v: BookingValues) {
  const errors: Partial<Record<BookingField, string>> = {};
  if (v.name.length < 2) errors.name = "Please enter your name.";
  if (!PH_MOBILE.test(v.phone.replace(/[\s-]/g, "")))
    errors.phone = "Enter a valid PH mobile number, e.g. 0917 123 4567.";
  if (v.address.length < 5) errors.address = "Please enter your address or barangay.";
  if (!v.service) errors.service = "Please choose a service.";
  if (!v.date) errors.date = "Please pick a preferred date.";
  else if (v.date < todayISO()) errors.date = "Please pick today or a later date.";
  return errors;
}

/**
 * Front-end-only booking form state. Validates, fakes a network request,
 * then shows a success state with a reference number. Each template renders
 * its own markup and spreads `field(name)` onto every control.
 */
export function useBookingForm() {
  const id = useId();
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [errors, setErrors] = useState<Partial<Record<BookingField, string>>>({});
  const [result, setResult] = useState<{ reference: string; values: BookingValues } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(
      (["name", "phone", "address", "service", "date"] as const).map((k) => [
        k,
        String(data.get(k) ?? "").trim(),
      ]),
    ) as BookingValues;

    const next = validate(values);
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const reference = `AC-${Math.floor(10000 + Math.random() * 90000)}`;
      setResult({ reference, values });
      setStatus("success");
    }, 1200);
  }

  function reset() {
    setStatus("idle");
    setErrors({});
    setResult(null);
  }

  /** Spread onto an input/select: id, name, aria-invalid, aria-describedby. */
  function field(name: BookingField) {
    const invalid = Boolean(errors[name]);
    return {
      id: `${id}-${name}`,
      name,
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `${id}-${name}-error` : undefined,
      ...(name === "date"
        ? {
            // Set `min` lazily so the prerendered HTML doesn't bake in the build date.
            onFocus: (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
              (e.currentTarget as HTMLInputElement).min = todayISO();
            },
          }
        : {}),
    };
  }

  return {
    status,
    errors,
    result,
    onSubmit,
    reset,
    field,
    /** id for the <label htmlFor> of a field */
    labelFor: (name: BookingField) => `${id}-${name}`,
    /** id for a field's error message element */
    errorId: (name: BookingField) => `${id}-${name}-error`,
  };
}
