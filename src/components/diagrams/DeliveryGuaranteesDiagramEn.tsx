"use client";

import dynamic from "next/dynamic";
import { useShouldRender3D } from "@/components/three/webgl-support";
import { HeroCanvasSkeleton } from "@/components/hero/HeroCanvasSkeleton";
import { useStepCarousel } from "@/lib/hooks/useStepCarousel";
import { DiagramStepArrows, DiagramStepDots } from "@/components/hero/ChapterDiagramControls";
import type { DeliveryGuaranteesLabels } from "@/components/three/diagrams/DeliveryGuaranteesScene";

const DeliveryGuaranteesScene = dynamic(
  () => import("@/components/three/diagrams/DeliveryGuaranteesScene"),
  { ssr: false, loading: () => <HeroCanvasSkeleton /> },
);

const LABELS: DeliveryGuaranteesLabels = {
  producer: "Producer",
  kafka: "Kafka",
  consumer: "Consumer",
  steps: [
    { title: "At Most Once", outcome: "message may be lost" },
    { title: "At Least Once", outcome: "message may be duplicated" },
    { title: "Exactly Once", outcome: "processed exactly once" },
  ],
};

const STEP_LABELS = ["At Most Once", "At Least Once", "Exactly Once"];
const AUTOPLAY_INTERVAL_MS = 4500;

function Lane({
  y,
  title,
  outcome,
  outcomeTone,
  failAt,
}: {
  y: number;
  title: string;
  outcome: string;
  outcomeTone: "red" | "amber" | "emerald";
  failAt: number;
}) {
  const toneClass =
    outcomeTone === "red"
      ? "fill-red-500"
      : outcomeTone === "amber"
        ? "fill-amber-500"
        : "fill-emerald-600";

  return (
    <g>
      <text x="0" y={y - 8} className="fill-[var(--color-text)] text-[12px] font-semibold">
        {title}
      </text>

      <rect
        x="0"
        y={y}
        width="90"
        height="34"
        rx="5"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="45"
        y={y + 21}
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[10px] font-medium"
      >
        Producer
      </text>

      <line
        x1="90"
        y1={y + 17}
        x2="150"
        y2={y + 17}
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />

      <rect
        x="150"
        y={y}
        width="90"
        height="34"
        rx="5"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="195"
        y={y + 21}
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[10px] font-medium"
      >
        Kafka
      </text>

      <line
        x1="240"
        y1={y + 17}
        x2="300"
        y2={y + 17}
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />

      <rect
        x="300"
        y={y}
        width="90"
        height="34"
        rx="5"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="345"
        y={y + 21}
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[10px] font-medium"
      >
        Consumer
      </text>

      <text x={failAt} y={y - 8} className="text-[14px] font-bold" textAnchor="middle">
        <tspan className={toneClass}>×</tspan>
      </text>

      <text x="410" y={y + 21} className={`text-[11px] font-medium ${toneClass}`}>
        {outcome}
      </text>
    </g>
  );
}

export function DeliveryGuaranteesDiagramEnSvg() {
  return (
    <svg
      viewBox="0 0 620 220"
      role="img"
      aria-label="At Most Once: a failure before the ack can lose the message. At Least Once: a failure after processing and before the commit duplicates the message. Exactly Once: idempotency and transactions guarantee single processing even with a failure."
      className="mx-auto w-full max-w-2xl"
    >
      <g transform="translate(10, 30)">
        <Lane
          y={0}
          title="At Most Once"
          outcome="message may be lost"
          outcomeTone="red"
          failAt={120}
        />
        <Lane
          y={70}
          title="At Least Once"
          outcome="message may be duplicated"
          outcomeTone="amber"
          failAt={345}
        />
        <Lane
          y={140}
          title="Exactly Once"
          outcome="processed exactly once"
          outcomeTone="emerald"
          failAt={345}
        />
      </g>
    </svg>
  );
}

export function DeliveryGuaranteesDiagramEn() {
  const shouldRender3D = useShouldRender3D();
  const { step, goTo } = useStepCarousel(STEP_LABELS.length, shouldRender3D, AUTOPLAY_INTERVAL_MS);

  if (!shouldRender3D) {
    return <DeliveryGuaranteesDiagramEnSvg />;
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl">
        <div aria-hidden="true" className="h-full w-full">
          <DeliveryGuaranteesScene step={step} labels={LABELS} />
        </div>
        <DiagramStepArrows step={step} onGoTo={goTo} prevLabel="Previous step" nextLabel="Next step" />
      </div>
      <DiagramStepDots step={step} stepLabels={STEP_LABELS} onGoTo={goTo} goToLabel="Go to step" />
    </div>
  );
}
