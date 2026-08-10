import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { themeInitScript } from "@/lib/theme-script";
import { getSiteConfig } from "@/config/site";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

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
    alternates: {
      canonical: `/${rawLocale}`,
      languages: { pt: "/pt", en: "/en" },
    },
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
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
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

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en-US"} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
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
