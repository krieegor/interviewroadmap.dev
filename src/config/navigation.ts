import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { techsWithContent, type Tech } from "@/lib/tech/config";

export type TopNavItem = {
  label: string;
  href: string;
};

export function getTopNav(locale: Locale, tech: Tech, dict: Dictionary): TopNavItem[] {
  if (!techsWithContent.includes(tech)) return [];
  return [
    { label: dict.nav.livro, href: `/${locale}/${tech}/livro` },
    { label: dict.nav.perguntas, href: `/${locale}/${tech}/perguntas` },
    { label: dict.nav.casos, href: `/${locale}/${tech}/casos` },
    { label: dict.nav.glossario, href: `/${locale}/${tech}/glossario` },
    { label: dict.nav.simulador, href: `/${locale}/${tech}/simulador` },
    { label: dict.nav.sobre, href: `/${locale}/${tech}/sobre` },
  ];
}

// Primeiros dois nós compartilhados por toda breadcrumb sob uma trilha — cada página completa com sua
// própria seção (e, quando aplicável, o item atual) via `[...getTechBreadcrumb(...), { label, href }]`.
export function getTechBreadcrumb(
  locale: Locale,
  tech: Tech,
  techName: string,
  dict: Dictionary,
): TopNavItem[] {
  return [
    { label: dict.breadcrumbs.home, href: `/${locale}/home` },
    { label: techName, href: `/${locale}/${tech}` },
  ];
}
