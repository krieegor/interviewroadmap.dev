export function IdempotencyDiagram() {
  return (
    <svg
      viewBox="0 0 640 220"
      role="img"
      aria-label="Evento chega com um eventId; o consumer verifica se esse eventId ja existe na tabela de eventos processados; se existir, ignora; se nao existir, insere o eventId e aplica o efeito na mesma transacao de banco."
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-idem"
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
        y="30"
        width="150"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="85"
        y="52"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        Evento chega
      </text>
      <text
        x="85"
        y="68"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        eventId = X
      </text>

      <line
        x1="160"
        y1="55"
        x2="220"
        y2="55"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-idem)"
      />

      <rect
        x="220"
        y="20"
        width="200"
        height="70"
        rx="8"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="320"
        y="48"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        eventId X já existe em
      </text>
      <text
        x="320"
        y="63"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        eventos_processados?
      </text>
      <text
        x="320"
        y="80"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        (mesma transação)
      </text>

      <line
        x1="320"
        y1="90"
        x2="320"
        y2="130"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-idem)"
      />
      <text x="332" y="115" className="fill-[var(--color-text-muted)] text-[10px]">
        sim
      </text>

      <rect
        x="220"
        y="130"
        width="200"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="320"
        y="152"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        Ignora
      </text>
      <text
        x="320"
        y="168"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        evento já processado
      </text>

      <line
        x1="420"
        y1="55"
        x2="470"
        y2="55"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-idem)"
      />
      <text
        x="445"
        y="45"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        não
      </text>

      <rect
        x="470"
        y="20"
        width="160"
        height="70"
        rx="8"
        className="fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
        strokeWidth="1.5"
      />
      <text
        x="550"
        y="45"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        Insere eventId +
      </text>
      <text
        x="550"
        y="60"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        aplica efeito
      </text>
      <text
        x="550"
        y="78"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[10px] font-medium"
      >
        mesma transação
      </text>

      <text
        x="320"
        y="210"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        Constraint de unicidade em eventId garante atomicidade mesmo sob concorrência.
      </text>
    </svg>
  );
}
