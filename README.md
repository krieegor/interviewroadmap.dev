# Apache Kafka para Entrevistas Java Sênior

E-book interativo, gratuito e open source sobre Apache Kafka, voltado para desenvolvedores Java Backend
(Pleno, Sênior e Tech Lead) se preparando para entrevistas técnicas.

Guia prático sobre mensageria, arquitetura, reprocessamento, ordenação, idempotência e sistemas
distribuídos — não é uma cópia da documentação oficial, e sim um livro técnico produzido para estudo real.

## O que tem aqui

- Livro navegável por capítulos, organizado em partes progressivas.
- 50 perguntas de entrevista, cada uma com resposta rápida, resposta nível sênior, explicação aprofundada,
  exemplo financeiro e pegadinhas comuns.
- Glossário com termos essenciais do Kafka.
- Estudos de caso de sistemas financeiros reais (PIX, cartões, faturas).
- Simulador de entrevista local, sem backend.
- Busca local, progresso de leitura e tema claro/escuro — tudo salvo no seu navegador.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + MDX. 100% estático, sem banco de dados, sem
autenticação, sem serviços pagos.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

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
