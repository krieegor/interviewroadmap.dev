import { RoundedBox } from "@react-three/drei";
import { PRODUCER_POS } from "./scene-constants";
import type { SceneColors } from "./useThemeColors";

export function ProducerNode({ colors }: { colors: SceneColors }) {
  return (
    <RoundedBox position={PRODUCER_POS} args={[1.4, 1, 1]} radius={0.08} smoothness={2}>
      <meshStandardMaterial
        color={colors.surface}
        emissive={colors.accent}
        emissiveIntensity={0.3}
        roughness={0.6}
        metalness={0.1}
      />
    </RoundedBox>
  );
}
