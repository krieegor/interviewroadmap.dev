"use client";

import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { CAMERA_START, LANE_Z } from "./scene-constants";
import { useThemeColors } from "./useThemeColors";
import { ProducerNode } from "./ProducerNode";
import { PartitionLane } from "./PartitionLane";
import { ConsumerGroupCluster } from "./ConsumerGroupCluster";
import { ScrollCameraRig } from "./ScrollCameraRig";
import { IdleOrbitCamera } from "./IdleOrbitCamera";

export default function KafkaFlowScene({
  scrollProgress,
  mobile,
}: {
  scrollProgress?: MotionValue<number>;
  mobile: boolean;
}) {
  const colors = useThemeColors();
  const bgHex = `#${colors.bg.getHexString()}`;

  return (
    <Canvas
      dpr={mobile ? 1 : [1, 2]}
      camera={{ fov: 50, near: 0.1, far: 100, position: CAMERA_START.toArray() }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <color attach="background" args={[bgHex]} />
      <fogExp2 attach="fog" args={[bgHex, mobile ? 0.055 : 0.045]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />

      <ProducerNode colors={colors} />
      {LANE_Z.map((z, i) => (
        <PartitionLane key={i} index={i} z={z} colors={colors} mobile={mobile} />
      ))}
      <ConsumerGroupCluster colors={colors} />

      {mobile || !scrollProgress ? <IdleOrbitCamera /> : <ScrollCameraRig progress={scrollProgress} />}
    </Canvas>
  );
}
