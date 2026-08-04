export function ProducerConsumerFlowEn() {
  return (
    <svg
      viewBox="0 0 720 260"
      role="img"
      aria-label="Producer sends messages to a Topic split into Partitions, read by Consumers in a Consumer Group"
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-en"
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
        y="100"
        width="120"
        height="60"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="70"
        y="135"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[13px] font-medium"
      >
        Producer
      </text>

      <line
        x1="130"
        y1="130"
        x2="190"
        y2="130"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-en)"
      />

      <rect
        x="190"
        y="40"
        width="180"
        height="180"
        rx="8"
        className="fill-[var(--color-bg-subtle)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="280"
        y="28"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[12px]"
      >
        Topic: payments
      </text>

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="205"
            y={55 + i * 55}
            width="150"
            height="40"
            rx="4"
            className={
              i === 0
                ? "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
                : "fill-[var(--color-bg)] stroke-[var(--color-border)]"
            }
            strokeWidth="1.5"
          />
          <text
            x="280"
            y={55 + i * 55 + 25}
            textAnchor="middle"
            className="fill-[var(--color-text)] text-[12px]"
          >
            Partition {i}
          </text>
        </g>
      ))}

      <line
        x1="370"
        y1="75"
        x2="430"
        y2="75"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-en)"
      />
      <line
        x1="370"
        y1="130"
        x2="430"
        y2="130"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-en)"
      />
      <line
        x1="370"
        y1="185"
        x2="430"
        y2="185"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-en)"
      />

      <rect
        x="430"
        y="20"
        width="280"
        height="220"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x="570"
        y="14"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[12px]"
      >
        Consumer Group: notification-service
      </text>

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="450"
            y={40 + i * 60}
            width="140"
            height="40"
            rx="6"
            className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
            strokeWidth="1.5"
          />
          <text
            x="520"
            y={40 + i * 60 + 25}
            textAnchor="middle"
            className="fill-[var(--color-text)] text-[12px]"
          >
            Consumer {i}
          </text>
        </g>
      ))}
    </svg>
  );
}
