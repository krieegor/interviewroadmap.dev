import { describe, it, expect, beforeEach } from "vitest";
import {
  STORAGE_KEY,
  getQuestionWeight,
  readQuestionProgress,
  recordQuestionAnswer,
} from "@/lib/progress/question-progress";

describe("question-progress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("retorna progresso vazio quando nada foi salvo", () => {
    expect(readQuestionProgress()).toEqual({});
  });

  it("dá peso máximo pra pergunta nunca vista", () => {
    const progress = readQuestionProgress();
    expect(getQuestionWeight(progress, "kafka", "particoes")).toBe(3);
  });

  it("registra a resposta e aumenta o contador de vezes vista", () => {
    recordQuestionAnswer("kafka", "particoes", "acertei");
    recordQuestionAnswer("kafka", "particoes", "parcial");

    const progress = readQuestionProgress();
    expect(progress["kafka:particoes"]).toMatchObject({ lastAnswer: "parcial", timesSeen: 2 });
  });

  it("dá peso 3 pra última resposta 'nao-sabia', 2 pra 'parcial' e 1 pra 'acertei'", () => {
    recordQuestionAnswer("kafka", "a", "nao-sabia");
    recordQuestionAnswer("kafka", "b", "parcial");
    recordQuestionAnswer("kafka", "c", "acertei");

    const progress = readQuestionProgress();
    expect(getQuestionWeight(progress, "kafka", "a")).toBe(3);
    expect(getQuestionWeight(progress, "kafka", "b")).toBe(2);
    expect(getQuestionWeight(progress, "kafka", "c")).toBe(1);
  });

  it("mantém o progresso separado por tech", () => {
    recordQuestionAnswer("kafka", "particoes", "acertei");
    const progress = readQuestionProgress();
    expect(getQuestionWeight(progress, "java", "particoes")).toBe(3);
    expect(getQuestionWeight(progress, "kafka", "particoes")).toBe(1);
  });

  it("ignora JSON corrompido no localStorage e volta pro progresso vazio", () => {
    localStorage.setItem(STORAGE_KEY, "{ isso não é json válido");
    expect(readQuestionProgress()).toEqual({});
  });

  it("ignora dado com shape errado no localStorage e volta pro progresso vazio", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "kafka:x": { lastAnswer: "invalido" } }));
    expect(readQuestionProgress()).toEqual({});
  });
});
