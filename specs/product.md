# Product Spec — trainer.dev

## 1. O que é

**trainer.dev** é uma plataforma interativa, gratuita e open source, publicada como site estático, de
preparação para entrevistas técnicas — organizada por trilhas de tecnologia. Cada trilha é um e-book
navegável com a mesma estrutura de estudo (capítulos, perguntas de entrevista, glossário, estudos de caso,
simulador).

A trilha **Apache Kafka para Entrevistas Java Sênior** está completa hoje, ensinando Kafka para
desenvolvedores Java Backend (Pleno, Sênior, Tech Lead). **Java**, **Elastic Search**, **SQL**, **AWS** e
**GCP** são trilhas futuras, hoje "em construção" (página própria, sem conteúdo publicado). O restante deste
documento descreve a trilha Kafka em detalhe — o mesmo padrão editorial e estrutural se aplica a qualquer
trilha nova.

Não é uma landing page, não é um curso pago, não é documentação oficial. É um livro técnico navegável na web,
com estrutura de estudo (capítulos, perguntas de entrevista, glossário, estudos de caso, simulador).

## 2. Problema que resolve

Desenvolvedores Java que já usam Kafka em produção frequentemente conseguem "fazer funcionar", mas travam em
entrevistas quando precisam explicar _por que_ o Kafka se comporta de determinada forma — ordenação, rebalance,
exactly-once, idempotência. A documentação oficial é referência de configuração, não material de estudo para
entrevista. Cursos existentes cobram por esse recorte. Este projeto fecha essa lacuna de forma gratuita.

## 3. Público-alvo

- Desenvolvedores Java/Spring Boot Pleno → Sênior → Tech Lead.
- Já trabalham com microsserviços e mensageria básica.
- Não necessariamente administram clusters Kafka (não é conteúdo de operação/SRE).
- Estudando para entrevistas técnicas ou querendo consolidar fundamentos antes de uma promoção.

## 4. Não-objetivos (escopo negativo)

- Não é manual de administração de cluster (Kafka Connect ops, tuning de SO, Zookeeper/KRaft internals profundos).
- Não é curso de Kafka Streams ou ksqlDB (pode ser citado, não é foco).
- Não requer login, banco de dados ou backend pago.
- Não usa depoimentos fictícios nem métricas inventadas.
- Não reivindica vínculo oficial com Apache Kafka, Confluent ou ASF.

## 5. Funcionalidades (visão de produto)

| Área           | Funcionalidade                                                        | Prioridade |
| -------------- | --------------------------------------------------------------------- | ---------- |
| Livro          | Navegação por capítulos/seções, anterior/próximo, URL profunda        | P0         |
| Livro          | Sumário lateral (desktop fixo/recolhível, mobile drawer)              | P0         |
| Leitura        | Progresso local (visitado/concluído/último capítulo)                  | P0         |
| Busca          | Busca local sobre capítulos, perguntas, glossário                     | P1         |
| Tema           | Claro/escuro com persistência e respeito a `prefers-color-scheme`     | P0         |
| Conteúdo       | Blocos MDX especiais (definição, atenção, dica, pegadinha, etc.)      | P0         |
| Diagramas      | Mermaid/SVG/React para os fluxos de arquitetura                       | P0         |
| Perguntas      | 50 perguntas de entrevista, cada uma com URL própria e estrutura fixa | P0         |
| Casos          | 5 estudos de caso financeiros                                         | P1         |
| Simulador      | Simulado local por nível/assunto, sem IA/backend                      | P1         |
| Glossário      | Termos com definição curta/detalhada e cross-links                    | P0         |
| SEO            | Metadata, sitemap, robots, OG, JSON-LD                                | P0         |
| Acessibilidade | Semântica, contraste, teclado, `prefers-reduced-motion`               | P0         |

## 6. Critérios de sucesso

- Um desenvolvedor Sênior consegue estudar as 50 perguntas e sair capaz de defender respostas em entrevista real.
- O site carrega rápido (estático), funciona offline após cache do navegador para conteúdo já visitado, e é
  100% navegável por teclado.
- O projeto pode ser clonado, rodado localmente (`npm install && npm run dev`) e publicado de graça em
  Vercel/Cloudflare Pages/Netlify sem nenhuma chave de API ou serviço pago.
- Contribuidores externos conseguem adicionar um capítulo ou pergunta seguindo `docs/content-authoring.md`
  sem precisar entender o app inteiro.

## 7. Tom editorial

Livro técnico escrito por arquiteto de software experiente, não documentação de referência. Ver
[content-guidelines.md](./content-guidelines.md) para o modelo completo por conceito e por pergunta.
