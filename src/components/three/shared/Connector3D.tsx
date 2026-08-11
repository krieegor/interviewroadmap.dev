import { Line } from "@react-three/drei";

export function Connector3D({
  from,
  to,
  color,
  dashed = false,
  width = 1,
  opacity = 0.7,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  dashed?: boolean;
  width?: number;
  opacity?: number;
}) {
  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={width}
      dashed={dashed}
      dashSize={dashed ? 0.15 : undefined}
      gapSize={dashed ? 0.1 : undefined}
      transparent
      opacity={opacity}
    />
  );
}
