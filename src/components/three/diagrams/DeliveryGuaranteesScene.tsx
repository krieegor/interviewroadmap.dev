"use client";

import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Node3D } from "../shared/Node3D";
import { Connector3D } from "../shared/Connector3D";
import { FlowParticles3D } from "../shared/FlowParticles3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";
import { TONE_ERROR, TONE_SUCCESS, TONE_WARNING } from "../shared/tones";

const PRODUCER_POS: [number, number, number] = [-3, 0, 0];
const KAFKA_POS: [number, number, number] = [0, 0, 0];
const CONSUMER_POS: [number, number, number] = [3, 0, 0];
const FAIL_BEFORE_KAFKA: [number, number, number] = [-1.5, 0.6, 0];
const FAIL_AFTER_KAFKA: [number, number, number] = [1.5, 0.6, 0];

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0, 3.4, 7.5), lookAt: new THREE.Vector3(0, 0, 0) },
];

export type DeliveryGuaranteesLabels = {
  producer: string;
  kafka: string;
  consumer: string;
  steps: { title: string; outcome: string }[];
};

const TONES = [TONE_ERROR, TONE_WARNING, TONE_SUCCESS];

export default function DeliveryGuaranteesScene({
  step,
  labels,
}: {
  step: number;
  labels: DeliveryGuaranteesLabels;
}) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;
  const lineColor = colors.textMuted.getStyle();
  const failPos = step === 0 ? FAIL_BEFORE_KAFKA : FAIL_AFTER_KAFKA;
  const tone = TONES[step] ?? TONE_ERROR;
  const stepInfo = labels.steps[step] ?? labels.steps[0]!;

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

      <Node3D position={PRODUCER_POS} label={labels.producer} colors={colors} variant="neutral" />
      <Node3D position={KAFKA_POS} label={labels.kafka} colors={colors} variant="neutral" />
      <Node3D position={CONSUMER_POS} label={labels.consumer} colors={colors} variant="neutral" />

      <Connector3D from={PRODUCER_POS} to={KAFKA_POS} color={lineColor} />
      <Connector3D from={KAFKA_POS} to={CONSUMER_POS} color={lineColor} />

      <FlowParticles3D path={[PRODUCER_POS, KAFKA_POS, CONSUMER_POS]} count={4} color={colors.accent.getStyle()} />

      <Html center position={failPos} distanceFactor={8} pointerEvents="none">
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold" style={{ color: tone }}>
            ×
          </span>
          <div
            className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium shadow-sm"
            style={{ borderColor: tone, backgroundColor: colors.bg.getStyle(), color: tone }}
          >
            {stepInfo.title}: {stepInfo.outcome}
          </div>
        </div>
      </Html>

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
