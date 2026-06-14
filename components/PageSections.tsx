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
import TextBlock from "./blocks/TextBlock";
import ImageBlock from "./blocks/ImageBlock";
import TextImageBlock from "./blocks/TextImageBlock";

type BlockProps = { section?: { data?: Record<string, unknown> }; index?: number };

// type → component. Nav and Footer are fixed chrome (in app/page.tsx).
// The block* types are user-added custom blocks that carry their own data.
const REGISTRY: Record<string, ComponentType<BlockProps>> = {
  hero: Hero,
  trustbar: TrustBar,
  services: Services,
  process: Process,
  reviews: Reviews,
  about: About,
  serviceArea: ServiceArea,
  faq: FAQ,
  contact: Contact,
  textBlock: TextBlock,
  imageBlock: ImageBlock,
  textImageBlock: TextImageBlock,
};

// Default layout with background tones so the page isn't a flat white wall.
export const DEFAULT_SECTIONS: {
  type: string;
  visible: boolean;
  tone?: string;
  data?: Record<string, unknown>;
}[] = [
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
        const key = (s as { id?: string }).id || `${s.type}-${i}`;
        return cls ? (
          <div key={key} className={cls}>
            <Cmp section={s} index={i} />
          </div>
        ) : (
          <Cmp key={key} section={s} index={i} />
        );
      })}
    </>
  );
}
