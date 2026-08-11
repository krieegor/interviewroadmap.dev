"use client";

import dynamic from "next/dynamic";
import type { MotionValue } from "motion/react";
import { HeroCanvasSkeleton } from "./HeroCanvasSkeleton";

const KafkaFlowScene = dynamic(() => import("@/components/three/KafkaFlowScene"), {
  ssr: false,
  loading: () => <HeroCanvasSkeleton />,
});

export function KafkaHeroCanvas({
  scrollProgress,
  mobile,
}: {
  scrollProgress?: MotionValue<number>;
  mobile: boolean;
}) {
  return <KafkaFlowScene scrollProgress={scrollProgress} mobile={mobile} />;
}
