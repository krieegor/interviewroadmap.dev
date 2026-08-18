import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export type CameraStep = { position: THREE.Vector3; lookAt: THREE.Vector3 };

const DAMPING = 3.5;

// `step`/`steps` são fechados pelo closure do callback: @react-three/fiber sempre chama a versão
// mais recente do callback passado a cada render, então não precisa de ref pra ler o valor atual.
// Funciona também para cenas de 1 passo só: a câmera some suavemente até a posição única no mount.
export function StepCameraRig({ step, steps }: { step: number; steps: CameraStep[] }) {
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    const target = steps[step % steps.length]!;
    const t = 1 - Math.exp(-DAMPING * delta);
    camera.position.lerp(target.position, t);
    lookAtTarget.lerp(target.lookAt, t);
    camera.lookAt(lookAtTarget);
  });

  return null;
}
