import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { hasWebGL, useShouldRender3D } from "@/components/three/webgl-support";

const { useReducedMotionMock } = vi.hoisted(() => ({
  useReducedMotionMock: vi.fn(),
}));

vi.mock("motion/react", () => ({
  useReducedMotion: useReducedMotionMock,
}));

function mockMatchMedia(matchesQuery: string | null) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query === matchesQuery,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("hasWebGL", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna true quando o canvas consegue criar um contexto WebGL", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      {} as RenderingContext,
    );

    expect(hasWebGL()).toBe(true);
  });

  it("retorna false quando nenhum contexto WebGL está disponível", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(hasWebGL()).toBe(false);
  });

  it("retorna false se getContext lançar (ambiente sem suporte)", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("WebGL indisponível");
    });

    expect(hasWebGL()).toBe(false);
  });
});

describe("useShouldRender3D", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("retorna false sob @media print, mesmo com WebGL disponível e sem reduced motion", () => {
    // Regressão: scripts/generate-pdf.ts gera o PDF do livro via Playwright/Chromium com
    // `page.emulateMedia({ media: "print" })`. O canvas WebGL dos diagramas 3D não sobrevive a essa
    // captura de impressão (sai em branco, rótulos <Html> do drei somem); sob @media print o
    // fallback SVG precisa ser usado mesmo quando o navegador tem WebGL de sobra.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as RenderingContext);
    useReducedMotionMock.mockReturnValue(false);
    mockMatchMedia("print");

    const { result } = renderHook(() => useShouldRender3D());

    expect(result.current).toBe(false);
  });

  it("retorna true fora de @media print, com WebGL disponível e sem reduced motion", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as RenderingContext);
    useReducedMotionMock.mockReturnValue(false);
    mockMatchMedia(null);

    const { result } = renderHook(() => useShouldRender3D());

    expect(result.current).toBe(true);
  });
});
