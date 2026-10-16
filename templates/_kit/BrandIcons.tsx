/**
 * Simplified brand glyphs (lucide doesn't ship brand marks). They're
 * placeholders; swap for official assets when building a client site.
 */
type P = { className?: string };

export function MessengerIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.14 7.17.16.15.26.35.27.57l.05 1.78a.8.8 0 0 0 1.12.71l1.98-.87a.8.8 0 0 1 .53-.04c.91.25 1.88.38 2.91.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2Z"
      />
      <path fill="var(--icon-contrast, #fff)" d="m6 14.54 2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63l-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63Z" />
    </svg>
  );
}

export function ViberIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C7.5 2 3.5 3.6 3.5 10.2v1.6c0 4.2 1.8 6.3 4.4 7.2v2.4c0 .6.7.9 1.1.5l2.2-2.3h.8c4.5 0 8.5-1.6 8.5-8.2v-1.2C20.5 3.6 16.5 2 12 2Z"
      />
      <path
        fill="var(--icon-contrast, #fff)"
        d="M9.3 6.9c.3-.1.6 0 .8.2l1 1.4c.2.3.2.7-.1 1l-.5.4c.4 1 1.2 1.8 2.2 2.3l.4-.5c.3-.3.7-.3 1-.1l1.4 1c.3.2.3.6.2.9-.4.9-1.2 1.4-2.1 1.2-2.6-.6-4.6-2.6-5.2-5.2-.2-.9.3-1.8.9-2.6Z"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"
      />
      <path
        fill="var(--icon-contrast, #fff)"
        d="M8.6 7.2c.2-.2.5-.2.7 0l1.1 1.6c.2.3.1.6-.1.9l-.5.5c.6 1.3 1.6 2.3 2.9 2.9l.5-.5c.3-.2.6-.3.9-.1l1.6 1.1c.2.2.3.5.1.8-.5.9-1.5 1.4-2.5 1.1-2.6-.7-4.6-2.7-5.3-5.3-.2-1 .2-2.1.6-3Z"
      />
    </svg>
  );
}

export function FacebookIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.5 21.9v-7.4H16l.4-3h-2.9V9.6c0-.9.3-1.5 1.5-1.5h1.5V5.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.3H8v3h2.6v7.4A10 10 0 1 1 13.5 21.9Z"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.6 2c.3 2.3 1.7 3.8 4 4v3.1c-1.4.1-2.8-.3-4-1.1v6.6A6.4 6.4 0 1 1 10 8.3v3.2a3.2 3.2 0 1 0 3.3 3.2V2h3.3Z"
      />
    </svg>
  );
}
