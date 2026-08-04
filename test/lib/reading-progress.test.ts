import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useReadingProgress } from "@/lib/progress/reading-progress";

describe("useReadingProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("marca o capítulo atual como visitado e como último visitado", () => {
    const { result } = renderHook(() => useReadingProgress("o-que-e-apache-kafka"));

    expect(result.current.progress.visited).toContain("o-que-e-apache-kafka");
    expect(result.current.progress.lastVisited).toBe("o-que-e-apache-kafka");
  });

  it("não duplica o mesmo slug ao visitar novamente", () => {
    const { result, rerender } = renderHook(
      ({ slug }: { slug: string }) => useReadingProgress(slug),
      { initialProps: { slug: "o-que-e-apache-kafka" } },
    );

    rerender({ slug: "o-que-e-apache-kafka" });

    const occurrences = result.current.progress.visited.filter(
      (s) => s === "o-que-e-apache-kafka",
    ).length;
    expect(occurrences).toBe(1);
  });

  it("alterna o status de concluído e persiste no localStorage", () => {
    const { result } = renderHook(() => useReadingProgress("arquitetura-interna"));

    act(() => {
      result.current.toggleCompleted("arquitetura-interna");
    });
    expect(result.current.progress.completed).toContain("arquitetura-interna");

    act(() => {
      result.current.toggleCompleted("arquitetura-interna");
    });
    expect(result.current.progress.completed).not.toContain("arquitetura-interna");
  });

  it("persiste o progresso entre instâncias do hook (via localStorage)", () => {
    const { result: first } = renderHook(() =>
      useReadingProgress("kafka-versus-outras-ferramentas"),
    );
    act(() => {
      first.current.toggleCompleted("kafka-versus-outras-ferramentas");
    });

    const { result: second } = renderHook(() => useReadingProgress());
    expect(second.current.progress.completed).toContain("kafka-versus-outras-ferramentas");
  });
});
