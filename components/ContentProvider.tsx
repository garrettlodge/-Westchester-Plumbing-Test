"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SiteConfig } from "@/site.config";

// ─────────────────────────────────────────────────────────────────────────
//  ContentProvider — the single source of content for every section.
//
//  Normally it just hands components the build-time content (site.content.json
//  via site.config). But when the page is loaded inside Mission Control's
//  preview (?mcpreview=1), it listens for the editor's draft over postMessage
//  and swaps it in live — so the whole site re-renders as the client types,
//  with no rebuild. It also reports clicks on [data-mc-field] elements back to
//  the editor (click-to-edit).
// ─────────────────────────────────────────────────────────────────────────

const ContentContext = createContext<SiteConfig | null>(null);

export function useContent(): SiteConfig {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within <ContentProvider>");
  }
  return ctx;
}

// Origins allowed to drive the preview (Mission Control prod + local dev).
const ALLOWED_ORIGINS = [
  "https://mission-control-recstu.fly.dev",
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost:3000",
];

export default function ContentProvider({
  initial,
  children,
}: {
  initial: SiteConfig;
  children: ReactNode;
}) {
  const [content, setContent] = useState<SiteConfig>(initial);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mcpreview") !== "1") return;

    document.documentElement.setAttribute("data-mc-preview", "1");

    const allowed = (origin: string) =>
      origin === window.location.origin || ALLOWED_ORIGINS.includes(origin);

    const onMessage = (e: MessageEvent) => {
      if (!allowed(e.origin)) return;
      const data = e.data;
      if (data && data.type === "mc:content" && data.content) {
        setContent(data.content as SiteConfig);
      }
    };

    // Click any annotated element → tell the editor which field it maps to.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-mc-field]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage(
        { type: "mc:click", field: el.getAttribute("data-mc-field") },
        "*"
      );
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    // Tell the editor we're mounted and ready for content.
    window.parent.postMessage({ type: "mc:ready" }, "*");

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}
