import { interpolate, useCurrentFrame } from "remotion";
import { colors, fontFamily } from "../tokens";

function ease(frame: number, from: number, to: number) {
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function Outro() {
  const frame = useCurrentFrame();
  const titleIn = ease(frame, 0, 15);
  const badgeIn = ease(frame, 10, 25);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        backgroundColor: colors.bg,
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          color: colors.text,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 12}px)`,
        }}
      >
        trainerdev.app
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          opacity: badgeIn,
        }}
      >
        {["Grátis", "Open source", "Sem login"].map((label) => (
          <div
            key={label}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              color: colors.accent,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
