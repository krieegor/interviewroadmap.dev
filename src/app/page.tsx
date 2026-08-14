import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import { siteConfig } from "@/config/site";

// `redirect()` sob `output: "export"` vira uma página estática mínima (sem herdar o `generateMetadata`
// de `[locale]/layout.tsx`, que só existe pra rotas com `locale` no path) — sem isso, crawlers de link
// preview (WhatsApp, etc.) que batem direto na raiz não acham título/descrição/OG e mostram um card vazio.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootPage() {
  redirect(`/${defaultLocale}/home`);
}
