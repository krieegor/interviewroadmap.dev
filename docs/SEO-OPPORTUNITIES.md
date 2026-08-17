# SEO Opportunities

Oportunidades identificadas na auditoria (ver [`SEO-AUDIT.md`](./SEO-AUDIT.md)) que não foram implementadas
agora — não porque sejam ruins, mas porque exigem trabalho de conteúdo editorial ou engenharia maior do que
cabia no lote de SEO técnico. Priorizadas por Impact/Effort.

## 1. Conteúdo real pras trilhas `ComingSoon` — Impact: HIGH / Effort: HIGH

De longe a maior oportunidade. O projeto hoje só compete organicamente por keywords de Kafka. Todo o resto
do universo pedido — **Java interview, Spring Boot interview, JavaScript/TypeScript interview, React
interview, Angular interview, Node.js interview, AWS interview, Docker interview, Kubernetes interview, SQL
interview, microservices interview, system design interview** — está bloqueado porque as trilhas
correspondentes (`java`, `elastic`, `sql`, `aws`, `gcp`) não têm conteúdo real (`ComingSoon`, `noindex`).

Isso **não é uma tarefa de código**. É replicar, por trilha, o mesmo trabalho editorial que já existe pra
Kafka: 50 perguntas de entrevista com resposta aprofundada, capítulos de livro cobrindo os 10 pontos de
[`specs/content-guidelines.md`](../specs/content-guidelines.md), glossário, estudos de caso. Ver
[`docs/content-authoring.md`](./content-authoring.md) e [`docs/adding-a-tech.md`](./adding-a-tech.md) pro
processo. Criar páginas "SEO" vazias ou rasas pra essas keywords antes de ter esse conteúdo seria thin
content — teria o efeito oposto do pretendido (Google penaliza, não recompensa).

**Como priorizar:** a trilha `java` provavelmente tem a maior demanda de busca combinada com menor esforço
de produção (o autor já atua com Java/Spring/arquitetura distribuída, conteúdo já parcialmente estruturado
em `src/config/tech.ts`), seguida por `sql` (universo de keywords amplo, formato de conteúdo mais
padronizável que cloud). `aws`/`gcp` têm mais concorrência de conteúdo institucional (documentação oficial,
grandes sites de certificação) — mais difícil ranquear sem um ângulo diferenciado.

## 2. `Article`/`LearningResource` schema por capítulo — Impact: MEDIUM / Effort: MEDIUM

Reforçaria o `FAQPage` já existente com um segundo tipo de structured data mais alinhado a conteúdo
educacional longo. Bloqueado hoje porque `dateModified` não existe no frontmatter dos capítulos — precisa
de uma decisão de onde essa data vem (campo manual no MDX vs. derivado de `git log`/mtime do arquivo em
`src/lib/content/chapters.ts`) antes de implementar, pra não inventar uma data que não reflete a realidade.

## 3. `ItemList`/`CollectionPage` nas páginas de índice — Impact: LOW / Effort: LOW

`livro`, `perguntas`, `glossario`, `casos` já têm `BreadcrumbList` (implementado neste lote). Adicionar
`ItemList` listando os itens de cada índice é barato, mas o ganho marginal é pequeno — a maior parte do
sinal de estrutura já está coberta.

## 4. OG image por pergunta/capítulo individual — Impact: LOW-MEDIUM / Effort: MEDIUM

Hoje cada trilha tem sua própria imagem OG (`src/app/[locale]/[tech]/opengraph-image.tsx`), mas uma
pergunta ou capítulo compartilhado individualmente ainda cai nesse fallback genérico da trilha. Uma imagem
por item (título da pergunta/capítulo estampado) melhoraria CTR de compartilhamento, mas são 100+ arquivos
× 2 idiomas gerados a cada build — custo de build real que não se justifica antes de ter tráfego social
mensurável saindo dessas páginas especificamente.

## 5. `Organization.founder`/`sameAs` apontando pro `/sobre` — Impact: LOW / Effort: LOW

Fecharia o grafo de entidades (Organization → Person) no JSON-LD. Não implementado agora só por ser
estritamente aditivo ao que já existe — fácil de adicionar depois em `buildOrganizationJsonLd`
(`src/lib/seo.ts`) sem mexer em mais nada.

## 6. Backlinks / conteúdo editorial externo — Impact: HIGH / Effort: HIGH

Fora do escopo de mudança de código. Republicar capítulos-resumo em plataformas como Dev.to/Medium
apontando de volta pro livro completo, ou o autor comentando/linkando o projeto em respostas técnicas
(Stack Overflow, Reddit r/experienceddevs, comunidades Kafka) são formas legítimas de construir autoridade
— mas são ações editoriais/de distribuição, não têm arquivo de código correspondente.

## 7. Guias comparativos ("Kafka vs. RabbitMQ para entrevistas", etc.) — Impact: MEDIUM / Effort: MEDIUM

Long-tail de busca comparativa converte bem pra quem está decidindo o que estudar. Só faz sentido depois
que uma segunda trilha tiver conteúdo real o suficiente pra sustentar a comparação sem ficar raso de um
lado.
