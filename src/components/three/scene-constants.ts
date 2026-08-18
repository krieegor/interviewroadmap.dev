import * as THREE from "three";

export const LANE_Z = [-1.6, 0, 1.6] as const;
export const LANE_START_X = -3;
export const LANE_END_X = 5;

export const PRODUCER_POS = new THREE.Vector3(LANE_START_X - 2.5, 0, 0);
export const CONSUMER_X = LANE_END_X + 3;

export const CUBES_PER_LANE_DESKTOP = 6;
export const CUBES_PER_LANE_MOBILE = 3;

export const STEP_COUNT = 3;
export const AUTOPLAY_INTERVAL_MS = 4500;

// Um enquadramento de câmera por etapa (Producer / Partitions / Consumer Group): a câmera se move
// suavemente até o alvo da etapa atual (ver StepCameraRig), nunca em resposta a scroll da página.
export const CAMERA_STEPS: { position: THREE.Vector3; lookAt: THREE.Vector3 }[] = [
  { position: new THREE.Vector3(-3, 3.2, 11), lookAt: new THREE.Vector3(-4, 0, 0) },
  { position: new THREE.Vector3(1, 3.4, 9), lookAt: new THREE.Vector3(1, 0, 0) },
  { position: new THREE.Vector3(6.5, 1.8, 6), lookAt: new THREE.Vector3(CONSUMER_X, 0, 0) },
];
