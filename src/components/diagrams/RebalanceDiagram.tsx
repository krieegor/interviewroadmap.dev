"use client";

import dynamic from "next/dynamic";
import { useShouldRender3D } from "@/components/three/webgl-support";
import { HeroCanvasSkeleton } from "@/components/hero/HeroCanvasSkeleton";
import { useStepCarousel } from "@/lib/hooks/useStepCarousel";
import { DiagramStepArrows, DiagramStepDots } from "@/components/hero/ChapterDiagramControls";
import type { RebalanceLabels } from "@/components/three/diagrams/RebalanceScene";

const RebalanceScene = dynamic(() => import("@/components/three/diagrams/RebalanceScene"), {
  ssr: false,
  loading: () => <HeroCanvasSkeleton />,
});

const LABELS: RebalanceLabels = {
  partition0: "Partition 0",
  partition1: "Partition 1",
  partition2: "Partition 2",
  consumer1: "Consumer 1",
  consumer2: "Consumer 2",
  consumer3: "Consumer 3",
  down: "caiu",
};

const STEP_LABELS = ["Antes do rebalance", "Depois (Consumer 2 cai)"];
const AUTOPLAY_INTERVAL_MS = 4500;

function PartitionBox({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="90"
        height="30"
        rx="5"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x={x + 45}
        y={y + 20}
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-medium"
      >
        {label}
      </text>
    </g>
  );
}

function ConsumerBox({
  x,
  y,
  label,
  down,
  highlight,
}: {
  x: number;
  y: number;
  label: string;
  down?: boolean;
  highlight?: boolean;
}) {
  return (
    <g opacity={down ? 0.35 : 1}>
      <rect
        x={x}
        y={y}
        width="90"
        height="30"
        rx="5"
        className={
          highlight
            ? "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
            : "fill-[var(--color-surface)] stroke-[var(--color-border)]"
        }
        strokeWidth="1.5"
        strokeDasharray={down ? "3 3" : undefined}
      />
      <text
        x={x + 45}
        y={y + 20}
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-medium"
      >
        {label}
      </text>
    </g>
  );
}

export function RebalanceDiagramSvg() {
  return (
    <svg
      viewBox="0 0 640 280"
      role="img"
      aria-label="Antes: 3 partitions, 3 consumers, um por partition. Consumer 2 cai. Depois do rebalance: Consumer 1 e Consumer 3 dividem as 3 partitions entre si."
      className="mx-auto w-full max-w-2xl"
    >
      <text
        x="20"
        y="18"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        Antes do rebalance
      </text>
      <PartitionBox x={20} y={30} label="Partition 0" />
      <PartitionBox x={130} y={30} label="Partition 1" />
      <PartitionBox x={240} y={30} label="Partition 2" />

      <line x1="65" y1="60" x2="65" y2="80" stroke="var(--color-text-muted)" strokeWidth="1.5" />
      <line x1="175" y1="60" x2="175" y2="80" stroke="var(--color-text-muted)" strokeWidth="1.5" />
      <line x1="285" y1="60" x2="285" y2="80" stroke="var(--color-text-muted)" strokeWidth="1.5" />

      <ConsumerBox x={20} y={80} label="Consumer 1" />
      <ConsumerBox x={130} y={80} label="Consumer 2" />
      <ConsumerBox x={240} y={80} label="Consumer 3" />

      <line x1="20" y1="135" x2="620" y2="135" stroke="var(--color-border)" strokeWidth="1" />

      <text
        x="20"
        y="155"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        Depois (Consumer 2 cai)
      </text>
      <g transform="translate(0, 165)">
        <PartitionBox x={20} y={0} label="Partition 0" />
        <PartitionBox x={130} y={0} label="Partition 1" />
        <PartitionBox x={240} y={0} label="Partition 2" />

        <line x1="65" y1="30" x2="65" y2="50" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        <line x1="175" y1="30" x2="65" y2="50" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        <line
          x1="285"
          y1="30"
          x2="285"
          y2="50"
          stroke="var(--color-text-muted)"
          strokeWidth="1.5"
        />

        <ConsumerBox x={20} y={50} label="Consumer 1" highlight />
        <ConsumerBox x={130} y={50} label="Consumer 2" down />
        <ConsumerBox x={240} y={50} label="Consumer 3" highlight />
      </g>

      <text
        x="460"
        y="240"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        Consumer 1 assume também
      </text>
      <text
        x="460"
        y="256"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        a Partition 1
      </text>
    </svg>
  );
}

export function RebalanceDiagram() {
  const shouldRender3D = useShouldRender3D();
  const { step, goTo } = useStepCarousel(STEP_LABELS.length, shouldRender3D, AUTOPLAY_INTERVAL_MS);

  if (!shouldRender3D) {
    return <RebalanceDiagramSvg />;
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl">
        <div aria-hidden="true" className="h-full w-full">
          <RebalanceScene step={step} labels={LABELS} />
        </div>
        <DiagramStepArrows step={step} onGoTo={goTo} prevLabel="Etapa anterior" nextLabel="Próxima etapa" />
      </div>
      <DiagramStepDots step={step} stepLabels={STEP_LABELS} onGoTo={goTo} goToLabel="Ir para a etapa" />
    </div>
  );
}
