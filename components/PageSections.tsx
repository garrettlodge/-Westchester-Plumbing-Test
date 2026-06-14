"use client";

import type { ComponentType } from "react";
import { useContent } from "./ContentProvider";
import Hero from "./Hero";
import TrustBar from "./TrustBar";
import Services from "./Services";
import Process from "./Process";
import Reviews from "./Reviews";
import About from "./About";
import ServiceArea from "./ServiceArea";
import FAQ from "./FAQ";
import Contact from "./Contact";

// Maps a section type → its component. Nav and Footer are fixed chrome and
// live outside this list (in app/page.tsx).
const REGISTRY: Record<string, ComponentType> = {
  hero: Hero,
  trustbar: TrustBar,
  services: Services,
  process: Process,
  reviews: Reviews,
  about: About,
  serviceArea: ServiceArea,
  faq: FAQ,
  contact: Contact,
};

export const DEFAULT_SECTIONS = [
  "hero",
  "trustbar",
  "services",
  "process",
  "reviews",
  "about",
  "serviceArea",
  "faq",
  "contact",
];

// Renders the body sections in the order/visibility from content.sections.
// Falls back to the default order when content.sections is absent — so older
// sites (and the seed) render fully without needing the field.
export default function PageSections() {
  const content = useContent();
  const sections =
    content.sections && content.sections.length
      ? content.sections
      : DEFAULT_SECTIONS.map((type) => ({ type, visible: true }));

  return (
    <>
      {sections.map((s, i) => {
        if (s.visible === false) return null;
        const Cmp = REGISTRY[s.type];
        return Cmp ? <Cmp key={`${s.type}-${i}`} /> : null;
      })}
    </>
  );
}
