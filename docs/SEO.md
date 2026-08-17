# SEO

O projeto é 100% SSG (`output: "export"`, ver [`deployment.md`](./deployment.md)) — todo o conteúdo já
existe como HTML no momento em que um crawler visita a página, sem depender de JavaScript. Esse documento
descreve a arquitetura de SEO em cima disso: metadata, canonical/hreflang, sitemap, robots, JSON-LD e a
estratégia de internal linking.

## Páginas indexáveis vs. não indexáveis

Só trilhas com conteúdo real (`techsWithContent` em `src/lib/tech/config.ts` — hoje só `kafka`) são
indexáveis. `src/app/[locale]/[tech]/layout.tsx` aplica `robots: { index: false, follow: true }`
automaticamente pra qualquer trilha fora dessa lista — a página `ComingSoon` correspondente não compete por
índice de busca até ter conteúdo real. Isso é deliberado: uma trilha vazia gerando `noindex` é o
comportamento certo, não um bug a corrigir quando ela ganhar conteúdo (nesse ponto ela some da lista de
exclusão automaticamente, sem editar nada aqui).

`livro/impressao` (usada só pra gerar o PDF, ver `deployment.md`) é `noindex, nofollow` — página utilitária,
nunca deveria aparecer em busca nem ser seguida por crawler.

## Metadata por página

Toda página de conteúdo (capítulo, pergunta, termo, estudo de caso) define seu próprio `generateMetadata`
com `title`/`description` derivados do frontmatter real do MDX — nunca hardcoded, nunca genérico. Título e
descrição de cada trilha (`src/config/tech.ts`) são escritos à mão com intenção de busca específica (ex.:
"Apache Kafka para Entrevistas Java Sênior", não "Kafka | interviewroadmap.dev").

## Canonical + hreflang

`buildAlternates(locale, pathWithoutLocale)` em `src/lib/seo.ts` gera `canonical` + `languages` (hreflang)
em uma chamada, usado por toda página de conteúdo. Assume que todo tipo de conteúdo usa o mesmo slug em
pt/en (confirmado — nenhum diff entre os diretórios de conteúdo), então troca só o prefixo de locale no
path.

Importante: esse helper produz **paths relativos** (`/${locale}${path}`) porque o Next resolve `canonical`/
`languages` contra `metadataBase` (setado em `src/app/[locale]/layout.tsx`). JSON-LD **não** passa por essa
resolução — qualquer URL dentro de `application/ld+json` precisa ser absoluta (`${siteConfig.url}${path}`,
mesmo padrão que `src/app/sitemap.ts` já usa). Os builders de JSON-LD em `seo.ts` seguem essa convenção;
não reuse `buildAlternates` pra montar URL de JSON-LD.

## Sitemap e robots

`src/app/sitemap.ts` gera o sitemap dinamicamente a partir da fonte de conteúdo real (`getAllChapters`,
`getAllQuestions`, `getAllCaseStudies`, `getAllTerms`) — nunca uma lista mantida à mão. Só inclui
`techsWithContent`, então trilhas `ComingSoon` nunca aparecem no sitemap (consistente com o `noindex`
acima). `src/app/robots.ts` permite todo crawling e referencia `${siteConfig.url}/sitemap.xml`.

## JSON-LD (structured data)

Centralizado em dois lugares:

- **Builders puros** em `src/lib/seo.ts` — `buildBreadcrumbJsonLd`, `buildWebSiteJsonLd`,
  `buildOrganizationJsonLd`, `buildPersonJsonLd` — cada um só monta o objeto, não sabe renderizar nada.
- **`src/components/seo/JsonLdScript.tsx`** — recebe `data: object`, renderiza o `<script type=
  "application/ld+json">`. Escapa `<` no JSON antes de `dangerouslySetInnerHTML` pra um valor de conteúdo
  nunca poder fechar a tag `</script>` antes da hora.

O que cada tipo cobre:

| Tipo             | Onde                                   | Fonte dos dados                                |
| ----------------- | --------------------------------------- | ----------------------------------------------- |
| `WebSite`         | `[locale]/layout.tsx` (toda página)     | `getSiteConfig(locale)`                          |
| `Organization`    | `[locale]/layout.tsx` (toda página)     | `getSiteConfig(locale)`                          |
| `Person`          | `[tech]/sobre` só                       | `siteConfig.author` (nome, bio, avatar, redes já reais e verificáveis na própria página — nunca inventados) |
| `BreadcrumbList`  | 10 páginas sob `[locale]/[tech]/*`      | `Breadcrumbs` component (ver abaixo)             |
| `FAQPage`         | `[tech]/perguntas/[slug]`               | frontmatter da pergunta                          |

**Nota sobre `FAQPage`:** é markup válido e correto, mas o Google restringiu a elegibilidade de rich result
de FAQ (ago/2023) a majoritariamente sites institucionais/governo/saúde. Não tratar como "vai gerar rich
snippet" — o valor aqui é o markup semântico correto, não uma garantia de rich result.

## Breadcrumbs (internal linking)

`src/components/navigation/Breadcrumbs.tsx` recebe `items: { label, href }[]` (props explícitos, sem
inferência de rota) e renderiza `<nav aria-label><ol>` semântico + o `BreadcrumbList` JSON-LD
correspondente a partir do mesmo array — uma única fonte de verdade pro visual e pro structured data.

`getTechBreadcrumb(locale, tech, techName, dict)` em `src/config/navigation.ts` monta os dois primeiros
nós compartilhados por toda página de uma trilha (`Início` → nome da trilha); cada página completa com sua
própria seção e, quando for uma página de detalhe, o item atual:

```ts
const breadcrumbItems = [
  ...getTechBreadcrumb(locale, tech, techConfig.name, dict),
  { label: dict.nav.perguntas, href: `/${locale}/${tech}/perguntas` },
  { label: frontmatter.title, href: `/${locale}/${tech}/perguntas/${slug}` },
];
```

Aplicado em: `livro` (índice + capítulo), `perguntas` (índice + pergunta), `glossario` (índice + termo),
`casos` (índice + caso), `simulador`, `sobre`. Labels de seção reusam `dict.nav.*` (já usado no header) —
`dict.breadcrumbs.home` é a única string nova.

## Open Graph

Cada trilha tem sua própria imagem OG (`src/app/[locale]/[tech]/opengraph-image.tsx`, mesmo padrão
`ImageResponse`/`force-static` da imagem raiz em `src/app/opengraph-image.tsx`), usando `techConfig.name`/
`description` reais — um link compartilhado de `/kafka` mostra "Apache Kafka para Entrevistas Java Sênior",
não um card genérico do site inteiro. Gerada pra todas as trilhas (incluindo `ComingSoon`) porque é um
asset de compartilhamento social, não uma página indexada — não reabre a questão de páginas vazias
competindo por índice.

Páginas de conteúdo individuais (pergunta, capítulo, termo, caso) não têm imagem OG própria — caem no
fallback da trilha. Ver [`SEO-OPPORTUNITIES.md`](./SEO-OPPORTUNITIES.md) pro porquê disso ser adiado.

## Google Search Console Setup

O que **eu preciso fazer manualmente** depois do deploy:

1. Acessar [search.google.com/search-console](https://search.google.com/search-console) e cadastrar
   `https://interviewroadmap.dev/`.
2. Escolher verificação por "meta tag HTML". O Search Console mostra uma string tipo
   `content="abc123..."` — copiar só o valor.
3. Definir `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123...` nas variáveis de ambiente do deploy (mesmo
   lugar onde `NEXT_PUBLIC_SITE_URL` já é definido — ver [`deployment.md`](./deployment.md)) e rodar um
   novo build. Essa string não é segredo — ela é pública por natureza (vai pro HTML renderizado de
   qualquer forma), não é o tipo de credencial que a regra "sem variável de ambiente secreta" do
   `CLAUDE.md` está protegendo.
4. Depois de verificado, submeter `https://interviewroadmap.dev/sitemap.xml` na seção Sitemaps do Search
   Console.
5. Usar "Inspeção de URL" pra pedir indexação manual das páginas mais importantes (`/pt/kafka`,
   `/pt/kafka/perguntas`, `/pt/kafka/livro`) em vez de esperar o crawl orgânico descobrir tudo sozinho.
6. Monitorar, depois de 2-3 semanas: Cobertura (páginas indexadas vs. excluídas), Core Web Vitals,
   Enhancements → Sitelinks/Breadcrumbs (deve começar a reconhecer o `BreadcrumbList` novo).

## Testes/validação

`npm run test` cobre os componentes de conteúdo/simulador; não há teste automatizado dedicado a JSON-LD ou
metadata hoje — a verificação é manual, inspecionando o HTML gerado em `out/` depois de `npm run build`
(ver seção de verificação em qualquer plano de mudança de SEO). `npm run validate-content` valida
frontmatter e links internos, não metadata de SEO.
