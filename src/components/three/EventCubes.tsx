import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { LANE_END_X, LANE_START_X } from "./scene-constants";
import type { SceneColors } from "./useThemeColors";

type Phase = { offset: number; speed: number };

const dummy = new THREE.Object3D();
const LANE_LENGTH = LANE_END_X - LANE_START_X;

export function EventCubes({
  z,
  count,
  colors,
}: {
  z: number;
  count: number;
  colors: SceneColors;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const phasesRef = useRef<Phase[]>([]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Lazy-init fora do render (dentro do loop imperativo do R3F) — gerar posições
    // iniciais aleatórias aqui evita chamar Math.random durante a renderização do React.
    if (phasesRef.current.length !== count) {
      phasesRef.current = Array.from({ length: count }, (_, i) => ({
        offset: (i / count) * LANE_LENGTH,
        speed: 1.4 + Math.random() * 0.6,
      }));
    }

    const elapsed = state.clock.elapsedTime;
    const phases = phasesRef.current;
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]!;
      const traveled = (elapsed * phase.speed + phase.offset) % LANE_LENGTH;
      dummy.position.set(LANE_START_X + traveled, 0, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} count={count}>
      <boxGeometry args={[0.18, 0.18, 0.18]} />
      <meshStandardMaterial
        color={colors.accent}
        emissive={colors.accent}
        emissiveIntensity={1.6}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
