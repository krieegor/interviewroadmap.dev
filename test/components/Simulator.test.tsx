import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Simulator } from "@/components/interview/Simulator";
import type { QuestionFrontmatter } from "@/types/content";
import { pt } from "@/lib/i18n/dictionaries/pt";

const questions: QuestionFrontmatter[] = [
  {
    id: 1,
    title: "O que é Apache Kafka?",
    slug: "o-que-e-apache-kafka",
    level: ["pleno"],
    topics: ["fundamentos"],
    relatedChapters: [],
    shortAnswer: "Resposta curta 1",
    quiz: {
      options: ["Correta 1", "Errada 1a", "Errada 1b", "Errada 1c"],
      correctIndex: 0,
    },
  },
  {
    id: 2,
    title: "O que é um Producer?",
    slug: "o-que-e-um-producer",
    level: ["pleno"],
    topics: ["arquitetura"],
    relatedChapters: [],
    shortAnswer: "Resposta curta 2",
    quiz: {
      options: ["Correta 2", "Errada 2a", "Errada 2b", "Errada 2c"],
      correctIndex: 0,
    },
  },
];

describe("Simulator", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("percorre o simulado até o resultado final", () => {
    render(<Simulator questions={questions} locale="pt" dict={pt} />);

    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulado" }));

    for (let i = 0; i < questions.length; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Revelar resposta" }));
      fireEvent.click(screen.getByRole("button", { name: "Acertei" }));
    }

    expect(screen.getByText("Resultado")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("permite reiniciar o simulado após o resultado", () => {
    render(<Simulator questions={questions} locale="pt" dict={pt} />);

    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulado" }));
    for (let i = 0; i < questions.length; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Revelar resposta" }));
      fireEvent.click(screen.getByRole("button", { name: "Não sabia" }));
    }

    fireEvent.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.getByRole("button", { name: "Iniciar simulado" })).toBeInTheDocument();
  });

  it("percorre o simulado no modo múltipla escolha até o resultado final", () => {
    render(<Simulator questions={questions} locale="pt" dict={pt} />);

    fireEvent.click(screen.getByText("Múltipla escolha"));
    fireEvent.click(screen.getByRole("button", { name: "Iniciar simulado" }));

    let correctOption = screen.getByRole("button", { name: /^Correta/ });
    fireEvent.click(correctOption);
    expect(correctOption).toHaveClass("bg-emerald-600");
    for (const button of screen.getAllByRole("button", { name: /^Errada/ })) {
      expect(button).toBeDisabled();
    }
    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));

    correctOption = screen.getByRole("button", { name: /^Correta/ });
    fireEvent.click(correctOption);
    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));

    expect(screen.getByText("Resultado")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(2);
  });
});
