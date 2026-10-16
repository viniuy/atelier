"use client";

import { useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Copies the absolute URL of `path` (e.g. a client-shareable preview link). */
export function CopyLinkButton({
  path,
  label = "Copy client link",
  className,
}: {
  path: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link:", url);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  const Icon = copied ? Check : Link2;
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-line-strong bg-card px-4 py-2.5 text-[14px] font-medium transition-colors hover:border-ink active:scale-[0.98]",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span aria-live="polite">{copied ? "Link copied" : label}</span>
    </button>
  );
}
