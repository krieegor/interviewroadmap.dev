# SEO Audit

Auditoria feita lendo o código real do projeto (não assumida), em 2026-08-17. Contexto: um pedido externo
de "auditoria SEO completa" (mega-prompt genérico de 38 seções, gerado por outra ferramenta) partia da
premissa de que o projeto não tinha SEO nenhum. Não era o caso: commit recente "feat: optimizations for
google SEO" já tinha resolvido boa parte do básico. Esta auditoria separa o que já existia do que foi
adicionado agora, com severidade por item.

## O que já existia (antes desta mudança)

| Item | Status | Onde |
| --- | --- | --- |
| Rastreabilidade (SSG puro, nada client-side-only) | ✅ OK | `next.config.ts` (`output: "export"`) |
| Sitemap dinâmico, só conteúdo real | ✅ OK | `src/app/sitemap.ts` |
| Robots.txt + link ao sitemap | ✅ OK | `src/app/robots.ts` |
| Canonical + hreflang por página | ✅ OK | `src/lib/seo.ts` (`buildAlternates`), usado em toda página de conteúdo |
| `noindex` automático em trilhas sem conteúdo | ✅ OK | `src/app/[locale]/[tech]/layout.tsx` |
| Title/description únicos por página, derivados do frontmatter | ✅ OK | `generateMetadata` de cada `page.tsx` |
| Title/description por trilha keyword-aware (não genérico) | ✅ OK | `src/config/tech.ts` |
| H1/H2 semânticos | ✅ OK | páginas de trilha, capítulo, pergunta, etc. |
| `FAQPage` JSON-LD | ✅ OK (com ressalva; ver `SEO.md`) | `perguntas/[slug]/page.tsx` |
| Manifest, favicon, ícone | ✅ OK | `manifest.ts`, `icon.tsx` |

## Gaps corrigidos nesta mudança

| Severidade | Problema | Impacto | Solução | Arquivos |
| --- | --- | --- | --- | --- |
| MEDIUM | Nenhum `BreadcrumbList`/breadcrumb visual em nenhuma página | Hierarquia real (Home → Trilha → Seção → Item) invisível pra usuário e crawler; sem sinal de estrutura pro Google oferecer sitelinks/breadcrumb no resultado de busca | Componente `Breadcrumbs` (visual + JSON-LD a partir do mesmo array) aplicado nas 10 páginas sob `[tech]/*` | `src/components/navigation/Breadcrumbs.tsx`, `src/config/navigation.ts` (`getTechBreadcrumb`), 10 `page.tsx` |
| MEDIUM | Nenhum `WebSite`/`Organization` JSON-LD | Sem entidade de site clara pro Google associar a marca "interviewroadmap.dev" | `buildWebSiteJsonLd`/`buildOrganizationJsonLd`, emitidos uma vez no layout raiz | `src/lib/seo.ts`, `src/app/[locale]/layout.tsx` |
| LOW-MEDIUM | Nenhum `Person` JSON-LD pro autor, apesar de `/sobre` já ter bio real e verificável (nome, avatar, LinkedIn, GitHub, 10+ anos de experiência) | Sinal de E-E-A-T fraco: página institucional sem markup de autoria | `buildPersonJsonLd`, emitido só em `/sobre`, só com dados já existentes (nada inventado) | `src/lib/seo.ts`, `src/app/[locale]/[tech]/sobre/page.tsx` |
| LOW | Uma única imagem OG estática pra todo o site: compartilhar `/kafka`, `/java` ou qualquer página mostra o mesmo card genérico | CTR de compartilhamento social mais baixo, sem diferenciação por trilha | `opengraph-image.tsx` por trilha, mesmo padrão da imagem raiz | `src/app/[locale]/[tech]/opengraph-image.tsx` |
| LOW | Sem verificação do Google Search Console preparada | Bloqueio manual pro dono do site cadastrar a propriedade | `verification.google` opcional via env var, sem quebrar build se não setada | `src/app/[locale]/layout.tsx`, `docs/SEO.md` |
| LOW (qualidade de código, não SEO em si) | JSON-LD inline duplicava boilerplate (`<script>` + `JSON.stringify` + `dangerouslySetInnerHTML`) e não escapava `<` | Se um `title`/`shortAnswer` de frontmatter algum dia contivesse `</script>` literal, quebraria a página | `JsonLdScript` centralizado, escapa `<` | `src/components/seo/JsonLdScript.tsx`, refatorado em `perguntas/[slug]/page.tsx` |
| - | `docs/SEO.md` não existia | Arquitetura de SEO só reconstituível lendo código espalhado | Documento novo | `docs/SEO.md` |

## Gaps identificados e conscientemente não corrigidos agora

| Severidade | Problema | Por que não agora |
| --- | --- | --- |
| **CRITICAL (mas não é bug de código)** | A maior parte do universo de keywords visado (Java, Spring Boot, React, Angular, Node.js, AWS, Docker, Kubernetes, SQL, microservices, system design interview) não tem página indexável correspondente | As trilhas `java`/`elastic`/`sql`/`aws`/`gcp` são `ComingSoon`, sem conteúdo real. Criar páginas pra essas keywords sem conteúdo seria thin content/doorway page, proibido pela própria política de SEO sustentável e pelas regras do projeto (`CLAUDE.md`: não inventar conteúdo). Isso é um gap de **conteúdo editorial**, não de engenharia de SEO. Ver `SEO-OPPORTUNITIES.md`. |
| LOW | `Article`/`LearningResource` schema por capítulo | Precisa de um campo de data (`dateModified`) que não existe no frontmatter hoje; poderia ser derivado de mtime do arquivo/git, mas isso é lógica de loader nova (`src/lib/content/chapters.ts`), maior que este lote |
| LOW | `ItemList`/`CollectionPage` nas 4 páginas de índice (livro/perguntas/glossario/casos) | Valor marginal depois que `BreadcrumbList` já existe nessas páginas |
| LOW | OG image por pergunta/capítulo individual (não só por trilha) | 100+ arquivos × 2 idiomas; custo de build real, ROI baixo comparado ao nível de trilha |

## Validação

`npm run typecheck`, `npm run lint`, `npm run test` (67 testes), `npm run validate-content` e `npm run
build` rodados depois de todas as mudanças acima, todos passando, sem erro novo. Build gera as 12 imagens
OG por trilha (2 locales × 6 techs) e o `BreadcrumbList`/`WebSite`/`Organization`/`Person` JSON-LD
verificados manualmente no HTML de `out/` (URLs absolutas, JSON válido). Trilhas sem conteúdo continuam
`noindex` e fora do sitemap; nada nesta mudança alterou esse comportamento.

---

## Auditoria 2: Preview de compartilhamento social sem imagem (2026-08-17)

Motivada por um bug relatado: compartilhar `/pt/home` no WhatsApp mostrava título/descrição mas nenhuma
imagem. A investigação (comparando o HTML real gerado em `out/` entre páginas, não assumindo) revelou dois
problemas reais, mais sérios do que o sintoma relatado sozinho sugeria.

| Severidade | Problema | Impacto | Solução | Arquivos |
| --- | --- | --- | --- | --- |
| CRITICAL | `openGraph` não é deep-merged pelo Next entre `layout`/`page`: qualquer página que definisse `openGraph` parcialmente (só `title`/`description`) apagava `images`/`siteName`/`locale`/`type`/`url` herdados. Afetava `perguntas/[slug]`, `livro/[...slug]`, `glossario/[slug]` (sem imagem) e **todas as outras páginas** de conteúdo, que mostravam `og:title`/`og:description` genéricos do site ("interviewroadmap.dev") em vez do título real da página, mesmo com a `<title>` do navegador correta | Cards de compartilhamento errados/incompletos em praticamente toda página do site, não só `/pt/home` | `buildOpenGraph()` centralizado em `src/lib/seo.ts`: monta o objeto `openGraph` inteiro (nunca parcial) em todo `generateMetadata` que precisa de título/descrição/URL específicos da página | `src/lib/seo.ts` + 12 `page.tsx`/`layout.tsx` (ver `SEO.md` § Open Graph) |
| CRITICAL | `og:locale` usava o formato errado (`pt-BR`/`en-US`, com hífen, formato BCP-47 de `<html lang>`) em vez do formato exigido pelo protocolo Open Graph (`pt_BR`/`en_US`, com underscore) | Alguns parsers de crawler são estritos quanto a esse formato | Mapeamento `OG_LOCALE` dedicado em `buildOpenGraph()`, não reusa `SiteConfig.locale` | `src/lib/seo.ts` |
| CRITICAL | `og:url` nunca era definido em lugar nenhum do site | Falta um campo obrigatório do protocolo OG; alguns crawlers rejeitam o card sem ele | `buildOpenGraph()` sempre inclui `url` absoluto específico da página | `src/lib/seo.ts` |
| **CRITICAL: causa raiz mais provável do bug relatado** | As imagens OG (`/opengraph-image`, `/icon` e todas as variantes por locale/trilha) são rotas **sem extensão** no path. Confirmado em produção com `curl -sD -`: o Cloudflare Workers responde `HTTP 200` com os bytes corretos do PNG, mas **sem header `Content-Type`**, porque infere o tipo pela extensão do arquivo, e essas rotas não têm uma. Crawlers de redes sociais descartam a imagem mesmo com body válido | Nenhuma imagem aparece em nenhum preview social, em nenhuma página do site, não só `/pt/home` | `public/_headers` declarando `Content-Type: image/png` explicitamente pras 16 rotas de imagem sem extensão | `public/_headers`, `docs/adding-a-tech.md` (manutenção ao adicionar trilha) |
| - | `/pt/kafka` (home da trilha) tinha o `og:image` correto mas sem `og:image:alt`, porque sem `generateMetadata` própria a página caía no arquivo de convenção do Next (`opengraph-image.tsx`) em vez do `openGraph.images` explícito do layout | Card levemente inconsistente com as demais páginas | `generateMetadata` própria em `[locale]/[tech]/page.tsx`, mesmo padrão `buildOpenGraph` das outras páginas | `src/app/[locale]/[tech]/page.tsx` |

### Por que o sintoma relatado ("só `/pt/home` sem imagem") não contava a história toda

`/pt/home` foi o único caso em que a imagem estava **totalmente ausente** do HTML (nenhum `og:image` sequer
era emitido, por causa do bug de merge). Em todas as outras páginas o `og:image` existia no HTML, mas o
arquivo por trás dele respondia sem `Content-Type`, então o crawler do WhatsApp provavelmente também
falhava em renderizar essas imagens, só que sem um sintoma tão óbvio quanto "a tag nem existe". Os dois
problemas são independentes e ambos precisavam ser corrigidos.

### Validação desta auditoria

`npm run typecheck`, `npm run lint` e `npm run build` rodados depois de cada rodada de mudanças, todos
passando. Conferido manualmente no HTML de `out/` para 14 tipos de página (home pt/en, trilha, pergunta,
capítulo, termo, caso, 6 páginas de índice) que existe exatamente **uma** ocorrência de `og:title`/
`og:image`/`og:url` (zero duplicata) e que os valores são específicos da página, não genéricos. Confirmado
com `curl -sD -` contra `https://interviewroadmap.dev/opengraph-image` (produção, antes do deploy desta
correção) que o `Content-Type` realmente estava ausente, e que arquivos com extensão (`/favicon.svg`,
`/manifest.webmanifest`) já respondiam corretamente, isolando o problema à ausência de extensão, não a uma
falha geral do Cloudflare.
