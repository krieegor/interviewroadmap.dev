import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SimulatorHistory } from "@/components/interview/SimulatorHistory";
import { saveSimulatorResult } from "@/lib/progress/simulator-progress";
import { pt } from "@/lib/i18n/dictionaries/pt";

describe("SimulatorHistory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("não renderiza nada quando não há histórico", () => {
    const { container } = render(<SimulatorHistory locale="pt" dict={pt} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra o resumo agregado e a lista de simulados após salvar resultados", () => {
    saveSimulatorResult({
      date: new Date().toISOString(),
      level: "senior",
      topic: "fundamentos",
      mode: "aberta",
      total: 5,
      totalTimeMs: 125000,
      correct: 3,
      partial: 1,
      unknown: 1,
    });
    saveSimulatorResult({
      date: new Date().toISOString(),
      level: "pleno",
      topic: "arquitetura",
      mode: "multipla-escolha",
      total: 4,
      totalTimeMs: 60000,
      correct: 4,
      partial: 0,
      unknown: 0,
    });

    render(<SimulatorHistory locale="pt" dict={pt} />);

    expect(screen.getByText("2")).toBeInTheDocument(); // simulados feitos
    expect(screen.getByText("9")).toBeInTheDocument(); // perguntas respondidas
    expect(screen.getByText("Pleno · arquitetura · Múltipla escolha")).toBeInTheDocument();
    expect(screen.getByText("Sênior · fundamentos · Aberta")).toBeInTheDocument();
  });
});
