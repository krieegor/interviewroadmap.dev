"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { FlowParticles3D } from "../shared/FlowParticles3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const SERVICE_POS: [number, number, number] = [-3.8, 0, 0];
const PAY_POS: [number, number, number] = [-1.2, 0.9, 0];
const OUTBOX_POS: [number, number, number] = [-1.2, -0.9, 0];
const RELAY_POS: [number, number, number] = [1.6, 0, 0];
const KAFKA_POS: [number, number, number] = [4, 0, 0];

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0.2, 3.6, 9), lookAt: new THREE.Vector3(0.2, 0, 0) },
];

export type OutboxPatternLabels = {
  service: string;
  paymentsTable: string;
  outboxTable: string;
  relay: string;
  relaySub: string;
  kafka: string;
};

export default function OutboxPatternScene({
  step,
  labels,
}: {
  step: number;
  labels: OutboxPatternLabels;
}) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();
  const accent = colors.accent.getStyle();

  const isWrite = step === 0;
  const isRead = step === 1;
  const isPublish = step === 2;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, near: 0.1, far: 100, position: CAMERA_STEPS[0]!.position.toArray() }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <color attach="background" args={[bgHex]} />
      <fogExp2 attach="fog" args={[bgHex, 0.04]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />

      <Node3D position={SERVICE_POS} label={labels.service} colors={colors} variant="neutral" />
      <Node3D
        position={PAY_POS}
        label={labels.paymentsTable}
        colors={colors}
        variant={isWrite ? "accent" : "neutral"}
        size={[1.1, 0.7, 0.7]}
      />
      <Node3D
        position={OUTBOX_POS}
        label={labels.outboxTable}
        colors={colors}
        variant={isWrite || isRead ? "accent" : "neutral"}
        size={[1.1, 0.7, 0.7]}
      />
      <Node3D
        position={RELAY_POS}
        label={labels.relay}
        sublabel={labels.relaySub}
        colors={colors}
        variant={isRead || isPublish ? "accent" : "neutral"}
      />
      <Node3D
        position={KAFKA_POS}
        label={labels.kafka}
        colors={colors}
        variant={isPublish ? "accent" : "neutral"}
        muted={!isPublish}
      />

      <Connector3D from={SERVICE_POS} to={PAY_POS} color={isWrite ? accent : lineColor} opacity={isWrite ? 0.9 : 0.35} />
      <Connector3D
        from={SERVICE_POS}
        to={OUTBOX_POS}
        color={isWrite ? accent : lineColor}
        opacity={isWrite ? 0.9 : 0.35}
      />
      <Connector3D
        from={OUTBOX_POS}
        to={RELAY_POS}
        color={isRead ? accent : lineColor}
        opacity={isRead ? 0.9 : 0.35}
        dashed
      />
      <Connector3D
        from={RELAY_POS}
        to={KAFKA_POS}
        color={isPublish ? accent : lineColor}
        opacity={isPublish ? 0.9 : 0.35}
      />

      {isWrite && (
        <>
          <FlowParticles3D path={[SERVICE_POS, PAY_POS]} count={3} color={accent} />
          <FlowParticles3D path={[SERVICE_POS, OUTBOX_POS]} count={3} color={accent} />
        </>
      )}
      {isRead && <FlowParticles3D path={[OUTBOX_POS, RELAY_POS]} count={3} color={accent} />}
      {isPublish && <FlowParticles3D path={[RELAY_POS, KAFKA_POS]} count={3} color={accent} />}

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
