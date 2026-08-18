# Roadmap do interviewroadmap.dev

## Fase 1: Análise (concluída)

- [x] specs/product.md
- [x] specs/architecture.md
- [x] specs/content-guidelines.md
- [x] specs/design-system.md
- [x] specs/roadmap.md

## Fase 2: Fundação (concluída)

- [x] Inicializar Next.js + TypeScript + Tailwind + MDX
- [x] Layout base (Header, Sidebar, Shell), tema claro/escuro
- [x] Navegação (config de topo, BookSidebar derivada do frontmatter, ChapterPager)
- [x] SEO base (metadata raiz, sitemap, robots, OG dinâmico, manifest, icon)

## Fase 3: Conteúdo inicial (concluída)

- [x] Home
- [x] Página do livro (índice) + rota de capítulo
- [x] Capítulos 1-3 (Fundamentos + início de Arquitetura)
- [x] 10 primeiras perguntas de entrevista
- [x] Glossário inicial (15 termos centrais)
- [x] Estudo de caso 1: PIX recebido
- [x] Simulador básico

## Fase 4: Expansão (pós-fundação, trabalho contínuo)

- [x] Capítulos 4-15 (restante das 5 partes editoriais): livro completo, 15/15 capítulos
  - [x] Capítulo 4: Partitions e ordenação
  - [x] Capítulo 5: Brokers, líderes e replicação
  - [x] Capítulo 6: Consumer Groups e Rebalance
  - [x] Capítulo 7: Offset e Commit
  - [x] Capítulo 8: Retention e Replay
  - [x] Capítulo 9: Retry e DLQ
  - [x] Capítulo 10: Garantias de entrega
  - [x] Capítulo 11: Idempotência
  - [x] Capítulo 12: Transações e Outbox Pattern
  - [x] Capítulo 13: Producer com Spring Kafka
  - [x] Capítulo 14: Consumer com Spring Kafka
  - [x] Capítulo 15: Observabilidade
- [x] Perguntas 11-50 (50/50 perguntas completas)
- [x] Estudos de caso 2-5 (5/5 completos: PIX, compra com cartão, faturas, reconstrução de índice, integração instável)
- [x] Diagramas completos (catálogo da seção 10 de content-guidelines.md + Circuit Breaker, adicional)
- [x] Busca local (índice + UI via `Ctrl+K`)
- [x] Progresso de leitura (via `useSyncExternalStore`, barra de % na home, marcação manual de concluído)
- [x] Simulador completo (histórico visível na UI: resumo agregado + quebra por assunto + lista dos últimos
      simulados, via `useSyncExternalStore`; filtros por nível/assunto já existiam)
- [x] Glossário completo (24 termos do briefing)

## Fase 5: Validação (baseline concluída na fundação; repetir a cada expansão relevante)

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run validate-content`
- [x] `npm run build`
- [x] Revisão de responsividade (desktop verificado no navegador; mobile validado por revisão de código:
      breakpoints Tailwind + drawer Radix)
- [x] Revisão de acessibilidade básica (semântica, foco visível, `aria-label`, `prefers-reduced-motion`)
- [x] Revisão de links internos (script `validate-content` cobre `relatedChapters` e links `[texto](/livro/slug)`)
- [x] Revisão de consistência visual e técnica (testado no navegador em tema claro/escuro)

## Pós-lançamento (backlog, fora do escopo inicial)

- [x] Página dedicada por termo de glossário com deep link: `/[locale]/[tech]/glossario/[slug]`, listagem
      em `/glossario` linkando para cada página, sitemap e `validate-content` cobrindo a rota nova.
- [x] Sumário "nesta página" (coluna direita) nos capítulos: `rehype-slug` + `github-slugger` geram/replicam
      ids de heading, `TableOfContents` renderiza `##`/`###` com âncora, `<details>` equivalente em mobile.
- [x] Exportação do e-book (capítulos) em PDF, gerado em build-time (`postbuild`) via Playwright a
      partir da rota `/pt/kafka/livro/impressao`, publicado em `public/livro.pdf` e disponível para
      download na página `/livro`. Só em português; export de PDF em inglês e EPUB continuam no backlog.
- [x] Internacionalização (EN), infraestrutura completa: rotas `/pt/[...]` e `/en/[...]` simétricas,
      dicionários de UI tipados, loaders de conteúdo por locale, busca e sitemap por locale,
      `LocaleSwitcher` com fallback seguro. **Conteúdo 100% traduzido**: 15/15 capítulos, 50/50 perguntas,
      glossário completo (24 termos) e os 5 estudos de caso. Cada capítulo com diagrama próprio (SVG/React)
      ganhou a variante `*En.tsx` correspondente (padrão em `ProducerConsumerFlowEn.tsx`). Ver
      [`specs/architecture.md`](./architecture.md) seção 13.

## Fase 6, trainer.dev: plataforma multi-trilha (concluída)

- [x] Modo "múltipla escolha" no simulador (além do modo aberto), campo `quiz` obrigatório no frontmatter
      de pergunta, alternativas embaralhadas em runtime, feedback visual certo/errado.
- [x] Painel lateral para "ver resposta completa" no simulador (iframe da própria página da pergunta,
      via `@radix-ui/react-dialog`); não navega para fora nem perde o progresso da sessão.
- [x] Correção de paginação do PDF: título não fica mais sozinho no fim de página (agrupamento
      heading+parágrafo via plugin rehype próprio, `src/lib/mdx/rehype-keep-heading-with-next.mjs`).
- [x] Capa do PDF com caixa de contribuidores e versão datada (dia/mês/ano).
- [x] Restruturação completa da plataforma para multi-trilha: `/[locale]/[tech]/...`, trilha Kafka
      completa, Java e Elastic Search como trilhas "em construção" com página própria. Ver
      [`specs/architecture.md`](./architecture.md) seção 14 (inclui o bug do Next.js 16 com
      `generateStaticParams` aninhado que foi descoberto e contornado nessa migração).
- [x] Landing page do seletor de trilha (`/[locale]`), com hero, seção "como funciona" e ícones por
      trilha (`src/components/icons/TechIcon.tsx`).
- [x] Logo próprio (`src/components/icons/Logo.tsx`, lambda estilizada) aplicado a favicon, `/icon`,
      Header e landing.
- [x] Repositório GitHub renomeado para `trainer.dev`.

## Fase 7: quatro novas trilhas "em construção" (concluída)

- [x] Trilhas **SQL**, **Amazon Web Services (AWS)** e **Google Cloud Platform (GCP)** adicionadas ao
      seletor (`src/lib/tech/config.ts`, `src/config/tech.ts`), com página própria "em construção"
      (mesmo padrão de Java/Elastic) e ícone próprio em `TechIcon.tsx`.
- [x] Cor de destaque (`--color-accent`/`--color-accent-subtle`) passou a variar por trilha via atributo
      `data-tech` (`src/app/[locale]/[tech]/layout.tsx` e nos cards do seletor), em vez de um único laranja
      global: cada trilha usa uma cor que remete à sua identidade (Java vermelho, Elastic teal, SQL azul
      genérico, AWS laranja-queimado, GCP azul Google), sempre validada para contraste AA. Kafka continua
      laranja (default herdado de `:root`/`.dark`).
- [x] Aviso de marca (`footer.disclaimer`, `sobre.trademarkDisclaimer`, PDF de impressão, README) atualizado
      para citar também Amazon Web Services e Google Cloud.

## Pós-lançamento: vídeo de demonstração (concluído)

- [x] Vídeo de demonstração curto (recriação estilizada do hero + do simulador em modo múltipla escolha,
      paleta dark do design system) usado no topo do [`README.md`](../README.md) (GIF) e num bloco discreto
      perto do CTA de GitHub na landing page (MP4, mudo, loop, oculto sob `prefers-reduced-motion`). Gerado
      por um subprojeto isolado `remotion/` (Remotion), com `package.json` próprio; **não** é dependência
      do app Next.js, nunca é importado por `src/`, e o render não roda no `npm run build`/CI (é manual, ver
      [`docs/contributing.md`](../docs/contributing.md)). Segue o mesmo espírito de
      `scripts/generate-pdf.ts` (ferramenta de build-time isolada), mas sem hook automático por ser lento e
      exigir Chromium. Justificativa do desvio: a landing page hoje segue
      [`specs/design-system.md`](./design-system.md) §1 ("sem seções hero com CTA gigante"), então o vídeo
      deliberadamente **não** entra no hero acima da dobra; fica como preview pequeno e opcional perto do
      link do GitHub existente.

## Pós-lançamento: export estático puro (`output: "export"`) (concluído)

- [x] `next.config.ts` passou a usar `output: "export"` (+ `images.unoptimized: true`, já que export
      estático não tem servidor pra otimizar imagem sob demanda). `npm run build` agora gera `out/` com
      HTML/CSS/JS puro, sem servidor Node em produção. Motivação: uma tentativa de deploy no Cloudflare
      como **Worker** (via `@opennextjs/cloudflare`) esbarrou em dois problemas de fundo: o Worker
      ultrapassava o limite de tamanho (15+ MB, acima até do plano pago) e o cache incremental necessário
      pra servir páginas SSG corretamente exigia um bucket R2, que por sua vez exige cadastrar cartão/PayPal
      na conta Cloudflare (mesmo no free tier). Como o site já era 100% estático por design (todo conteúdo
      via `generateStaticParams`, sem middleware, sem API routes, sem Server Actions), rodá-lo atrás de um
      Worker nunca foi necessário: a causa raiz era simplesmente não estar usando `output: "export"`.
- [x] `scripts/generate-pdf.ts` deixou de depender de `next start` (incompatível com `output: "export"`),
      agora serve `out/` com `serve` (novo devDependency) e escreve o PDF em `public/livro.pdf` **e**
      `out/livro.pdf` (o export já foi copiado de `public/` antes do `postbuild` rodar).
      `export const dynamicParams = false` nas rotas com `generateStaticParams` (adicionado durante a
      tentativa com Cloudflare Workers, ver commit anterior) continua correto/necessário aqui: export
      estático exige que todo parâmetro de rota dinâmica seja conhecido em build time.
- [x] Removida a infra pesada da tentativa com Workers (`@opennextjs/cloudflare`, R2, cache incremental).
      `wrangler.jsonc` voltou, mas minimalista (só `assets.directory: "./out"`, sem `main`/Worker script):
      o Worker existente na Cloudflare (`trainer-dev.workers.dev`, criado no fluxo de git integration)
      continuou funcionando sem precisar recriar o projeto como Pages, porque Workers suporta "só assets
      estáticos" como modo nativo. [`docs/deployment.md`](../docs/deployment.md) atualizado; GitHub Pages
      passou de "não recomendado" para viável (site agora é estático puro).
- [x] `public/livro.pdf` passou a ser **committado no git** em vez de gerado do zero em todo build: o
      Cloudflare Workers Builds não tem as libs gráficas do Chromium (mesmo problema de antes), então nesse
      provedor o `postbuild` sempre pulava a geração e o deploy ficava sem PDF (`/livro.pdf` 404). Como
      `next build` copia `public/**` pra `out/` antes do `postbuild` rodar, ter o PDF committado garante que
      todo deploy (mesmo sem Chromium) publica pelo menos a última versão gerada. Regenerar continua
      automático em ambientes com Chromium (local, GitHub Actions, Vercel, Netlify); o autor comita o
      `public/livro.pdf` atualizado quando muda conteúdo do livro (ver
      [`docs/contributing.md`](../docs/contributing.md)).

## Pós-lançamento: rebranding para trainerdev.app (concluído)

- [x] Domínio `trainer.dev` trocado por `trainerdev.app` (o primeiro ficou caro demais pra manter), marca
      atualizada em `src/config/site.ts`, dicionários de i18n, README, [`CLAUDE.md`](../CLAUDE.md),
      [`specs/`](.), [`docs/content-authoring.md`](../docs/content-authoring.md), logo/favicon
      (`aria-label`) e `package.json`/`remotion/package.json`.
- [x] Vídeo de demonstração (`remotion/src/scenes/Intro.tsx` e `Outro.tsx`) re-renderizado com o novo nome:
      `public/videos/demo.mp4`, `public/videos/demo-poster.jpg` e `docs/media/demo.gif` regenerados via
      `npm run render:mp4`/`render:gif` + `remotion still` (ver
      [`docs/contributing.md`](../docs/contributing.md)).
- [x] Repositório GitHub renomeado de `trainer.dev` para `trainerdev.app`: `githubUrl` em
      `src/config/site.ts` e o badge de CI do README atualizados para a nova URL.
- [x] Worker da Cloudflare renomeado de `trainer-dev` para `trainerdev-app`: `wrangler.jsonc` (`name`) e
      [`docs/deployment.md`](../docs/deployment.md) atualizados para a nova URL
      (`trainerdev-app.workers.dev`). As entradas antigas
      deste changelog (Fase 6, "export estático puro") não foram reescritas: permanecem como registro
      histórico do nome em uso na época de cada uma.

## Pós-lançamento: remoção do Remotion (concluído)

- [x] Subprojeto `remotion/` removido inteiramente (custo de manutenção de uma segunda toolchain só pra
      gerar um vídeo curto não se justificava). `public/videos/demo.mp4` e `public/videos/demo-poster.jpg`
      removidos junto: a landing page voltou a ter só a seção de texto + CTA de GitHub, sem o bloco de
      vídeo, e a seção "vídeo de demonstração" (Pós-lançamento, acima) passou a ser histórico puro.
      `docs/media/demo.gif` foi mantido como asset estático no topo do README (sem pipeline de geração; pra
      atualizar, é só substituir o arquivo). Referências a `remotion/` removidas de `.prettierignore`,
      `eslint.config.mjs` e `tsconfig.json` (`exclude`).

## Pós-lançamento: hero 3D interativo (Motion + Three.js) (concluído)

- [x] `motion`, `three`, `@react-three/fiber`, `@react-three/drei` adicionados como dependências (e
      `@types/three` como devDependency), mudança de direção visual deliberada, pedida pelo autor,
      substituindo a regra "sem animação de scroll" nas páginas de seletor/trilha; as páginas de leitura do
      livro mantêm a identidade calma original. Ver `specs/design-system.md` §1.
- [x] Hero 3D scroll-driven do fluxo canônico do Kafka (Producer → Partitions → Consumer Group), mesmo
      modelo já usado no diagrama 2D `src/components/diagrams/ProducerConsumerFlow.tsx`, agora em
      `src/components/three/` (cena R3F: `KafkaFlowScene.tsx` + meshes/câmera/luz em módulos próprios) e
      `src/components/hero/` (orquestração, code-split via `next/dynamic(..., { ssr: false })` a partir de
      `KafkaHeroCanvas.tsx`). Câmera ligada ao scroll via `motion/react` (`useScroll`/`useSpring`), lida
      dentro do `useFrame` do R3F via `MotionValue.get()`, sem re-render React por frame. Cores lidas de
      `--color-*` (tema reativo via `theme-store.ts`, mesmo hook do `ThemeToggle.tsx`).
- [x] Fallback obrigatório: sem WebGL (`useHasWebGL`, `src/components/three/webgl-support.ts`) ou
      `prefers-reduced-motion: reduce` renderiza o `ProducerConsumerFlow` existente em vez do Canvas, só o
      wrapper decorativo (`aria-hidden`) muda, o fallback continua com seu `role="img"`/`aria-label`
      próprios, sem depender do 3D pra nenhuma informação essencial.
- [x] `Reveal`/`RevealGroup` (`src/components/motion/`) para entrada dos cards de feature/trilha e da seção
      de CTA; `HoverLift` nos cards de trilha e `GithubCtaLink` no CTA do GitHub, microinterações sutis
      (`whileHover`/`whileTap`), todas desativadas sob `useReducedMotion()`.
- [x] Typewriter (`useTypewriter`, `src/lib/hooks/`) no hero, reaproveitando `dict.home.coreConcepts`
      (conteúdo real já existente, usado antes só na página por trilha), nenhuma string nova inventada.
- [x] Skeleton shimmer (`.skeleton-shimmer`, `globals.css`) como `loading` do `next/dynamic` enquanto o chunk
      do Three.js (isolado, ~890 KB, confirmado fora do bundle de `/[locale]/kafka` e de qualquer outra rota)
      carrega.
- [x] Dois bugs reais pegos pelos testes novos antes de ir pra produção: `useTypewriter` reiniciava a cadeia
      de timers a cada tecla quando `words` era um array literal (referência nova a cada render), corrigido
      lendo `words`/`options` via ref sincronizado em efeito próprio; o `aria-hidden` do hero escondia o
      fallback SVG (que tem seu próprio `role="img"` e deveria ficar acessível), corrigido restringindo
      `aria-hidden` só ao wrapper do Canvas 3D.
- [x] Feedback do autor após ver o resultado: o hero 3D do Kafka não fazia sentido no seletor `/[locale]`
      (página multi-trilha: Kafka, Java, Elastic, SQL, AWS, GCP; um modelo 3D específico de uma tecnologia
      favorecia ela sobre as demais). `KafkaHero` movido pra home da trilha Kafka
      (`src/app/[locale]/[tech]/page.tsx`, renderizado só quando `tech === "kafka"`), logo após o
      `ReadingProgressCard`, não bloqueia os CTAs principais (Começar a estudar/Ver perguntas/Simular) atrás
      do scroll de 180vh do hero. `/[locale]` voltou a ser só texto + Motion (`Reveal`/`RevealGroup`/
      `HoverLift`/typewriter), sem Canvas 3D. Também corrigido nessa passada: `whileTap` no `HoverLift` dos
      cards de trilha fazia o Motion injetar `tabindex="0"` num `<div>` já aninhado dentro do `<Link>`
      focável, criando um tab-stop duplicado e não-funcional, pego testando navegação por teclado no
      navegador; removido `whileTap` (feedback de toque agora é só CSS `active:scale` no `<Link>`).
- [x] Seletor de trilha movido de `/[locale]` pra `/[locale]/home` (rota estática irmã de `[tech]`, sem
      colisão: `home` não é um `Tech` válido). `/[locale]` e `/` (raiz) viraram só `redirect()` estático
      pro destino final, sem renderizar nada. Todos os links internos que apontavam pro seletor
      (`Header.tsx`, `ComingSoon.tsx`, `not-found.tsx`, `error.tsx`, `sitemap.ts`) atualizados; `/` redireciona
      direto pra `/[locale]/home` (sem passar por `/[locale]` no meio).
- [x] Feedback do autor após ver o hero do Kafka animando a câmera junto com o scroll da página: incomodava.
      Trocado o mecanismo inteiro: de scroll-driven (`useScroll`/`useSpring` de `motion/react`, câmera
      interpolando por progresso de scroll) pra **autoplay + navegação manual**: `KafkaHero` agora guarda um
      `step` (0-2) em `useState`, avançado automaticamente por `setInterval` (`AUTOPLAY_INTERVAL_MS`,
      `scene-constants.ts`) e manualmente por setas (`‹`/`›`, `<button>` reais com `aria-label`) e
      indicadores (dots clicáveis, `aria-current` no ativo), qualquer interação reinicia o timer do
      autoplay. `ScrollCameraRig.tsx` e `IdleOrbitCamera.tsx` removidos; `StepCameraRig.tsx` os substitui,
      interpolando a câmera (`camera.position.lerp`) até o enquadramento da etapa atual
      (`CAMERA_STEPS[step]`) a cada frame, suave, mas sem depender de scroll, então a distinção
      desktop/mobile de câmera deixou de existir (só contagem de cubos e `dpr` continuam menores no
      mobile). Container do hero deixou de ser `h-[180vh]`/`sticky` (não precisa mais de espaço de scroll
      pra "acontecer"), voltou a ser um bloco normal no fluxo da página. Testes atualizados
      (`test/components/KafkaHero.test.tsx`) pra cobrir setas, loop nas pontas, clique em indicador e
      avanço via `vi.advanceTimersByTime`, sem nunca montar `<Canvas>` real.

## Pós-lançamento: 3D nos diagramas do livro Kafka (concluído)

- [x] Pedido do autor: o hero 3D (Producer → Partitions → Consumer Group) ficava "desconexo" por só existir
      na home da trilha Kafka, sem relação com o conteúdo real do livro, perguntou se dava pra levar 3D pras
      seções do livro onde cada diagrama já existe, representando especificamente o que aquele capítulo
      explica. Opções apresentadas (ligar o hero aos capítulos / piloto em 1-2 capítulos / cobertura completa
      nos capítulos relevantes), o autor escolheu explicitamente a cobertura completa.
- [x] Inventariados os 14 componentes de diagrama 2D em `src/components/diagrams/`: 12 ganharam cena 3D nova,
      `ProducerConsumerFlow`/`...En` (capítulos 01/03/14) passaram a reaproveitar a cena do hero
      (`KafkaFlowScene`) via `KafkaHeroCanvas`/`HeroCaption` já existentes, e `CircuitBreakerDiagram`/
      `Mermaid` ficaram fora de escopo (nenhum capítulo os usa).
- [x] Kit compartilhado novo em `src/components/three/shared/`: `Node3D` (caixa arredondada + label via
      `<Html>` do drei), `Connector3D` (linha sólida/tracejada entre dois pontos), `FlowParticles3D`
      (generalização do `EventCubes` do hero, anima cubos ao longo de um `CatmullRomCurve3` arbitrário),
      `OffsetLog3D` (fileira de offsets numerados com faixa de destaque e marcadores, cobre toda a família
      "log linear": `OffsetCommitDiagram`, `ReplayDiagram`, `ConsumerLagDiagram`) e `StepCameraRig`
      (generalizado do rig do hero, agora recebendo os `CAMERA_STEPS` como prop em vez de ler uma constante
      fixa). `tones.ts` fixa as cores semânticas (erro/warning/sucesso) já usadas nos SVGs originais.
- [x] Decisão de integração: nenhum arquivo `.mdx` de capítulo mudou, e `mdx-components.tsx` não precisou de
      edição: cada `src/components/diagrams/XDiagram.tsx`/`XDiagramEn.tsx` manteve o mesmo nome/export, só o
      miolo mudou pra escolher entre a cena 3D (`src/components/three/diagrams/XScene.tsx`, code-split via
      `next/dynamic(..., { ssr: false })`, um chunk por cena) e o SVG original, preservado verbatim como
      fallback (`XDiagramSvg`/`XDiagramEnSvg`) sob `!useHasWebGL() || useReducedMotion()`, mesmo contrato já
      validado no hero. `ConsumerLagDiagram.tsx` ficou como caso especial: passou a exportar uma base
      compartilhada (`ConsumerLagDiagramImpl`) chamada tanto pela versão PT quanto pela EN (que a importa do
      arquivo irmão), já que só o texto muda entre os dois idiomas.
- [x] Texto das cenas 3D hardcoded por idioma dentro de cada arquivo `X.tsx`/`XEn.tsx`, do mesmo jeito que o
      SVG já fazia, sem entrar no dicionário i18n, mantendo a convenção existente dos diagramas.
- [x] `three`/`@react-three/fiber`/`@react-three/drei` confirmados como um chunk compartilhado entre as cenas
      novas (baixado uma vez, cacheado nos capítulos seguintes) e distinto do chunk do hero, dois chunks no
      total no pior caso, nunca um por diagrama.
- [x] 13 testes novos em `test/components/` (um por componente de diagrama, incluindo `ProducerConsumerFlow`)
      seguindo o template de `KafkaHero.test.tsx`: mock de `useHasWebGL`/`useReducedMotion`, assert que o SVG
      (`role="img"`) renderiza e nenhum `<canvas>` aparece, tanto sem WebGL quanto sob
      `prefers-reduced-motion`.
- [x] `specs/design-system.md` §1 revisado: a regra "sem 3D" nas páginas de leitura passou a ter uma exceção
      explícita e escopada: 3D só pra recriar um diagrama que já existe em 2D, seguindo o contrato de
      fallback obrigatório, nunca como decoração solta em prosa. `CLAUDE.md` atualizado no mesmo espírito
      ("Como criar um diagrama").

## Backlog (trilhas futuras e itens ainda em aberto)

- Conteúdo real para a trilha **Java** (hoje só "em construção").
- Conteúdo real para a trilha **Elastic Search** (hoje só "em construção").
- Conteúdo real para as trilhas **SQL**, **AWS** e **GCP** (hoje só "em construção").
- Testes E2E (Playwright) se o projeto crescer em complexidade de interação.
- Export de PDF do livro em inglês (hoje `scripts/generate-pdf.ts` gera só a versão `/pt/kafka/livro/impressao`).
- Exportar/importar progresso do simulador e leitura em JSON (hoje só `localStorage`, perdido ao trocar de
  navegador/dispositivo).
