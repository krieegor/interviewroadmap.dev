import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import type { SiteConfig } from "@/config/site";

// Todo tipo de conteúdo (capítulos, perguntas, glossário, estudos de caso) usa o mesmo slug em pt/en
// — confirmado comparando os diretórios de conteúdo, nenhum diff. Por isso hreflang pode trocar só o
// prefixo de locale no path, sem precisar resolver o slug equivalente por tipo de conteúdo (diferente
// do LocaleSwitcher, que troca locale a partir de uma URL já existente em vez de a partir dos params
// de uma rota, e por isso lida com a possibilidade de conteúdo ainda não traduzido).
export function buildAlternates(locale: Locale, pathWithoutLocale: string): Metadata["alternates"] {
  return {
    canonical: `/${locale}${pathWithoutLocale}`,
    languages: Object.fromEntries(locales.map((l) => [l, `/${l}${pathWithoutLocale}`])),
  };
}

export type BreadcrumbItem = { name: string; url: string };

// Diferente de `buildAlternates`, JSON-LD não passa pela resolução de `metadataBase` do Next — as URLs
// aqui precisam ser absolutas (mesmo padrão que `src/app/sitemap.ts` já usa).
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildWebSiteJsonLd(siteConfig: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function buildOrganizationJsonLd(siteConfig: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon`,
  };
}

export function buildPersonJsonLd(siteConfig: SiteConfig, pageUrl: string) {
  const { author } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: pageUrl,
    image: `${siteConfig.url}${author.avatar}`,
    description: author.bio,
    sameAs: [author.linkedin, author.github, author.website].filter(Boolean),
  };
}
