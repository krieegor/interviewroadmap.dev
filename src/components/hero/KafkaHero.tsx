"use client";

import { useReducedMotion } from "motion/react";
import { ProducerConsumerFlow } from "@/components/diagrams/ProducerConsumerFlow";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useHasWebGL } from "@/components/three/webgl-support";
import { AUTOPLAY_INTERVAL_MS, STEP_COUNT } from "@/components/three/scene-constants";
import { useStepCarousel } from "@/lib/hooks/useStepCarousel";
import { KafkaHeroCanvas } from "./KafkaHeroCanvas";
import { HeroCaption } from "./HeroCaption";
import { DiagramStepArrows, DiagramStepDots } from "./ChapterDiagramControls";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function KafkaHero({ dict }: { dict: Dictionary }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const supportsWebGL = useHasWebGL();
  const shouldRender3D = supportsWebGL && !prefersReducedMotion;

  const { step, goTo } = useStepCarousel(STEP_COUNT, shouldRender3D, AUTOPLAY_INTERVAL_MS);

  const captions = [
    dict.trackSelector.heroCaptionProducer,
    dict.trackSelector.heroCaptionPartitions,
    dict.trackSelector.heroCaptionConsumerGroup,
  ];

  return (
    <section className="relative mt-10">
      <div className="relative mx-auto aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        {shouldRender3D ? (
          <>
            <div aria-hidden="true" className="h-full w-full">
              <KafkaHeroCanvas step={step} mobile={isMobile} />
              <HeroCaption text={captions[step]!} />
            </div>
            <DiagramStepArrows
              step={step}
              onGoTo={goTo}
              prevLabel={dict.trackSelector.heroPrevStep}
              nextLabel={dict.trackSelector.heroNextStep}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6">
            <ProducerConsumerFlow />
          </div>
        )}
      </div>

      {shouldRender3D ? (
        <DiagramStepDots
          step={step}
          stepLabels={captions}
          onGoTo={goTo}
          goToLabel={dict.trackSelector.heroGoToStep}
        />
      ) : null}
    </section>
  );
}
