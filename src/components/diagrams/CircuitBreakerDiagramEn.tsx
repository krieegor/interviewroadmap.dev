export function CircuitBreakerDiagramEn() {
  return (
    <svg
      viewBox="0 0 640 220"
      role="img"
      aria-label="Closed circuit breaker allows calls normally; after many failures, it opens and starts rejecting calls immediately; after a timeout, it enters half-open testing one call; if it succeeds it goes back to closed, if it fails it goes back to open."
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-cbrk-en"
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
        x="30"
        y="70"
        width="150"
        height="60"
        rx="10"
        className="fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
        strokeWidth="2"
      />
      <text
        x="105"
        y="95"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[13px] font-semibold"
      >
        Closed
      </text>
      <text
        x="105"
        y="112"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[10px] font-medium"
      >
        normal calls
      </text>

      <rect
        x="245"
        y="70"
        width="150"
        height="60"
        rx="10"
        className="fill-[var(--color-bg)] stroke-red-500"
        strokeWidth="2"
      />
      <text
        x="320"
        y="95"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[13px] font-semibold"
      >
        Open
      </text>
      <text x="320" y="112" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">
        rejects immediately
      </text>

      <rect
        x="460"
        y="70"
        width="150"
        height="60"
        rx="10"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="2"
      />
      <text
        x="535"
        y="95"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[13px] font-semibold"
      >
        Half-Open
      </text>
      <text
        x="535"
        y="112"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px] font-medium"
      >
        tests 1 call
      </text>

      <line
        x1="180"
        y1="100"
        x2="245"
        y2="100"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-cbrk-en)"
      />
      <text
        x="212"
        y="85"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[9px]"
      >
        many failures
      </text>

      <line
        x1="395"
        y1="100"
        x2="460"
        y2="100"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-cbrk-en)"
      />
      <text
        x="427"
        y="85"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[9px]"
      >
        after timeout
      </text>

      <path
        d="M 535 130 Q 320 190 105 130"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-cbrk-en)"
      />
      <text
        x="320"
        y="185"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[10px] font-medium"
      >
        test call succeeded
      </text>

      <path
        d="M 505 70 Q 400 20 210 70"
        fill="none"
        stroke="red"
        strokeWidth="1.5"
        markerEnd="url(#arrow-cbrk-en)"
      />
      <text x="357" y="35" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">
        test call failed
      </text>
    </svg>
  );
}
