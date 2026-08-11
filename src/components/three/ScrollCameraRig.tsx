import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo } from "react";
import * as THREE from "three";
import { CAMERA_END, CAMERA_START, LOOKAT_END, LOOKAT_START } from "./scene-constants";

export function ScrollCameraRig({ progress }: { progress: MotionValue<number> }) {
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const p = progress.get();
    camera.position.lerpVectors(CAMERA_START, CAMERA_END, p);
    lookAtTarget.lerpVectors(LOOKAT_START, LOOKAT_END, p);
    camera.lookAt(lookAtTarget);
  });

  return null;
}
