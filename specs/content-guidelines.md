# Content Guidelines — Apache Kafka para Entrevistas Java Sênior

Este documento é a referência editorial. Todo capítulo, pergunta, termo de glossário ou estudo de caso deve
seguir estas regras. Não é um resumo de configuração do Kafka — é um livro técnico.

## 1. Voz e tom

- Escrito como um arquiteto de software sênior explicando para um colega capaz, não como um manual.
- Direto, sem enrolação, sem adjetivos vazios ("incrível", "poderoso", "simplesmente").
- Assume que o leitor programa em Java/Spring Boot e conhece microsserviços — não explique o que é uma API REST.
- Não assume que o leitor conhece jargão interno do Kafka — todo termo é definido na primeira aparição do
  capítulo (ou linkado ao glossário).
- Kafka nunca é tratado como "só uma fila". Sempre que essa comparação aparecer, é para explicar por que ela
  está errada.
- Afirmações absolutas são evitadas sem contexto ("Kafka garante ordenação" está incompleto; a versão correta é
  "Kafka garante ordenação dentro de uma partition").

## 2. Os 10 pontos obrigatórios por conceito

Para cada conceito central de um capítulo, cubra, na ordem que fizer sentido para o texto fluir (não precisa
ser lista numerada no texto final):

1. O que é.
2. Por que existe (que problema motivou sua criação).
3. Qual problema resolve na prática.
4. Como funciona.
5. Quando utilizar.
6. Quando não utilizar.
7. Quais limitações possui.
8. Como aparece em entrevistas (o que o entrevistador costuma perguntar/testar).
9. Como se relaciona com Java e Spring Boot.
10. Como aparece em sistemas reais (preferencialmente exemplo financeiro).

## 3. Exemplos de domínio

Priorize exemplos financeiros ao ilustrar conceitos: PIX, cartões, pagamentos, contas, boletos, faturas,
contratos, benefícios, integrações bancárias, processamento em lote, alta volumetria. Isso não é decoração —
é o que torna o conceito memorizável e aplicável em entrevista.

## 4. Blocos de conteúdo (componentes MDX)

Cada capítulo/pergunta deve usar os blocos relevantes de `src/components/content`:

| Componente            | Uso                                                        |
| --------------------- | ---------------------------------------------------------- |
| `<Definicao>`         | Definição formal e enxuta de um termo                      |
| `<Atencao>`           | Alerta sobre erro comum ou limitação importante            |
| `<DicaEntrevista>`    | O que dizer/observar em entrevista                         |
| `<Pegadinha>`         | Resposta comum incorreta e por que está errada             |
| `<ExemploFinanceiro>` | Cenário bancário/pagamento ilustrando o conceito           |
| `<RespostaCurta>`     | Resposta de 20-40s, direta                                 |
| `<RespostaSenior>`    | Resposta completa, natural, nível sênior                   |
| `<ErroComum>`         | Erro de implementação real (não de resposta de entrevista) |
| `<Resumo>`            | Fechamento do capítulo/seção                               |
| `<Comparacao>`        | Tabela ou bloco comparando abordagens/ferramentas          |
| `<Diagrama>`          | Wrapper para diagramas (SVG/React/Mermaid)                 |
| `<PerguntaDerivada>`  | Pergunta de follow-up que a resposta costuma gerar         |

Não invente blocos novos sem necessidade — reuse os 12 acima.

## 5. Estrutura obrigatória de uma pergunta de entrevista

Cada MDX em `src/content/questions` segue esta ordem de seções:

1. **Pergunta** — texto literal como um entrevistador perguntaria.
2. **O que o entrevistador quer avaliar** — o objetivo oculto por trás da pergunta.
3. **Resposta rápida** (`<RespostaCurta>`) — 20 a 40 segundos falados.
4. **Resposta nível Sênior** (`<RespostaSenior>`) — resposta completa e natural.
5. **Explicação aprofundada** — o conceito em detalhe, seguindo os 10 pontos da seção 2 quando aplicável.
6. **Exemplo financeiro** (`<ExemploFinanceiro>`).
7. **Pegadinhas** (`<Pegadinha>`) — respostas erradas comuns.
8. **Perguntas derivadas** (`<PerguntaDerivada>`) — 2 a 4 perguntas de follow-up, linkadas quando já existirem.

Nenhuma pergunta pode pular direto da "resposta rápida" para "pegadinhas" sem a explicação aprofundada — o
objetivo é estudo real, não flashcard.

Além das seções acima, o frontmatter de cada pergunta deve incluir um campo `quiz` com exatamente 4
alternativas (`options`) e o índice 0-based da correta (`correctIndex`). Os 3 distratores devem ser
plausíveis — idealmente derivados das `<Pegadinha>` da própria pergunta, reescritas em tamanho e registro
similares ao da alternativa correta — nunca óbvios ou absurdos. Isso alimenta o modo "múltipla escolha" do
simulador; o modo "aberta" continua sendo a forma primária de estudo.

## 6. Estrutura de um capítulo

1. Abertura contextual (por que este capítulo importa, o que o leitor vai conseguir fazer depois de lê-lo).
2. Desenvolvimento dos conceitos, cobrindo os 10 pontos da seção 2.
3. Pelo menos um `<Diagrama>`.
4. Pelo menos um `<ExemploFinanceiro>`.
5. `<Resumo>` de fechamento.
6. (Opcional) `<PerguntaDerivada>` linkando para perguntas relacionadas em `/perguntas`.

## 7. Estudos de caso

Cada estudo de caso narra um cenário fim-a-fim (ex.: PIX recebido) cobrindo topologia de tópicos, escolha de
key/partition, estratégia de idempotência, retry/DLQ, replay e observabilidade — sempre amarrado aos capítulos
correspondentes via link.

## 8. Glossário

Cada termo tem: definição curta (1-2 frases, para tooltip/preview), definição detalhada (parágrafo),
relação com outros termos (lista de termos relacionados) e link para o(s) capítulo(s) onde é explicado em
profundidade. Glossário não repete o capítulo — aponta para ele.

## 9. O que evitar

- Linguagem robótica ou "traduzida" da documentação oficial.
- Excesso de adjetivos e frases de efeito.
- Frases genéricas que serviriam para qualquer tecnologia ("é muito usado no mercado").
- Conteúdo superficial — se um ponto dos 10 obrigatórios não pode ser respondido em uma frase honesta, é sinal
  de que falta profundidade, não de que o ponto deve ser pulado.
- Repetição desnecessária entre capítulos (linke, não copie).
- Conteúdo copiado de livros, cursos ou documentação — tudo é original.
- Atribuir experiências profissionais fictícias ao autor.

## 10. Diagramas obrigatórios (catálogo mínimo)

Producer → Topic → Partition → Consumer; cluster multi-broker; Leader/Follower; Consumer Group; Rebalance;
Replay; Offset; Commit; DLQ; Retry; Idempotência; Outbox Pattern; fluxo financeiro orientado a eventos.
