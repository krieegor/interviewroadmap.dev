# Deploy

O projeto é 100% estático (Next.js App Router com SSG) e não depende de banco de dados, autenticação ou
serviços pagos. Qualquer plataforma abaixo funciona no plano gratuito.

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

## Cloudflare Workers (via OpenNext)

`@cloudflare/next-on-pages` (Cloudflare Pages clássico) está em modo manutenção — o caminho atual
recomendado pela própria Cloudflare para Next.js é deploy como **Worker** via `@opennextjs/cloudflare`.
Arquivos relevantes no repo: `wrangler.jsonc`, `open-next.config.ts`.

### Por que precisa de R2 (cache incremental)

Mesmo páginas 100% SSG (`generateStaticParams`) no App Router não são servidas como arquivo estático puro
pelo OpenNext — passam por uma camada de "cache incremental" populada no build. Sem um backend persistente
configurado para esse cache, toda request cairia no fallback de renderização ao vivo dentro do Worker, que
falha: os loaders de conteúdo (`src/lib/content/**`) usam `fs.readdirSync`/`import()` dinâmico contra
`src/content/**/*.mdx`, e o sandbox do Workers não tem acesso a esse filesystem. Por isso o cache incremental
está configurado para usar um bucket R2 (`open-next.config.ts` → `r2IncrementalCache`), que É populado no
build e persiste entre requests.

### Setup (uma vez, na conta Cloudflare)

1. Crie o bucket R2 (nome tem que bater com `bucket_name` em `wrangler.jsonc`, hoje `trainer-dev-cache`):
   ```bash
   npx wrangler login
   npx wrangler r2 bucket create trainer-dev-cache
   ```
2. Conecte o repositório como **Worker** (não Pages clássico) via git integration da Cloudflare.
3. Configure os campos do dashboard:
   - **Build command**: `npx opennextjs-cloudflare build` (roda `next build` + `postbuild` internamente e
     gera `.open-next/worker.js`; **não** usar `npm run build` sozinho, ele não gera o Worker).
   - **Deploy command**: `npx wrangler deploy` (detecta projeto OpenNext automaticamente e popula o cache R2
     como parte do deploy).
   - **Non-production branch deploy command**: `npx wrangler versions upload`.
   - **Path**: `/` (app na raiz do repo).
4. Defina `NEXT_PUBLIC_SITE_URL` em "Build variables and secrets" com a URL final do Worker.

### Limitação conhecida: PDF do livro

`scripts/generate-pdf.ts` (chamado via `postbuild`) precisa de um Chromium completo (Playwright). O
container de build da Cloudflare Workers Builds é uma imagem Linux mínima sem as bibliotecas gráficas
necessárias (`libatk-1.0.so.0` e outras) — o script detecta essa falha de lançamento do navegador
especificamente e **pula a geração do PDF sem derrubar o build** (loga um aviso). `public/livro.pdf` só é
atualizado por builds em ambientes com essas libs (ex.: GitHub Actions/Vercel/Netlify). Se isso importar para
o deploy no Cloudflare, o PDF pode ser gerado em outro pipeline e comitado manualmente, ou o Cloudflare pode
servir a última versão já publicada.

### Testar localmente antes de mudar o dashboard

```bash
npm install
npx opennextjs-cloudflare build
npx opennextjs-cloudflare preview   # sobe o Worker localmente com R2 emulado (Miniflare), popula o cache
```

## Netlify

1. Instale o plugin oficial: `@netlify/plugin-nextjs` (adicionado automaticamente pelo Netlify ao detectar
   Next.js, ou configurável em `netlify.toml`).
2. Build command: `npm run build`.
3. Defina `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente do site.

## GitHub Pages

GitHub Pages serve apenas arquivos estáticos puros, sem suporte a Server Components. Como o projeto usa
`generateStaticParams` com componentes de servidor (não apenas export estático simples), GitHub Pages não é
recomendado sem uma reestruturação significativa. Prefira Vercel, Cloudflare Pages ou Netlify.

## Build local (verificação antes do deploy)

```bash
npm run lint
npm run typecheck
npm run validate-content
npm run test
npm run build
```

Todos devem passar antes de qualquer deploy.
