import type { Locale } from "@/lib/i18n/config";
import type { Tech } from "@/lib/tech/config";

type TechConfig = {
  name: string;
  shortName: string;
  description: string;
  // Só usados na home da trilha (`/[locale]/[tech]`) quando `techsWithContent` inclui a trilha:
  // trilhas "em construção" caem em <ComingSoon> antes de chegar nesses campos, mas ainda precisam
  // de um valor (o tipo é `Record<Tech, ...>`) até ganharem conteúdo real.
  intro: string;
  coreConcepts: string[];
};

const localizedTechConfig: Record<Tech, Record<Locale, TechConfig>> = {
  kafka: {
    pt: {
      name: "Apache Kafka para Entrevistas Java Sênior",
      shortName: "Kafka",
      description:
        "Guia prático e gratuito sobre mensageria, arquitetura, reprocessamento, ordenação, idempotência e sistemas distribuídos com Apache Kafka, voltado para desenvolvedores Java Backend em entrevistas técnicas.",
      intro:
        "Para quem já trabalha com Java, Spring Boot e microsserviços, tem contato básico ou intermediário com mensageria e está se preparando para entrevistas técnicas de nível Pleno, Sênior ou Tech Lead, sem precisar administrar clusters Kafka para tirar proveito do conteúdo.",
      coreConcepts: [
        "Partitions e ordenação",
        "Consumer Groups e rebalance",
        "Offset e commit",
        "Retention e replay",
        "Retry e DLQ",
        "Idempotência",
        "Garantias de entrega",
        "Outbox pattern",
      ],
    },
    en: {
      name: "Apache Kafka for Senior Java Interviews",
      shortName: "Kafka",
      description:
        "A practical, free guide to messaging, architecture, reprocessing, ordering, idempotency and distributed systems with Apache Kafka, for Java Backend developers preparing for technical interviews.",
      intro:
        "For developers who already work with Java, Spring Boot and microservices, have basic to intermediate exposure to messaging, and are preparing for Mid-level, Senior or Tech Lead technical interviews, with no need to administer Kafka clusters to get value from this content.",
      coreConcepts: [
        "Partitions and ordering",
        "Consumer groups and rebalance",
        "Offset and commit",
        "Retention and replay",
        "Retry and DLQ",
        "Idempotency",
        "Delivery guarantees",
        "Outbox pattern",
      ],
    },
  },
  java: {
    pt: {
      name: "Java",
      shortName: "Java",
      description:
        "Guia de preparação para entrevistas de Java Backend: concorrência, coleta de lixo, Streams, Spring Boot, testes e boas práticas de arquitetura para desenvolvedores Pleno, Sênior e Tech Lead.",
      intro: "",
      coreConcepts: [],
    },
    en: {
      name: "Java",
      shortName: "Java",
      description:
        "Interview prep guide for Java Backend developers: concurrency, garbage collection, Streams, Spring Boot, testing and architecture practices for Mid-level, Senior and Tech Lead roles.",
      intro: "",
      coreConcepts: [],
    },
  },
  elastic: {
    pt: {
      name: "Elastic Search",
      shortName: "Elastic",
      description:
        "Guia de preparação para entrevistas de Elasticsearch: indexação, mapeamento, busca full-text, agregações, relevância e escalabilidade de clusters de busca.",
      intro: "",
      coreConcepts: [],
    },
    en: {
      name: "Elastic Search",
      shortName: "Elastic",
      description:
        "Interview prep guide for Elasticsearch: indexing, mapping, full-text search, aggregations, relevance scoring and search cluster scalability.",
      intro: "",
      coreConcepts: [],
    },
  },
  sql: {
    pt: {
      name: "SQL",
      shortName: "SQL",
      description:
        "Guia de preparação para entrevistas de SQL e bancos relacionais: modelagem, índices, joins, transações, isolamento e otimização de queries.",
      intro: "",
      coreConcepts: [],
    },
    en: {
      name: "SQL",
      shortName: "SQL",
      description:
        "Interview prep guide for SQL and relational databases: modeling, indexing, joins, transactions, isolation levels and query optimization.",
      intro: "",
      coreConcepts: [],
    },
  },
  aws: {
    pt: {
      name: "Amazon Web Services (AWS)",
      shortName: "AWS",
      description:
        "Guia de preparação para entrevistas de AWS: computação (EC2, Lambda), armazenamento (S3), mensageria (SQS/SNS), IAM e arquitetura de sistemas na nuvem.",
      intro: "",
      coreConcepts: [],
    },
    en: {
      name: "Amazon Web Services (AWS)",
      shortName: "AWS",
      description:
        "Interview prep guide for AWS: compute (EC2, Lambda), storage (S3), messaging (SQS/SNS), IAM and cloud system architecture.",
      intro: "",
      coreConcepts: [],
    },
  },
  gcp: {
    pt: {
      name: "Google Cloud Platform (GCP)",
      shortName: "GCP",
      description:
        "Guia de preparação para entrevistas de Google Cloud Platform: computação (Compute Engine, Cloud Run), armazenamento, Pub/Sub, IAM e arquitetura de sistemas na nuvem.",
      intro: "",
      coreConcepts: [],
    },
    en: {
      name: "Google Cloud Platform (GCP)",
      shortName: "GCP",
      description:
        "Interview prep guide for Google Cloud Platform: compute (Compute Engine, Cloud Run), storage, Pub/Sub, IAM and cloud system architecture.",
      intro: "",
      coreConcepts: [],
    },
  },
};

export function getTechConfig(tech: Tech, locale: Locale): TechConfig {
  return localizedTechConfig[tech][locale];
}
