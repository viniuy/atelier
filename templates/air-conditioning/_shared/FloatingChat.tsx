"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { MessengerIcon, ViberIcon, WhatsAppIcon } from "@/templates/_kit/BrandIcons";
import { cn } from "@/lib/utils";

type Links = { messenger: string; viber: string; whatsapp: string };

/**
 * Floating "chat with us" launcher with Messenger / Viber / WhatsApp links.
 * Behavior is shared; every template passes its own classNames so the
 * button looks native to that design.
 */
export function FloatingChat({
  links,
  label = "Chat with us",
  classNames,
}: {
  links: Links;
  label?: string;
  classNames: {
    /** fixed position, e.g. "bottom-5 right-5" */
    position: string;
    launcher: string;
    panel: string;
    item: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const items = [
    { name: "Messenger", href: links.messenger, Icon: MessengerIcon, color: "#0866FF" },
    { name: "Viber", href: links.viber, Icon: ViberIcon, color: "#7360F2" },
    { name: "WhatsApp", href: links.whatsapp, Icon: WhatsAppIcon, color: "#25D366" },
  ];

  return (
    <div ref={root} className={cn("fixed z-50", classNames.position)}>
      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute right-0 bottom-full mb-3 w-56 origin-bottom-right motion-safe:animate-[atelier-pop_.18s_ease-out]",
          classNames.panel,
        )}
      >
        <p className="sr-only">Message us on</p>
        <ul className="space-y-1">
          {items.map(({ name, href, Icon, color }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("flex items-center gap-3", classNames.item)}
              >
                <span style={{ color }} className="shrink-0">
                  <Icon className="size-7" />
                </span>
                <span>{name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={cn("grid place-items-center transition-transform active:scale-95", classNames.launcher)}
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <MessageCircle className="size-6" aria-hidden="true" />}
        <span className="sr-only">{open ? "Close chat options" : label}</span>
      </button>
    </div>
  );
}
