import { AbsoluteFill, Sequence } from "remotion";
import { Intro } from "./scenes/Intro";
import { QuizCard } from "./scenes/QuizCard";
import { Outro } from "./scenes/Outro";

export const INTRO_DURATION = 75; // 2.5s @30fps
export const QUIZ_DURATION = 150; // 5s @30fps
export const OUTRO_DURATION = 75; // 2.5s @30fps
export const TOTAL_DURATION = INTRO_DURATION + QUIZ_DURATION + OUTRO_DURATION; // 10s

export function Demo() {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro />
      </Sequence>
      <Sequence from={INTRO_DURATION} durationInFrames={QUIZ_DURATION}>
        <QuizCard />
      </Sequence>
      <Sequence from={INTRO_DURATION + QUIZ_DURATION} durationInFrames={OUTRO_DURATION}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
}
