# Segurança: headers e Content-Security-Policy

`public/_headers` é gerado automaticamente por `scripts/generate-headers.ts` (roda no `prebuild`, ver
`package.json`). Além das entradas `Content-Type: image/png` das rotas de imagem OG (ver
[`docs/adding-a-tech.md`](./adding-a-tech.md) §6), o arquivo aplica um bloco global `/*` com headers de
segurança que o Cloudflare Workers passa a enviar em toda resposta.

## Headers aplicados

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN
```

- `default-src 'self'`: bloqueia por padrão qualquer recurso (script, imagem, fonte, conexão) que não seja
  do próprio domínio.
- `object-src 'none'`, `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`: fecham vetores
  clássicos de clickjacking/injeção de `<object>`/`<base>`/submissão de formulário para domínio externo.
- `img-src 'self' data:`: `data:` é necessário porque alguns componentes embutem imagem inline
  (ex.: ícones/placeholders); nenhuma imagem vem de host externo.
- `X-Frame-Options: SAMEORIGIN` reforça `frame-ancestors` para navegadores antigos que ainda não leem CSP.

## O trade-off do `'unsafe-inline'`

`script-src 'self' 'unsafe-inline'` e `style-src 'self' 'unsafe-inline'` **não** são o ideal de uma CSP
estrita (o ideal seria nonce ou hash por script/style, sem `'unsafe-inline'` nenhum). Isso foi investigado
antes de escrever a política e o motivo de manter `'unsafe-inline'` aqui é arquitetural, não preguiça:

- O site é 100% SSG (`output: "export"`, ver decisão em [`specs/roadmap.md`](../specs/roadmap.md)). O
  Next.js injeta um script de hidratação inline (`self.__next_s = ...`) em **toda** página gerada
  estaticamente. Um nonce por página exigiria um servidor gerando HTML por requisição para carimbar o
  nonce e o header CSP juntos, o que contradiz a decisão de não ter servidor Next em produção.
  Hash-por-script também não é viável porque o Next controla o conteúdo desse script internamente, sem
  gancho estável para o build calcular o hash com segurança entre versões.
- Vários componentes usam `style={{...}}` (prop `style` real do React, não `className`), por exemplo
  `Node3D`, `OffsetLog3D`, `AnimatedWordmark`, `ReadingProgressCard`, `DeliveryGuaranteesScene`: valores
  calculados em runtime (posição de nó num diagrama, progresso de leitura), não viáveis como classe
  Tailwind estática. Isso exige `style-src 'unsafe-inline'`.
- O tema (claro/escuro) é aplicado antes da hidratação via um `<script>` inline em
  `[locale]/layout.tsx`, para evitar flash de tema errado; o mesmo problema de nonce estático se aplica.

O ganho real dessa CSP não é eliminar inline (não é possível nesta arquitetura), e sim bloquear **recurso
de terceiro**: nenhum script, iframe, imagem, fonte ou conexão de rede pode ser carregado de um domínio que
não seja o do próprio site, mesmo que algum componente futuro tente (por bug ou por injeção de conteúdo).
Como o projeto não renderiza conteúdo gerado por usuário sem escape em lugar nenhum (todo conteúdo é MDX
autoral, versionado no repositório), o risco prático de manter `'unsafe-inline'` é baixo.

Se no futuro o projeto deixar de ser 100% estático (deixar de usar `output: "export"`), reavalie: um
servidor Next real permite nonce por requisição via middleware, o que eliminaria a necessidade de
`'unsafe-inline'` em `script-src`.

## Validando

Depois de `npm run build`, sirva `out/` localmente (`npm run start`) e abra no navegador as páginas que
exercitam os casos mais arriscados de CSP: a home do seletor, a home da trilha Kafka (hero 3D), um capítulo
com diagrama 3D, uma pergunta com o painel de resposta completa, e o simulador. Confira o console: não deve
haver nenhum erro `Refused to ...` relacionado a CSP. Qualquer erro novo indica um recurso de terceiro
sendo carregado (que deveria ser adicionado explicitamente à política) ou um `'unsafe-inline'` faltando
para um caso legítimo novo.
