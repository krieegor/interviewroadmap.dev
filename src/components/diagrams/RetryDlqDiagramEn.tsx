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
  topic: "Topic: payments",
  consumer: "Consumer",
  consumerFail: "fails to process",
  retryTopic: "Topic: payments-retry",
  backoff: "exponential backoff",
  dlqTopic: "Topic: payments-dlq",
  dlqSub: "manual investigation",
};

const STEP_LABELS = ["Tries to process", "Retry with backoff", "Exhausted, goes to DLQ"];
const AUTOPLAY_INTERVAL_MS = 4500;

export function RetryDlqDiagramEnSvg() {
  return (
    <svg
      viewBox="0 0 700 260"
      role="img"
      aria-label="Main topic sends to the consumer; transient failures go to the retry topic with backoff; once attempts are exhausted, the message goes to the Dead Letter Topic, without blocking the rest of the main topic's messages."
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-retry-en"
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
        Topic: payments
      </text>

      <line
        x1="150"
        y1="55"
        x2="210"
        y2="55"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-retry-en)"
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
        fails to process
      </text>

      <line
        x1="280"
        y1="80"
        x2="280"
        y2="120"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-retry-en)"
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
        Topic: payments-retry
      </text>
      <text
        x="280"
        y="158"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[10px] font-medium"
      >
        exponential backoff (1, 2, 3...)
      </text>

      <line
        x1="340"
        y1="120"
        x2="340"
        y2="70"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrow-retry-en)"
      />
      <text x="352" y="98" className="fill-[var(--color-text-muted)] text-[10px]">
        reprocesses
      </text>

      <line
        x1="375"
        y1="145"
        x2="460"
        y2="145"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-retry-en)"
      />
      <text
        x="417"
        y="128"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[9px]"
      >
        attempts
      </text>
      <text
        x="417"
        y="140"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[9px]"
      >
        exhausted
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
        Topic: payments-dlq
      </text>
      <text x="555" y="158" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">
        manual investigation
      </text>

      <text
        x="300"
        y="210"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        The rest of the main topic&apos;s messages keep being processed normally.
      </text>
      <text
        x="300"
        y="226"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        The problematic message doesn&apos;t block the partition (no poison pill effect).
      </text>
    </svg>
  );
}

export function RetryDlqDiagramEn() {
  const shouldRender3D = useShouldRender3D();
  const { step, goTo } = useStepCarousel(STEP_LABELS.length, shouldRender3D, AUTOPLAY_INTERVAL_MS);

  if (!shouldRender3D) {
    return <RetryDlqDiagramEnSvg />;
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl">
        <div aria-hidden="true" className="h-full w-full">
          <RetryDlqScene step={step} labels={LABELS} />
        </div>
        <DiagramStepArrows step={step} onGoTo={goTo} prevLabel="Previous step" nextLabel="Next step" />
      </div>
      <DiagramStepDots step={step} stepLabels={STEP_LABELS} onGoTo={goTo} goToLabel="Go to step" />
    </div>
  );
}
