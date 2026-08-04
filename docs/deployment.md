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

## Cloudflare Pages

1. Crie um projeto Pages apontando para o repositório.
2. Build command: `npm run build`.
3. Build output directory: use o adapter `@cloudflare/next-on-pages` (`npx @cloudflare/next-on-pages`) como
   comando de build, já que o projeto usa recursos de Server Components/`generateStaticParams` do App
   Router — o export estático puro (`next export`) não é usado aqui.
4. Defina `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente do projeto Pages.

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
