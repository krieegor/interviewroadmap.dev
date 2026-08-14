import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";

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
