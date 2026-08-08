# Design System — Apache Kafka para Entrevistas Java Sênior

## 1. Princípios

- Documentação técnica premium, não landing page. Sem gradientes chamativos, sem animações de scroll, sem
  seções "hero" com CTA gigante.
- Otimizado para leitura prolongada: largura de linha confortável, contraste alto, espaçamento generoso.
- Diferenciação clara entre prosa e blocos técnicos (código, diagrama, callouts) através de cor de fundo e
  borda lateral, não de decoração pesada.
- Poucas animações, todas curtas e desativadas sob `prefers-reduced-motion`.

## 2. Identidade visual

- **Base neutra**: cinzas com temperatura levemente fria (slate), tanto no claro quanto no escuro.
- **Cor de destaque**: varia por trilha (`--color-accent`/`--color-accent-subtle`, escopados via atributo
  `data-tech` — ver `src/app/globals.css`), usada com moderação — links ativos, ícones de destaque, bordas de
  callout, item de sidebar ativo. Nunca como cor de fundo de blocos grandes de texto. Kafka (o default de
  `:root`/`.dark`, sem override) usa laranja, referência ao ecossistema; as demais trilhas usam uma cor que
  remete à identidade visual da própria tecnologia (Java vermelho, Elastic teal, SQL azul, AWS laranja
  queimado, GCP azul Google), sempre validada para contraste AA (4.5:1) contra `--color-bg`.
- **Modo escuro**: fundo quase preto (não cinza médio) para reduzir fadiga em leitura longa; laranja levemente
  dessaturado para não estourar em telas OLED.

### Paleta (tokens CSS, `globals.css`)

```css
:root {
  --color-bg: #ffffff;
  --color-bg-subtle: #f8fafc; /* slate-50 */
  --color-surface: #f1f5f9; /* slate-100 — blocos de código/callout */
  --color-border: #e2e8f0; /* slate-200 */
  --color-text: #0f172a; /* slate-900 */
  --color-text-muted: #475569; /* slate-600 */
  --color-accent: #ea580c; /* orange-600 */
  --color-accent-subtle: #fff7ed; /* orange-50 */
}

.dark {
  --color-bg: #0a0e14;
  --color-bg-subtle: #0f1420;
  --color-surface: #131a26;
  --color-border: #1e293b; /* slate-800 */
  --color-text: #e2e8f0; /* slate-200 */
  --color-text-muted: #94a3b8; /* slate-400 */
  --color-accent: #fb923c; /* orange-400 */
  --color-accent-subtle: #1c1206;
}
```

Cada bloco especial de conteúdo (seção 6.6 do briefing) tem uma cor de borda própria, sempre com fundo neutro
(`--color-surface`), para não competir com o laranja de destaque de navegação:

| Bloco              | Cor de borda                          |
| ------------------ | ------------------------------------- |
| Definição          | slate (neutro)                        |
| Atenção            | amber-500                             |
| Dica de entrevista | orange (accent)                       |
| Pegadinha          | red-500                               |
| Exemplo financeiro | emerald-500                           |
| Resposta Sênior    | orange (accent), preenchido levemente |
| Erro comum         | red-500, estilo outline               |
| Resumo             | slate, estilo outline                 |
| Comparação         | slate, tabela                         |

## 3. Tipografia

- Fonte de texto: system font stack (`ui-sans-serif, system-ui, ...`) — zero custo de carregamento, ótima
  legibilidade nativa em cada SO.
- Fonte de código: `ui-monospace, "SF Mono", "Cascadia Code", monospace`.
- Corpo de texto: `text-base` (16px) / `leading-relaxed` (1.625) em prosa longa.
- Largura máxima de coluna de leitura: `65ch` (`max-w-prose` customizado) — não a largura da viewport inteira.
- Hierarquia de headings semântica e visível: `h1` só o título da página; `h2` seções de capítulo; `h3`
  subseções. Nunca pular nível.

## 4. Layout

- **Desktop**: três colunas possíveis — sidebar de navegação (esquerda, recolhível), conteúdo central
  (`max-w-prose`), sumário da página "on this page" (direita, opcional, a partir da fase de expansão).
- **Mobile**: sidebar vira drawer acionado pelo header; sumário lateral direito é omitido ou colapsado no
  topo do artigo.
- Header fixo, baixo (altura ~56px), contém: logo/nome do projeto, busca, toggle de tema, link GitHub.
- Espaço em branco generoso: `py-12`/`py-16` entre seções, nunca conteúdo colado nas bordas.

## 5. Componentes de UI (`src/components/ui`)

Conjunto mínimo, sem biblioteca de componentes pesada (sem shadcn completo, sem MUI): Button, Badge, Card,
Callout (base para os blocos de conteúdo), Tabs (para comparações), CopyLinkButton, ThemeToggle,
SearchDialog. Todos construídos com Tailwind + Radix primitives apenas onde acessibilidade exige
(`@radix-ui/react-dialog` para busca/drawer, `@radix-ui/react-tabs` para comparações) — não recriar
comportamento de foco/teclado na mão quando uma primitiva madura resolve com poucos KB.

## 6. Diagramas

Diagramas seguem a mesma paleta neutra + accent — nós em `--color-surface` com borda `--color-border`, setas
em `--color-text-muted`, elemento em destaque (ex.: partition ativa, leader) em `--color-accent`. Mermaid é
configurado com tema customizado (`themeVariables`) para herdar essas cores em vez do tema default.

## 7. Acessibilidade

- Contraste mínimo AA (4.5:1) para texto normal em ambos os temas — validado nos tokens acima.
- Foco visível customizado (`outline: 2px solid var(--color-accent)`), nunca `outline: none` sem substituto.
- Todo ícone interativo tem `aria-label`; navegação usa `<nav>` com `aria-label` distinto (principal, sumário,
  paginação de capítulo).
- Animações de transição de tema/drawer respeitam `prefers-reduced-motion: reduce` (duração 0 ou `auto`).

## 8. Responsividade

Breakpoints padrão do Tailwind (`sm/md/lg/xl`), mobile-first. Sidebar de navegação aparece fixa a partir de
`lg`; abaixo disso, drawer. Nenhum componente deve exigir scroll horizontal na largura de conteúdo (blocos de
código com `overflow-x-auto` próprio).
