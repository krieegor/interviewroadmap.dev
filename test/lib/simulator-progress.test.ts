import { describe, it, expect, beforeEach } from "vitest";
import { STORAGE_KEY, readSimulatorHistory, saveSimulatorResult } from "@/lib/progress/simulator-progress";

function makeResult(overrides: Partial<Parameters<typeof saveSimulatorResult>[0]> = {}) {
  return {
    date: new Date().toISOString(),
    level: "senior",
    topic: "fundamentos",
    mode: "aberta" as const,
    total: 5,
    correct: 3,
    partial: 1,
    unknown: 1,
    ...overrides,
  };
}

describe("simulator-progress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("retorna histórico vazio quando nada foi salvo", () => {
    expect(readSimulatorHistory()).toEqual([]);
  });

  it("salva um resultado e o disponibiliza no início do histórico", () => {
    saveSimulatorResult(makeResult({ topic: "fundamentos" }));
    saveSimulatorResult(makeResult({ topic: "arquitetura" }));

    const history = readSimulatorHistory();
    expect(history).toHaveLength(2);
    expect(history[0]?.topic).toBe("arquitetura");
  });

  it("limita o histórico aos 10 resultados mais recentes", () => {
    for (let i = 0; i < 15; i++) {
      saveSimulatorResult(makeResult({ topic: `topico-${i}` }));
    }

    const history = readSimulatorHistory();
    expect(history).toHaveLength(10);
    expect(history[0]?.topic).toBe("topico-14");
  });

  it("ignora JSON corrompido no localStorage e volta pro histórico vazio", () => {
    localStorage.setItem(STORAGE_KEY, "{ isso não é json válido");
    expect(readSimulatorHistory()).toEqual([]);
  });

  it("ignora dado com shape errado no localStorage e volta pro histórico vazio", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ date: "hoje" }]));
    expect(readSimulatorHistory()).toEqual([]);
  });
});
