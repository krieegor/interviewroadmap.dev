# Architecture Spec — Apache Kafka para Entrevistas Java Sênior

## 1. Stack

- **Next.js 16 (App Router, Turbopack)** + **TypeScript strict** + **React 19**.
- **Tailwind CSS v4** para estilo.
- **MDX** (`next-mdx-remote` ou `@next/mdx` com processamento em build) para conteúdo de capítulos, perguntas,
  glossário e estudos de caso.
- **Geração estática** (`generateStaticParams` + SSG) em todas as rotas de conteúdo. Sem SSR dinâmico, sem
  banco de dados, sem autenticação, sem serviços pagos.
- **Mermaid** via componente client-side (`<Mermaid>`) para diagramas que não valem a pena desenhar em SVG/JSX
  puro; diagramas simples são SVG/React/CSS para evitar custo de bundle e flash de renderização.
- **localStorage** para todo estado do usuário (progresso de leitura, tema, resultado do simulador). Nenhum
  dado do usuário sai do navegador.
- **Vitest** + **Testing Library** para testes unitários/componentes. **tsx**/Node script para validação de
  frontmatter de conteúdo.

## 2. Por que Next.js App Router (decisão arquitetural)

- Roteamento baseado em arquivos mapeia 1:1 com a estrutura editorial (parte → capítulo → seção).
- `generateStaticParams` permite gerar todas as páginas de capítulo/pergunta/glossário em build time — sem
  servidor, publicável em CDN gratuita.
- Metadata API nativa (`generateMetadata`) cobre todo o requisito de SEO (título, descrição, OG, canonical) por
  rota sem lib adicional.
- MDX é suportado nativamente e permite componentes React customizados dentro do texto (`<InterviewTip>`,
  `<FinancialExample>`) sem sair de Markdown.

## 3. Modelo de conteúdo

Conteúdo vive em `src/content/<tech>/**` como arquivos `.mdx` com frontmatter tipado — `tech` é a
plataforma interviewroadmap.dev particionada por trilha (`kafka`, `java`, `elastic`; ver seção 14). O código de app
(`src/app`) apenas roteia e renderiza; nunca contém texto do livro hardcoded.

```
src/content/
└── kafka/
    ├── chapters/
    │   └── pt/01-o-que-e-apache-kafka.mdx
    │   └── en/01-o-que-e-apache-kafka.mdx
    │   └── ...
    ├── questions/
    │   └── pt/001-o-que-e-apache-kafka.mdx
    │   └── ...
    ├── glossary/
    │   └── pt/broker.mdx
    │   └── ...
    └── case-studies/
        └── pt/01-pix-recebido.mdx
# src/content/java/**, src/content/elastic/** ainda não existem — trilhas "em breve", sem arquivos.
```

Cada tipo de conteúdo tem um schema de frontmatter validado por um script (`scripts/validate-content.ts`),
não por biblioteca de runtime — mantém o build simples e sem dependência de schema-validator pesada em
produção (zod é usado apenas no script de validação, tempo de build).

### Frontmatter — capítulo

```yaml
---
title: "O que é Apache Kafka?"
part: "Fundamentos"
partOrder: 1
chapterOrder: 1
slug: "o-que-e-apache-kafka"
description: "Origem, contexto e o problema que o Kafka resolve."
---
```

### Frontmatter — pergunta

```yaml
---
id: 1
title: "O que é Apache Kafka?"
slug: "o-que-e-apache-kafka"
level: ["pleno", "senior", "tech-lead"]
topics: ["fundamentos"]
relatedChapters: ["o-que-e-apache-kafka"]
---
```

Ver [content-guidelines.md](./content-guidelines.md) para a estrutura textual obrigatória dentro de cada MDX.

## 4. Camadas do código-fonte

```
src/
├── app/            # rotas (App Router) — sem lógica de negócio, sem texto
├── components/
│   ├── layout/      # Header, Sidebar, Footer, Shell
│   ├── navigation/  # TableOfContents, ChapterPager, MobileDrawer
│   ├── content/      # blocos MDX (Definicao, Atencao, DicaEntrevista, ...)
│   ├── diagrams/    # Mermaid wrapper + diagramas SVG/React específicos
│   ├── interview/   # QuestionCard, Simulator, LevelPicker
│   └── ui/          # botões, badges, primitivos genéricos
├── content/         # MDX (ver acima)
├── lib/
│   ├── content/     # loaders (getAllChapters, getChapterBySlug, getAllQuestions, ...) — recebem (tech, locale)
│   ├── tech/        # Tech/techs/defaultTech/isTech/techsWithContent (ver seção 14)
│   ├── search/      # índice de busca client-side
│   ├── progress/    # hooks de localStorage (leitura, simulador)
│   └── seo/         # helpers de metadata/OG/JSON-LD
├── types/           # tipos compartilhados (Chapter, Question, GlossaryTerm, CaseStudy) — sem campo tech,
│                     # é dimensão de path/rota, não de dado
└── config/          # site.ts (identidade da plataforma interviewroadmap.dev) + tech.ts (nome/descrição por
                      # trilha) + navegação de topo (não a ordem de capítulos, que é derivada do
                      # frontmatter em src/lib/content)
```

**Regra central:** `src/app` é só roteamento e composição; `src/lib/content` é a única camada que lê o
filesystem (`fs`, `gray-matter`) em build time; `src/components` nunca importa de `fs`.

## 5. Roteamento

Todas as rotas de conteúdo vivem sob `/[locale]/[tech]/...` — locale primeiro (`pt`/`en`, ver seção 13),
tech depois (`kafka`/`java`/`elastic`, ver seção 14). `/` (raiz) é um `redirect()` estático para
`/[locale]/home`; `/[locale]` sozinho também é só um `redirect()` estático (pro mesmo destino) — nenhum dos
dois renderiza conteúdo. O seletor de trilha em si vive em `/[locale]/home`, uma rota estática irmã de
`[tech]` (Next.js resolve o segmento literal `home/` antes de cair no dinâmico `[tech]/`, então não há
colisão — `home` também não é um valor válido de `Tech`).

| Rota                                  | Descrição                                                       |
| -------------------------------------- | ----------------------------------------------------------------- |
| `/`                                    | Redirect estático para `/[locale]/home` (locale padrão)             |
| `/[locale]`                            | Redirect estático para `/[locale]/home`                             |
| `/[locale]/home`                       | Seletor de trilha (Kafka / Java / Elastic / SQL / AWS / GCP)         |
| `/[locale]/[tech]`                     | Home da trilha (conteúdo real se `techsWithContent`, senão "em breve") |
| `/[locale]/[tech]/livro`               | Índice do livro (partes + capítulos)                                |
| `/[locale]/[tech]/livro/[...slug]`     | Capítulo/seção individual, resolvido por slug do frontmatter        |
| `/[locale]/[tech]/perguntas`           | Listagem/filtro das perguntas                                       |
| `/[locale]/[tech]/perguntas/[slug]`    | Página de uma pergunta                                              |
| `/[locale]/[tech]/glossario`           | Lista de termos                                                    |
| `/[locale]/[tech]/glossario/[slug]`    | Página dedicada de um termo, com deep link e prev/next             |
| `/[locale]/[tech]/casos`               | Listagem de estudos de caso                                        |
| `/[locale]/[tech]/casos/[slug]`        | Estudo de caso individual                                          |
| `/[locale]/[tech]/simulador`           | Simulador de entrevista                                            |
| `/[locale]/[tech]/sobre`               | Página sobre o projeto/autor                                       |

`/[locale]/[tech]/livro/[...slug]` usa catch-all para suportar futura hierarquia parte/capítulo/seção sem
migração de rotas. `[locale]/[tech]/layout.tsx` valida a forma de `tech` (`isTech`) e renderiza
Header/Footer (já cientes da trilha atual); `[locale]/layout.tsx`, acima dele, fica mínimo (`<html>`/
`<body>`/script de tema) porque não tem acesso ao segmento `[tech]`, que é filho seu. Rotas de conteúdo
sob `[tech]` (`livro/[...slug]`, `perguntas/[slug]`, etc.) só geram `generateStaticParams` para trilhas em
`techsWithContent` — `/en/java/livro/qualquer-coisa` dá 404 de build, sem custo extra, já que o site é SSG
puro. `sitemap.ts`, `robots.ts`, `manifest.ts`, `not-found.tsx`, `icon.tsx` e `opengraph-image.tsx`
continuam fora de `[locale]` — são rotas globais únicas do App Router, com identidade de plataforma
(interviewroadmap.dev), não de trilha; `sitemap.ts` itera locale × tech.

## 6. Busca local

`scripts/build-search-index.ts` (roda como `prebuild`, antes de `next build`) lê o frontmatter dos `.mdx`
direto via `gray-matter` (não reaproveita `src/lib/content/**` — esses loaders fazem `import()` dinâmico de
`.mdx`, só funciona dentro do pipeline de build do Next) e gera um JSON estático por trilha/idioma em
`public/search-index/<tech>-<locale>.json` — `{ type, title, excerpt, href }` (tipo `SearchEntry` em
`src/types/content.ts`). O `SearchDialog` (client component) busca
esse arquivo via `fetch()` sob demanda — no hover/foco do botão de busca ou na abertura do diálogo — e faz
filtro simples de substring em memória. Deliberadamente **não** vem embutido no HTML da página (evitaria
duplicar as ~90 entradas em cada uma das centenas de páginas do site); sem Algolia, sem backend, sem custo.

## 7. Progresso de leitura

Hook `useReadingProgress` grava em `localStorage` sob uma chave versionada (`kafka-ebook:progress:v1`):

```ts
type ReadingProgress = {
  visited: string[]; // slugs de capítulo
  completed: string[]; // slugs marcados como concluído
  lastVisited?: string;
};
```

Sem sincronização entre dispositivos (fora de escopo — exigiria backend/login, contra os princípios do projeto).

## 8. Tema claro/escuro

Estratégia Tailwind `class` + script inline no `<head>` (evita flash) que lê `localStorage` e aplica a classe
`dark` antes do primeiro paint. Preferência padrão: `system` → `prefers-color-scheme`.

## 9. Diagramas

- Diagramas de fluxo simples (Producer→Topic→Partition→Consumer, Leader/Follower) — componentes React/SVG em
  `src/components/diagrams`, estilizados com Tailwind, para controle visual total e zero dependência externa.
- Diagramas mais elaborados (rebalance, outbox pattern) podem usar Mermaid via wrapper client-side
  (`<Mermaid chart="..." />`) carregado com `dynamic(() => import('mermaid'), { ssr: false })` para não
  penalizar o bundle de páginas que não usam.

## 10. SEO

- `generateMetadata` por rota de conteúdo, derivando `title`/`description` do frontmatter.
- `app/sitemap.ts` e `app/robots.ts` nativos do Next, construídos a partir dos loaders de conteúdo.
- JSON-LD `Article`/`FAQPage` (para perguntas) injetado via `<script type="application/ld+json">`.
- `NEXT_PUBLIC_SITE_URL` como única env var, usada para canonical/OG — configurável por ambiente de deploy.

## 11. Deploy

`next.config.ts` usa `output: "export"` — `npm run build` gera HTML/CSS/JS puro em `out/`, sem servidor Node
em runtime, sem adapter. Compatível com qualquer host estático:

- **Vercel** (zero config, detecta o export automaticamente).
- **Cloudflare Workers** (assets estáticos, `wrangler.jsonc` com `assets.directory` apontando pra `out/`,
  sem `main`/Worker script) ou **Cloudflare Pages** clássico — ambos servem `out/` diretamente.
- **Netlify** (publish directory `out/`, sem plugin — `@netlify/plugin-nextjs` só é necessário pra
  SSR/ISR, que este projeto não usa).
- **GitHub Pages** (também viável desde o export estático; ver
  [`docs/deployment.md`](../docs/deployment.md)).

Detalhes de cada plataforma, incluindo por que a tentativa inicial de deploy no Cloudflare via
`@opennextjs/cloudflare`/Workers com cache R2 foi revertida, em [`docs/deployment.md`](../docs/deployment.md)
e [`specs/roadmap.md`](./roadmap.md). Nenhuma opção exige cartão de crédito ou variável secreta.

## 12. Testes

- **Vitest** para funções puras (`lib/content`, `lib/progress`).
- **Testing Library** para componentes com lógica (busca, simulador, toggle de tema).
- **Script de validação de conteúdo** (`scripts/validate-content.ts`) roda no CI e localmente
  (`npm run validate-content`), garante frontmatter obrigatório e links internos válidos.
- Sem testes E2E na fundação (custo desproporcional ao estágio do projeto); pode entrar no roadmap.

## 13. i18n (PT/EN)

- **Sem lib de terceiros** (nada de `next-intl`/`next-i18next`) — dois locales fixos (`pt`, `en`) não
  justificam negociação de locale em runtime num site 100% estático. `src/lib/i18n/config.ts` define
  `Locale = "pt" | "en"`, `locales`, `defaultLocale` e o type guard `isLocale`.
- **Rotas simétricas com prefixo**: `/pt/...` e `/en/...` para tudo, via segmento `src/app/[locale]/**`
  (seção 5). `src/app/layout.tsx` (raiz) é minimal — só repassa `children`, sem `<html>`/`<body>` — quem
  fornece isso é `src/app/[locale]/layout.tsx`, que também resolve `<html lang>`, tema e metadata por
  locale. `/` faz `redirect("/pt")`.
- **Dicionários de UI tipados, sem I/O**: `src/lib/i18n/dictionaries/{pt,en}.ts` são objetos TS simples
  (strings e arrays, nada de função — ver próximo bullet). `Dictionary = typeof pt`; o arquivo `en.ts` é
  tipado como `Dictionary`, então o próprio TypeScript garante paridade de chaves entre os dois idiomas sem
  lib de validação. `getDictionary(locale)` em `src/lib/i18n/get-dictionary.ts` é um lookup síncrono.
- **Nunca funções dentro do dicionário.** Strings parametrizadas usam placeholders (`"Pergunta {id}"`) e
  `formatTemplate(template, values)` (`src/lib/i18n/format.ts`) faz a interpolação. Motivo: o dicionário
  inteiro é passado como prop de Server Component para vários Client Components (`SearchDialog`,
  `Simulator`, etc.), e Next não serializa funções através dessa fronteira — um valor função em qualquer
  chave do objeto quebra o build inteiro na primeira página que renderizar aquele client component.
- **Conteúdo por locale em diretórios irmãos**: `src/content/<tech>/<tipo>/{pt,en}/*.mdx`, mesmo nome de
  arquivo nos dois idiomas quando o conteúdo existe nos dois. Todo loader de `src/lib/content/**` recebe
  `tech` e `locale` como parâmetros (`getAllChapters(tech, locale)`, `getChapterBySlug(tech, slug, locale)`,
  etc.) e cacheia por `` `${tech}:${locale}` ``. **Sem fallback silencioso PT→EN** — se um conteúdo não
  existe no locale pedido, o loader retorna vazio/`null` para aquele locale; páginas de listagem em EN
  mostram só o que existe — hoje isso só afeta a versão em inglês do PDF (backlog), já que o resto do
  conteúdo está completo nos dois idiomas.
- **Links internos dentro do corpo MDX são locale- e tech-prefixados explicitamente**
  (`/pt/kafka/livro/slug` nos arquivos `pt/`, `/en/kafka/livro/slug` nos arquivos `en/`).
  `scripts/validate-content.ts` valida esses links por tech e locale. Se algum conteúdo futuro em inglês
  referenciar um capítulo ainda não traduzido, o padrão é linkar para a versão em português
  (`/pt/kafka/livro/...`) com uma nota explícita, não inventar tradução nem omitir a referência.
- **Conteúdo 100% traduzido para EN**: os 15 capítulos, as 50 perguntas, o glossário completo (24 termos) e
  os 5 estudos de caso existem nos dois idiomas — incluindo uma variante `*En.tsx` de cada diagrama
  SVG/React usado em algum capítulo (padrão em `ProducerConsumerFlowEn.tsx`).
- `LocaleSwitcher` (`src/components/layout/LocaleSwitcher.tsx`) troca o prefixo de locale preservando o
  caminho quando a página de destino existe (`src/lib/i18n/en-availability.ts` lista os slugs disponíveis
  em `en/`); cai para o índice da seção em vez de gerar um link para uma página inexistente — hoje isso só
  entra em ação se algum conteúdo novo for adicionado a um único locale no futuro. Recebe `tech` como prop
  explícita (não tenta re-parsear a URL) — só é renderizado dentro de `[locale]/[tech]/layout.tsx`, onde
  `tech` sempre existe.

## 14. Trilhas de tecnologia (tech)

- **`Tech = "kafka" | "java" | "elastic"`**, definido em `src/lib/tech/config.ts` — mesmo formato de
  `src/lib/i18n/config.ts` (`techs`, `defaultTech`, `isTech`). Diferente de locale, tech tem uma lista à
  parte, `techsWithContent` (hoje só `["kafka"]`), porque nem toda trilha tem conteúdo real — é o único
  lugar que precisa mudar quando Java/Elastic ganharem conteúdo.
- **`/[locale]/[tech]/layout.tsx`** valida a forma de `tech` (`isTech`, não `techsWithContent`) e renderiza
  Header/Footer, já que são os únicos pontos da árvore de rotas com acesso ao segmento `[tech]`.
  `/[locale]/[tech]/page.tsx` decide, dentro da própria página, entre a home real (kafka) e
  `<ComingSoon>` (`src/components/content/ComingSoon.tsx`) para trilhas sem conteúdo.
- **Rotas de conteúdo** (`livro`, `perguntas`, `glossario`, `casos`) checam `techsWithContent` no próprio
  `generateStaticParams` e no corpo da página (`notFound()` se a trilha não tem conteúdo) — sem layout
  aninhado extra só para isso, para não fragmentar o guard em mais um lugar.
- **`src/config/site.ts` (plataforma) vs. `src/config/tech.ts` (trilha)**: `getSiteConfig(locale)` cobre o
  que é comum a toda a plataforma (autor, contribuidores, URL, GitHub) e é usado por Header/Footer/rotas
  globais — essas não têm `tech` disponível estruturalmente (Header renderiza de dentro de
  `[tech]/layout.tsx`, mas rotas fora de `[locale]` como `manifest.ts` não têm `tech` nunca).
  `getTechConfig(tech, locale)` cobre nome/descrição por trilha (ex.: "Apache Kafka para Entrevistas Java
  Sênior" vs. "interviewroadmap.dev"), usado em `generateMetadata` e no corpo de páginas dentro de `[tech]`.
- **`scripts/generate-pdf.ts` continua kafka-only** — o script nunca teve loop de locale ou tech (gera um
  PDF só, a partir de uma rota fixa), então só a constante `PRINT_ROUTE` precisou ganhar o segmento
  (`/pt/kafka/livro/impressao`); não vale a pena generalizar antes de Java/Elastic terem conteúdo e alguém
  pedir PDF pra eles.
