export function KeyPartitioningDiagramEn() {
  const keys = [
    { label: "account-101", partition: 0 },
    { label: "account-204", partition: 2 },
    { label: "account-101", partition: 0 },
    { label: "account-357", partition: 1 },
    { label: "account-204", partition: 2 },
  ];

  return (
    <svg
      viewBox="0 0 640 260"
      role="img"
      aria-label="Messages with the same key are hashed to always land on the same partition"
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-key-en"
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

      {keys.map((key, i) => (
        <g key={i}>
          <rect
            x="10"
            y={20 + i * 44}
            width="120"
            height="32"
            rx="6"
            className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
            strokeWidth="1.5"
          />
          <text
            x="70"
            y={20 + i * 44 + 20}
            textAnchor="middle"
            className="fill-[var(--color-text)] text-[11px] font-medium"
          >
            key={key.label}
          </text>
          <line
            x1="130"
            y1={20 + i * 44 + 16}
            x2="220"
            y2={20 + i * 44 + 16}
            stroke="var(--color-text-muted)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </g>
      ))}

      <rect
        x="220"
        y="90"
        width="90"
        height="70"
        rx="8"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="265"
        y="120"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        hash(key)
      </text>
      <text
        x="265"
        y="136"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        % partitions
      </text>

      {keys.map((key, i) => (
        <line
          key={i}
          x1="310"
          y1="125"
          x2="420"
          y2={65 + key.partition * 55}
          stroke="var(--color-text-muted)"
          strokeWidth="1"
          markerEnd="url(#arrow-key-en)"
        />
      ))}

      {[0, 1, 2].map((p) => (
        <g key={p}>
          <rect
            x="420"
            y={50 + p * 55}
            width="200"
            height="34"
            rx="6"
            className={
              p === 0
                ? "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
                : "fill-[var(--color-bg)] stroke-[var(--color-border)]"
            }
            strokeWidth="1.5"
          />
          <text
            x="520"
            y={50 + p * 55 + 22}
            textAnchor="middle"
            className="fill-[var(--color-text)] text-[11px] font-medium"
          >
            Partition {p}
          </text>
        </g>
      ))}
    </svg>
  );
}
