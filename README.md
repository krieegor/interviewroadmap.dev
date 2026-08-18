# interviewroadmap.dev

[![CI](https://github.com/krieegor/interviewroadmap.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/krieegor/interviewroadmap.dev/actions/workflows/ci.yml)
[![Licença MIT](https://img.shields.io/badge/licença-MIT-blue.svg)](./LICENSE)

**🔗 [interviewroadmap.dev](https://interviewroadmap.dev)**

Plataforma interativa, gratuita e open source de preparação para entrevistas técnicas, organizada por
trilhas de tecnologia. Cada trilha segue o mesmo formato: guia prático produzido para estudo real (não é
cópia da documentação oficial), com resposta rápida, resposta nível sênior, explicação aprofundada, exemplo
financeiro e pegadinhas comuns para cada pergunta de entrevista.

## Sumário

- [Trilhas](#trilhas)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rodando localmente](#rodando-localmente)
- [Scripts](#scripts)
- [Documentação do projeto](#documentação-do-projeto)
- [Contribuindo](#contribuindo)
- [Aviso](#aviso)
- [Licença](#licença)

## Trilhas

| Trilha             | Status           | Conteúdo hoje                                                         |
| ------------------ | ---------------- | --------------------------------------------------------------------- |
| **Kafka**          | ✅ Completa      | 15 capítulos, 50 perguntas, 24 termos de glossário, 5 estudos de caso |
| **Java**           | 🚧 Em construção | Nenhum ainda                                                          |
| **Elastic Search** | 🚧 Em construção | Nenhum ainda                                                          |
| **SQL**            | 🚧 Em construção | Nenhum ainda                                                          |
| **AWS**            | 🚧 Em construção | Nenhum ainda                                                          |
| **GCP**            | 🚧 Em construção | Nenhum ainda                                                          |

## Funcionalidades

- Livro navegável por capítulos, organizado em partes progressivas.
- Perguntas de entrevista com resposta rápida, resposta nível sênior, explicação aprofundada, exemplo
  financeiro e pegadinhas comuns.
- Glossário com termos essenciais, cada um com página própria e deep link.
- Estudos de caso de sistemas financeiros reais (PIX, cartões, faturas).
- Simulador de entrevista local, sem backend: modo aberto (você explica em voz alta) e modo múltipla
  escolha (estilo Enem), com painel lateral para ver a resposta completa sem sair da sessão.
- Exportação do livro em PDF (capa com contribuidores da versão e data).
- Busca local (`Ctrl+K`), progresso de leitura e tema claro/escuro, tudo salvo só no seu navegador.
- Internacionalização completa em português e inglês.
- Identidade visual própria por trilha: a cor de destaque muda conforme a tecnologia (Kafka laranja, Java
  vermelho, Elastic teal, SQL azul, AWS laranja queimado, GCP azul Google).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + MDX. 100% estático, sem banco de dados, sem
autenticação, sem serviços pagos. Estado do usuário (tema, progresso, simulador) vive só em `localStorage`.

## Estrutura do projeto

```
src/
├── app/            # rotas (App Router) — /[locale]/[tech]/...
├── components/      # UI, layout, navegação, blocos de conteúdo MDX, diagramas, ícones
├── content/          # conteúdo (.mdx) por trilha/tipo/idioma
├── lib/                # loaders de conteúdo, i18n, trilhas, busca, progresso
├── config/              # identidade da plataforma (site.ts) e das trilhas (tech.ts)
└── types/                # tipos compartilhados
```

Detalhes completos da arquitetura em [`specs/architecture.md`](./specs/architecture.md).

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`, que redireciona pro seletor de trilha (`/pt/home`), de onde você escolhe
Kafka, Java, Elastic Search, SQL, AWS ou GCP.

## Scripts

```bash
npm run dev              # ambiente de desenvolvimento
npm run build              # build de produção (gera out/, estático puro)
npm run start                # serve out/ localmente, pra conferir o build de produção
npm run lint                   # ESLint
npm run typecheck                # checagem de tipos
npm run test                       # Vitest
npm run format                       # Prettier
npm run validate-content                # valida frontmatter e links internos do conteúdo
```

## Documentação do projeto

- [`CLAUDE.md`](./CLAUDE.md): guia de arquitetura e convenções para contribuição (humana ou assistida por IA).
- [`specs/`](./specs): especificações de produto, arquitetura, diretrizes de conteúdo, design system e roadmap.
- [`docs/contributing.md`](./docs/contributing.md): como contribuir.
- [`docs/content-authoring.md`](./docs/content-authoring.md): como escrever capítulos, perguntas, glossário e estudos de caso.
- [`docs/adding-a-tech.md`](./docs/adding-a-tech.md): pré-requisitos e passo a passo para adicionar uma trilha (`tech`) nova.
- [`docs/deployment.md`](./docs/deployment.md): como publicar em Vercel, Cloudflare (Workers ou Pages),
  Netlify ou GitHub Pages.

## Contribuindo

Contribuições são bem-vindas: correções técnicas, novos capítulos/perguntas, conteúdo para as trilhas Java,
Elastic Search, SQL, AWS e GCP, ou melhorias de acessibilidade e design. Veja
[`docs/contributing.md`](./docs/contributing.md) antes de abrir um Pull Request. Este projeto segue o
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

### Contribuidores

- [João Paulo Rodrigues de Araújo](https://github.com/krieegor)

## Aviso

Este projeto não possui vínculo oficial com a Apache Software Foundation, com o Apache Kafka, com a
Confluent, com a Elastic NV, com a Oracle, com a Amazon Web Services ou com o Google Cloud. O conteúdo é
original e não substitui a documentação oficial nem a experiência prática de operar o sistema em produção.

## Licença

MIT.
