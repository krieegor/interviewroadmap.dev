# Como adicionar uma trilha (`tech`) nova

Este guia é para quem vai adicionar uma trilha nova ao seletor (`/[locale]/home`) — seja uma trilha "em
construção" (só a página existe, sem conteúdo ainda, como Java/Elastic/SQL/AWS/GCP hoje) ou uma trilha que
já nasce com conteúdo real. Para escrever capítulos/perguntas/glossário/estudos de caso **dentro** de uma
trilha que já existe, veja [`docs/content-authoring.md`](./content-authoring.md) — este guia aqui é só sobre
dar de alta a trilha em si. Contexto arquitetural completo em
[`specs/architecture.md`](../specs/architecture.md) §14.

Pré-requisito: decida se a trilha já entra com conteúdo real ou só como placeholder "em construção". A
imensa maioria das trilhas novas entra como placeholder — escrever o conteúdo completo (livro + 50 perguntas
+ glossário + estudos de caso, nos dois idiomas) é o trabalho grande e separado, coberto por
[`docs/content-authoring.md`](./content-authoring.md).

## 1. Declarar o `Tech`

Em `src/lib/tech/config.ts`:

```ts
export type Tech = "kafka" | "java" | "elastic" | "sql" | "aws" | "gcp" | "sua-trilha";

export const techs: Tech[] = ["kafka", "java", "elastic", "sql", "aws", "gcp", "sua-trilha"];

// Só adicione aqui quando o conteúdo (chapters/questions/glossary/case-studies) já existir de verdade.
export const techsWithContent: Tech[] = ["kafka"];
```

`techsWithContent` é o único gate que importa para conteúdo: `sitemap.ts`, `scripts/build-search-index.ts`
e todas as rotas de conteúdo sob `[tech]` (`livro`, `perguntas`, `glossario`, `casos`, `simulador`) leem
essa lista para decidir entre gerar as páginas reais ou cair no 404 de build. Uma trilha em `techs` mas fora
de `techsWithContent` só ganha a home (`/[locale]/[tech]`) com `<ComingSoon>`.

## 2. Nome/descrição da trilha

Em `src/config/tech.ts`, adicione a entrada `pt`/`en` correspondente:

```ts
"sua-trilha": {
  pt: {
    name: "Nome completo da trilha",
    shortName: "Nome curto",
    description: "Trilha de preparação para entrevistas de X — em construção.",
  },
  en: {
    name: "Full track name",
    shortName: "Short name",
    description: "X interview prep track — coming soon.",
  },
},
```

Quando a trilha ganhar conteúdo real, troque a `description` (deixa de dizer "em construção"/"coming soon")
e ajuste conforme o padrão do Kafka (`localizedTechConfig.kafka` no mesmo arquivo).

## 3. Ícone

Adicione um `case` novo em `src/components/icons/TechIcon.tsx` — um SVG simples de linha (`currentColor`,
`strokeWidth="2"`, sem preenchimento), no mesmo estilo dos existentes. Não é o logo oficial da tecnologia,
só um glifo que ajuda a diferenciar a trilha no seletor.

## 4. Cor de destaque por trilha

Em `src/app/globals.css`, adicione um bloco `[data-tech="sua-trilha"]` (light) e
`.dark [data-tech="sua-trilha"]` (dark), definindo `--color-accent` e `--color-accent-subtle`. Kafka
continua sendo o default herdado de `:root`/`.dark` — só defina overrides para trilhas novas.

**Valide contraste AA (4.5:1) de `--color-accent` contra `--color-bg`** no tema em que ele é usado, antes de
commitar. Toda cor de trilha existente já foi validada assim (ver comentário acima dos blocos
`[data-tech]` em `globals.css`).

Não precisa tocar em `layout.tsx` nem nos cards do seletor — ambos já leem `data-tech` dinamicamente a
partir do `tech` da rota/loop.

## 5. Disclaimer de marca

Se a tecnologia pertence a uma empresa/fundação (como Apache Kafka → Apache Software Foundation, Elastic →
Elastic NV, AWS → Amazon, GCP → Google), adicione o nome dela em `footer.disclaimer` e
`sobre.trademarkDisclaimer`, nos dois dicionários (`src/lib/i18n/dictionaries/pt.ts` e `en.ts`). É a mesma
frase que já cita Apache Kafka/Confluent/Apache Software Foundation/Elastic NV/Oracle/AWS/Google Cloud —
só estenda a lista.

## 6. O que **não** precisa mudar

Rotas (`src/app/[locale]/[tech]/**`), `sitemap.ts`, `robots.ts`, `scripts/build-search-index.ts` e o
`LocaleSwitcher`/`TrackSwitcher` já iteram sobre `techs`/`techsWithContent` dinamicamente — nenhum deles tem
lista própria de tecnologias para manter sincronizada. Se você adicionou uma trilha e algo não apareceu,
o problema quase sempre está em `techs`/`techsWithContent` desatualizado, não em código de rota.

## 7. Quando a trilha ganha conteúdo real

Siga [`docs/content-authoring.md`](./content-authoring.md) para criar os arquivos `.mdx`
(`src/content/<tech>/...`), depois:

1. Adicione `<tech>` a `techsWithContent` em `src/lib/tech/config.ts` — isso sozinho liga sitemap, busca e
   todas as rotas de conteúdo (`livro`, `perguntas`, `glossario`, `casos`, `simulador`) para a trilha.
2. Atualize a `description` em `src/config/tech.ts` (deixa de ser "em construção").
3. Rode `npm run validate-content`, `npm run lint`, `npm run test` e `npm run build` antes de considerar a
   trilha pronta.

## Checklist rápido

- [ ] `Tech` + `techs` em `src/lib/tech/config.ts` (`techsWithContent` só quando tiver conteúdo real)
- [ ] Nome/descrição em `src/config/tech.ts` (pt + en)
- [ ] Ícone em `src/components/icons/TechIcon.tsx`
- [ ] Cor `[data-tech]` em `src/app/globals.css` (light + dark, validada AA)
- [ ] Disclaimer de marca em `footer.disclaimer`/`sobre.trademarkDisclaimer` (pt + en), se aplicável
- [ ] `npm run lint && npm run test && npm run validate-content && npm run build`
