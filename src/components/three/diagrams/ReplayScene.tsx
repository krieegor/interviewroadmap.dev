"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OffsetLog3D } from "../shared/OffsetLog3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0, 2.4, 6.5), lookAt: new THREE.Vector3(0, 0, 0) },
];

export type ReplayLabels = { committedOffset: string; newReadPosition: string };

export default function ReplayScene({ step, labels }: { step: number; labels: ReplayLabels }) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;

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

      {step === 0 ? (
        <OffsetLog3D
          count={8}
          markers={[{ offset: 6, label: labels.committedOffset, accent: true }]}
          colors={colors}
        />
      ) : (
        <OffsetLog3D
          count={8}
          accentFrom={2}
          accentTo={6}
          accentDashed
          markers={[{ offset: 2, label: labels.newReadPosition, accent: true }]}
          colors={colors}
        />
      )}

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
