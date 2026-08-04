function PartitionBox({
  x,
  y,
  label,
  dashed,
}: {
  x: number;
  y: number;
  label: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="90"
        height="30"
        rx="5"
        className={
          dashed
            ? "fill-[var(--color-bg)] stroke-[var(--color-border)]"
            : "fill-[var(--color-bg)] stroke-[var(--color-border)]"
        }
        strokeWidth="1.5"
        strokeDasharray={dashed ? "3 3" : undefined}
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

export function RebalanceDiagramEn() {
  return (
    <svg
      viewBox="0 0 640 280"
      role="img"
      aria-label="Before: 3 partitions, 3 consumers, one per partition. Consumer 2 goes down. After the rebalance: Consumer 1 and Consumer 3 split the 3 partitions between them."
      className="mx-auto w-full max-w-2xl"
    >
      <text
        x="20"
        y="18"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        Before the rebalance
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
        After (Consumer 2 goes down)
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
        Consumer 1 also takes over
      </text>
      <text
        x="460"
        y="256"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        Partition 1
      </text>
    </svg>
  );
}
