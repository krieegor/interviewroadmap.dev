import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { KafkaHero } from "@/components/hero/KafkaHero";
import { pt } from "@/lib/i18n/dictionaries/pt";

const { useHasWebGLMock, useReducedMotionMock } = vi.hoisted(() => ({
  useHasWebGLMock: vi.fn(),
  useReducedMotionMock: vi.fn(),
}));

vi.mock("@/components/three/webgl-support", () => ({
  useHasWebGL: useHasWebGLMock,
  useShouldRender3D: () => {
    const supportsWebGL = useHasWebGLMock();
    const prefersReducedMotion = useReducedMotionMock();
    return supportsWebGL && !prefersReducedMotion;
  },
  hasWebGL: () => false,
}));

vi.mock("@/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));

vi.mock("motion/react", () => ({
  useReducedMotion: useReducedMotionMock,
}));

vi.mock("@/components/hero/KafkaHeroCanvas", () => ({
  KafkaHeroCanvas: ({ step }: { step: number }) => <div data-testid="canvas-stub" data-step={step} />,
}));

vi.mock("@/components/hero/HeroCaption", () => ({
  HeroCaption: ({ text }: { text: string }) => <div data-testid="caption-stub">{text}</div>,
}));

describe("KafkaHero", () => {
  beforeEach(() => {
    useReducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renderiza o diagrama SVG estático quando WebGL não está disponível, sem montar um canvas 3D", () => {
    useHasWebGLMock.mockReturnValue(false);
    render(<KafkaHero dict={pt} />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByTestId("canvas-stub")).not.toBeInTheDocument();
  });

  it("avança e retorna a etapa ao clicar nas setas, sem depender de scroll", () => {
    useHasWebGLMock.mockReturnValue(true);
    render(<KafkaHero dict={pt} />);

    expect(screen.getByTestId("canvas-stub")).toHaveAttribute("data-step", "0");

    fireEvent.click(screen.getByLabelText(pt.trackSelector.heroNextStep));
    expect(screen.getByTestId("canvas-stub")).toHaveAttribute("data-step", "1");

    fireEvent.click(screen.getByLabelText(pt.trackSelector.heroPrevStep));
    expect(screen.getByTestId("canvas-stub")).toHaveAttribute("data-step", "0");
  });

  it("dá a volta (loop) ao clicar 'anterior' na primeira etapa", () => {
    useHasWebGLMock.mockReturnValue(true);
    render(<KafkaHero dict={pt} />);

    fireEvent.click(screen.getByLabelText(pt.trackSelector.heroPrevStep));
    expect(screen.getByTestId("canvas-stub")).toHaveAttribute("data-step", "2");
  });

  it("clicar num indicador pula direto pra etapa correspondente", () => {
    useHasWebGLMock.mockReturnValue(true);
    render(<KafkaHero dict={pt} />);

    fireEvent.click(
      screen.getByLabelText(
        `${pt.trackSelector.heroGoToStep}: ${pt.trackSelector.heroCaptionConsumerGroup}`,
      ),
    );
    expect(screen.getByTestId("canvas-stub")).toHaveAttribute("data-step", "2");
  });

  it("avança automaticamente via autoplay depois do intervalo", () => {
    vi.useFakeTimers();
    useHasWebGLMock.mockReturnValue(true);
    render(<KafkaHero dict={pt} />);

    expect(screen.getByTestId("canvas-stub")).toHaveAttribute("data-step", "0");
    act(() => {
      vi.advanceTimersByTime(4500);
    });
    expect(screen.getByTestId("canvas-stub")).toHaveAttribute("data-step", "1");
  });
});
