import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReplayDiagram } from "@/components/diagrams/ReplayDiagram";

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

vi.mock("motion/react", () => ({
  useReducedMotion: useReducedMotionMock,
}));

describe("ReplayDiagram", () => {
  it("renderiza o SVG estático quando WebGL não está disponível, sem montar um canvas 3D", () => {
    useHasWebGLMock.mockReturnValue(false);
    useReducedMotionMock.mockReturnValue(false);
    render(<ReplayDiagram />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(document.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("renderiza o SVG estático quando o usuário prefere reduced motion, mesmo com WebGL disponível", () => {
    useHasWebGLMock.mockReturnValue(true);
    useReducedMotionMock.mockReturnValue(true);
    render(<ReplayDiagram />);

    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(document.querySelector("canvas")).not.toBeInTheDocument();
  });
});
