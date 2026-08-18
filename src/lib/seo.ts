import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import type { SiteConfig } from "@/config/site";
import type { Tech } from "@/lib/tech/config";

// Todo tipo de conteúdo (capítulos, perguntas, glossário, estudos de caso) usa o mesmo slug em pt/en
// (confirmado comparando os diretórios de conteúdo, nenhum diff). Por isso hreflang pode trocar só o
// prefixo de locale no path, sem precisar resolver o slug equivalente por tipo de conteúdo (diferente
// do LocaleSwitcher, que troca locale a partir de uma URL já existente em vez de a partir dos params
// de uma rota, e por isso lida com a possibilidade de conteúdo ainda não traduzido).
export function buildAlternates(locale: Locale, pathWithoutLocale: string): Metadata["alternates"] {
  return {
    canonical: `/${locale}${pathWithoutLocale}`,
    languages: Object.fromEntries(locales.map((l) => [l, `/${l}${pathWithoutLocale}`])),
  };
}

// Formato exigido pelo protocolo Open Graph (`pt_BR`/`en_US`, com underscore), diferente do formato
// BCP-47 usado em `SiteConfig.locale`/`<html lang>` (`pt-BR`/`en-US`, com hífen). Não reusar um pro outro.
const OG_LOCALE: Record<Locale, string> = { pt: "pt_BR", en: "en_US" };

function otherLocale(locale: Locale): Locale {
  return locale === "pt" ? "en" : "pt";
}

// URL absoluta da imagem OG gerada por `src/app/[locale]/opengraph-image.tsx`, fallback pra qualquer
// página que não pertença a uma trilha (hoje, só `/[locale]/home`).
export function localeOpengraphImageUrl(siteConfig: SiteConfig, locale: Locale): string {
  return `${siteConfig.url}/${locale}/opengraph-image`;
}

// URL absoluta da imagem OG gerada por `src/app/[locale]/[tech]/opengraph-image.tsx`, reusada por toda
// página de conteúdo de uma trilha (não vale a pena gerar uma imagem por pergunta/capítulo/termo, ver
// docs/SEO-OPPORTUNITIES.md).
export function techOpengraphImageUrl(siteConfig: SiteConfig, locale: Locale, tech: Tech): string {
  return `${siteConfig.url}/${locale}/${tech}/opengraph-image`;
}

// O objeto `openGraph` do Next NÃO é deep-merged entre segmentos (layout → página): qualquer
// `generateMetadata` que defina `openGraph` (mesmo parcialmente) SUBSTITUI por inteiro o que um
// ancestral já tinha definido, derrubando `images`/`siteName`/`locale`/`type` junto. Por isso todo
// `generateMetadata` que precisa de um `openGraph.title`/`description` específico da página deve montar
// o objeto INTEIRO através desta função, nunca um objeto parcial `{ title, description }` à mão.
export function buildOpenGraph({
  siteConfig,
  locale,
  pathWithoutLocale,
  title,
  description,
  imageUrl,
}: {
  siteConfig: SiteConfig;
  locale: Locale;
  pathWithoutLocale: string;
  title: string;
  description: string;
  imageUrl: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: siteConfig.shortName,
    locale: OG_LOCALE[locale],
    alternateLocale: OG_LOCALE[otherLocale(locale)],
    url: `${siteConfig.url}/${locale}${pathWithoutLocale}`,
    title,
    description,
    images: [{ url: imageUrl, width: 1200, height: 630, type: "image/png", alt: title }],
  };
}

export type BreadcrumbItem = { name: string; url: string };

// Diferente de `buildAlternates`, JSON-LD não passa pela resolução de `metadataBase` do Next: as URLs
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
    name: siteConfig.shortName,
    url: siteConfig.url,
  };
}

export function buildOrganizationJsonLd(siteConfig: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.shortName,
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
