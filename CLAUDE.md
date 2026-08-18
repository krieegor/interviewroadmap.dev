# CLAUDE.md

Guia para execuções futuras do Claude Code neste repositório.

## Objetivo do projeto

**interviewroadmap.dev**: plataforma interativa, gratuita e open source de preparação para entrevistas técnicas,
organizada por trilhas de tecnologia (`Tech`: `kafka` | `java` | `elastic` | `sql` | `aws` | `gcp`). A
trilha **Kafka** está completa (e-book, 50 perguntas, glossário, estudos de caso, simulador); as demais
estão "em construção" (página própria, sem conteúdo ainda). Não é landing page, não é documentação de
referência, não é curso pago. Especificação completa em [`specs/`](./specs).

Leia [`specs/product.md`](./specs/product.md), [`specs/architecture.md`](./specs/architecture.md),
[`specs/content-guidelines.md`](./specs/content-guidelines.md) e
[`specs/design-system.md`](./specs/design-system.md) antes de qualquer mudança estrutural. Eles são a fonte
da verdade. Este arquivo resume o essencial para o dia a dia.

## Stack

Next.js (App Router) + TypeScript strict + Tailwind CSS + MDX. 100% estático (SSG), sem backend, sem banco
de dados, sem autenticação, sem serviços pagos. Estado do usuário (tema, progresso, simulador) vive só em
`localStorage`.

## Regras de ouro

- Do not use em dashes (—) or en dashes (–) as punctuation in generated prose. Rewrite the sentence using
  commas, colons, semicolons, parentheses, periods, or a more natural sentence structure instead. Never
  perform blind character replacement; preserve grammar, meaning, and readability. (Vale para texto em
  qualquer idioma no projeto: conteúdo do livro, UI, documentação, comentários, qualquer prosa em
  linguagem natural. Não vale para hífen normal `-` em palavras compostas, nem para `-`/`--` com função
  técnica em código, comandos, URLs ou regex.)
- `src/app/**` é só roteamento e composição de componentes. **Nunca** escreva texto do livro ali. Rotas de
  conteúdo vivem sob `/[locale]/[tech]/**` (ex.: `/pt/kafka/livro/...`); `/[locale]/home` é o seletor de
  trilha; `/[locale]` sozinho é só um redirect estático pra `/[locale]/home` (não renderiza nada, ver
  `src/app/[locale]/page.tsx`).
- Todo conteúdo (capítulo, pergunta, termo, estudo de caso) é um arquivo `.mdx` em
  `src/content/<tech>/<tipo>/<locale>/*.mdx` com frontmatter tipado. Ver seção "Como criar conteúdo" abaixo.
- `src/lib/content/**` é a única camada que lê o filesystem. Componentes não importam `fs`/`gray-matter`.
  Toda função de loader recebe `tech` como primeiro parâmetro (`getAllChapters(tech, locale)` etc.);
  `src/lib/tech/config.ts` define `Tech`/`techs`/`techsWithContent`.
- Não adicione dependência de backend, banco de dados, autenticação ou serviço pago. Se uma funcionalidade
  parece exigir isso, redesenhe para rodar client-side/estático antes de aceitar a dependência.
- Não copie conteúdo de livros, cursos ou da documentação oficial. Todo texto é original. Não invente
  experiências profissionais atribuídas ao autor.
- Não trate Kafka como "só uma fila" em nenhum texto.
- Siga [`specs/content-guidelines.md`](./specs/content-guidelines.md) à risca: os 10 pontos por conceito, a
  estrutura fixa de pergunta de entrevista, os blocos MDX disponíveis.
- `/[locale]/home` (seletor de trilha) e `/[locale]/[tech]` (home de cada trilha) têm identidade visual
  própria, mais expressiva (motion, scroll reveal, microinterações); ver `specs/design-system.md` §1.
  Elemento 3D decorativo/de vitrine é **específico de uma trilha** (ex.: o hero do Kafka em
  `src/components/hero/KafkaHero.tsx`, condicionado a `tech === "kafka"` em
  `src/app/[locale]/[tech]/page.tsx`); nunca entra no seletor genérico `/[locale]/home`, que lista várias
  tecnologias e não deve favorecer o modelo visual de uma só. Qualquer componente 3D/motion pesado
  **precisa** ter fallback real sob "sem WebGL"/`prefers-reduced-motion` (não é opcional) e ser carregado via
  `next/dynamic(..., { ssr: false })`. As páginas de leitura do livro mantêm a identidade calma (sem
  scroll-drive, sem hero, sem 3D decorativo solto em prosa); a única exceção aceita é recriar em 3D um
  diagrama que já existe em 2D no livro, seguindo o contrato de fallback e o kit compartilhado descritos em
  `specs/design-system.md` §1. Não estenda 3D pra lá além desse caso sem justificar antes.

## Como criar um novo capítulo

1. Arquivo em `src/content/<tech>/chapters/<locale>/NN-slug.mdx` (NN = ordem de exibição; `<tech>` hoje é
   praticamente sempre `kafka`, o único com conteúdo real).
2. Frontmatter: `title`, `part`, `partOrder`, `chapterOrder`, `slug`, `description`.
3. Estrutura de texto: abertura contextual → desenvolvimento cobrindo os 10 pontos de
   [`specs/content-guidelines.md`](./specs/content-guidelines.md) seção 2 → pelo menos um `<Diagrama>` →
   pelo menos um `<ExemploFinanceiro>` → `<Resumo>`.
4. Não é preciso editar nenhum arquivo de configuração de navegação: `src/lib/content/chapters.ts` deriva o
   índice do livro (partes → capítulos, em ordem) diretamente do frontmatter (`partOrder`/`chapterOrder`) de
   todos os arquivos em `src/content/<tech>/chapters`.
5. Rode `npm run validate-content` antes de commitar.

## Como criar uma nova pergunta de entrevista

1. Arquivo em `src/content/<tech>/questions/<locale>/NNN-slug.mdx` (NNN = número da pergunta, 1-50).
2. Frontmatter: `id`, `title`, `slug`, `level` (`pleno`/`senior`/`tech-lead`), `topics`, `relatedChapters`.
3. Seções obrigatórias, nesta ordem (ver [`specs/content-guidelines.md`](./specs/content-guidelines.md)
   seção 5): Pergunta → O que o entrevistador quer avaliar → `<RespostaCurta>` → `<RespostaSenior>` →
   Explicação aprofundada → `<ExemploFinanceiro>` → `<Pegadinha>` (uma ou mais) → `<PerguntaDerivada>`
   (2-4).
4. Nunca pule a explicação aprofundada: o objetivo é estudo real, não flashcard raso.

## Como adicionar uma trilha (`tech`) nova

Ver [`docs/adding-a-tech.md`](./docs/adding-a-tech.md) para o passo a passo completo (declarar o `Tech`,
nome/descrição, ícone, cor de destaque `data-tech`, disclaimer de marca). Resumo: quase toda trilha nova
entra só como "em construção"; conteúdo real é trabalho separado e maior, coberto por "Como criar um novo
capítulo"/"pergunta" acima e por [`docs/content-authoring.md`](./docs/content-authoring.md).

## Como criar um diagrama

- Fluxo simples e reutilizável (Producer→Topic→Partition→Consumer, Leader/Follower, etc.) → componente
  React/SVG em `src/components/diagrams/`, estilizado com os tokens de cor de
  [`specs/design-system.md`](./specs/design-system.md).
- Fluxo mais elaborado/único (rebalance, outbox pattern) → `<Mermaid chart="...">` (import dinâmico,
  `ssr: false`), tema customizado para herdar a paleta do projeto.
- Nunca use imagens externas ou hotlink de diagrama de terceiros.
- Todo diagrama SVG do livro Kafka hoje também tem uma versão 3D equivalente (ver
  `specs/design-system.md` §1); o componente exportado em `src/components/diagrams/XDiagram.tsx`/
  `XDiagramEn.tsx` decide entre a cena 3D (`src/components/three/diagrams/XScene.tsx`, carregada via
  `next/dynamic(..., { ssr: false })`) e o SVG original (preservado verbatim como fallback) usando
  `useHasWebGL()` + `useReducedMotion()`. Um diagrama **novo** não precisa de versão 3D: só recrie em 3D um
  diagrama já existente se o autor pedir explicitamente; nesse caso reuse os primitives de
  `src/components/three/shared/` (`Node3D`, `Connector3D`, `FlowParticles3D`, `OffsetLog3D`,
  `StepCameraRig`) em vez de escrever geometria do zero.

## Componentes de conteúdo disponíveis (`src/components/content`)

`Definicao`, `Atencao`, `DicaEntrevista`, `Pegadinha`, `ExemploFinanceiro`, `RespostaCurta`, `RespostaSenior`,
`ErroComum`, `Resumo`, `Comparacao`, `Diagrama`, `PerguntaDerivada`. Não crie um bloco novo sem antes checar
se um destes já cobre o caso.

## Testes e validação

```bash
npm run dev              # desenvolvimento
npm run build             # build de produção (estático)
npm run lint               # ESLint
npm run test                # Vitest
npm run format              # Prettier
npm run validate-content     # valida frontmatter + links internos de todo src/content
```

Rode lint + test + validate-content + build antes de considerar qualquer tarefa de conteúdo ou app concluída.
Nunca declare algo concluído sem ter rodado os comandos correspondentes.

**Nunca rode `npm run format` sobre `src/content/**/*.mdx`** (o `.prettierignore` já exclui esse caminho).
O plugin MDX do Prettier reflui texto JSX para o `printWidth`, o que corrompe tabelas GFM (`| a | b |`)
dentro de componentes como `<Comparacao>`: colapsa cada linha da tabela em um único parágrafo. Se precisar
formatar um `.mdx` manualmente, verifique visualmente qualquer tabela depois.

## Restrições

- Sem serviços pagos, sem chaves de API, sem variável de ambiente secreta.
- Sem dependências pesadas sem justificativa (avalie custo de bundle antes de adicionar lib nova).
- Sem abstrações prematuras: três linhas parecidas são melhores que uma abstração precoce.
- Sem componentes gigantes: quebre por responsabilidade (layout / navegação / conteúdo / diagrama / ui).
- Preserve a arquitetura existente ao estender o projeto; justifique qualquer desvio das specs em
  [`specs/roadmap.md`](./specs/roadmap.md) (seção correspondente) antes de implementar.

## Decisões arquiteturais já tomadas (não reabrir sem motivo forte)

- App Router + SSG em vez de Pages Router: Metadata API nativa e `generateStaticParams` cobrem SEO e build
  estático sem lib extra.
- MDX com componentes customizados em vez de Markdown puro: permite os blocos de conteúdo (`InterviewTip`
  etc.) sem sair da sintaxe de texto.
- localStorage em vez de backend para progresso/simulador: mantém o projeto 100% gratuito e sem login.
- Diagramas próprios (SVG/React) + Mermaid pontual em vez de biblioteca de diagramas completa: controle
  visual e bundle enxuto.
- `output: "export"` em `next.config.ts` (HTML/CSS/JS puro em `out/`) em vez de servidor Next.js: deploy
  funciona em qualquer host estático (Cloudflare Workers/Pages, Vercel, Netlify, GitHub Pages) sem adapter,
  sem cache incremental, sem serviço pago extra. Ver [`specs/roadmap.md`](./specs/roadmap.md) (seção "export
  estático puro") pelo porquê: uma tentativa anterior de rodar como servidor num adapter de edge (Cloudflare
  Workers via `@opennextjs/cloudflare`) esbarrou em limite de tamanho e exigiu R2, e foi revertida.
- Motion (`motion`) + Three.js via `@react-three/fiber`/`@react-three/drei` adotados para um hero 3D na
  home da trilha Kafka (`/[locale]/kafka`): decisão explícita do autor pra elevar a qualidade visual da
  vitrine do produto, substituindo a regra anterior de "sem animação" só nas páginas de seletor/trilha (o
  resto do site mantém a identidade calma original). O 3D ficou de fora do seletor `/[locale]/home`
  (multi-trilha) por não fazer sentido mostrar o modelo de uma tecnologia específica ali; motion/reveal/
  microinterações continuam em ambas as páginas, só o Canvas 3D é exclusivo da home do Kafka. **Não é
  scroll-driven**: é autoplay (`setInterval`) + navegação manual (setas/indicadores, `<button>` reais),
  autocontido, porque a primeira versão (câmera ligada ao scroll) incomodava: rolar a página não pode mudar
  o que o 3D mostra. Escolhido R3F em vez de canvas/WebGL na mão ou CSS-only porque o grafo de cena
  declarativo combina com o padrão de um-componente-por-responsabilidade do projeto. Ver
  [`specs/roadmap.md`](./specs/roadmap.md) ("hero 3D interativo") e `specs/design-system.md` §1 pelo
  contrato de fallback obrigatório.
