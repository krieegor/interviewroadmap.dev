import type { Locale } from "@/lib/i18n/config";

const author = {
  name: "João Paulo Rodrigues de Araújo",
  avatar: "/autor/joao-paulo.webp",
  linkedin: "https://linkedin.com/in/jprodriguesdev",
  github: "https://github.com/jprodriguesdev",
  website: "https://jprodrigues.dev",
  bio: "Engenheiro de Software com mais de 10 anos de experiência em tecnologia e mais de 6 anos de atuação com Java, arquitetura de sistemas distribuídos e soluções em cloud. Atua como Tech Lead e Arquiteto de Software no setor financeiro (cartões, crédito, contas e PIX), com experiência prática em arquiteturas orientadas a eventos usando Apache Kafka.",
};

const shared = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  githubUrl: "https://github.com/",
  author,
  // Cresce conforme PRs de novos colaboradores forem aceitos no repositório.
  contributors: [{ name: author.name, url: author.github }],
};

const localizedSiteConfig = {
  pt: {
    ...shared,
    name: "Apache Kafka para Entrevistas Java Sênior",
    shortName: "Kafka para Entrevistas",
    description:
      "Guia prático e gratuito sobre mensageria, arquitetura, reprocessamento, ordenação, idempotência e sistemas distribuídos com Apache Kafka, voltado para desenvolvedores Java Backend em entrevistas técnicas.",
    locale: "pt-BR",
  },
  en: {
    ...shared,
    name: "Apache Kafka for Senior Java Interviews",
    shortName: "Kafka for Interviews",
    description:
      "A practical, free guide to messaging, architecture, reprocessing, ordering, idempotency and distributed systems with Apache Kafka, for Java Backend developers preparing for technical interviews.",
    locale: "en-US",
  },
} as const;

export type SiteConfig = (typeof localizedSiteConfig)[Locale];

export function getSiteConfig(locale: Locale): SiteConfig {
  return localizedSiteConfig[locale];
}

// Usado pelas rotas globais que não são por-locale (manifest, robots, opengraph-image, scripts de build).
export const siteConfig = localizedSiteConfig.pt;
