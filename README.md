# trainer.dev

Plataforma interativa, gratuita e open source de preparação para entrevistas técnicas, organizada por
trilhas de tecnologia.

- **Kafka** — trilha completa: livro navegável, 50 perguntas de entrevista, glossário, estudos de caso e
  simulador.
- **Java** e **Elastic Search** — em construção.

Cada trilha segue o mesmo formato: guia prático produzido para estudo real (não é cópia da documentação
oficial), com resposta rápida, resposta nível sênior, explicação aprofundada, exemplo financeiro e
pegadinhas comuns para cada pergunta de entrevista.

## O que tem aqui (trilha Kafka)

- Livro navegável por capítulos, organizado em partes progressivas.
- 50 perguntas de entrevista, cada uma com resposta rápida, resposta nível sênior, explicação aprofundada,
  exemplo financeiro e pegadinhas comuns.
- Glossário com termos essenciais do Kafka.
- Estudos de caso de sistemas financeiros reais (PIX, cartões, faturas).
- Simulador de entrevista local, sem backend (modo aberto e modo múltipla escolha).
- Busca local, progresso de leitura e tema claro/escuro — tudo salvo no seu navegador.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + MDX. 100% estático, sem banco de dados, sem
autenticação, sem serviços pagos.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` — redireciona pro seletor de trilha (`/pt`), de onde você escolhe Kafka,
Java ou Elastic Search.

## Scripts

```bash
npm run dev              # ambiente de desenvolvimento
npm run build              # build de produção (estático)
npm run lint                 # ESLint
npm run typecheck              # checagem de tipos
npm run test                    # Vitest
npm run format                    # Prettier
npm run validate-content            # valida frontmatter e links internos do conteúdo
```

## Documentação do projeto

- [`CLAUDE.md`](./CLAUDE.md) — guia de arquitetura e convenções para contribuição (humana ou assistida por IA).
- [`specs/`](./specs) — especificações de produto, arquitetura, diretrizes de conteúdo, design system e roadmap.
- [`docs/contributing.md`](./docs/contributing.md) — como contribuir.
- [`docs/content-authoring.md`](./docs/content-authoring.md) — como escrever capítulos, perguntas, glossário e estudos de caso.
- [`docs/deployment.md`](./docs/deployment.md) — como publicar em Vercel, Cloudflare Pages ou Netlify.

## Aviso

Este projeto não possui vínculo oficial com a Apache Software Foundation, com o Apache Kafka ou com a
Confluent. O conteúdo é original e não substitui a documentação oficial nem a experiência prática de operar
o sistema em produção.

## Licença

MIT.
