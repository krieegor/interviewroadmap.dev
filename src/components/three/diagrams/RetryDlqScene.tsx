"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { FlowParticles3D } from "../shared/FlowParticles3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const TOPIC_POS: [number, number, number] = [-4.2, 0, 0];
const CONSUMER_POS: [number, number, number] = [-1.2, 0, 0];
const RETRY_POS: [number, number, number] = [-1.2, 0, -2.3];
const DLQ_POS: [number, number, number] = [2, 0, -2.3];

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0, 4.5, 8.5), lookAt: new THREE.Vector3(-0.5, 0, -1) },
];

export type RetryDlqLabels = {
  topic: string;
  consumer: string;
  consumerFail: string;
  retryTopic: string;
  backoff: string;
  dlqTopic: string;
  dlqSub: string;
};

export default function RetryDlqScene({ step, labels }: { step: number; labels: RetryDlqLabels }) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();

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

      <Node3D position={TOPIC_POS} label={labels.topic} colors={colors} variant={step === 0 ? "accent" : "neutral"} />
      <Node3D
        position={CONSUMER_POS}
        label={labels.consumer}
        sublabel={step === 0 ? labels.consumerFail : undefined}
        colors={colors}
        variant="neutral"
      />
      <Node3D
        position={RETRY_POS}
        label={labels.retryTopic}
        sublabel={step === 1 ? labels.backoff : undefined}
        colors={colors}
        variant={step === 1 ? "accent" : "neutral"}
      />
      <Node3D
        position={DLQ_POS}
        label={labels.dlqTopic}
        sublabel={step === 2 ? labels.dlqSub : undefined}
        colors={colors}
        variant={step === 2 ? "error" : "neutral"}
      />

      <Connector3D from={TOPIC_POS} to={CONSUMER_POS} color={lineColor} />
      <Connector3D from={CONSUMER_POS} to={RETRY_POS} color={lineColor} />
      <Connector3D from={RETRY_POS} to={CONSUMER_POS} color={lineColor} dashed opacity={0.5} />
      <Connector3D from={RETRY_POS} to={DLQ_POS} color={lineColor} />

      {step === 0 ? <FlowParticles3D path={[TOPIC_POS, CONSUMER_POS]} count={3} color={colors.accent.getStyle()} /> : null}
      {step === 1 ? (
        <FlowParticles3D path={[CONSUMER_POS, RETRY_POS, CONSUMER_POS]} count={3} color={colors.accent.getStyle()} />
      ) : null}
      {step === 2 ? <FlowParticles3D path={[RETRY_POS, DLQ_POS]} count={3} color="#ef4444" /> : null}

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
