import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Phase = { offset: number; speed: number };

const dummy = new THREE.Object3D();

// Generalização do EventCubes do hero: em vez de uma lane reta fixa, aceita qualquer caminho
// (2+ pontos); usa CatmullRomCurve3 pra suportar tanto linhas retas quanto o loop do retry/DLQ.
export function FlowParticles3D({
  path,
  count = 4,
  color,
  size = 0.16,
}: {
  path: [number, number, number][];
  count?: number;
  color: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const phasesRef = useRef<Phase[]>([]);

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(path.map(([x, y, z]) => new THREE.Vector3(x, y, z))),
    [path],
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (phasesRef.current.length !== count) {
      phasesRef.current = Array.from({ length: count }, (_, i) => ({
        offset: i / count,
        speed: 0.12 + Math.random() * 0.05,
      }));
    }

    const elapsed = state.clock.elapsedTime;
    const phases = phasesRef.current;
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]!;
      const t = (elapsed * phase.speed + phase.offset) % 1;
      const point = curve.getPointAt(t);
      dummy.position.copy(point);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} count={count}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} toneMapped={false} />
    </instancedMesh>
  );
}
