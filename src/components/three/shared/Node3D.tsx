import { Html, RoundedBox } from "@react-three/drei";
import type { SceneColors } from "../useThemeColors";
import { TONE_ERROR, TONE_SUCCESS, TONE_WARNING } from "./tones";

export type Node3DVariant = "neutral" | "accent" | "error" | "warning" | "success";

export function Node3D({
  position,
  label,
  sublabel,
  colors,
  variant = "neutral",
  muted = false,
  size = [1.3, 0.85, 0.85],
}: {
  position: [number, number, number];
  label: string;
  sublabel?: string;
  colors: SceneColors;
  variant?: Node3DVariant;
  muted?: boolean;
  size?: [number, number, number];
}) {
  const toneColor: string =
    variant === "accent"
      ? colors.accent.getStyle()
      : variant === "error"
        ? TONE_ERROR
        : variant === "warning"
          ? TONE_WARNING
          : variant === "success"
            ? TONE_SUCCESS
            : colors.border.getStyle();

  return (
    <group position={position}>
      <RoundedBox args={size} radius={0.07} smoothness={2}>
        <meshStandardMaterial
          color={muted ? colors.bg : colors.surface}
          emissive={toneColor}
          emissiveIntensity={muted ? 0.08 : variant === "neutral" ? 0.12 : 0.3}
          roughness={0.6}
          metalness={0.1}
          transparent={muted}
          opacity={muted ? 0.45 : 1}
        />
      </RoundedBox>
      <Html center distanceFactor={8} position={[0, size[1] / 2 + 0.55, 0]} pointerEvents="none">
        <div
          className="flex flex-col items-center gap-0.5 rounded-lg border px-2 py-1 text-center text-[10px] font-medium shadow-sm"
          style={{
            width: "max-content",
            maxWidth: 150,
            borderColor: muted ? colors.border.getStyle() : toneColor,
            backgroundColor: colors.bg.getStyle(),
            color: colors.text.getStyle(),
            opacity: muted ? 0.6 : 1,
          }}
        >
          <span className="leading-tight">{label}</span>
          {sublabel ? (
            <span className="font-normal leading-tight" style={{ opacity: 0.7 }}>
              {sublabel}
            </span>
          ) : null}
        </div>
      </Html>
    </group>
  );
}
