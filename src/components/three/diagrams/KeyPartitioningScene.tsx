"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const KEY_X = -4.6;
const HASH_POS: [number, number, number] = [-1.2, 0, 0];
const PARTITION_X = 2.6;
const PARTITION_Z = [-1.4, 0, 1.4] as const;
const KEY_Z = [-2.4, -1.2, 0, 1.2, 2.4] as const;

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0.5, 4, 9.5), lookAt: new THREE.Vector3(0, 0, 0) },
];

export type KeyPartitioningLabels = {
  keys: { label: string; partition: number }[];
  hash: string;
  hashSub: string;
  partition: string;
};

export default function KeyPartitioningScene({ labels }: { labels: KeyPartitioningLabels }) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();

  const keyPositions: [number, number, number][] = KEY_Z.map((z) => [KEY_X, 0, z]);
  const partitionPositions: [number, number, number][] = PARTITION_Z.map((z) => [PARTITION_X, 0, z]);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, near: 0.1, far: 100, position: CAMERA_STEPS[0]!.position.toArray() }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <color attach="background" args={[bgHex]} />
      <fogExp2 attach="fog" args={[bgHex, 0.045]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 7, 4]} intensity={1.1} />

      {labels.keys.map((key, i) => (
        <Node3D
          key={i}
          position={keyPositions[i]!}
          label={key.label}
          colors={colors}
          variant="neutral"
          size={[1.1, 0.55, 0.55]}
        />
      ))}

      <Node3D position={HASH_POS} label={labels.hash} sublabel={labels.hashSub} colors={colors} variant="neutral" />

      {labels.keys.map((key, i) => (
        <Connector3D
          key={`k-${i}`}
          from={keyPositions[i]!}
          to={HASH_POS}
          color={lineColor}
          dashed
          opacity={0.5}
        />
      ))}

      {[0, 1, 2].map((p) => (
        <Node3D
          key={p}
          position={partitionPositions[p]!}
          label={`${labels.partition} ${p}`}
          colors={colors}
          variant={p === 0 ? "accent" : "neutral"}
        />
      ))}

      {labels.keys.map((key, i) => (
        <Connector3D
          key={`p-${i}`}
          from={HASH_POS}
          to={partitionPositions[key.partition]!}
          color={key.partition === 0 ? colors.accent.getStyle() : lineColor}
          opacity={0.6}
        />
      ))}

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
