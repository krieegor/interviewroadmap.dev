"use client";

import dynamic from "next/dynamic";
import { HeroCanvasSkeleton } from "./HeroCanvasSkeleton";

const KafkaFlowScene = dynamic(() => import("@/components/three/KafkaFlowScene"), {
  ssr: false,
  loading: () => <HeroCanvasSkeleton />,
});

export function KafkaHeroCanvas({ step, mobile }: { step: number; mobile: boolean }) {
  return <KafkaFlowScene step={step} mobile={mobile} />;
}
