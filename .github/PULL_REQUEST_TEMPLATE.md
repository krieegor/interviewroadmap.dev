## O que este PR muda

<!-- Descreva a mudança e o motivo. Se resolve uma issue, referencie com "Closes #123". -->

## Tipo de mudança

- [ ] Conteúdo (capítulo, pergunta, glossário, estudo de caso)
- [ ] Trilha nova (ver [`docs/adding-a-tech.md`](../docs/adding-a-tech.md))
- [ ] Correção de bug na aplicação
- [ ] Melhoria de acessibilidade/design
- [ ] Outro (descreva acima)

## Checklist

- [ ] Li [`CLAUDE.md`](../CLAUDE.md) e, se for mudança de conteúdo, [`docs/content-authoring.md`](../docs/content-authoring.md)
- [ ] `npm run lint` passa
- [ ] `npm run typecheck` passa
- [ ] `npm run validate-content` passa (mudanças em `src/content/**`)
- [ ] `npm run test` passa
- [ ] `npm run build` passa
- [ ] Se um capítulo do livro mudou, `public/livro.pdf` regenerado está incluído no commit
- [ ] Se o conteúdo foi adicionado/alterado em `pt/`, a versão `en/` correspondente foi criada ou atualizada
      (ou, se ainda não traduzida, isso está explícito na descrição do PR)
