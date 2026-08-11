import { Html, RoundedBox } from "@react-three/drei";
import type { SceneColors } from "../useThemeColors";

export type OffsetMarker = { offset: number; label: string; accent?: boolean };

const BOX_WIDTH = 0.8;
const BOX_GAP = 0.15;
const BOX_STEP = BOX_WIDTH + BOX_GAP;

export function OffsetLog3D({
  count,
  z = 0,
  accentFrom,
  accentTo,
  accentDashed = false,
  pendingFrom,
  pendingTo,
  markers = [],
  colors,
}: {
  count: number;
  z?: number;
  /** Faixa destacada em accent (ex.: offsets já commitados, ou offsets em reprocessamento). */
  accentFrom?: number;
  accentTo?: number;
  /** Tracejado = "em andamento" (ex.: reprocessando); sólido = estado already-final (ex.: commitado). */
  accentDashed?: boolean;
  /** Faixa neutra/esmaecida (ex.: processado mas ainda não commitado — zona de risco). */
  pendingFrom?: number;
  pendingTo?: number;
  markers?: OffsetMarker[];
  colors: SceneColors;
}) {
  const startX = -((count - 1) * BOX_STEP) / 2;

  return (
    <group>
      {Array.from({ length: count }, (_, offset) => {
        const x = startX + offset * BOX_STEP;
        const isAccent = accentFrom !== undefined && accentTo !== undefined && offset >= accentFrom && offset <= accentTo;
        const isPending =
          pendingFrom !== undefined && pendingTo !== undefined && offset >= pendingFrom && offset <= pendingTo;

        return (
          <group key={offset} position={[x, 0, z]}>
            <RoundedBox args={[BOX_WIDTH, 0.6, 0.5]} radius={0.05} smoothness={2}>
              <meshStandardMaterial
                color={isAccent ? colors.accentSubtle : colors.surface}
                emissive={isAccent ? colors.accent : colors.border}
                emissiveIntensity={isAccent ? 0.35 : isPending ? 0.15 : 0.08}
                roughness={0.65}
                metalness={0.05}
                transparent={isPending || (isAccent && accentDashed)}
                opacity={isPending ? 0.55 : isAccent && accentDashed ? 0.75 : 1}
              />
            </RoundedBox>
            <Html center distanceFactor={8} pointerEvents="none">
              <div
                className="text-[10px] font-semibold"
                style={{ color: isAccent ? colors.accent.getStyle() : colors.text.getStyle() }}
              >
                {offset}
              </div>
            </Html>
          </group>
        );
      })}

      {markers.map((marker) => {
        const x = startX + marker.offset * BOX_STEP;
        return (
          <Html key={marker.label} position={[x, -0.7, z]} center distanceFactor={8} pointerEvents="none">
            <div
              className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium shadow-sm"
              style={{
                borderColor: marker.accent ? colors.accent.getStyle() : colors.border.getStyle(),
                backgroundColor: colors.bg.getStyle(),
                color: marker.accent ? colors.accent.getStyle() : colors.textMuted.getStyle(),
              }}
            >
              {marker.label}
            </div>
          </Html>
        );
      })}
    </group>
  );
}
