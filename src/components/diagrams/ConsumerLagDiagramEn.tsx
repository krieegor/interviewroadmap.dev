export function ConsumerLagDiagramEn() {
  const offsets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const consumerOffset = 4;
  const logEndOffset = 9;

  return (
    <svg
      viewBox="0 0 700 180"
      role="img"
      aria-label="The producer has already written up to offset 9 (log end offset). The consumer has only processed up to offset 4. Consumer lag is the difference between the two: 5 messages not yet processed."
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
        consumer at 4
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
        log end: 9
      </text>

      <text x="350" y="150" textAnchor="middle" className="fill-red-500 text-[12px] font-semibold">
        consumer lag = 9 - 4 = 5 pending messages
      </text>
    </svg>
  );
}
