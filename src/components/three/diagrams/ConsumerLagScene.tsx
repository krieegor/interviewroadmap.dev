"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OffsetLog3D } from "../shared/OffsetLog3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0, 2.6, 7.5), lookAt: new THREE.Vector3(0, 0, 0) },
];

export type ConsumerLagLabels = { consumerAt: string; logEnd: string };

export default function ConsumerLagScene({ labels }: { labels: ConsumerLagLabels }) {
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
      <fogExp2 attach="fog" args={[bgHex, 0.045]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />

      <OffsetLog3D
        count={10}
        markers={[
          { offset: 4, label: labels.consumerAt, accent: true },
          { offset: 9, label: labels.logEnd },
        ]}
        colors={colors}
      />

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
