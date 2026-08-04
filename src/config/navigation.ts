import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export type TopNavItem = {
  label: string;
  href: string;
};

export function getTopNav(locale: Locale, dict: Dictionary): TopNavItem[] {
  return [
    { label: dict.nav.livro, href: `/${locale}/livro` },
    { label: dict.nav.perguntas, href: `/${locale}/perguntas` },
    { label: dict.nav.casos, href: `/${locale}/casos` },
    { label: dict.nav.glossario, href: `/${locale}/glossario` },
    { label: dict.nav.simulador, href: `/${locale}/simulador` },
    { label: dict.nav.sobre, href: `/${locale}/sobre` },
  ];
}
