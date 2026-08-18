"use client";

import dynamic from "next/dynamic";
import { useShouldRender3D } from "@/components/three/webgl-support";
import { HeroCanvasSkeleton } from "@/components/hero/HeroCanvasSkeleton";
import { useStepCarousel } from "@/lib/hooks/useStepCarousel";
import { DiagramStepArrows, DiagramStepDots } from "@/components/hero/ChapterDiagramControls";
import type { OutboxPatternLabels } from "@/components/three/diagrams/OutboxPatternScene";

const OutboxPatternScene = dynamic(() => import("@/components/three/diagrams/OutboxPatternScene"), {
  ssr: false,
  loading: () => <HeroCanvasSkeleton />,
});

const LABELS: OutboxPatternLabels = {
  service: "Serviço",
  paymentsTable: "tabela pagamentos",
  outboxTable: "tabela outbox",
  relay: "Relay / Debezium",
  relaySub: "(CDC)",
  kafka: "Kafka",
};

const STEP_LABELS = ["Grava", "Lê (CDC)", "Publica"];
const AUTOPLAY_INTERVAL_MS = 4500;

export function OutboxPatternDiagramSvg() {
  return (
    <svg
      viewBox="0 0 640 240"
      role="img"
      aria-label="O servico grava a tabela de negocio e a tabela outbox na mesma transacao de banco. Um processo relay (CDC, ex. Debezium) le a tabela outbox e publica os eventos no Kafka de forma confiavel."
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-outbox"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--color-text-muted)" />
        </marker>
      </defs>

      <rect
        x="10"
        y="70"
        width="110"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="65"
        y="99"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[12px] font-semibold"
      >
        Serviço
      </text>

      <line
        x1="120"
        y1="95"
        x2="170"
        y2="95"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-outbox)"
      />

      <rect
        x="170"
        y="30"
        width="250"
        height="130"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x="295"
        y="20"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        mesma transação
      </text>

      <rect
        x="188"
        y="50"
        width="100"
        height="45"
        rx="6"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="238"
        y="76"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-medium"
      >
        tabela pagamentos
      </text>

      <rect
        x="188"
        y="115"
        width="100"
        height="45"
        rx="6"
        className="fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
        strokeWidth="1.5"
      />
      <text
        x="238"
        y="141"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-medium"
      >
        tabela outbox
      </text>

      <line
        x1="288"
        y1="138"
        x2="470"
        y2="95"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrow-outbox)"
      />
      <text
        x="400"
        y="105"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        lê (CDC)
      </text>

      <rect
        x="470"
        y="70"
        width="150"
        height="50"
        rx="8"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="545"
        y="90"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        Relay / Debezium
      </text>
      <text
        x="545"
        y="105"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        (CDC)
      </text>

      <text
        x="545"
        y="200"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        publica no Kafka →
      </text>

      <text
        x="320"
        y="225"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        Se a transação falhar, nem o pagamento nem o evento outbox existem: nunca um sem o outro.
      </text>
    </svg>
  );
}

export function OutboxPatternDiagram() {
  const shouldRender3D = useShouldRender3D();
  const { step, goTo } = useStepCarousel(STEP_LABELS.length, shouldRender3D, AUTOPLAY_INTERVAL_MS);

  if (!shouldRender3D) {
    return <OutboxPatternDiagramSvg />;
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl">
        <div aria-hidden="true" className="h-full w-full">
          <OutboxPatternScene step={step} labels={LABELS} />
        </div>
        <DiagramStepArrows step={step} onGoTo={goTo} prevLabel="Etapa anterior" nextLabel="Próxima etapa" />
      </div>
      <DiagramStepDots step={step} stepLabels={STEP_LABELS} onGoTo={goTo} goToLabel="Ir para a etapa" />
    </div>
  );
}
