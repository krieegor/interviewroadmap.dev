import { ConsumerLagDiagramBase } from "./ConsumerLagDiagram";

export function ConsumerLagDiagramEn() {
  return (
    <ConsumerLagDiagramBase
      labels={{
        ariaLabel:
          "The producer has already written up to offset 9 (log end offset). The consumer has only processed up to offset 4. Consumer lag is the difference between the two: 5 messages not yet processed.",
        consumerAt: "consumer at 4",
        logEnd: "log end: 9",
        lag: "consumer lag = 9 - 4 = 5 pending messages",
      }}
    />
  );
}
