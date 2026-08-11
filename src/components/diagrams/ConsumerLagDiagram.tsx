"use client";

import dynamic from "next/dynamic";
import { useShouldRender3D } from "@/components/three/webgl-support";
import { HeroCanvasSkeleton } from "@/components/hero/HeroCanvasSkeleton";
import type { ConsumerLagLabels } from "@/components/three/diagrams/ConsumerLagScene";

const ConsumerLagScene = dynamic(() => import("@/components/three/diagrams/ConsumerLagScene"), {
  ssr: false,
  loading: () => <HeroCanvasSkeleton />,
});

type ConsumerLagSvgLabels = {
  ariaLabel: string;
  consumerAt: string;
  logEnd: string;
  lag: string;
};

// Base compartilhada entre PT (`ConsumerLagDiagram`) e EN (`ConsumerLagDiagramEn`, no arquivo
// irmão) — só o texto muda entre os dois idiomas, a geometria do SVG é idêntica. Ver
// specs/roadmap.md (spike de consolidação de diagramas) antes de replicar esse padrão pros outros
// 12 pares PT/EN.
export function ConsumerLagDiagramBase({ labels }: { labels: ConsumerLagSvgLabels }) {
  const offsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const consumerOffset = 4;
  const logEndOffset = 9;

  return (
    <svg
      viewBox="0 0 700 180"
      role="img"
      aria-label={labels.ariaLabel}
      className="mx-auto w-full max-w-2xl"
    >
      {offsets.map((offset, i) => {
        const x = 20 + i * 65;
        const isPending = offset > consumerOffset;
        return (
          <g key={offset}>
            <rect
              x={x}
              y={40}
              width="55"
              height="36"
              rx="4"
              className={
                isPending
                  ? "fill-red-500/10 stroke-red-500"
                  : "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
              }
              strokeWidth="1.5"
              strokeDasharray={isPending ? "3 3" : undefined}
            />
            <text
              x={x + 27}
              y={63}
              textAnchor="middle"
              className="fill-[var(--color-text)] text-[11px] font-medium"
            >
              {offset}
            </text>
          </g>
        );
      })}

      <line
        x1={20 + consumerOffset * 65 + 27}
        y1="80"
        x2={20 + consumerOffset * 65 + 27}
        y2="100"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <text
        x={20 + consumerOffset * 65 + 27}
        y="114"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[11px] font-semibold"
      >
        {labels.consumerAt}
      </text>

      <line
        x1={20 + logEndOffset * 65 + 27}
        y1="80"
        x2={20 + logEndOffset * 65 + 27}
        y2="100"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />
      <text
        x={20 + logEndOffset * 65 + 27}
        y="114"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold"
      >
        {labels.logEnd}
      </text>

      <text x="350" y="150" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">
        {labels.lag}
      </text>
    </svg>
  );
}

export function ConsumerLagDiagramImpl({
  svgLabels,
  sceneLabels,
}: {
  svgLabels: ConsumerLagSvgLabels;
  sceneLabels: ConsumerLagLabels;
}) {
  const shouldRender3D = useShouldRender3D();

  if (!shouldRender3D) {
    return <ConsumerLagDiagramBase labels={svgLabels} />;
  }

  return (
    <div aria-hidden="true" className="mx-auto aspect-[16/7] w-full max-w-2xl">
      <ConsumerLagScene labels={sceneLabels} />
    </div>
  );
}

export function ConsumerLagDiagram() {
  return (
    <ConsumerLagDiagramImpl
      svgLabels={{
        ariaLabel:
          "O producer já escreveu até o offset 9 (log end offset). O consumer só processou até o offset 4. Consumer lag é a diferença entre os dois: 5 mensagens ainda não processadas.",
        consumerAt: "consumer em 4",
        logEnd: "log end: 9",
        lag: "consumer lag = 9 − 4 = 5 mensagens pendentes",
      }}
      sceneLabels={{ consumerAt: "consumer em 4", logEnd: "log end: 9" }}
    />
  );
}
