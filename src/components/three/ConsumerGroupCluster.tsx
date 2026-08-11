import { RoundedBox, Line } from "@react-three/drei";
import { CONSUMER_X, LANE_END_X, LANE_Z } from "./scene-constants";
import type { SceneColors } from "./useThemeColors";

export function ConsumerGroupCluster({ colors }: { colors: SceneColors }) {
  return (
    <group>
      {LANE_Z.map((z, i) => (
        <group key={i}>
          <Line
            points={[
              [LANE_END_X, 0, z],
              [CONSUMER_X, 0, z],
            ]}
            color={colors.textMuted}
            lineWidth={1}
            dashed
            dashSize={0.15}
            gapSize={0.1}
            transparent
            opacity={0.6}
          />
          <RoundedBox position={[CONSUMER_X, 0, z]} args={[1, 0.75, 0.75]} radius={0.06} smoothness={2}>
            <meshStandardMaterial color={colors.surface} roughness={0.7} metalness={0.05} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}
