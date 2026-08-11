"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OffsetLog3D } from "../shared/OffsetLog3D";
import { StepCameraRig } from "../shared/StepCameraRig";
import { useThemeColors } from "../useThemeColors";

const CAMERA_STEPS = [
  { position: new THREE.Vector3(0, 2.4, 6.5), lookAt: new THREE.Vector3(0, 0, 0) },
];

export type OffsetCommitLabels = { committed: string; currentPosition: string };

export default function OffsetCommitScene({ labels }: { labels: OffsetCommitLabels }) {
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

      <OffsetLog3D
        count={8}
        accentFrom={0}
        accentTo={3}
        pendingFrom={4}
        pendingTo={6}
        markers={[
          { offset: 3, label: labels.committed, accent: true },
          { offset: 6, label: labels.currentPosition },
        ]}
        colors={colors}
      />

      <StepCameraRig step={0} steps={CAMERA_STEPS} />
    </Canvas>
  );
}
