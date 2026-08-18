"use client";

import dynamic from "next/dynamic";
import { useShouldRender3D } from "@/components/three/webgl-support";
import { HeroCanvasSkeleton } from "@/components/hero/HeroCanvasSkeleton";
import { useStepCarousel } from "@/lib/hooks/useStepCarousel";
import { DiagramStepArrows, DiagramStepDots } from "@/components/hero/ChapterDiagramControls";
import type { RetryDlqLabels } from "@/components/three/diagrams/RetryDlqScene";

const RetryDlqScene = dynamic(() => import("@/components/three/diagrams/RetryDlqScene"), {
  ssr: false,
  loading: () => <HeroCanvasSkeleton />,
});

const LABELS: RetryDlqLabels = {
  topic: "Topic: pagamentos",
  consumer: "Consumer",
  consumerFail: "falha ao processar",
  retryTopic: "Topic: pagamentos-retry",
  backoff: "backoff exponencial",
  dlqTopic: "Topic: pagamentos-dlq",
  dlqSub: "investigação manual",
};

const STEP_LABELS = ["Tenta processar", "Retry com backoff", "Esgotou, vai pro DLQ"];
const AUTOPLAY_INTERVAL_MS = 4500;

export function RetryDlqDiagramSvg() {
  return (
    <svg
      viewBox="0 0 700 260"
      role="img"
      aria-label="Topico principal envia ao consumer; falhas transitorias vao para o topico de retry com backoff; apos esgotar as tentativas, a mensagem vai para o Dead Letter Topic, sem bloquear as demais mensagens do topico principal."
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-retry"
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
        y="30"
        width="140"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="80"
        y="60"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[12px] font-semibold"
      >
        Topic: pagamentos
      </text>

      <line
        x1="150"
        y1="55"
        x2="210"
        y2="55"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-retry)"
      />

      <rect
        x="210"
        y="30"
        width="140"
        height="50"
        rx="8"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="280"
        y="55"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[12px] font-semibold"
      >
        Consumer
      </text>
      <text
        x="280"
        y="70"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        falha ao processar
      </text>

      <line
        x1="280"
        y1="80"
        x2="280"
        y2="120"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-retry)"
      />

      <rect
        x="185"
        y="120"
        width="190"
        height="50"
        rx="8"
        className="fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
        strokeWidth="1.5"
      />
      <text
        x="280"
        y="142"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[12px] font-semibold"
      >
        Topic: pagamentos-retry
      </text>
      <text
        x="280"
        y="158"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[10px] font-medium"
      >
        backoff exponencial (1, 2, 3...)
      </text>

      <line
        x1="340"
        y1="120"
        x2="340"
        y2="70"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrow-retry)"
      />
      <text x="352" y="98" className="fill-[var(--color-text-muted)] text-[10px]">
        reprocessa
      </text>

      <line
        x1="375"
        y1="145"
        x2="460"
        y2="145"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-retry)"
      />
      <text
        x="417"
        y="128"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[9px]"
      >
        esgotou
      </text>
      <text
        x="417"
        y="140"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[9px]"
      >
        tentativas
      </text>

      <rect
        x="460"
        y="120"
        width="190"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-red-500"
        strokeWidth="1.5"
      />
      <text
        x="555"
        y="142"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[12px] font-semibold"
      >
        Topic: pagamentos-dlq
      </text>
      <text x="555" y="158" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">
        investigação manual
      </text>

      <text
        x="300"
        y="210"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        As demais mensagens do tópico principal continuam sendo processadas normalmente.
      </text>
      <text
        x="300"
        y="226"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        A mensagem problemática não bloqueia a partition (sem efeito poison pill).
      </text>
    </svg>
  );
}

export function RetryDlqDiagram() {
  const shouldRender3D = useShouldRender3D();
  const { step, goTo } = useStepCarousel(STEP_LABELS.length, shouldRender3D, AUTOPLAY_INTERVAL_MS);

  if (!shouldRender3D) {
    return <RetryDlqDiagramSvg />;
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl">
        <div aria-hidden="true" className="h-full w-full">
          <RetryDlqScene step={step} labels={LABELS} />
        </div>
        <DiagramStepArrows step={step} onGoTo={goTo} prevLabel="Etapa anterior" nextLabel="Próxima etapa" />
      </div>
      <DiagramStepDots step={step} stepLabels={STEP_LABELS} onGoTo={goTo} goToLabel="Ir para a etapa" />
    </div>
  );
}
