export function OffsetCommitDiagramEn() {
  const offsets = [0, 1, 2, 3, 4, 5, 6, 7];
  const committedOffset = 3;
  const currentPosition = 6;

  return (
    <svg
      viewBox="0 0 640 180"
      role="img"
      aria-label="A partition's offset line: offsets 0 to 3 already committed, offsets 4 to 6 already processed but not yet committed (reprocessing risk zone), offset 7 not yet read."
      className="mx-auto w-full max-w-2xl"
    >
      {offsets.map((offset, i) => {
        const x = 20 + i * 75;
        const isCommitted = offset <= committedOffset;
        const isProcessedNotCommitted = offset > committedOffset && offset <= currentPosition;
        return (
          <g key={offset}>
            <rect
              x={x}
              y={40}
              width="60"
              height="40"
              rx="4"
              className={
                isCommitted
                  ? "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
                  : isProcessedNotCommitted
                    ? "fill-[var(--color-surface)] stroke-[var(--color-border)]"
                    : "fill-[var(--color-bg)] stroke-[var(--color-border)]"
              }
              strokeWidth="1.5"
              strokeDasharray={isProcessedNotCommitted ? "3 3" : undefined}
            />
            <text
              x={x + 30}
              y={65}
              textAnchor="middle"
              className="fill-[var(--color-text)] text-[12px] font-medium"
            >
              {offset}
            </text>
          </g>
        );
      })}

      <line
        x1={20 + committedOffset * 75 + 30}
        y1="90"
        x2={20 + committedOffset * 75 + 30}
        y2="110"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <text
        x={20 + committedOffset * 75 + 30}
        y="124"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[11px] font-semibold"
      >
        committed
      </text>

      <line
        x1={20 + currentPosition * 75 + 30}
        y1="90"
        x2={20 + currentPosition * 75 + 30}
        y2="110"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />
      <text
        x={20 + currentPosition * 75 + 30}
        y="124"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold"
      >
        current position
      </text>

      <text
        x="320"
        y="155"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px]"
      >
        offsets 4-6: already processed, not yet committed — reprocessed if the consumer crashes now
      </text>
    </svg>
  );
}
