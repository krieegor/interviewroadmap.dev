import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KafkaHero } from "@/components/hero/KafkaHero";
import { pt } from "@/lib/i18n/dictionaries/pt";

vi.mock("@/components/three/webgl-support", () => ({
  useHasWebGL: () => false,
  hasWebGL: () => false,
}));

vi.mock("@/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));

vi.mock("motion/react", () => ({
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
  useSpring: (value: unknown) => value,
}));

describe("KafkaHero", () => {
  it("renderiza o diagrama SVG estático quando WebGL não está disponível, sem montar um canvas 3D", () => {
    render(<KafkaHero dict={pt} />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(document.querySelector("canvas")).not.toBeInTheDocument();
  });
});
