import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { themeInitScript } from "@/lib/theme-script";
import { getSiteConfig } from "@/config/site";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildAlternates, buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import { JsonLdScript } from "@/components/seo/JsonLdScript";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// `locales` é um conjunto fechado — sem isso, adapters de edge (ex.: OpenNext/Cloudflare Workers)
// tratam a rota como parcialmente dinâmica e empacotam o server-render de toda a árvore de páginas
// na function de request, estourando o limite de tamanho do Worker.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const siteConfig = getSiteConfig(rawLocale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s · ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    // Fallback só pra rotas que não definem o próprio `alternates` (nenhuma deveria chegar aqui hoje
    // — cada página de conteúdo já sobrescreve com o path real via `buildAlternates`).
    alternates: buildAlternates(rawLocale, "/home"),
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
    },
    // Sem `title`/`description` fixos aqui: a maioria dos leitores de card (incluindo X/Twitter) cai
    // de volta pro `openGraph.title`/`description` quando o campo `twitter` não os define — e esse OG
    // já é correto por página (pergunta, capítulo etc.). Definir um valor fixo aqui bloquearia esse
    // fallback pra todo o site com o texto genérico da plataforma.
    twitter: {
      card: "summary_large_image",
    },
    // String pública fornecida pelo Google Search Console (não é segredo — ela vai pro HTML renderizado
    // de qualquer forma). `undefined` quando não configurada: o Next omite a meta tag, sem afetar o build.
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const siteConfig = getSiteConfig(locale);

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en-US"} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <JsonLdScript data={buildWebSiteJsonLd(siteConfig)} />
        <JsonLdScript data={buildOrganizationJsonLd(siteConfig)} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
