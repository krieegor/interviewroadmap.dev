"use client";

import { useRef } from "react";
import { useReducedMotion, useScroll, useSpring } from "motion/react";
import { ProducerConsumerFlow } from "@/components/diagrams/ProducerConsumerFlow";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useHasWebGL } from "@/components/three/webgl-support";
import { KafkaHeroCanvas } from "./KafkaHeroCanvas";
import { HeroCaption } from "./HeroCaption";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function KafkaHero({ dict }: { dict: Dictionary }) {
  const heroSectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const supportsWebGL = useHasWebGL();

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.5 });

  const shouldRender3D = supportsWebGL && !prefersReducedMotion;

  return (
    <section ref={heroSectionRef} className="relative mt-10 h-[180vh]">
      <div className="sticky top-20 mx-auto aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        {shouldRender3D ? (
          <div aria-hidden="true" className="h-full w-full">
            <KafkaHeroCanvas scrollProgress={smoothProgress} mobile={isMobile} />
            <HeroCaption
              text={dict.trackSelector.heroCaptionProducer}
              progress={smoothProgress}
              range={[0, 0.08, 0.26, 0.34]}
              style={{ left: "10%", top: "70%" }}
            />
            <HeroCaption
              text={dict.trackSelector.heroCaptionPartitions}
              progress={smoothProgress}
              range={[0.3, 0.4, 0.6, 0.68]}
              style={{ left: "42%", top: "16%" }}
            />
            <HeroCaption
              text={dict.trackSelector.heroCaptionConsumerGroup}
              progress={smoothProgress}
              range={[0.64, 0.74, 1, 1]}
              style={{ left: "68%", top: "62%" }}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6">
            <ProducerConsumerFlow />
          </div>
        )}
      </div>
    </section>
  );
}
