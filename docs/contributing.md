# Contribuindo

Obrigado por considerar contribuir com este projeto. Ele é gratuito, aberto e depende de contribuições da
comunidade para crescer em conteúdo e qualidade. Ao participar, você concorda em seguir o
[`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) do projeto.

Para propor conteúdo novo (capítulo, pergunta, trilha) antes de abrir um PR grande, abra uma
[issue de proposta de conteúdo](../.github/ISSUE_TEMPLATE/content_proposal.md): alinha escopo antes do
trabalho pesado.

## O que você pode contribuir

- Correções técnicas em capítulos, perguntas, glossário ou estudos de caso existentes.
- Novos capítulos, perguntas ou termos de glossário (ver
  [`docs/content-authoring.md`](./content-authoring.md)).
- Melhorias de acessibilidade, responsividade ou design.
- Correções de bugs na aplicação (busca, simulador, tema, progresso de leitura).

## Antes de começar

1. Leia [`CLAUDE.md`](../CLAUDE.md) e os documentos em [`specs/`](../specs): eles definem a arquitetura, o
   modelo de conteúdo e as diretrizes editoriais do projeto.
2. Para mudanças de conteúdo, siga [`docs/content-authoring.md`](./content-authoring.md).
3. Para mudanças de código, mantenha a arquitetura existente: `src/app` só roteia, conteúdo vive em
   `src/content`, e a lógica de leitura de arquivos fica isolada em `src/lib/content`.

## Rodando o projeto localmente

```bash
npm install
npm run dev
```

## Antes de abrir um Pull Request

Rode a suíte completa localmente:

```bash
npm run lint
npm run typecheck
npm run validate-content
npm run test
npm run build
```

Um Pull Request só deve ser aberto depois que todos esses comandos passarem sem erro.

`npm run build` regenera `public/livro.pdf` automaticamente (via `postbuild`) sempre que roda num ambiente
com Chromium completo; se a mudança alterou algum capítulo do livro, inclua o `public/livro.pdf`
atualizado no commit (ver [`docs/deployment.md`](./deployment.md) § "PDF do livro é committado no repo").

## Estilo de código

- TypeScript estrito, sem `any` não justificado.
- Componentes pequenos, com responsabilidade única.
- Sem dependências novas sem justificativa: avalie o custo de bundle antes de propor uma biblioteca.
- Prettier formata automaticamente (`npm run format`); não brigue com o formatter.

## Estilo editorial

Todo conteúdo deve seguir [`specs/content-guidelines.md`](../specs/content-guidelines.md): os 10 pontos
obrigatórios por conceito, a estrutura fixa de pergunta de entrevista, e o tom de livro técnico (nunca
documentação de referência traduzida).
Conteúdo copiado de livros, cursos ou da documentação oficial não será aceito: o material precisa ser
original.
