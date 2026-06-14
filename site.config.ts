/**
 * ═══════════════════════════════════════════════════════════════════════
 *  site.config.ts — TYPES + WIRING.  ✦ EDIT CONTENT IN site.content.json ✦
 * ═══════════════════════════════════════════════════════════════════════
 *  Every bit of editable content — copy, services, reviews, hours, theme —
 *  lives in site.content.json. This file only declares the shape and
 *  re-exports it as a typed object, so the site stays fully type-checked.
 *
 *  Why JSON? So content can be edited two ways:
 *    • by hand — open site.content.json and change the values, or
 *    • on the board — Mission Control reads/writes that JSON for you.
 *
 *  To launch a new client:
 *    1. Edit site.content.json (or do it in Mission Control).
 *    2. Drop real photos in /public and point `about.photo` (and the Hero
 *       plate, if you swap it) at them.
 *  Convention: wrap a word in *asterisks* inside `business.tagline` to
 *  render it as an italic serif accent in the hero headline.
 */

import content from "./site.content.json";

export type Industry =
  | "plumber"
  | "contractor"
  | "electrician"
  | "hvac"
  | "roofer"
  | "other";

export interface SiteConfig {
  business: {
    name: string;
    tagline: string; // hero headline; *word* = italic accent
    description: string; // hero paragraph + meta description
    industry: Industry;
    foundedYear: number;
    license: string; // e.g. "Licensed & insured · TN #12345"
    domain: string; // bare domain, no protocol — e.g. "hawthorneplumbing.com"
  };
  contact: {
    phone: string; // display format, e.g. "(615) 555-0142"
    phoneTel: string; // tel: href, e.g. "+16155550142"
    email: string;
    address: { street: string; city: string; state: string; zip: string };
    hours: { days: string; time: string }[];
    mapsUrl: string; // Google Maps link to the business
  };
  serviceArea: string[]; // cities served (drives ServiceArea + schema areaServed)
  services: { slug: string; title: string; blurb: string }[];
  reviews: {
    rating: number; // e.g. 4.9
    count: number; // e.g. 312
    source: string; // e.g. "Google"
    sourceUrl: string; // link to the public reviews
    items: { author: string; rating: number; date: string; body: string }[];
  };
  process: { n: string; title: string; body: string }[];
  faq: { q: string; a: string }[];
  about: {
    owner: string;
    ownerRole: string;
    photo: string | null; // /public path (e.g. "/owner.jpg") or null → SVG plate
    paragraphs: string[];
  };
  social: {
    google?: string;
    facebook?: string;
    instagram?: string;
    yelp?: string;
  };
  theme: {
    mode: "light" | "dark";
    accent: string; // hex — single accent color used site-wide
  };
  /** Optional page layout — section order, visibility, background tone. Absent = default. */
  sections?: { type: string; visible: boolean; tone?: string }[];
}

// site.content.json holds the values; the cast applies the precise types
// (JSON widens unions like `industry`/`theme.mode` to `string`).
export const siteConfig: SiteConfig = content as SiteConfig;

export default siteConfig;
