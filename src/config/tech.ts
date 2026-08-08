import type { Locale } from "@/lib/i18n/config";
import type { Tech } from "@/lib/tech/config";

type TechConfig = {
  name: string;
  shortName: string;
  description: string;
};

const localizedTechConfig: Record<Tech, Record<Locale, TechConfig>> = {
  kafka: {
    pt: {
      name: "Apache Kafka para Entrevistas Java Sênior",
      shortName: "Kafka",
      description:
        "Guia prático e gratuito sobre mensageria, arquitetura, reprocessamento, ordenação, idempotência e sistemas distribuídos com Apache Kafka, voltado para desenvolvedores Java Backend em entrevistas técnicas.",
    },
    en: {
      name: "Apache Kafka for Senior Java Interviews",
      shortName: "Kafka",
      description:
        "A practical, free guide to messaging, architecture, reprocessing, ordering, idempotency and distributed systems with Apache Kafka, for Java Backend developers preparing for technical interviews.",
    },
  },
  java: {
    pt: {
      name: "Java",
      shortName: "Java",
      description: "Trilha de preparação para entrevistas de Java — em construção.",
    },
    en: {
      name: "Java",
      shortName: "Java",
      description: "Java interview prep track — coming soon.",
    },
  },
  elastic: {
    pt: {
      name: "Elastic Search",
      shortName: "Elastic",
      description: "Trilha de preparação para entrevistas de Elastic Search — em construção.",
    },
    en: {
      name: "Elastic Search",
      shortName: "Elastic",
      description: "Elastic Search interview prep track — coming soon.",
    },
  },
  sql: {
    pt: {
      name: "SQL",
      shortName: "SQL",
      description: "Trilha de preparação para entrevistas de SQL e bancos relacionais — em construção.",
    },
    en: {
      name: "SQL",
      shortName: "SQL",
      description: "SQL and relational database interview prep track — coming soon.",
    },
  },
  aws: {
    pt: {
      name: "Amazon Web Services (AWS)",
      shortName: "AWS",
      description: "Trilha de preparação para entrevistas de AWS — em construção.",
    },
    en: {
      name: "Amazon Web Services (AWS)",
      shortName: "AWS",
      description: "AWS interview prep track — coming soon.",
    },
  },
  gcp: {
    pt: {
      name: "Google Cloud Platform (GCP)",
      shortName: "GCP",
      description: "Trilha de preparação para entrevistas de GCP — em construção.",
    },
    en: {
      name: "Google Cloud Platform (GCP)",
      shortName: "GCP",
      description: "GCP interview prep track — coming soon.",
    },
  },
};

export function getTechConfig(tech: Tech, locale: Locale): TechConfig {
  return localizedTechConfig[tech][locale];
}
