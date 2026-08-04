function Broker({
  x,
  label,
  role,
  down,
}: {
  x: number;
  label: string;
  role: string;
  down?: boolean;
}) {
  return (
    <g opacity={down ? 0.35 : 1}>
      <rect
        x={x}
        y={30}
        width={120}
        height={80}
        rx={8}
        className={
          down
            ? "fill-[var(--color-bg)] stroke-[var(--color-border)]"
            : role === "Leader"
              ? "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
              : "fill-[var(--color-bg)] stroke-[var(--color-border)]"
        }
        strokeWidth="2"
        strokeDasharray={down ? "4 3" : undefined}
      />
      <text
        x={x + 60}
        y={58}
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[12px] font-semibold"
      >
        {label}
      </text>
      <text
        x={x + 60}
        y={78}
        textAnchor="middle"
        className={
          down
            ? "fill-[var(--color-text-muted)] text-[11px] font-medium"
            : role === "Leader"
              ? "fill-[var(--color-accent)] text-[11px] font-medium"
              : "fill-[var(--color-text-muted)] text-[11px] font-medium"
        }
      >
        {down ? "indisponível" : role}
      </text>
      {down ? (
        <line
          x1={x + 15}
          y1={45}
          x2={x + 105}
          y2={95}
          stroke="var(--color-text-muted)"
          strokeWidth="2"
        />
      ) : null}
    </g>
  );
}

export function LeaderFailoverDiagram() {
  return (
    <svg
      viewBox="0 0 640 320"
      role="img"
      aria-label="Antes: Broker 1 é leader. Depois da queda do Broker 1, o Broker 2 (antes follower no ISR) é eleito novo leader."
      className="mx-auto w-full max-w-2xl"
    >
      <text
        x="20"
        y="20"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        Antes
      </text>
      <Broker x={20} label="Broker 1" role="Leader" />
      <Broker x={160} label="Broker 2" role="Follower (ISR)" />
      <Broker x={300} label="Broker 3" role="Follower (ISR)" />

      <line x1="20" y1="150" x2="620" y2="150" stroke="var(--color-border)" strokeWidth="1" />

      <text
        x="20"
        y="180"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        Depois (Broker 1 cai)
      </text>
      <g transform="translate(0, 160)">
        <Broker x={20} label="Broker 1" role="Leader" down />
        <Broker x={160} label="Broker 2" role="Leader" />
        <Broker x={300} label="Broker 3" role="Follower (ISR)" />
      </g>

      <text
        x="460"
        y="240"
        className="fill-[var(--color-text-muted)] text-[11px]"
        textAnchor="middle"
      >
        eleito a partir do ISR,
      </text>
      <text
        x="460"
        y="256"
        className="fill-[var(--color-text-muted)] text-[11px]"
        textAnchor="middle"
      >
        sem perda de dados confirmados
      </text>
    </svg>
  );
}
