import { interpolate, useCurrentFrame } from "remotion";
import { colors, fontFamily } from "../tokens";

// Pergunta real de src/content/kafka/questions/pt/003-kafka-e-uma-fila.mdx (opções truncadas para
// caber no quadro — texto na íntegra é mantido no site, aqui é só um recorte fiel para o teaser).
const QUESTION = "Kafka é uma fila?";
const OPTIONS = [
  "Não estruturalmente: o evento continua no log até expirar pela retenção…",
  "Sim, é basicamente uma fila de mensagens, só que mais rápida…",
  "Não, porque o Kafka nunca apaga eventos, ficam retidos para sempre…",
  "Sim, um Consumer Group distribuindo partitions já é uma fila…",
];
const CORRECT_INDEX = 0;

function ease(frame: number, from: number, to: number) {
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function QuizCard() {
  const frame = useCurrentFrame();

  const cardIn = ease(frame, 0, 15);
  const questionIn = ease(frame, 12, 27);
  const clickFrame = 100;
  const revealFrame = 112;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bg,
        fontFamily,
      }}
    >
      <div
        style={{
          width: 880,
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          padding: 40,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 24}px)`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.accent,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 12,
          }}
        >
          Simulador · Kafka
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: colors.text,
            opacity: questionIn,
            marginBottom: 28,
          }}
        >
          {QUESTION}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {OPTIONS.map((option, i) => {
            const optionIn = ease(frame, 35 + i * 10, 50 + i * 10);
            const isCorrect = i === CORRECT_INDEX;
            const selected = isCorrect && frame >= clickFrame;
            const revealed = isCorrect && frame >= revealFrame;
            const revealProgress = ease(frame, revealFrame, revealFrame + 12);

            return (
              <div
                key={option}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 20px",
                  borderRadius: 8,
                  border: `1px solid ${revealed ? colors.success : colors.border}`,
                  backgroundColor: revealed
                    ? `rgba(34, 197, 94, ${0.12 * revealProgress})`
                    : colors.bgSubtle,
                  opacity: optionIn,
                  transform: `translateX(${(1 - optionIn) * -16}px) scale(${
                    selected && !revealed ? 0.98 : 1
                  })`,
                  fontSize: 18,
                  color: colors.textMuted,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${revealed ? colors.success : colors.textMuted}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {revealed ? (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: colors.success,
                        opacity: revealProgress,
                      }}
                    />
                  ) : null}
                </div>
                <span style={{ color: revealed ? colors.text : colors.textMuted }}>{option}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
