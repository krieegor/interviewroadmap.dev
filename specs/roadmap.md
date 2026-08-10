# Roadmap — trainer.dev

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

- [x] Página dedicada por termo de glossário com deep link — `/[locale]/[tech]/glossario/[slug]`, listagem
      em `/glossario` linkando para cada página, sitemap e `validate-content` cobrindo a rota nova.
- [x] Sumário "nesta página" (coluna direita) nos capítulos — `rehype-slug` + `github-slugger` geram/replicam
      ids de heading, `TableOfContents` renderiza `##`/`###` com âncora, `<details>` equivalente em mobile.
- [x] Exportação do e-book (capítulos) em PDF — gerado em build-time (`postbuild`) via Playwright a
      partir da rota `/pt/kafka/livro/impressao`, publicado em `public/livro.pdf` e disponível para
      download na página `/livro`. Só em português; export de PDF em inglês e EPUB continuam no backlog.
- [x] Internacionalização (EN) — infraestrutura completa: rotas `/pt/[...]` e `/en/[...]` simétricas,
      dicionários de UI tipados, loaders de conteúdo por locale, busca e sitemap por locale,
      `LocaleSwitcher` com fallback seguro. **Conteúdo 100% traduzido**: 15/15 capítulos, 50/50 perguntas,
      glossário completo (24 termos) e os 5 estudos de caso. Cada capítulo com diagrama próprio (SVG/React)
      ganhou a variante `*En.tsx` correspondente (padrão em `ProducerConsumerFlowEn.tsx`). Ver
      `specs/architecture.md` seção 13.

## Fase 6 — trainer.dev: plataforma multi-trilha (concluída)

- [x] Modo "múltipla escolha" no simulador (além do modo aberto) — campo `quiz` obrigatório no frontmatter
      de pergunta, alternativas embaralhadas em runtime, feedback visual certo/errado.
- [x] Painel lateral para "ver resposta completa" no simulador (iframe da própria página da pergunta,
      via `@radix-ui/react-dialog`) — não navega para fora nem perde o progresso da sessão.
- [x] Correção de paginação do PDF — título não fica mais sozinho no fim de página (agrupamento
      heading+parágrafo via plugin rehype próprio, `src/lib/mdx/rehype-keep-heading-with-next.mjs`).
- [x] Capa do PDF com caixa de contribuidores e versão datada (dia/mês/ano).
- [x] Restruturação completa da plataforma para multi-trilha: `/[locale]/[tech]/...`, trilha Kafka
      completa, Java e Elastic Search como trilhas "em construção" com página própria. Ver
      `specs/architecture.md` seção 14 (inclui o bug do Next.js 16 com `generateStaticParams` aninhado que
      foi descoberto e contornado nessa migração).
- [x] Landing page do seletor de trilha (`/[locale]`), com hero, seção "como funciona" e ícones por
      trilha (`src/components/icons/TechIcon.tsx`).
- [x] Logo próprio (`src/components/icons/Logo.tsx`, lambda estilizada) aplicado a favicon, `/icon`,
      Header e landing.
- [x] Repositório GitHub renomeado para `trainer.dev`.

## Fase 7 — quatro novas trilhas "em construção" (concluída)

- [x] Trilhas **SQL**, **Amazon Web Services (AWS)** e **Google Cloud Platform (GCP)** adicionadas ao
      seletor (`src/lib/tech/config.ts`, `src/config/tech.ts`), com página própria "em construção"
      (mesmo padrão de Java/Elastic) e ícone próprio em `TechIcon.tsx`.
- [x] Cor de destaque (`--color-accent`/`--color-accent-subtle`) passou a variar por trilha via atributo
      `data-tech` (`src/app/[locale]/[tech]/layout.tsx` e nos cards do seletor), em vez de um único laranja
      global — cada trilha usa uma cor que remete à sua identidade (Java vermelho, Elastic teal, SQL azul
      genérico, AWS laranja-queimado, GCP azul Google), sempre validada para contraste AA. Kafka continua
      laranja (default herdado de `:root`/`.dark`).
- [x] Aviso de marca (`footer.disclaimer`, `sobre.trademarkDisclaimer`, PDF de impressão, README) atualizado
      para citar também Amazon Web Services e Google Cloud.

## Pós-lançamento — vídeo de demonstração (concluído)

- [x] Vídeo de demonstração curto (recriação estilizada do hero + do simulador em modo múltipla escolha,
      paleta dark do design system) usado no topo do `README.md` (GIF) e num bloco discreto perto do CTA de
      GitHub na landing page (MP4, mudo, loop, oculto sob `prefers-reduced-motion`). Gerado por um
      subprojeto isolado `remotion/` (Remotion), com `package.json` próprio — **não** é dependência do app
      Next.js, nunca é importado por `src/`, e o render não roda no `npm run build`/CI (é manual, ver
      `docs/contributing.md`). Segue o mesmo espírito de `scripts/generate-pdf.ts` (ferramenta de build-time
      isolada), mas sem hook automático por ser lento e exigir Chromium. Justificativa do desvio: a landing
      page hoje segue `specs/design-system.md` §1 ("sem seções hero com CTA gigante"), então o vídeo
      deliberadamente **não** entra no hero acima da dobra — fica como preview pequeno e opcional perto do
      link do GitHub existente.

## Pós-lançamento — export estático puro (`output: "export"`) (concluído)

- [x] `next.config.ts` passou a usar `output: "export"` (+ `images.unoptimized: true`, já que export
      estático não tem servidor pra otimizar imagem sob demanda). `npm run build` agora gera `out/` com
      HTML/CSS/JS puro — sem servidor Node em produção. Motivação: uma tentativa de deploy no Cloudflare
      como **Worker** (via `@opennextjs/cloudflare`) esbarrou em dois problemas de fundo — o Worker
      ultrapassava o limite de tamanho (15+ MB, acima até do plano pago) e o cache incremental necessário
      pra servir páginas SSG corretamente exigia um bucket R2, que por sua vez exige cadastrar cartão/PayPal
      na conta Cloudflare (mesmo no free tier). Como o site já era 100% estático por design (todo conteúdo
      via `generateStaticParams`, sem middleware, sem API routes, sem Server Actions), rodá-lo atrás de um
      Worker nunca foi necessário — a causa raiz era simplesmente não estar usando `output: "export"`.
- [x] `scripts/generate-pdf.ts` deixou de depender de `next start` (incompatível com `output: "export"`) —
      agora serve `out/` com `serve` (novo devDependency) e escreve o PDF em `public/livro.pdf` **e**
      `out/livro.pdf` (o export já foi copiado de `public/` antes do `postbuild` rodar).
      `export const dynamicParams = false` nas rotas com `generateStaticParams` (adicionado durante a
      tentativa com Cloudflare Workers, ver commit anterior) continua correto/necessário aqui — export
      estático exige que todo parâmetro de rota dinâmica seja conhecido em build time.
- [x] Removida toda a infra da tentativa com Workers: `@opennextjs/cloudflare`, `wrangler`, `wrangler.jsonc`,
      `open-next.config.ts`, scripts `preview`/`deploy` do `package.json`. `docs/deployment.md` atualizado —
      Cloudflare volta a ser **Pages** clássico (build output `out/`, sem adapter), e GitHub Pages passou de
      "não recomendado" para viável (site agora é estático puro).

## Backlog (trilhas futuras e itens ainda em aberto)

- Conteúdo real para a trilha **Java** (hoje só "em construção").
- Conteúdo real para a trilha **Elastic Search** (hoje só "em construção").
- Conteúdo real para as trilhas **SQL**, **AWS** e **GCP** (hoje só "em construção").
- Testes E2E (Playwright) se o projeto crescer em complexidade de interação.
- Export de PDF do livro em inglês (hoje `scripts/generate-pdf.ts` gera só a versão `/pt/kafka/livro/impressao`).
- Exportar/importar progresso do simulador e leitura em JSON (hoje só `localStorage`, perdido ao trocar de
  navegador/dispositivo).
