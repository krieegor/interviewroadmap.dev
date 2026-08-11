import { Line } from "@react-three/drei";
import { CUBES_PER_LANE_DESKTOP, CUBES_PER_LANE_MOBILE, LANE_END_X, LANE_START_X } from "./scene-constants";
import { EventCubes } from "./EventCubes";
import type { SceneColors } from "./useThemeColors";

export function PartitionLane({
  index,
  z,
  colors,
  mobile,
}: {
  index: number;
  z: number;
  colors: SceneColors;
  mobile: boolean;
}) {
  const lineColor = index === 0 ? colors.accent : colors.border;
  const count = mobile ? CUBES_PER_LANE_MOBILE : CUBES_PER_LANE_DESKTOP;

  return (
    <group>
      <Line
        points={[
          [LANE_START_X, 0, z],
          [LANE_END_X, 0, z],
        ]}
        color={lineColor}
        lineWidth={index === 0 ? 1.5 : 1}
        transparent
        opacity={index === 0 ? 0.9 : 0.5}
      />
      <EventCubes z={z} count={count} colors={colors} />
    </group>
  );
}
