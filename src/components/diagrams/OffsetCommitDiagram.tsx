"use client";

import dynamic from "next/dynamic";
import { useShouldRender3D } from "@/components/three/webgl-support";
import { HeroCanvasSkeleton } from "@/components/hero/HeroCanvasSkeleton";
import type { OffsetCommitLabels } from "@/components/three/diagrams/OffsetCommitScene";

const OffsetCommitScene = dynamic(() => import("@/components/three/diagrams/OffsetCommitScene"), {
  ssr: false,
  loading: () => <HeroCanvasSkeleton />,
});

const LABELS: OffsetCommitLabels = {
  committed: "commitado",
  currentPosition: "posição atual",
};

export function OffsetCommitDiagramSvg() {
  const offsets = [0, 1, 2, 3, 4, 5, 6, 7];
  const committedOffset = 3;
  const currentPosition = 6;

  return (
    <svg
      viewBox="0 0 640 180"
      role="img"
      aria-label="Linha de offsets de uma partition: offsets 0 a 3 já commitados, offsets 4 a 6 já processados mas ainda não commitados (zona de risco de reprocessamento), offset 7 ainda não lido."
      className="mx-auto w-full max-w-2xl"
    >
      {offsets.map((offset, i) => {
        const x = 20 + i * 75;
        const isCommitted = offset <= committedOffset;
        const isProcessedNotCommitted = offset > committedOffset && offset <= currentPosition;
        return (
          <g key={offset}>
            <rect
              x={x}
              y={40}
              width="60"
              height="40"
              rx="4"
              className={
                isCommitted
                  ? "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
                  : isProcessedNotCommitted
                    ? "fill-[var(--color-surface)] stroke-[var(--color-border)]"
                    : "fill-[var(--color-bg)] stroke-[var(--color-border)]"
              }
              strokeWidth="1.5"
              strokeDasharray={isProcessedNotCommitted ? "3 3" : undefined}
            />
            <text
              x={x + 30}
              y={65}
              textAnchor="middle"
              className="fill-[var(--color-text)] text-[12px] font-medium"
            >
              {offset}
            </text>
          </g>
        );
      })}

      <line
        x1={20 + committedOffset * 75 + 30}
        y1="90"
        x2={20 + committedOffset * 75 + 30}
        y2="110"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <text
        x={20 + committedOffset * 75 + 30}
        y="124"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[11px] font-semibold"
      >
        commitado
      </text>

      <line
        x1={20 + currentPosition * 75 + 30}
        y1="90"
        x2={20 + currentPosition * 75 + 30}
        y2="110"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />
      <text
        x={20 + currentPosition * 75 + 30}
        y="124"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold"
      >
        posição atual
      </text>

      <text
        x="320"
        y="155"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        offsets 4–6: já processados, ainda não commitados — reprocessados se o consumer cair agora
      </text>
    </svg>
  );
}

export function OffsetCommitDiagram() {
  const shouldRender3D = useShouldRender3D();

  if (!shouldRender3D) {
    return <OffsetCommitDiagramSvg />;
  }

  return (
    <div aria-hidden="true" className="mx-auto aspect-[16/9] w-full max-w-2xl">
      <OffsetCommitScene labels={LABELS} />
    </div>
  );
}
