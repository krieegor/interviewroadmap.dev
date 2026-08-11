"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const EVENT_POS: [number, number, number] = [-4.6, 0, 0];
const DECISION_POS: [number, number, number] = [-1, 0, 0];
const SKIP_POS: [number, number, number] = [1.9, -1.1, 0];
const INSERT_POS: [number, number, number] = [1.9, 1.1, 0];

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0.1, 3.6, 9), lookAt: new THREE.Vector3(0.1, 0, 0) },
];

export type IdempotencyLabels = {
  event: string;
  eventSub: string;
  decision: string;
  decisionSub: string;
  skip: string;
  skipSub: string;
  insert: string;
  insertSub: string;
};

export default function IdempotencyScene({ step, labels }: { step: number; labels: IdempotencyLabels }) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();

  // Passo 0: evento novo -> insere e aplica. Passo 1: evento duplicado -> ignora.
  const isDuplicate = step === 1;

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
      <directionalLight position={[4, 6, 4]} intensity={1.1} />

      <Node3D position={EVENT_POS} label={labels.event} sublabel={labels.eventSub} colors={colors} variant="neutral" />
      <Node3D position={DECISION_POS} label={labels.decision} sublabel={labels.decisionSub} colors={colors} variant="neutral" />
      <Node3D
        position={SKIP_POS}
        label={labels.skip}
        sublabel={labels.skipSub}
        colors={colors}
        variant={isDuplicate ? "accent" : "neutral"}
        muted={!isDuplicate}
      />
      <Node3D
        position={INSERT_POS}
        label={labels.insert}
        sublabel={labels.insertSub}
        colors={colors}
        variant={!isDuplicate ? "accent" : "neutral"}
        muted={isDuplicate}
      />

      <Connector3D from={EVENT_POS} to={DECISION_POS} color={lineColor} />
      <Connector3D
        from={DECISION_POS}
        to={SKIP_POS}
        color={isDuplicate ? colors.accent.getStyle() : lineColor}
        opacity={isDuplicate ? 0.9 : 0.4}
      />
      <Connector3D
        from={DECISION_POS}
        to={INSERT_POS}
        color={!isDuplicate ? colors.accent.getStyle() : lineColor}
        opacity={!isDuplicate ? 0.9 : 0.4}
      />

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
