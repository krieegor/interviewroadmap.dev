export function OutboxPatternDiagramEn() {
  return (
    <svg
      viewBox="0 0 640 240"
      role="img"
      aria-label="The service writes the business table and the outbox table in the same database transaction. A relay process (CDC, e.g. Debezium) reads the outbox table and reliably publishes the events to Kafka."
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-outbox-en"
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
        y="70"
        width="110"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="65"
        y="99"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[12px] font-semibold"
      >
        Service
      </text>

      <line
        x1="120"
        y1="95"
        x2="170"
        y2="95"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-outbox-en)"
      />

      <rect
        x="170"
        y="30"
        width="250"
        height="130"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x="295"
        y="20"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        same transaction
      </text>

      <rect
        x="188"
        y="50"
        width="100"
        height="45"
        rx="6"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="238"
        y="76"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-medium"
      >
        payments table
      </text>

      <rect
        x="188"
        y="115"
        width="100"
        height="45"
        rx="6"
        className="fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
        strokeWidth="1.5"
      />
      <text
        x="238"
        y="141"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-medium"
      >
        outbox table
      </text>

      <line
        x1="288"
        y1="138"
        x2="470"
        y2="95"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#arrow-outbox-en)"
      />
      <text
        x="400"
        y="105"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        reads (CDC)
      </text>

      <rect
        x="470"
        y="70"
        width="150"
        height="50"
        rx="8"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="545"
        y="90"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        Relay / Debezium
      </text>
      <text
        x="545"
        y="105"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        (CDC)
      </text>

      <text
        x="545"
        y="200"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        publishes to Kafka →
      </text>

      <text
        x="320"
        y="225"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        If the transaction fails, neither the payment nor the outbox event exists — never one without the other.
      </text>
    </svg>
  );
}
