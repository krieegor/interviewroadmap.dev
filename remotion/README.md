# Vídeo de demonstração (Remotion)

Subprojeto isolado que gera o vídeo de demonstração usado no topo do [`README.md`](../README.md) (GIF) e na
landing page do site (MP4). Tem `package.json` próprio e **não** é dependência do app Next.js — nunca é
importado por `src/`.

## Estrutura

- `src/Root.tsx` — declara a composição `Demo` (1280×720, 30fps).
- `src/Demo.tsx` — encadeia as cenas via `Sequence` (`Intro` → `QuizCard` → `Outro`).
- `src/scenes/` — `Intro.tsx`, `QuizCard.tsx`, `Outro.tsx`.
- `src/tokens.ts` — paleta de cores/fonte, espelhando os tokens de
  [`specs/design-system.md`](../specs/design-system.md).

## Comandos

```bash
npm install
npm run dev            # abre o Remotion Studio (preview interativo)
npm run render:mp4     # gera out/demo.mp4
npm run render:gif     # gera out/demo.gif
```

Depois de renderizar, copie os arquivos gerados pros destinos finais do site — ver
[`docs/contributing.md`](../docs/contributing.md) § "Vídeo de demonstração (README + landing page)" pelo
passo a passo completo (inclui como gerar o poster do vídeo com `npx remotion still`).

## Docs

[Fundamentos do Remotion](https://www.remotion.dev/docs/the-fundamentals).
