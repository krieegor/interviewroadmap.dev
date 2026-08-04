export function BrokerClusterDiagramEn() {
  return (
    <svg
      viewBox="0 0 640 220"
      role="img"
      aria-label="Cluster with three brokers: one Leader and two Followers replicating the same partition"
      className="mx-auto w-full max-w-2xl"
    >
      <rect
        x="10"
        y="10"
        width="620"
        height="200"
        rx="10"
        className="fill-[var(--color-bg-subtle)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text x="30" y="34" className="fill-[var(--color-text-muted)] text-[12px]">
        Kafka Cluster
      </text>

      <g>
        <rect
          x="50"
          y="60"
          width="150"
          height="110"
          rx="8"
          className="fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
          strokeWidth="2"
        />
        <text
          x="125"
          y="90"
          textAnchor="middle"
          className="fill-[var(--color-text)] text-[13px] font-semibold"
        >
          Broker 1
        </text>
        <text
          x="125"
          y="112"
          textAnchor="middle"
          className="fill-[var(--color-accent)] text-[12px] font-medium"
        >
          Leader
        </text>
        <text
          x="125"
          y="132"
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-[11px]"
        >
          partition 0
        </text>
      </g>

      <g>
        <rect
          x="245"
          y="60"
          width="150"
          height="110"
          rx="8"
          className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
          strokeWidth="1.5"
        />
        <text
          x="320"
          y="90"
          textAnchor="middle"
          className="fill-[var(--color-text)] text-[13px] font-semibold"
        >
          Broker 2
        </text>
        <text
          x="320"
          y="112"
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-[12px]"
        >
          Follower
        </text>
        <text
          x="320"
          y="132"
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-[11px]"
        >
          partition 0 replica
        </text>
      </g>

      <g>
        <rect
          x="440"
          y="60"
          width="150"
          height="110"
          rx="8"
          className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
          strokeWidth="1.5"
        />
        <text
          x="515"
          y="90"
          textAnchor="middle"
          className="fill-[var(--color-text)] text-[13px] font-semibold"
        >
          Broker 3
        </text>
        <text
          x="515"
          y="112"
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-[12px]"
        >
          Follower
        </text>
        <text
          x="515"
          y="132"
          textAnchor="middle"
          className="fill-[var(--color-text-muted)] text-[11px]"
        >
          partition 0 replica
        </text>
      </g>

      <line
        x1="200"
        y1="115"
        x2="245"
        y2="115"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <line
        x1="395"
        y1="115"
        x2="440"
        y2="115"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <text
        x="320"
        y="190"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        replication (ISR)
      </text>
    </svg>
  );
}
