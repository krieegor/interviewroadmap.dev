import "./index.css";
import { Composition } from "remotion";
import { Demo, TOTAL_DURATION } from "./Demo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Demo"
      component={Demo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
