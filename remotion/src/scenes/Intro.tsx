import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily } from "../tokens";

// Recriação em SVG puro do logo de src/components/icons/Logo.tsx (lambda estilizada).
function Logo({ size, color }: { size: number; color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M12 3.5 6.5 20.5" />
      <path d="M10 12 16.5 20.5" />
    </svg>
  );
}

export function Intro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 18, mass: 0.6 } });
  const textOpacity = interpolate(frame, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        backgroundColor: colors.bg,
        fontFamily,
      }}
    >
      <div style={{ transform: `scale(${logoScale})` }}>
        <Logo size={96} color={colors.accent} />
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: colors.text,
          opacity: textOpacity,
          letterSpacing: -0.5,
        }}
      >
        trainerdev.app
      </div>
      <div
        style={{
          fontSize: 20,
          color: colors.accent,
          opacity: badgeOpacity,
          textTransform: "uppercase",
          letterSpacing: 2,
          fontWeight: 500,
        }}
      >
        Preparação para entrevistas técnicas
      </div>
    </div>
  );
}
