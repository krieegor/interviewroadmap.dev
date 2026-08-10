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

## Cloudflare Pages

1. Crie um projeto **Pages** (não "Worker" — o app não precisa de servidor, então não usa
   `@opennextjs/cloudflare`/Workers/R2; já tentamos esse caminho e foi revertido, ver
   `specs/roadmap.md`).
2. Build command: `npm run build`.
3. Build output directory: `out`.
4. Defina `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente do projeto Pages.

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

## Limitação conhecida: PDF do livro

`scripts/generate-pdf.ts` (chamado via `postbuild`, depois que `out/` já existe) sobe um Chromium via
Playwright para renderizar `/pt/kafka/livro/impressao` e gerar `public/livro.pdf` **e** `out/livro.pdf` (o
export já foi copiado antes do postbuild rodar, então os dois precisam ser escritos). Em ambientes de build
sem as bibliotecas gráficas do Chromium (containers Linux mínimos, ex.: Cloudflare Workers Builds), o script
detecta a falha de lançamento do navegador e **pula a geração do PDF sem derrubar o build** — só loga um
aviso. Vercel, Netlify e GitHub Actions normalmente têm essas libs; se o seu provedor não tiver, o PDF
publicado será o da última build que conseguiu gerá-lo.

## Build local (verificação antes do deploy)

```bash
npm run lint
npm run typecheck
npm run validate-content
npm run test
npm run build
```

Todos devem passar antes de qualquer deploy. `npm run build` já inclui o `postbuild` (PDF).
