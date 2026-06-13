# Client Template

A reusable, **config-driven** marketing site for local service businesses — plumbers, electricians, HVAC, roofers, general contractors — the kind of business that lives or dies on its Google reviews and its phone ringing.

It's built so that **spinning up a new client is editing one file.** Everything on the page — copy, services, reviews, hours, the SEO schema, even the accent color and light/dark mode — is driven by [`site.content.json`](site.content.json). No component edits, no hunting through markup.

The design is deliberately quiet and editorial: huge serif headlines with italic accents, generous whitespace, hairline rules, slow scroll reveals. It's meant to make a one-truck plumber look like a firm you'd trust with your house.

---

## Why this template exists

Most local-service sites are either a bloated page-builder mess or a generic template every competitor in town also uses. This is the opposite: a fast, hand-built Next.js site with real structured data for local SEO, that takes **about fifteen minutes** to re-skin for a new client. Build it once, reuse it forever, charge per deploy.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for layout, **CSS variables** for theming (one accent color, swappable light/dark)
- **Framer Motion** for the scroll reveals and the mobile menu
- **next/font** — Instrument Serif (display), Inter (sans), JetBrains Mono (eyebrows). Self-hosted, no layout shift, no Google Fonts request at runtime.
- **schema.org JSON-LD** generated from config ([`lib/schema.ts`](lib/schema.ts))
- Deploys to **Netlify** via the official `@netlify/plugin-nextjs`

No external image dependencies — placeholders are inline SVG that you replace with real client photos.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build locally
npm run typecheck  # tsc --noEmit — run this before every deploy
npm run lint       # next lint
```

---

## Spinning up a new client

> **The whole point:** you only ever touch `site.content.json` and `/public`.

1. **Use this template** on GitHub (green **"Use this template"** button → **Create a new repository**) to make the client's own repo.
2. Open [`site.content.json`](site.content.json) and replace every value with the client's real details — name, phone, address, services, **real review count and rating**, hours, FAQ, owner story. This single file drives the entire site and the SEO schema. (`site.config.ts` just holds the TypeScript types — you rarely touch it.)
3. Drop the client's real photos into [`/public`](public) and:
   - Set `about.photo` to e.g. `"/owner.jpg"` to swap the About portrait placeholder for a real photo.
   - (Optional) Replace the SVG plate in [`components/Hero.tsx`](components/Hero.tsx) with a hero photo the same way.
   - Add a `public/og.jpg` (1200×630) for social sharing — see the SEO checklist below.
4. Set the brand: `theme.accent` to the client's hex color, and `theme.mode` to `"light"` or `"dark"`.
5. Commit and push.
6. Import the repo into **Netlify** and add the client's domain (see Deploy).

That's it. No component surgery for a standard build.

---

## Config reference

Everything below lives in [`site.content.json`](site.content.json) (typed by `site.config.ts`).

| Group | Field | What it does |
|---|---|---|
| **business** | `name` | Business name — wordmark, titles, footer, schema |
| | `tagline` | Hero headline. Wrap a word in `*asterisks*` to render it as an **italic serif accent** (e.g. `Plumbing Nashville homeowners *trust*.`) |
| | `description` | Hero paragraph **and** the meta description |
| | `industry` | One of `plumber` · `contractor` · `electrician` · `hvac` · `roofer` · `other`. Picks the schema.org `@type` |
| | `foundedYear` | Drives "since {year}" and the schema `foundingDate` |
| | `license` | License/insured line shown under the hero, in contact, and the footer |
| | `domain` | Bare domain, no protocol (e.g. `hawthorneplumbing.com`). Builds canonical URL, OG URL, and schema IDs |
| **contact** | `phone` / `phoneTel` | Display number (`(615) 555-0142`) and the `tel:` href (`+16155550142`) |
| | `email` | Used for the mailto link and schema |
| | `address` | `{ street, city, state, zip }` — NAP block, footer, schema `PostalAddress` |
| | `hours` | Array of `{ days, time }` — renders the hours table in Contact |
| | `mapsUrl` | Google Maps link to the business |
| **serviceArea** | `string[]` | Cities served. Drives the Service Area section **and** schema `areaServed` |
| **services** | `{ slug, title, blurb }[]` | The editorial service list **and** schema `hasOfferCatalog` |
| **reviews** | `rating`, `count`, `source`, `sourceUrl` | Aggregate rating block + schema `aggregateRating`. Use the client's **real** numbers |
| | `items` | `{ author, rating, date, body }[]` — the quote cards + schema `review[]` |
| **process** | `{ n, title, body }[]` | The numbered "how it works" columns |
| **faq** | `{ q, a }[]` | The accordion **and** the schema `FAQPage` (eligible for FAQ rich results) |
| **about** | `owner`, `ownerRole`, `photo`, `paragraphs[]` | About section. `photo: null` → SVG initials plate; set a `/public` path to use a real photo |
| **social** | `google`, `facebook`, `instagram`, `yelp` (all optional) | Footer links **and** schema `sameAs`. Omit any you don't have |
| **theme** | `mode` (`light`/`dark`), `accent` (hex) | Whole-site theme. Accent is injected as a CSS variable and used everywhere |

---

## Project structure

```
.
├── site.content.json       ← THE CONTENT YOU EDIT PER CLIENT (by hand or via Mission Control)
├── site.config.ts          ← TypeScript types + wiring (rarely touched)
├── app/
│   ├── layout.tsx          ← fonts, metadata, theme, JSON-LD injection
│   ├── page.tsx            ← composes the 11 sections in order
│   └── globals.css         ← CSS-variable theme + editorial utility classes
├── components/
│   ├── Reveal.tsx          ← Framer Motion scroll fade-up (respects reduced motion)
│   ├── Nav.tsx             ← sticky nav, scroll bg fade, mobile drawer
│   ├── Hero.tsx            ← headline mask-reveal + editorial SVG plate
│   ├── TrustBar.tsx        ← rating · license · serving-since
│   ├── Services.tsx        ← editorial row list
│   ├── Process.tsx         ← numbered steps
│   ├── Reviews.tsx         ← centerpiece: aggregate stat + quote cards
│   ├── About.tsx           ← owner story + portrait (SVG or photo)
│   ├── ServiceArea.tsx     ← cities as inline serif text
│   ├── FAQ.tsx             ← accordion (schema-backed)
│   ├── Contact.tsx         ← phone/email/address + hours
│   └── Footer.tsx          ← NAP, links, social, wordmark watermark
├── lib/
│   └── schema.ts           ← builds LocalBusiness + FAQPage JSON-LD from config
├── public/                 ← client photos + og.jpg go here
├── netlify.toml            ← Netlify build config + plugin
├── next.config.js          ← NOTE: no `output: standalone` (Netlify handles it)
└── tailwind.config.ts
```

---

## Local-SEO checklist

This is what actually moves the needle for a local service business. Do all of it per client:

- [ ] **NAP matches the Google Business Profile exactly.** Name, address, and phone in `site.content.json` must be character-for-character identical to the client's GBP and other directory listings. Inconsistent NAP is the #1 local-SEO killer.
- [ ] **Real review numbers.** `reviews.rating` and `reviews.count` should match the live Google rating. Don't invent them — the schema claims them publicly.
- [ ] **`sourceUrl` points at the real Google reviews** so the "Read all reviews" CTA works and `sameAs` is legitimate.
- [ ] **Fill the FAQ.** It renders a `FAQPage` schema that's eligible for FAQ rich results in search — free SERP real estate.
- [ ] **Add `public/og.jpg`** (1200×630). Referenced by Open Graph and Twitter tags and the schema `image`. Without it, shared links look broken.
- [ ] **Set the real `domain`.** It builds every canonical/OG/schema URL.
- [ ] **Verify the domain in [Google Search Console](https://search.google.com/search-console)** and submit the site once it's live.
- [ ] **Run the live URL through the [Rich Results Test](https://search.google.com/test/rich-results)** — confirm `LocalBusiness` and `FAQPage` parse with no errors.
- [ ] **Confirm the GBP website field** points at this site's domain.

---

## Deploy to Netlify

This template is built for **Netlify** (the `@netlify/plugin-nextjs` plugin and `netlify.toml` are already wired up). Do **not** add `output: "standalone"` to `next.config.js` — the plugin handles the serverless build itself, and standalone breaks it.

### Recommended: Git-driven (continuous deploy)

1. Push the client repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
3. Netlify reads `netlify.toml` — build command (`npm run build`), publish dir (`.next`), Node 20, and the Next.js plugin are all preconfigured. Just click **Deploy**.
4. Every push to `main` now redeploys automatically. Watch progress under the **Deploys** tab; the Next.js server/ISR functions show up under the **Functions** tab.

### One-off: Netlify CLI

```bash
npm i -g netlify-cli
netlify login
netlify init      # link to a new or existing Netlify site
netlify deploy --build --prod
```

### Custom domain

1. In the site's **Domain management**, add the client's domain (and the `www` variant).
2. Point DNS at Netlify:
   - **Apex / root** (`example.com`): an **A record** to `75.2.60.5`.
   - **www**: a **CNAME** to your Netlify subdomain (`your-site.netlify.app`).
   - *(If the registrar supports it, you can instead delegate the whole domain to Netlify DNS and skip the manual records.)*
3. HTTPS is automatic — Netlify provisions a **Let's Encrypt** certificate once DNS resolves (usually within minutes to a couple of hours).
4. Set the primary domain (apex or www) in Domain management so the other variant redirects to it.

---

## Future enhancements

Ideas for when a client wants more than the brochure:

- **Working booking/quote form** — add `app/api/contact/route.ts` that sends mail via [Resend](https://resend.com); store the API key as a **Netlify environment variable** (Site settings → Environment variables). Or use **Netlify Forms** for a zero-backend option.
- **Per-service pages** — `app/services/[slug]/page.tsx` generated from `services[]`, each with its own copy, `Service` schema, and internal links. Great for ranking on "{service} in {city}".
- **Live Google reviews** — pull fresh reviews from the **Google Places API** at build time instead of hardcoding them in config.
- **Blog / resources** — an MDX-powered `app/blog` for local-SEO content ("how to find a water leak", etc.).
- **`sitemap.ts` + `robots.ts`** — Next's metadata routes for an auto-generated sitemap and robots file (add once there's more than one page).
- **Multi-location** — extend the config to an array of locations, each with its own `LocalBusiness` schema and landing page.

---

Built as a starting point, not a finished product — the value is in how fast it re-skins. Keep the config clean and the rest takes care of itself.
