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

export function DeliveryGuaranteesDiagram() {
  return (
    <svg
      viewBox="0 0 620 220"
      role="img"
      aria-label="At Most Once: falha antes do ack pode perder a mensagem. At Least Once: falha depois do processamento e antes do commit duplica a mensagem. Exactly Once: idempotencia e transacoes garantem processamento unico mesmo com falha."
      className="mx-auto w-full max-w-2xl"
    >
      <g transform="translate(10, 30)">
        <Lane
          y={0}
          title="At Most Once"
          outcome="mensagem pode ser perdida"
          outcomeTone="red"
          failAt={120}
        />
        <Lane
          y={70}
          title="At Least Once"
          outcome="mensagem pode ser duplicada"
          outcomeTone="amber"
          failAt={345}
        />
        <Lane
          y={140}
          title="Exactly Once"
          outcome="processada exatamente uma vez"
          outcomeTone="emerald"
          failAt={345}
        />
      </g>
    </svg>
  );
}
