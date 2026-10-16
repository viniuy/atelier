# Atelier

A gallery of complete website templates for local businesses, organized by industry. Show prospective clients what their site could look like. When they say "I like this one", build their site from that template.

- **Gallery shell**: quiet, warm monochrome (Geist, hairline rules, black buttons, no glass, no gradients). It stays neutral so the templates carry the color.
- **Templates**: each one is a fully independent design with its own layout, palette, fonts and tone. The four aircon templates are modeled on real Philippine sites (see below).

**Stack:** Next.js 16 (App Router, Cache Components, Partial Prefetching) · TypeScript · Tailwind CSS v4 · Motion · lucide icons. No auth, no database. Everything is config-driven. Deploys to Vercel as-is.

---

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run placeholders` | Creates a placeholder JPG for every image slot that doesn't have a file yet (`--force` regenerates all) |
| `npm run showcase` | Screenshots every real site in `data/showcase.ts` into `public/showcase/<slug>.jpg` (dismisses cookie banners). `npm run showcase -- teko` for one. |
| `npm run thumbnails` | Screenshots every template's `/preview/<slug>` into its `thumbnail.jpg` and `thumbnail-mobile.jpg`. Needs the site running and Chrome or Edge installed. Use `BASE_URL=http://localhost:3123 npm run thumbnails` for another port, or `npm run thumbnails -- dispatch` for one template. |

### Settings you'll want to change

`data/site.ts` controls where the **"I like this one"** button goes:

```ts
contact: {
  method: "messenger",            // or "mailto"
  email: "hello@atelier.example",
  messenger: "atelierwebstudio",  // → https://m.me/atelierwebstudio
  message: (t) => `Hi! I like the "${t.name}" template…`,
}
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://atelier.yourdomain.com`) so shareable links and metadata use your domain. On Vercel it falls back to the production URL automatically.

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Particle "Atelier" hero, industry wheel with that industry's templates as a card deck, real sites, process |
| `/c/[category]` | Filterable grid of a category's templates ("Coming soon" state for empty categories) |
| `/t/[slug]` | Live preview in a Desktop / iPad / iPhone frame, details, palette, fonts, "I like this one" CTA, copy-client-link |
| `/sites` | Real websites: your client work and labelled inspiration |
| `/sites/[slug]` | One real site: screenshot (or live preview if it allows embedding), notes, related template |
| `/preview/[slug]` | The template alone, no gallery chrome. **Send this link to clients.** (`noindex`) |

The detail page previews templates through an iframe of `/preview/[slug]` rendered at the device's real width (1440 / 834 / 393 px). That way the iPad and iPhone toggles trigger the template's own responsive breakpoints instead of shrinking the desktop layout.

---

## Folder structure

```
app/
  layout.tsx                    root html/body + metadata
  globals.css                   Tailwind + gallery design tokens (gallery only)
  (gallery)/                    gallery chrome: header, footer, page fade
    page.tsx                    /
    c/[category]/page.tsx
    t/[slug]/page.tsx
  (standalone)/preview/[slug]/  bare template page
components/
  gallery/                      shell UI (cards, DevicePreview, filters, lists…)
data/
  site.ts                       your contact settings
  categories.ts                 every category (live / coming soon)
  templates.ts                  template registry: one line per template
  showcase.ts                   real websites: client work + inspiration
lib/                            types + helpers (peso formatting, palette → CSS vars)
templates/
  _kit/                         cross-category helpers (TemplateRoot, SlotImage, brand icons)
  air-conditioning/
    _shared/                    ACContent type, defaults, booking-form hook, FloatingChat, links
    dispatch/                   ┐
    showroom/                   │ each: index.tsx, meta.ts, content.ts, fonts.ts,
    authority/                  │       sections/*, optional ui.tsx
    contractor/                 ┘
public/placeholders/<category>/<slug>/<slot>.jpg    ← drop generated images here
scripts/                        placeholders + thumbnails (+ shared browser helper)
```

### Anatomy of a template folder

| File | Role |
| --- | --- |
| `meta.ts` | Gallery info: slug, name, category, tagline, description, tags, **palette**, fonts, bestFor, features, thumbnail(s), **image slots**. Must stay import-free apart from `import type`, because the scripts read it with Node directly. |
| `content.ts` | **The business**: name, phones, address, hours, services and prices, packages, testimonials, FAQ, service areas. Swap this file to build a client's site. |
| `index.tsx` | Default export: the full page. Wraps everything in `<TemplateRoot meta={meta}>`, which exposes each palette entry as a CSS variable (`palette.navy` → `var(--c-navy)`). |
| `fonts.ts` | `next/font/google` fonts, exposed as CSS variables. |
| `sections/*` | The template's own sections. Client components only where needed (booking form, tabs). |

---

## Images (Higgsfield workflow)

Every image a template renders is a **named slot** in its `meta.ts`:

```ts
images: {
  hero: {
    src: "/placeholders/air-conditioning/dispatch/hero.jpg",
    alt: "Uniformed technician servicing a split-type aircon…",
    width: 1200, height: 1400,          // intrinsic size → no layout shift
    prompt: "Filipino HVAC technician in a crisp navy polo…",  // ready for Higgsfield
  },
}
```

1. Generate the image using the slot's `prompt`, at the slot's aspect ratio.
2. Save it over the file at `public/` + `src` with the same name. Keep `width`/`height` in sync if you change the ratio.
3. Re-run `npm run thumbnails` so the gallery cards show the new look.

`npm run placeholders` never overwrites an existing file, so it's safe to run anytime.

---

## How to add a new template

Example: a fifth aircon template called "Coastal".

1. **Copy a folder**: `templates/air-conditioning/dispatch` → `templates/air-conditioning/coastal`.
2. **Edit `meta.ts`**: set `slug: "coastal"`, name, tagline, description, tags, palette, fonts, bestFor, features, and point `dir` at `/placeholders/air-conditioning/coastal`. Define its image slots.
3. **Edit `content.ts`** with the sample business, and **`fonts.ts`** with its fonts. Use unique CSS variable names, e.g. `--font-co-heading`.
4. **Design `index.tsx` and `sections/`**. Reuse `../_shared` (content type, `useBookingForm`, `FloatingChat`, `contactLinks`, `serviceIcons`), but give the template its own layout and styling.
5. **Register it** with one line in `data/templates.ts`:
   ```ts
   import coastal from "@/templates/air-conditioning/coastal/meta";
   // …
   { ...coastal, load: () => import("@/templates/air-conditioning/coastal") },
   ```
6. `npm run placeholders`, then with the site running, `npm run thumbnails -- coastal`.

No gallery code changes. Home, category, detail and preview pages pick it up automatically, and a build-time check catches duplicate slugs or unknown categories.

## How to add a new category

1. **Add an entry** to `data/categories.ts`:
   ```ts
   { slug: "coffee-shop", name: "Coffee Shop", description: "…", status: "live", icon: Coffee },
   ```
   `icon` is any lucide icon. While a category has no templates, keep `status: "coming-soon"`.
2. **Define the content contract**: create `templates/coffee-shop/_shared/types.ts` (menu, hours, branches…) plus any shared hooks. The aircon `_shared` folder is a good model.
3. **Add templates** following the steps above, with `category: "coffee-shop"` in each `meta.ts`.
4. Flip the category to `status: "live"`.

## Building a client's site from a template

1. Copy the chosen template folder (or the whole repo) into the client project.
2. Replace `content.ts` with the client's details: business name, phone (`display` + `e164` for tel/Viber/WhatsApp links), services, prices, testimonials, address, hours, socials, Messenger username.
3. Replace the images in its `public/placeholders/...` folder.
4. Optionally retune the `palette` in `meta.ts`. The whole template recolors from those values.

---

## Real sites (client work and inspiration)

`data/showcase.ts` lists real, live websites, kept separate from the templates:

- **`kind: "work"`**: sites you built for clients. They appear first, as your portfolio. With none listed, the section stays hidden in production; in development a note reminds you where to add them.
- **`kind: "inspiration"`**: other businesses' sites, always labelled "Inspiration · not built by Atelier" and linked to the original. Set `template` to link one to the template it inspired. That template's page then shows an "Inspired by" row.

To add one, add an entry, run `npm run showcase -- <slug>` to capture its screenshot, and you're done. Most big brand sites refuse to load inside other sites' frames, so the detail page shows a screenshot that links out. If a site (typically your own client's) allows embedding, set `embeddable: true` to get the live Desktop / iPad / iPhone preview instead.

## The aircon templates

Each one is modeled on the structure and visual language of a real site. The businesses, copy, prices and branding are fictional; only the layout patterns are borrowed.

| Template | Modeled on | What carries over |
| --- | --- | --- |
| **Dispatch** | [teko.ph](https://teko.ph) | On-demand booking: cut-out technician hero, service tiles, value props, rate table, maintenance plan, guarantee banner, rating bar, blue footer |
| **Showroom** | [samsung.com/ph](https://www.samsung.com/ph/) | Monochrome retail: full-bleed campaign banners, grey product tiles, "Recommended for you" shelf with sale prices, outline pills, dense column footer |
| **Authority** | [carrier.com.ph](https://carrier.com.ph) | Corporate HVAC brand: hotline bar, huge light headline over photography, tiles with round arrow buttons, home and business paths, sticky "why choose us", warranty block |
| **Contractor** | [rglairconditioning.com](https://www.rglairconditioning.com) | Local contractor: info bar with every phone line, bold uppercase headings, royal-blue hero with hexagon photos, trust stats, brand wall, about over a city backdrop, news card |

## Design rules for the gallery

The shell follows the anti-"AI slop" checklists from [Impeccable](https://github.com/pbakaus/impeccable) and [Taste Skill](https://github.com/Leonxlnx/taste-skill). No glassmorphism, gradient text, eyebrow labels, icon-tile card grids, hero-metric widgets or bounce easing. Use one warm neutral palette (never pure white), hairline dividers instead of cards, one ambient background (DotGrid), and motion only for page fades and the device toggle.

## Third-party UI

- **[React Bits](https://reactbits.dev)** `HalftoneReveal`: the home hero's "Atelier" is printed as a halftone (`components/gallery/HeroHalftone.tsx` renders the word in the site font into an image and feeds it in); the cursor wipes the halftone away to reveal the crisp word.
- **Particle morph** (`components/gallery/MorphField.tsx`, no library): as you scroll, the halftone hands off to ~3,400 particles that break the word apart and reform into a symbol beside each section. An anchor with `data-morph-rest="hide"` is drawn by something else at rest (the halftone) and receives `--morph-leave` (0 to 1) for the hand-off. Mark any element with `data-morph="word|browser|globe|grid|steps"` to make it a stop; `data-morph-color` and `data-morph-size` tune it. Scroll-scrubbed (reverses when scrolling up), skipped on phones except the hero, and it swaps shapes without the flight for reduced-motion users.
- **[React Bits](https://reactbits.dev)** `OptionWheel`: the home page's industry picker (`components/gallery/CategoryWheel.tsx`), a curved wheel of categories beside the selected category's templates (or a coming-soon panel). Scroll, drag, click or use the arrow keys. Local patches are marked `Atelier patch`: an accessible `label` prop, page scroll pass-through at either end of the wheel, and a `touchAction` prop (set to `pan-y` so finger swipes scroll the page and a tap selects).
- **[React Bits](https://reactbits.dev)** `CardSwap`: the selected industry's templates as a swipeable 3D card deck (`components/gallery/TemplateStack.tsx`). Drag the front card away (or use the arrow keys) to flip through; clicks are disabled, so "Open template" is the way in. Patched (marked `Atelier patch`) to drop its demo-only icon package, take an accessible `label`, and accept `clickable={false}`. Vertical swipes on the deck still scroll the page on phones.
- **[React Bits](https://reactbits.dev)** `DotGrid` (`components/reactbits/`, vendored from the registry): the faint dot field behind the home hero and the dark process band, wrapped in `components/gallery/Backgrounds.tsx`. ESLint's React Compiler rules are relaxed for that folder only.
- **Launch story** (`components/gallery/LaunchStory.tsx`, Motion + SVG): "From preview to launch" pins while you scroll and plays a line-art scene in four acts matching the four steps (two people browse a site together, one points "that one", the site fills in with their details, then a button sends it into a rocket that launches and the site goes live). Scroll-scrubbed, so scrolling back rewinds it; the active step highlights alongside.
- **Section build-ins** (`components/gallery/Build.tsx`, Motion): each home section assembles as it scrolls in: a hairline draws from a "+" mark (`BuildRule`), the heading rises word by word from a mask (`RiseText`), cards wipe open (`Stagger`/`Wipe`), copy fades up (`FadeUp`), and the dark process band widens from an inset panel to full width, scrubbed by scroll (`BandReveal`). Reduced motion is handled in CSS (`[data-build]` in `globals.css`) so server and client markup match.
- **[Motion](https://motion.dev)**: page fade, device-frame morphing, filter transitions. Respects the OS reduce-motion setting.
- **[lucide](https://lucide.dev)**: icons. Brand marks (Messenger, Viber, WhatsApp, Facebook…) are simplified SVGs in `templates/_kit/BrandIcons.tsx`.

## Notes

- **Accessibility:** semantic landmarks, skip link, visible focus, labelled form fields with inline errors, `aria-pressed` toggles, `<details>` FAQs, and reduced-motion support in CSS and Motion.
- **Performance:** fully static routes, `next/font`, `next/image` with intrinsic sizes on every slot, and template code loaded per route.
- **Booking forms** are front-end only: they validate (including PH mobile format), simulate a submit, and show a reference number. Wire `useBookingForm` to a real endpoint (Formspree, a Server Action, email) when building a client's site.
- `next.config.ts` limits the Tailwind Turbopack loader to non-module CSS, so any `*.module.css` file stays scoped.
- Pages that read `params` render inside a `<Suspense>` boundary. Partial Prefetching requires this; the pages still prerender fully from `generateStaticParams`.
- `npm run thumbnails` strips the Next.js dev badge, so it's safe to run against `npm run dev`.
