import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { pt } from "@/lib/i18n/dictionaries/pt";

const mockIndex = [
  {
    type: "Capítulo",
    title: "O que é Apache Kafka?",
    excerpt: "Introdução ao Kafka.",
    href: "/pt/kafka/livro/o-que-e-apache-kafka",
  },
  {
    type: "Pergunta",
    title: "O que é um Producer?",
    excerpt: "Quem publica eventos.",
    href: "/pt/kafka/perguntas/o-que-e-um-producer",
  },
];

describe("SearchDialog", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockIndex) } as Response)),
    );
  });

  it("busca o índice sob demanda no hover e filtra resultados", async () => {
    render(<SearchDialog tech="kafka" locale="pt" dict={pt} />);
    const button = screen.getByRole("button", { name: "Buscar" });

    fireEvent.mouseEnter(button);
    expect(fetch).toHaveBeenCalledWith("/search-index/kafka-pt.json");

    fireEvent.click(button);
    const input = await screen.findByPlaceholderText(pt.search.placeholder);
    fireEvent.change(input, { target: { value: "producer" } });

    await waitFor(() => {
      expect(screen.getByText("O que é um Producer?")).toBeInTheDocument();
    });
    expect(screen.queryByText("O que é Apache Kafka?")).not.toBeInTheDocument();
  });

  it("não refaz a busca se o índice já foi carregado", () => {
    render(<SearchDialog tech="kafka" locale="pt" dict={pt} />);
    const button = screen.getByRole("button", { name: "Buscar" });

    fireEvent.mouseEnter(button);
    fireEvent.focus(button);
    fireEvent.click(button);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("mostra estado de nenhum resultado quando a busca não bate com nada", async () => {
    render(<SearchDialog tech="kafka" locale="pt" dict={pt} />);
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    const input = await screen.findByPlaceholderText(pt.search.placeholder);
    fireEvent.change(input, { target: { value: "zzzznada" } });

    await waitFor(() => {
      expect(screen.getByText(/Nada encontrado/)).toBeInTheDocument();
    });
  });
});
