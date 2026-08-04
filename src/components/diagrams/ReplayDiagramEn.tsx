function OffsetRow({
  y,
  label,
  markerOffset,
  markerLabel,
  reprocessFrom,
  reprocessTo,
}: {
  y: number;
  label: string;
  markerOffset: number;
  markerLabel: string;
  reprocessFrom?: number;
  reprocessTo?: number;
}) {
  const offsets = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <g>
      <text
        x="20"
        y={y - 10}
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold uppercase"
      >
        {label}
      </text>
      {offsets.map((offset) => {
        const x = 20 + offset * 75;
        const isReprocessing =
          reprocessFrom !== undefined &&
          reprocessTo !== undefined &&
          offset >= reprocessFrom &&
          offset <= reprocessTo;
        return (
          <g key={offset}>
            <rect
              x={x}
              y={y}
              width="60"
              height="34"
              rx="4"
              className={
                isReprocessing
                  ? "fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
                  : "fill-[var(--color-bg)] stroke-[var(--color-border)]"
              }
              strokeWidth="1.5"
              strokeDasharray={isReprocessing ? "3 3" : undefined}
            />
            <text
              x={x + 30}
              y={y + 22}
              textAnchor="middle"
              className="fill-[var(--color-text)] text-[12px] font-medium"
            >
              {offset}
            </text>
          </g>
        );
      })}
      <line
        x1={20 + markerOffset * 75 + 30}
        y1={y + 34}
        x2={20 + markerOffset * 75 + 30}
        y2={y + 50}
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
      />
      <text
        x={20 + markerOffset * 75 + 30}
        y={y + 64}
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[11px] font-semibold"
      >
        {markerLabel}
      </text>
    </g>
  );
}

export function ReplayDiagramEn() {
  return (
    <svg
      viewBox="0 0 640 260"
      role="img"
      aria-label="Before replay: offset committed at 6. After resetting the offset to 2: the Consumer Group reprocesses offsets 2 through 6 again."
      className="mx-auto w-full max-w-2xl"
    >
      <OffsetRow y={30} label="Before replay" markerOffset={6} markerLabel="committed offset" />
      <line x1="20" y1="130" x2="620" y2="130" stroke="var(--color-border)" strokeWidth="1" />
      <OffsetRow
        y={160}
        label="After resetting the offset to 2"
        markerOffset={2}
        markerLabel="new read position"
        reprocessFrom={2}
        reprocessTo={6}
      />
    </svg>
  );
}
