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

// Default layout with background tones so the page isn't a flat white wall.
export const DEFAULT_SECTIONS: { type: string; visible: boolean; tone?: string }[] = [
  { type: "hero", visible: true },
  { type: "trustbar", visible: true },
  { type: "services", visible: true },
  { type: "process", visible: true, tone: "muted" },
  { type: "reviews", visible: true, tone: "contrast" },
  { type: "about", visible: true },
  { type: "serviceArea", visible: true, tone: "tint" },
  { type: "faq", visible: true },
  { type: "contact", visible: true },
];

const toneClass = (tone?: string) =>
  tone && tone !== "default" ? `sec-tone-${tone}` : "";

export default function PageSections() {
  const content = useContent();
  const sections =
    content.sections && content.sections.length
      ? content.sections
      : DEFAULT_SECTIONS;

  return (
    <>
      {sections.map((s, i) => {
        if (s.visible === false) return null;
        const Cmp = REGISTRY[s.type];
        if (!Cmp) return null;
        const cls = toneClass(s.tone);
        const key = `${s.type}-${i}`;
        return cls ? (
          <div key={key} className={cls}>
            <Cmp />
          </div>
        ) : (
          <Cmp key={key} />
        );
      })}
    </>
  );
}
