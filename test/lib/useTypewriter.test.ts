import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypewriter } from "@/lib/hooks/useTypewriter";

const { useReducedMotionMock } = vi.hoisted(() => ({ useReducedMotionMock: vi.fn() }));

vi.mock("motion/react", () => ({
  useReducedMotion: useReducedMotionMock,
}));

describe("useTypewriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("retorna a primeira palavra estática sob prefers-reduced-motion, sem agendar timers", () => {
    useReducedMotionMock.mockReturnValue(true);
    const { result } = renderHook(() => useTypewriter(["Partitions", "Idempotência"]));

    expect(result.current).toBe("Partitions");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("digita a primeira palavra caractere a caractere", () => {
    useReducedMotionMock.mockReturnValue(false);
    const { result } = renderHook(() =>
      useTypewriter(["ABC"], { typingMs: 10, deletingMs: 10, pauseMs: 50 }),
    );

    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("A");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("AB");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("ABC");
  });

  it("apaga a palavra e passa pra próxima depois da pausa", () => {
    useReducedMotionMock.mockReturnValue(false);
    const { result } = renderHook(() =>
      useTypewriter(["AB", "CD"], { typingMs: 10, deletingMs: 10, pauseMs: 20 }),
    );

    act(() => {
      vi.advanceTimersByTime(10);
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("AB");

    act(() => {
      vi.advanceTimersByTime(20); // pausa -> começa a deletar
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("A");

    act(() => {
      vi.advanceTimersByTime(10); // termina de apagar -> avança pra próxima palavra
    });
    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current).toBe("C");
  });

  it("não quebra com lista de palavras vazia", () => {
    useReducedMotionMock.mockReturnValue(false);
    const { result } = renderHook(() => useTypewriter([]));

    expect(result.current).toBe("");
    expect(vi.getTimerCount()).toBe(0);
  });
});
