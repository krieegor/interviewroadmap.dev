import * as THREE from "three";

export const LANE_Z = [-1.6, 0, 1.6] as const;
export const LANE_START_X = -3;
export const LANE_END_X = 5;

export const PRODUCER_POS = new THREE.Vector3(LANE_START_X - 2.5, 0, 0);
export const CONSUMER_X = LANE_END_X + 3;

export const CAMERA_START = new THREE.Vector3(0, 4.5, 13);
export const CAMERA_END = new THREE.Vector3(6.5, 1.4, 4);
export const LOOKAT_START = new THREE.Vector3(0, 0, 0);
export const LOOKAT_END = new THREE.Vector3(CONSUMER_X, 0, 0);

export const CUBES_PER_LANE_DESKTOP = 6;
export const CUBES_PER_LANE_MOBILE = 3;

export const IDLE_ORBIT_RADIUS = 12;
export const IDLE_ORBIT_HEIGHT = 3.5;
export const IDLE_ORBIT_SPEED = 0.06;
