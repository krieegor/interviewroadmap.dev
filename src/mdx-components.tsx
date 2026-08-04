import type { MDXComponents } from "mdx/types";
import {
  Definicao,
  Atencao,
  DicaEntrevista,
  Pegadinha,
  ExemploFinanceiro,
  RespostaCurta,
  RespostaSenior,
  ErroComum,
  Resumo,
  PerguntaDerivada,
} from "@/components/content/blocks";
import { Comparacao } from "@/components/content/Comparacao";
import { Diagrama } from "@/components/content/Diagrama";
import { Mermaid } from "@/components/diagrams/Mermaid";
import { ProducerConsumerFlow } from "@/components/diagrams/ProducerConsumerFlow";
import { ProducerConsumerFlowEn } from "@/components/diagrams/ProducerConsumerFlowEn";
import { BrokerClusterDiagram } from "@/components/diagrams/BrokerClusterDiagram";
import { BrokerClusterDiagramEn } from "@/components/diagrams/BrokerClusterDiagramEn";
import { KeyPartitioningDiagram } from "@/components/diagrams/KeyPartitioningDiagram";
import { KeyPartitioningDiagramEn } from "@/components/diagrams/KeyPartitioningDiagramEn";
import { LeaderFailoverDiagram } from "@/components/diagrams/LeaderFailoverDiagram";
import { LeaderFailoverDiagramEn } from "@/components/diagrams/LeaderFailoverDiagramEn";
import { RebalanceDiagram } from "@/components/diagrams/RebalanceDiagram";
import { RebalanceDiagramEn } from "@/components/diagrams/RebalanceDiagramEn";
import { OffsetCommitDiagram } from "@/components/diagrams/OffsetCommitDiagram";
import { OffsetCommitDiagramEn } from "@/components/diagrams/OffsetCommitDiagramEn";
import { ReplayDiagram } from "@/components/diagrams/ReplayDiagram";
import { ReplayDiagramEn } from "@/components/diagrams/ReplayDiagramEn";
import { RetryDlqDiagram } from "@/components/diagrams/RetryDlqDiagram";
import { RetryDlqDiagramEn } from "@/components/diagrams/RetryDlqDiagramEn";
import { DeliveryGuaranteesDiagram } from "@/components/diagrams/DeliveryGuaranteesDiagram";
import { DeliveryGuaranteesDiagramEn } from "@/components/diagrams/DeliveryGuaranteesDiagramEn";
import { IdempotencyDiagram } from "@/components/diagrams/IdempotencyDiagram";
import { IdempotencyDiagramEn } from "@/components/diagrams/IdempotencyDiagramEn";
import { OutboxPatternDiagram } from "@/components/diagrams/OutboxPatternDiagram";
import { OutboxPatternDiagramEn } from "@/components/diagrams/OutboxPatternDiagramEn";
import { ProducerCallbackDiagram } from "@/components/diagrams/ProducerCallbackDiagram";
import { ProducerCallbackDiagramEn } from "@/components/diagrams/ProducerCallbackDiagramEn";
import { ConsumerLagDiagram } from "@/components/diagrams/ConsumerLagDiagram";
import { ConsumerLagDiagramEn } from "@/components/diagrams/ConsumerLagDiagramEn";
import { CircuitBreakerDiagram } from "@/components/diagrams/CircuitBreakerDiagram";
import { CircuitBreakerDiagramEn } from "@/components/diagrams/CircuitBreakerDiagramEn";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Definicao,
    Atencao,
    DicaEntrevista,
    Pegadinha,
    ExemploFinanceiro,
    RespostaCurta,
    RespostaSenior,
    ErroComum,
    Resumo,
    Comparacao,
    Diagrama,
    PerguntaDerivada,
    Mermaid,
    ProducerConsumerFlow,
    ProducerConsumerFlowEn,
    BrokerClusterDiagram,
    BrokerClusterDiagramEn,
    KeyPartitioningDiagram,
    KeyPartitioningDiagramEn,
    LeaderFailoverDiagram,
    LeaderFailoverDiagramEn,
    RebalanceDiagram,
    RebalanceDiagramEn,
    OffsetCommitDiagram,
    OffsetCommitDiagramEn,
    ReplayDiagram,
    ReplayDiagramEn,
    RetryDlqDiagram,
    RetryDlqDiagramEn,
    DeliveryGuaranteesDiagram,
    DeliveryGuaranteesDiagramEn,
    IdempotencyDiagram,
    IdempotencyDiagramEn,
    OutboxPatternDiagram,
    OutboxPatternDiagramEn,
    ProducerCallbackDiagram,
    ProducerCallbackDiagramEn,
    ConsumerLagDiagram,
    ConsumerLagDiagramEn,
    CircuitBreakerDiagram,
    CircuitBreakerDiagramEn,
    ...components,
  };
}
