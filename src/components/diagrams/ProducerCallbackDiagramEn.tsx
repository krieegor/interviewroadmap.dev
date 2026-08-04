export function ProducerCallbackDiagramEn() {
  return (
    <svg
      viewBox="0 0 620 200"
      role="img"
      aria-label="KafkaTemplate.send() sends to the broker asynchronously; the result comes back via callback, calling onSuccess with the SendResult or onFailure with the exception."
      className="mx-auto w-full max-w-2xl"
    >
      <defs>
        <marker
          id="arrow-cb-en"
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
        y="75"
        width="170"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="95"
        y="97"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        KafkaTemplate
      </text>
      <text
        x="95"
        y="112"
        textAnchor="middle"
        className="fill-[var(--color-text-muted)] text-[10px]"
      >
        .send(topic, key, value)
      </text>

      <line
        x1="180"
        y1="100"
        x2="240"
        y2="100"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-cb-en)"
      />

      <rect
        x="240"
        y="75"
        width="120"
        height="50"
        rx="8"
        className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
        strokeWidth="1.5"
      />
      <text
        x="300"
        y="105"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        Broker
      </text>

      <line
        x1="360"
        y1="90"
        x2="420"
        y2="40"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-cb-en)"
      />
      <line
        x1="360"
        y1="110"
        x2="420"
        y2="160"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-cb-en)"
      />

      <rect
        x="420"
        y="15"
        width="190"
        height="50"
        rx="8"
        className="fill-[var(--color-accent-subtle)] stroke-[var(--color-accent)]"
        strokeWidth="1.5"
      />
      <text
        x="515"
        y="36"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        onSuccess(SendResult)
      </text>
      <text
        x="515"
        y="51"
        textAnchor="middle"
        className="fill-[var(--color-accent)] text-[10px] font-medium"
      >
        ack received
      </text>

      <rect
        x="420"
        y="135"
        width="190"
        height="50"
        rx="8"
        className="fill-[var(--color-bg)] stroke-red-500"
        strokeWidth="1.5"
      />
      <text
        x="515"
        y="156"
        textAnchor="middle"
        className="fill-[var(--color-text)] text-[11px] font-semibold"
      >
        onFailure(Throwable)
      </text>
      <text x="515" y="171" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">
        failed to publish
      </text>
    </svg>
  );
}
