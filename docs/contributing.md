# Contribuindo

Obrigado por considerar contribuir com este projeto. Ele é gratuito, aberto e depende de contribuições da
comunidade para crescer em conteúdo e qualidade. Ao participar, você concorda em seguir o
[`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) do projeto.

Para propor conteúdo novo (capítulo, pergunta, trilha) antes de abrir um PR grande, abra uma
[issue de proposta de conteúdo](../.github/ISSUE_TEMPLATE/content_proposal.md) — alinha escopo antes do
trabalho pesado.

## O que você pode contribuir

- Correções técnicas em capítulos, perguntas, glossário ou estudos de caso existentes.
- Novos capítulos, perguntas ou termos de glossário (ver
  [`docs/content-authoring.md`](./content-authoring.md)).
- Melhorias de acessibilidade, responsividade ou design.
- Correções de bugs na aplicação (busca, simulador, tema, progresso de leitura).

## Antes de começar

1. Leia [`CLAUDE.md`](../CLAUDE.md) e os documentos em [`specs/`](../specs) — eles definem a arquitetura, o
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
com Chromium completo — se a mudança alterou algum capítulo do livro, inclua o `public/livro.pdf`
atualizado no commit (ver [`docs/deployment.md`](./deployment.md) § "PDF do livro é committado no repo").

## Estilo de código

- TypeScript estrito, sem `any` não justificado.
- Componentes pequenos, com responsabilidade única.
- Sem dependências novas sem justificativa — avalie o custo de bundle antes de propor uma biblioteca.
- Prettier formata automaticamente (`npm run format`); não brigue com o formatter.

## Vídeo de demonstração (README + landing page)

O GIF do topo do [`README.md`](../README.md) (`docs/media/demo.gif`) e o vídeo da landing page
(`public/videos/demo.mp4`) são renderizados a partir do subprojeto isolado `remotion/` (Remotion), que
**não** é dependência do app Next.js — tem `package.json` próprio e nunca é importado por `src/`. Para
regenerar depois de alterar a
animação:

```bash
cd remotion
npm install
npm run render:mp4   # gera remotion/out/demo.mp4
npm run render:gif   # gera remotion/out/demo.gif
```

O poster do `<video>` (`public/videos/demo-poster.jpg`, exibido antes do autoplay) é um frame estático da
cena `Intro` — regenere com `remotion still` apontando pro mesmo frame usado hoje (frame 60, depois que texto
e badge já terminaram de aparecer):

```bash
npx remotion still Demo out/demo-poster.jpg --frame=60
```

Depois, copie manualmente os arquivos gerados para os destinos finais:

```bash
cp remotion/out/demo.mp4 public/videos/demo.mp4
cp remotion/out/demo.gif docs/media/demo.gif
cp remotion/out/demo-poster.jpg public/videos/demo-poster.jpg
```

Não há passo automático no `npm run build` raiz nem no CI para isso — renderizar vídeo é lento e exige
Chromium, o que o pipeline estático do site não tem hoje. Os dois arquivos finais (`.mp4`/`.gif`) são
commitados manualmente como qualquer outro asset estático.

## Estilo editorial

Todo conteúdo deve seguir [`specs/content-guidelines.md`](../specs/content-guidelines.md): os 10 pontos
obrigatórios por conceito, a estrutura fixa de pergunta de entrevista, e o tom de livro técnico (nunca
documentação de referência traduzida).
Conteúdo copiado de livros, cursos ou da documentação oficial não será aceito — o material precisa ser
original.
