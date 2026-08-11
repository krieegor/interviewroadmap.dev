"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const PARTITION_X = [-2.2, 0, 2.2] as const;
const PARTITION_Z = -1.6;
const CONSUMER_Z = 1.6;

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0, 3.6, 8.5), lookAt: new THREE.Vector3(0, 0, 0) },
];

export type RebalanceLabels = {
  partition0: string;
  partition1: string;
  partition2: string;
  consumer1: string;
  consumer2: string;
  consumer3: string;
  down: string;
};

export default function RebalanceScene({ step, labels }: { step: number; labels: RebalanceLabels }) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();

  const partitionPos: [number, number, number][] = PARTITION_X.map((x) => [x, 0, PARTITION_Z]);
  const consumerPos: [number, number, number][] = PARTITION_X.map((x) => [x, 0, CONSUMER_Z]);

  // Passo 0: 1 consumer por partition. Passo 1: Consumer 2 cai, Consumer 1 assume a Partition 1 também.
  const consumer2Down = step === 1;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.1, far: 100, position: CAMERA_STEPS[0]!.position.toArray() }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <color attach="background" args={[bgHex]} />
      <fogExp2 attach="fog" args={[bgHex, 0.045]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 7, 4]} intensity={1.1} />

      <Node3D position={partitionPos[0]!} label={labels.partition0} colors={colors} variant="neutral" />
      <Node3D position={partitionPos[1]!} label={labels.partition1} colors={colors} variant="neutral" />
      <Node3D position={partitionPos[2]!} label={labels.partition2} colors={colors} variant="neutral" />

      <Node3D
        position={consumerPos[0]!}
        label={labels.consumer1}
        colors={colors}
        variant={consumer2Down ? "accent" : "neutral"}
      />
      <Node3D
        position={consumerPos[1]!}
        label={labels.consumer2}
        sublabel={consumer2Down ? labels.down : undefined}
        colors={colors}
        variant="neutral"
        muted={consumer2Down}
      />
      <Node3D
        position={consumerPos[2]!}
        label={labels.consumer3}
        colors={colors}
        variant={consumer2Down ? "accent" : "neutral"}
      />

      {!consumer2Down ? (
        <>
          <Connector3D from={partitionPos[0]!} to={consumerPos[0]!} color={lineColor} />
          <Connector3D from={partitionPos[1]!} to={consumerPos[1]!} color={lineColor} />
          <Connector3D from={partitionPos[2]!} to={consumerPos[2]!} color={lineColor} />
        </>
      ) : (
        <>
          <Connector3D from={partitionPos[0]!} to={consumerPos[0]!} color={colors.accent.getStyle()} />
          <Connector3D from={partitionPos[1]!} to={consumerPos[0]!} color={colors.accent.getStyle()} />
          <Connector3D from={partitionPos[2]!} to={consumerPos[2]!} color={colors.accent.getStyle()} />
        </>
      )}

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
