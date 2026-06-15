import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/site.config";
import { buildJsonLd } from "@/lib/schema";
import ContentProvider from "@/components/ContentProvider";

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const plainTagline = siteConfig.business.tagline.replace(/\*/g, "");
const siteUrl = `https://${siteConfig.business.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.business.name} — ${plainTagline}`,
    template: `%s · ${siteConfig.business.name}`,
  },
  description: siteConfig.business.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.business.name} — ${plainTagline}`,
    description: siteConfig.business.description,
    url: siteUrl,
    siteName: siteConfig.business.name,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.business.name} — ${plainTagline}`,
    description: siteConfig.business.description,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = buildJsonLd(siteConfig);

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${
        siteConfig.theme.mode === "dark" ? "theme-dark" : ""
      }`}
      style={
        {
          "--accent": siteConfig.theme.accent,
          // optional per-client overrides — blank falls back to the mode default
          ...(siteConfig.theme.bg ? { "--bg": siteConfig.theme.bg } : {}),
          ...(siteConfig.theme.fg ? { "--fg": siteConfig.theme.fg } : {}),
        } as CSSProperties
      }
    >
      <body>
        <ContentProvider initial={siteConfig}>{children}</ContentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
