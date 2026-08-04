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

Conteúdo vive em `src/content/**` como arquivos `.mdx` com frontmatter tipado. O código de app (`src/app`)
apenas roteia e renderiza; nunca contém texto do livro hardcoded.

```
src/content/
├── chapters/
│   └── 01-o-que-e-apache-kafka.mdx
│   └── 02-kafka-versus-outras-ferramentas.mdx
│   └── ...
├── questions/
│   └── 001-o-que-e-apache-kafka.mdx
│   └── ...
├── glossary/
│   └── broker.mdx
│   └── ...
└── case-studies/
    └── 01-pix-recebido.mdx
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
│   ├── content/     # loaders (getAllChapters, getChapterBySlug, getAllQuestions, ...)
│   ├── search/      # índice de busca client-side
│   ├── progress/    # hooks de localStorage (leitura, simulador)
│   └── seo/         # helpers de metadata/OG/JSON-LD
├── types/           # tipos compartilhados (Chapter, Question, GlossaryTerm, CaseStudy)
└── config/          # site config (nome, url, autor) e navegação de topo (não a ordem de capítulos,
                      # que é derivada do frontmatter em src/lib/content)
```

**Regra central:** `src/app` é só roteamento e composição; `src/lib/content` é a única camada que lê o
filesystem (`fs`, `gray-matter`) em build time; `src/components` nunca importa de `fs`.

## 5. Roteamento

Todas as rotas de conteúdo vivem sob o segmento dinâmico `/[locale]` (`pt` ou `en` — ver seção 13). `/`
(raiz, sem locale) é só um `redirect()` estático para `/pt`.

| Rota                          | Descrição                                                    |
| ------------------------------ | ------------------------------------------------------------ |
| `/`                            | Redirect estático para `/pt`                                 |
| `/[locale]`                    | Home                                                          |
| `/[locale]/livro`              | Índice do livro (partes + capítulos)                          |
| `/[locale]/livro/[...slug]`    | Capítulo/seção individual, resolvido por slug do frontmatter |
| `/[locale]/perguntas`          | Listagem/filtro das 50 perguntas                              |
| `/[locale]/perguntas/[slug]`   | Página de uma pergunta                                        |
| `/[locale]/glossario`          | Lista de termos                                                |
| `/[locale]/glossario/[slug]`   | Página dedicada de um termo, com deep link e prev/next        |
| `/[locale]/casos`              | Listagem de estudos de caso                                    |
| `/[locale]/casos/[slug]`       | Estudo de caso individual                                      |
| `/[locale]/simulador`          | Simulador de entrevista                                        |
| `/[locale]/sobre`              | Página sobre o projeto/autor                                   |

`/[locale]/livro/[...slug]` usa catch-all para suportar futura hierarquia parte/capítulo/seção sem migração
de rotas. `sitemap.ts`, `robots.ts`, `manifest.ts`, `not-found.tsx`, `icon.tsx` e `opengraph-image.tsx`
continuam fora de `[locale]` — são rotas globais únicas do App Router; `sitemap.ts` itera os dois locales
manualmente.

## 6. Busca local

Build-time gera um índice JSON estático (`public/search-index.json` ou embutido via `generateStaticParams`)
contendo `{ type, title, slug, excerpt }` de capítulos, perguntas e termos do glossário. No client, um
componente carrega esse índice sob demanda (lazy) e faz filtro simples de substring/score — sem Algolia,
sem backend, sem custo.

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

Estático/SSG, sem servidor Node obrigatório em runtime. Compatível com:

- **Vercel** (padrão, zero config).
- **Cloudflare Pages** (via `@cloudflare/next-on-pages` ou export estático, documentado em
  `docs/deployment.md`).
- **Netlify** (adapter oficial `@netlify/plugin-nextjs`).

Nenhuma dessas opções exige cartão de crédito ou variável secreta.

## 12. Testes

- **Vitest** para funções puras (`lib/content`, `lib/progress`, `lib/search`).
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
- **Conteúdo por locale em diretórios irmãos**: `src/content/<tipo>/{pt,en}/*.mdx`, mesmo nome de arquivo
  nos dois idiomas quando o conteúdo existe nos dois. Todo loader de `src/lib/content/**` recebe `locale`
  como parâmetro (`getAllChapters(locale)`, `getChapterBySlug(slug, locale)`, etc.) e cacheia por locale
  (`Map<Locale, Promise<...>>`). **Sem fallback silencioso PT→EN** — se um conteúdo não existe no locale
  pedido, o loader retorna vazio/`null` para aquele locale; páginas de listagem em EN mostram só o que
  existe — hoje isso só afeta a versão em inglês do PDF (backlog), já que o resto do conteúdo está completo
  nos dois idiomas.
- **Links internos dentro do corpo MDX são locale-prefixados explicitamente** (`/pt/livro/slug` nos
  arquivos `pt/`, `/en/livro/slug` nos arquivos `en/`). `scripts/validate-content.ts` valida esses links por
  locale. Se algum conteúdo futuro em inglês referenciar um capítulo ainda não traduzido, o padrão é linkar
  para a versão em português (`/pt/livro/...`) com uma nota explícita, não inventar tradução nem omitir a
  referência.
- **Conteúdo 100% traduzido para EN**: os 15 capítulos, as 50 perguntas, o glossário completo (24 termos) e
  os 5 estudos de caso existem nos dois idiomas — incluindo uma variante `*En.tsx` de cada diagrama
  SVG/React usado em algum capítulo (padrão em `ProducerConsumerFlowEn.tsx`).
- `LocaleSwitcher` (`src/components/layout/LocaleSwitcher.tsx`) troca o prefixo de locale preservando o
  caminho quando a página de destino existe (`src/lib/i18n/en-availability.ts` lista os slugs disponíveis
  em `en/`); cai para o índice da seção em vez de gerar um link para uma página inexistente — hoje isso só
  entra em ação se algum conteúdo novo for adicionado a um único locale no futuro.
