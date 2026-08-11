import { describe, it, expect, vi, afterEach } from "vitest";
import { hasWebGL } from "@/components/three/webgl-support";

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
