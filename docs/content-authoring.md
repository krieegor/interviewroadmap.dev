# Guia de autoria de conteúdo

Este guia é para quem vai escrever ou editar capítulos, perguntas, termos de glossário ou estudos de caso
**dentro de uma trilha que já existe**. Para as regras editoriais completas (tom, os 10 pontos obrigatórios
por conceito, blocos disponíveis), veja `specs/content-guidelines.md`. Este documento é o passo a passo
prático. Para dar de alta uma trilha (`tech`) nova, veja `docs/adding-a-tech.md` primeiro.

## Estrutura de arquivos

trainerdev.app tem uma dimensão de **trilha** (`tech`) além de idioma — hoje só `kafka` tem conteúdo real
(`java` e `elastic` são trilhas "em breve", sem arquivos ainda). Todo conteúdo é um arquivo `.mdx` com
frontmatter YAML, em `src/content/<tech>/<tipo>/<locale>/`. Ao contribuir para a trilha Kafka, `<tech>` é
sempre `kafka`. Hoje o conteúdo do Kafka está completo nos dois idiomas; ao adicionar conteúdo novo, escreva
primeiro em `pt/` e traduza para `en/` seguindo "Traduzindo conteúdo para inglês" abaixo.

```
src/content/
└── kafka/
    ├── chapters/
    │   ├── pt/
    │   └── en/
    ├── questions/
    │   ├── pt/
    │   └── en/
    ├── glossary/
    │   ├── pt/
    │   └── en/
    └── case-studies/
        ├── pt/
        └── en/
```

Um arquivo de conteúdo pertence a exatamente um locale — `mesmo nome de arquivo` nos dois idiomas quando o
conteúdo existe nos dois, o que facilita comparar/traduzir. O `slug` no frontmatter é a mesma identidade
conceitual nos dois locales (não traduza o slug).

## Criando um capítulo

1. Crie `src/content/kafka/chapters/pt/NN-slug.mdx`, onde `NN` é a ordem de exibição (ex.:
   `04-partitions-e-ordenacao.mdx`).
2. Frontmatter obrigatório:

   ```yaml
   ---
   title: "Título do capítulo"
   part: "Parte II — Arquitetura"
   partOrder: 2
   chapterOrder: 4
   slug: "partitions-e-ordenacao"
   description: "Descrição de uma frase, usada em listagens e metadata."
   ---
   ```

3. Escreva o corpo cobrindo os 10 pontos de `content-guidelines.md` (o que é, por que existe, quando usar,
   limitações, como aparece em entrevista, relação com Java/Spring, exemplo real).
4. Use pelo menos um `<Diagrama>` e um `<ExemploFinanceiro>`, e feche com `<Resumo>`.
5. Não precisa registrar o capítulo em nenhum arquivo de configuração — a ordem no sumário é derivada
   automaticamente do frontmatter (`partOrder`/`chapterOrder`) por `src/lib/content/chapters.ts`.
6. Rode `npm run validate-content`.

## Criando uma pergunta de entrevista

1. Crie `src/content/kafka/questions/pt/NNN-slug.mdx`, onde `NNN` é o número da pergunta (001 a 050).
2. Frontmatter obrigatório:

   ```yaml
   ---
   id: 11
   title: "Título da pergunta, como um entrevistador perguntaria"
   slug: "slug-da-pergunta"
   level: ["pleno", "senior"]
   topics: ["arquitetura"]
   relatedChapters: ["slug-do-capitulo-relacionado"]
   shortAnswer: "Versão em texto puro da resposta rápida, usada em SEO e JSON-LD."
   quiz:
     options:
       - "Alternativa correta, mesma extensão/registro das erradas."
       - "Distrator 1 — idealmente adaptado de uma <Pegadinha> desta mesma pergunta."
       - "Distrator 2 — confusão com conceito adjacente."
       - "Distrator 3 — generalização ou escopo errado."
     correctIndex: 0
   ---
   ```

   `quiz` é obrigatório — alimenta o modo "múltipla escolha" do simulador. Sempre escreva a alternativa
   correta na posição 0 (`correctIndex: 0`); o simulador embaralha as opções em runtime, então a ordem no
   arquivo não importa para o usuário, só para você não se perder. `npm run validate-content` rejeita
   frontmatter sem `quiz`, com menos de 4 opções, ou com opções duplicadas.
3. Estrutura obrigatória do corpo, nesta ordem: `## Pergunta`, `## O que o entrevistador quer avaliar`,
   `<RespostaCurta>`, `<RespostaSenior>`, `## Explicação aprofundada`, `<ExemploFinanceiro>`,
   `<Pegadinha>`, `<PerguntaDerivada>`.
4. `relatedChapters` deve apontar apenas para slugs de capítulos que já existem — o script de validação
   falha se o link for para um capítulo inexistente.

## Criando um termo de glossário

1. Crie `src/content/kafka/glossary/pt/slug.mdx`.
2. Frontmatter:

   ```yaml
   ---
   term: "Nome do termo"
   slug: "slug-do-termo"
   shortDefinition: "Definição de uma frase."
   relatedTerms: ["outro-termo"]
   relatedChapters: ["capitulo-relacionado"]
   ---
   ```

3. O corpo do arquivo é a definição detalhada (um a dois parágrafos) — não repita o capítulo, aponte para
   ele.

## Criando um estudo de caso

1. Crie `src/content/kafka/case-studies/pt/NN-slug.mdx`.
2. Frontmatter:

   ```yaml
   ---
   title: "Título do estudo de caso"
   slug: "slug-do-caso"
   order: 2
   description: "Descrição de uma frase."
   relatedChapters: ["capitulo-relacionado"]
   ---
   ```

3. Cubra, nesta ordem: o evento de domínio, a topologia de tópicos (tabela `<Comparacao>`), a escolha de
   key, os consumidores independentes envolvidos, idempotência, retry/DLQ, replay e observabilidade.

## Traduzindo conteúdo para inglês

O conteúdo já está 100% traduzido para inglês. Ao adicionar um capítulo, pergunta, termo ou estudo de caso
novo, escreva a versão em português primeiro e traduza para `en/` seguindo os passos abaixo — mantendo os
dois idiomas sincronizados é o que evita o site regredir para tradução parcial.

1. Copie o arquivo de `pt/` para a pasta `en/` correspondente, **mesmo nome de arquivo**.
2. Traduza `title`/`description`/`shortDefinition`/`shortAnswer` no frontmatter. **Mantenha `slug` idêntico
   ao da versão em português** — é a mesma identidade de conteúdo nos dois locales, e é o que permite ao
   `LocaleSwitcher` linkar para a página certa ao trocar de idioma.
3. Traduza o corpo, preservando a estrutura de blocos MDX (`<Definicao>`, `<ExemploFinanceiro>`, etc.) — só o
   texto muda, não os componentes nem a ordem das seções. Traduza também os títulos `##` (`## Pergunta` →
   `## Question`, `## O que o entrevistador quer avaliar` → `## What the interviewer wants to assess`,
   `## Explicação aprofundada` → `## In-depth explanation`).
4. `<ExemploFinanceiro>` mantém o contexto financeiro brasileiro (PIX, boleto, valores em BRL) mesmo na
   versão em inglês — é conteúdo real do domínio do livro, não precisa ser adaptado para outro mercado, só
   traduzido.
5. **`relatedChapters` só pode apontar para capítulos que já existem em `en/`.** Se o capítulo relacionado
   ainda não foi traduzido, remova o slug de `relatedChapters` (deixe `[]` se nenhum existir) — não invente
   uma referência que o validador não consegue checar.
6. **Links internos no corpo do texto são locale- e trilha-prefixados**: `/pt/kafka/livro/slug` em arquivos
   `pt/`, `/en/kafka/livro/slug` em arquivos `en/`. Se o texto em inglês precisa citar um capítulo que ainda
   não foi traduzido, linke explicitamente para a versão em `/pt/kafka/...` e deixe claro no texto que a
   referência está em português.
7. Se o capítulo usa um `<Diagrama>` com texto embutido (a maioria dos diagramas SVG/React em
   `src/components/diagrams/`), o texto do diagrama também está em português — para uma versão em inglês
   ficar consistente, crie uma variante do componente (ex.: `NomeDoDiagramaEn.tsx`, mesmo SVG, só o texto
   traduzido) e registre-a em `src/mdx-components.tsx`. Veja `ProducerConsumerFlowEn.tsx`,
   `KeyPartitioningDiagramEn.tsx` e `IdempotencyDiagramEn.tsx` como exemplos do padrão.
8. Rode `npm run validate-content` — ele valida `pt/` e `en/` separadamente.

## Blocos MDX disponíveis

Todos os blocos abaixo já estão disponíveis globalmente em qualquer `.mdx` do projeto (via
`src/mdx-components.tsx`) — não é preciso importar:

`Definicao`, `Atencao`, `DicaEntrevista`, `Pegadinha`, `ExemploFinanceiro`, `RespostaCurta`, `RespostaSenior`,
`ErroComum`, `Resumo`, `Comparacao`, `Diagrama`, `PerguntaDerivada`, `Mermaid`, `ProducerConsumerFlow`,
`BrokerClusterDiagram`.

## Criando um novo diagrama

- Para um fluxo reutilizável em vários capítulos, crie um componente SVG/React em
  `src/components/diagrams/NomeDoDiagrama.tsx`, seguindo a paleta de `specs/design-system.md`, e registre-o
  em `src/mdx-components.tsx`.
- Para um fluxo específico de um único capítulo, use `<Mermaid chart="...">` diretamente no MDX — não é
  necessário criar um componente novo.

## Validação

Sempre rode antes de commitar:

```bash
npm run validate-content
```

O script verifica: frontmatter obrigatório por tipo de conteúdo (incluindo `quiz` em perguntas), slugs
duplicados e links internos (`relatedChapters` e links `[texto](/pt/kafka/livro/slug)` ou
`[texto](/en/kafka/livro/slug)` no corpo) apontando para capítulos/termos inexistentes — checado
separadamente por trilha e por locale.

**Não rode `npm run format` (Prettier) sobre arquivos `.mdx` de conteúdo.** `src/content/**/*.mdx` já está
no `.prettierignore` por isso: o plugin MDX do Prettier reflui texto dentro de componentes JSX (como
`<Comparacao>`) para o `printWidth`, e isso colapsa tabelas GFM (`| coluna | coluna |`) em um único
parágrafo, quebrando a tabela visualmente sem quebrar o build. Se um `<Comparacao>` tiver sido formatado por
engano, abra a página no navegador e confira se a tabela ainda renderiza como tabela.
