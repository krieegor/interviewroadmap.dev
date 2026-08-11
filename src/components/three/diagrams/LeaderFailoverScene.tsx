"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const POSITIONS: [number, number, number][] = [
  [-2.6, 0, 0],
  [0, 0, 0],
  [2.6, 0, 0],
];

const CAMERA_STEPS = [
  { position: new THREE.Vector3(1.4, 2.2, 7.5), lookAt: new THREE.Vector3(0, 0, 0) },
];

export type LeaderFailoverLabels = {
  broker1: string;
  broker2: string;
  broker3: string;
  leader: string;
  follower: string;
  down: string;
};

export default function LeaderFailoverScene({
  step,
  labels,
}: {
  step: number;
  labels: LeaderFailoverLabels;
}) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();

  // Passo 0 ("antes"): Broker 1 é leader, replica pros outros dois.
  // Passo 1 ("depois da queda"): Broker 1 fica indisponível, Broker 2 assume como novo leader.
  const broker1Down = step === 1;
  const leaderIndex = step === 1 ? 1 : 0;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.1, far: 100, position: CAMERA_STEPS[0]!.position.toArray() }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <color attach="background" args={[bgHex]} />
      <fogExp2 attach="fog" args={[bgHex, 0.05]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />

      <Node3D
        position={POSITIONS[0]!}
        label={labels.broker1}
        sublabel={broker1Down ? labels.down : leaderIndex === 0 ? labels.leader : labels.follower}
        colors={colors}
        variant={broker1Down ? "neutral" : leaderIndex === 0 ? "accent" : "neutral"}
        muted={broker1Down}
      />
      <Node3D
        position={POSITIONS[1]!}
        label={labels.broker2}
        sublabel={leaderIndex === 1 ? labels.leader : labels.follower}
        colors={colors}
        variant={leaderIndex === 1 ? "accent" : "neutral"}
      />
      <Node3D
        position={POSITIONS[2]!}
        label={labels.broker3}
        sublabel={labels.follower}
        colors={colors}
        variant="neutral"
      />

      {!broker1Down ? (
        <>
          <Connector3D from={POSITIONS[0]!} to={POSITIONS[1]!} color={lineColor} dashed />
          <Connector3D from={POSITIONS[0]!} to={POSITIONS[2]!} color={lineColor} dashed />
        </>
      ) : (
        <Connector3D from={POSITIONS[1]!} to={POSITIONS[2]!} color={lineColor} dashed />
      )}

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
