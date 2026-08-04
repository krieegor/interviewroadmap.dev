# Roadmap — Apache Kafka para Entrevistas Java Sênior

## Fase 1 — Análise (concluída)

- [x] specs/product.md
- [x] specs/architecture.md
- [x] specs/content-guidelines.md
- [x] specs/design-system.md
- [x] specs/roadmap.md

## Fase 2 — Fundação (concluída)

- [x] Inicializar Next.js + TypeScript + Tailwind + MDX
- [x] Layout base (Header, Sidebar, Shell), tema claro/escuro
- [x] Navegação (config de topo, BookSidebar derivada do frontmatter, ChapterPager)
- [x] SEO base (metadata raiz, sitemap, robots, OG dinâmico, manifest, icon)

## Fase 3 — Conteúdo inicial (concluída)

- [x] Home
- [x] Página do livro (índice) + rota de capítulo
- [x] Capítulos 1–3 (Fundamentos + início de Arquitetura)
- [x] 10 primeiras perguntas de entrevista
- [x] Glossário inicial (15 termos centrais)
- [x] Estudo de caso 1 — PIX recebido
- [x] Simulador básico

## Fase 4 — Expansão (pós-fundação, trabalho contínuo)

- [x] Capítulos 4–15 (restante das 5 partes editoriais) — livro completo, 15/15 capítulos
  - [x] Capítulo 4 — Partitions e ordenação
  - [x] Capítulo 5 — Brokers, líderes e replicação
  - [x] Capítulo 6 — Consumer Groups e Rebalance
  - [x] Capítulo 7 — Offset e Commit
  - [x] Capítulo 8 — Retention e Replay
  - [x] Capítulo 9 — Retry e DLQ
  - [x] Capítulo 10 — Garantias de entrega
  - [x] Capítulo 11 — Idempotência
  - [x] Capítulo 12 — Transações e Outbox Pattern
  - [x] Capítulo 13 — Producer com Spring Kafka
  - [x] Capítulo 14 — Consumer com Spring Kafka
  - [x] Capítulo 15 — Observabilidade
- [x] Perguntas 11–50 (50/50 perguntas completas)
- [x] Estudos de caso 2–5 (5/5 completos: PIX, compra com cartão, faturas, reconstrução de índice, integração instável)
- [x] Diagramas completos (catálogo da seção 10 de content-guidelines.md + Circuit Breaker, adicional)
- [x] Busca local (índice + UI via `Ctrl+K`)
- [x] Progresso de leitura (via `useSyncExternalStore`, barra de % na home, marcação manual de concluído)
- [x] Simulador completo (histórico visível na UI: resumo agregado + quebra por assunto + lista dos últimos
      simulados, via `useSyncExternalStore`; filtros por nível/assunto já existiam)
- [x] Glossário completo (24 termos do briefing)

## Fase 5 — Validação (baseline concluída na fundação; repetir a cada expansão relevante)

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run validate-content`
- [x] `npm run build`
- [x] Revisão de responsividade (desktop verificado no navegador; mobile validado por revisão de código —
      breakpoints Tailwind + drawer Radix)
- [x] Revisão de acessibilidade básica (semântica, foco visível, `aria-label`, `prefers-reduced-motion`)
- [x] Revisão de links internos (script `validate-content` cobre `relatedChapters` e links `[texto](/livro/slug)`)
- [x] Revisão de consistência visual e técnica (testado no navegador em tema claro/escuro)

## Pós-lançamento (backlog, fora do escopo inicial)

- [x] Página dedicada por termo de glossário com deep link — `/[locale]/glossario/[slug]`, listagem em
      `/glossario` linkando para cada página, sitemap e `validate-content` cobrindo a rota nova.
- [x] Sumário "nesta página" (coluna direita) nos capítulos — `rehype-slug` + `github-slugger` geram/replicam
      ids de heading, `TableOfContents` renderiza `##`/`###` com âncora, `<details>` equivalente em mobile.
- [x] Exportação do e-book (capítulos) em PDF — gerado em build-time (`postbuild`) via Playwright a
      partir da rota `/pt/livro/impressao`, publicado em `public/livro.pdf` e disponível para download na
      página `/livro`. Só em português; export de PDF em inglês e EPUB continuam no backlog.
- [x] Internacionalização (EN) — infraestrutura completa: rotas `/pt/[...]` e `/en/[...]` simétricas,
      dicionários de UI tipados, loaders de conteúdo por locale, busca e sitemap por locale,
      `LocaleSwitcher` com fallback seguro. **Conteúdo 100% traduzido**: 15/15 capítulos, 50/50 perguntas,
      glossário completo (24 termos) e os 5 estudos de caso. Cada capítulo com diagrama próprio (SVG/React)
      ganhou a variante `*En.tsx` correspondente (padrão em `ProducerConsumerFlowEn.tsx`). Ver
      `specs/architecture.md` seção 13.
- Testes E2E (Playwright) se o projeto crescer em complexidade de interação
- Export de PDF do livro em inglês (hoje `scripts/generate-pdf.ts` gera só a versão `/pt/livro/impressao`)
