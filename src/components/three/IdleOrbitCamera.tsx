import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { IDLE_ORBIT_HEIGHT, IDLE_ORBIT_RADIUS, IDLE_ORBIT_SPEED, LOOKAT_START } from "./scene-constants";

export function IdleOrbitCamera() {
  const angleRef = useRef(0.6);

  useFrame(({ camera }, delta) => {
    angleRef.current += delta * IDLE_ORBIT_SPEED;
    const angle = angleRef.current;
    camera.position.set(
      Math.cos(angle) * IDLE_ORBIT_RADIUS,
      IDLE_ORBIT_HEIGHT,
      Math.sin(angle) * IDLE_ORBIT_RADIUS,
    );
    camera.lookAt(LOOKAT_START);
  });

  return null;
}
