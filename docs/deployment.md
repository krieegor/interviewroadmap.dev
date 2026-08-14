# Deploy

O projeto é 100% estático: `next.config.ts` usa `output: "export"`, então `npm run build` gera um diretório
`out/` com HTML/CSS/JS puros (via `generateStaticParams` em toda rota de conteúdo) — sem servidor Node em
produção, sem adapter, sem banco de dados, sem autenticação, sem serviços pagos. Qualquer plataforma de
hospedagem estática funciona no plano gratuito; basta apontar pro diretório `out/`.

## Variáveis de ambiente

Apenas uma variável é usada, e é opcional:

| Variável               | Uso                                          | Padrão                  |
| ---------------------- | -------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_SITE_URL` | URL canônica usada em metadata, sitemap e OG | `http://localhost:3000` |

Configure-a com a URL final do deploy (ex.: `https://kafka-entrevistas.vercel.app`).

## Vercel (recomendado)

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. Framework detectado automaticamente: Next.js. Nenhuma configuração adicional é necessária.
3. Defina `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente do projeto.
4. Deploy automático a cada push na branch principal.

## Cloudflare Workers (assets estáticos, sem adapter)

O app não precisa de servidor, então **não** usa `@opennextjs/cloudflare`/R2 — já tentamos esse caminho e foi
revertido (ver [`specs/roadmap.md`](../specs/roadmap.md)). Em vez disso, `wrangler.jsonc` na raiz configura
um Worker "só assets": sem `main`/Worker script, só `assets.directory: "./out"`. Funciona tanto num projeto
criado como **Pages** quanto como **Worker** com git integration — o repositório atual
(`interviewroadmap.workers.dev`) usa o segundo.

1. Build command: `npm run build`.
2. Deploy command: `npx wrangler deploy` (detecta o `assets.directory` do `wrangler.jsonc` e sobe os arquivos
   de `out/` — não precisa de bucket R2, não precisa de bundle de servidor).
3. Non-production branch deploy command: `npx wrangler versions upload`.
4. Root directory: `/`.
5. Defina `NEXT_PUBLIC_SITE_URL` em "Build variables and secrets" com a URL final.

## Netlify

1. Build command: `npm run build`.
2. Publish directory: `out`.
3. Defina `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente do site.

Com `output: "export"` o site é estático puro — não precisa do plugin `@netlify/plugin-nextjs` (esse plugin
existe pra rodar Server Components/ISR sob demanda, que este projeto não usa).

## GitHub Pages

Com export estático, GitHub Pages passa a funcionar sem reestruturação: publique o conteúdo de `out/` (ex.:
via Actions com `actions/upload-pages-artifact` + `actions/deploy-pages`). Se publicar num project page sem
domínio customizado (`usuario.github.io/repo`), configure `basePath`/`assetPrefix` em `next.config.ts` com o
nome do repositório — não configurado hoje porque o deploy atual usa domínio próprio na raiz.

## Preview local do export estático

```bash
npm run build   # gera out/
npm run start   # serve out/ com `serve` (mesmo servidor usado por scripts/generate-pdf.ts)
```

## PDF do livro é committado no repo

`scripts/generate-pdf.ts` (chamado via `postbuild`) sobe um Chromium via Playwright para renderizar
`/pt/kafka/livro/impressao` e gerar `public/livro.pdf`. Como alguns ambientes de build (containers Linux
mínimos, ex.: Cloudflare Workers Builds) não têm as bibliotecas gráficas que o Chromium exige
(`libatk-1.0.so.0` e outras), o script detecta essa falha de lançamento do navegador especificamente e
**pula a geração sem derrubar o build** — só loga um aviso.

Por isso `public/livro.pdf` **é committado no git** (não é mais gerado do zero em todo build/deploy): o
`next build` copia `public/**` pra `out/` antes do `postbuild` rodar, então mesmo num provedor sem Chromium
o `out/livro.pdf` publicado é a última versão committada. Pra atualizar o PDF depois de mudar conteúdo do
livro, rode `npm run build` localmente (ou deixe o GitHub Actions gerar) e commite o `public/livro.pdf`
resultante — Vercel, Netlify e GitHub Actions têm as libs necessárias e sempre regeneram um novo.

## Build local (verificação antes do deploy)

```bash
npm run lint
npm run typecheck
npm run validate-content
npm run test
npm run build
```

Todos devem passar antes de qualquer deploy. `npm run build` já inclui o `postbuild` (PDF).
