"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { FlowParticles3D } from "../shared/FlowParticles3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";
import { TONE_ERROR } from "../shared/tones";

const TEMPLATE_POS: [number, number, number] = [-3.6, 0, 0];
const BROKER_POS: [number, number, number] = [-1, 0, 0];
const SUCCESS_POS: [number, number, number] = [1.9, 1.1, 0];
const FAILURE_POS: [number, number, number] = [1.9, -1.1, 0];

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0.3, 3.6, 8.5), lookAt: new THREE.Vector3(0.3, 0, 0) },
];

export type ProducerCallbackLabels = {
  template: string;
  templateSub: string;
  broker: string;
  success: string;
  successSub: string;
  failure: string;
  failureSub: string;
};

export default function ProducerCallbackScene({
  step,
  labels,
}: {
  step: number;
  labels: ProducerCallbackLabels;
}) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();
  const accent = colors.accent.getStyle();

  const isFailure = step === 1;

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

      <Node3D
        position={TEMPLATE_POS}
        label={labels.template}
        sublabel={labels.templateSub}
        colors={colors}
        variant="neutral"
      />
      <Node3D position={BROKER_POS} label={labels.broker} colors={colors} variant="neutral" />
      <Node3D
        position={SUCCESS_POS}
        label={labels.success}
        sublabel={labels.successSub}
        colors={colors}
        variant={isFailure ? "neutral" : "accent"}
        muted={isFailure}
      />
      <Node3D
        position={FAILURE_POS}
        label={labels.failure}
        sublabel={labels.failureSub}
        colors={colors}
        variant={isFailure ? "error" : "neutral"}
        muted={!isFailure}
      />

      <Connector3D from={TEMPLATE_POS} to={BROKER_POS} color={lineColor} />
      <Connector3D
        from={BROKER_POS}
        to={SUCCESS_POS}
        color={isFailure ? lineColor : accent}
        opacity={isFailure ? 0.35 : 0.9}
      />
      <Connector3D
        from={BROKER_POS}
        to={FAILURE_POS}
        color={isFailure ? TONE_ERROR : lineColor}
        opacity={isFailure ? 0.9 : 0.35}
      />

      <FlowParticles3D
        path={isFailure ? [TEMPLATE_POS, BROKER_POS, FAILURE_POS] : [TEMPLATE_POS, BROKER_POS, SUCCESS_POS]}
        count={4}
        color={isFailure ? TONE_ERROR : accent}
      />

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
