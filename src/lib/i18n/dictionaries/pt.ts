export const pt = {
  skipToContent: "Pular para o conteúdo principal",
  nav: {
    livro: "Livro",
    perguntas: "Perguntas",
    casos: "Casos",
    glossario: "Glossário",
    simulador: "Simulador",
    sobre: "Sobre",
  },
  header: {
    githubLabel: "Repositório no GitHub",
    searchButton: "Buscar",
    mobileMenuLabel: "Abrir menu de navegação",
    mobileMenuTitle: "Navegação",
    mainNavLabel: "Navegação principal",
    mobileNavLabel: "Navegação principal (mobile)",
  },
  localeSwitcher: {
    label: "Idioma",
    pt: "Português",
    en: "English",
  },
  theme: {
    enableLight: "Ativar tema claro",
    enableDark: "Ativar tema escuro",
  },
  search: {
    dialogTitle: "Buscar no conteúdo",
    placeholder: "Buscar capítulos, perguntas e termos...",
    noResults: 'Nada encontrado para "{query}".',
    typeChapter: "Capítulo",
    typeQuestion: "Pergunta",
    typeTerm: "Termo",
  },
  footer: {
    disclaimer:
      "é um material gratuito e open source. Não possui vínculo oficial com Apache Kafka, Confluent ou Apache Software Foundation.",
    sobre: "Sobre",
    github: "GitHub",
  },
  copyLink: {
    copy: "Copiar link",
    copied: "Link copiado!",
  },
  chapterPager: {
    ariaLabel: "Paginação de capítulos",
    previous: "Anterior",
    next: "Próximo",
  },
  chapterProgress: {
    completed: "Concluído",
    markCompleted: "Marcar como concluído",
  },
  bookSidebar: {
    ariaLabel: "Sumário do livro",
    mobileSummary: "Sumário do livro",
  },
  toc: {
    title: "Nesta página",
    mobileTitle: "Nesta página",
  },
  notFound: {
    errorLabel: "Erro 404",
    title: "Página não encontrada",
    description: "O conteúdo que você procura pode ter sido movido, renomeado ou ainda não foi publicado.",
    home: "Voltar para a home",
    book: "Ir para o livro",
  },
  home: {
    badge: "Gratuito & open source",
    intro:
      "Para quem já trabalha com Java, Spring Boot e microsserviços, tem contato básico ou intermediário com mensageria e está se preparando para entrevistas técnicas de nível Pleno, Sênior ou Tech Lead — sem precisar administrar clusters Kafka para tirar proveito do conteúdo.",
    ctaStart: "Começar a estudar",
    ctaQuestions: "Ver as 50 perguntas",
    ctaSimulate: "Simular entrevista",
    summaryTitle: "Sumário do livro",
    seeSummary: "Ver sumário completo →",
    conceptsTitle: "Principais conceitos",
    coreConcepts: [
      "Partitions e ordenação",
      "Consumer Groups e rebalance",
      "Offset e commit",
      "Retention e replay",
      "Retry e DLQ",
      "Idempotência",
      "Garantias de entrega",
      "Outbox pattern",
    ],
    openSourceText:
      "Este material é 100% gratuito, sem cadastro e sem paywall. O código-fonte é aberto — contribuições de conteúdo e correções são bem-vindas.",
    githubCta: "Ver no GitHub →",
  },
  livroIndex: {
    title: "O livro",
    description: "Sumário completo de {siteName}, organizado por partes e capítulos.",
    intro:
      "Organizado em partes progressivas, dos fundamentos à observabilidade em produção. Cada capítulo pode ser lido de forma independente, mas a ordem abaixo é a recomendada para quem está começando.",
    downloadPdf: "Baixar PDF (pronto para impressão)",
    empty: "Os capítulos ainda estão sendo publicados.",
  },
  perguntasIndex: {
    title: "Perguntas de entrevista",
    description:
      "As perguntas de entrevista sobre Apache Kafka mais comuns para desenvolvedores Java, com resposta rápida e resposta nível sênior — {siteName}.",
    intro:
      "50 perguntas reais de entrevista sobre Kafka, cada uma com objetivo do entrevistador, resposta rápida, resposta nível sênior, explicação aprofundada, exemplo financeiro e pegadinhas comuns.",
    empty: "As perguntas ainda estão sendo publicadas.",
    questionLabel: "Pergunta {id}",
  },
  perguntaDetail: {
    questionOf: "Pergunta {id} de 50",
    relatedChapters: "Capítulos relacionados",
    paginationAriaLabel: "Paginação de perguntas",
    previous: "Anterior",
    next: "Próxima",
  },
  casosIndex: {
    title: "Estudos de caso",
    description:
      "Estudos de caso reais de sistemas financeiros orientados a eventos com Apache Kafka — {siteName}.",
    intro:
      "Cenários fim-a-fim de sistemas financeiros, amarrando topologia de tópicos, escolha de key, idempotência, retry, DLQ, replay e observabilidade.",
    empty: "Os estudos de caso ainda estão sendo publicados.",
  },
  casoDetail: {
    relatedChapters: "Capítulos relacionados",
  },
  glossarioIndex: {
    title: "Glossário",
    description:
      "Termos essenciais de Apache Kafka, com definição curta, definição detalhada e relação com outros conceitos — {siteName}.",
    intro: "Termos essenciais do Kafka. O glossário não substitui os capítulos — ele aponta para eles.",
    indexAriaLabel: "Índice de termos",
    empty: "O glossário ainda está sendo publicado.",
    relatedLabel: "Relacionado:",
    seeChapter: "Ver capítulo →",
  },
  glossarioDetail: {
    relatedTerms: "Termos relacionados",
    relatedChapters: "Capítulos relacionados",
    previous: "Anterior",
    next: "Próximo",
  },
  simuladorPage: {
    title: "Simulador de entrevista",
    description:
      "Simule uma entrevista técnica de Kafka: escolha nível e assunto, responda e veja seu resultado.",
    intro:
      "Escolha o nível e o assunto, responda cada pergunta antes de revelar a resposta, e marque honestamente como foi. O resultado fica só no seu navegador.",
  },
  simulator: {
    configureTitle: "Configure seu simulado",
    levelLabel: "Nível",
    allLevels: "Todos",
    topicLabel: "Assunto",
    allTopics: "Todos",
    modeLabel: "Modo",
    modeLabels: {
      aberta: "Aberta",
      "multipla-escolha": "Múltipla escolha",
    },
    modeDescriptions: {
      aberta: "Você precisa explicar o conceito em voz alta antes de revelar a resposta.",
      "multipla-escolha":
        "Escolha a alternativa certa entre 4 opções, estilo Enem, para validar rapidamente o que você sabe.",
    },
    startButton: "Iniciar simulado",
    noQuestionsFound: "Nenhuma pergunta encontrada para esse filtro.",
    back: "Voltar",
    resultTitle: "Resultado",
    questionsCount: "{count} pergunta(s) —",
    allLevelsResult: "todos os níveis",
    correct: "Acertei",
    partial: "Parcial",
    unknown: "Não sabia",
    restart: "Reiniciar",
    questionOf: "Pergunta {index} de {total}",
    revealAnswer: "Revelar resposta",
    seeFullAnswer: "Ver resposta completa →",
    nextQuestion: "Próxima",
    closeAnswerPanel: "Fechar",
    levelLabels: {
      pleno: "Pleno",
      senior: "Sênior",
      "tech-lead": "Tech Lead",
    },
  },
  simulatorHistory: {
    title: "Seu histórico",
    testsDone: "Simulados feitos",
    questionsAnswered: "Perguntas respondidas",
    overallAccuracy: "Acurácia geral",
    byTopic: "Por assunto",
    correctSuffix: "certas",
    partialSuffix: "parciais",
    unknownSuffix: "não sabia",
    allLevels: "Todos os níveis",
    allTopics: "Todos os assuntos",
  },
  sobre: {
    title: "Sobre o projeto",
    intro1:
      "é um material gratuito e de código aberto, criado com o objetivo de ajudar desenvolvedores Java Backend a se prepararem para entrevistas técnicas sobre Apache Kafka — dos fundamentos de arquitetura até garantias de entrega, idempotência e observabilidade.",
    intro2:
      "O conteúdo não substitui a documentação oficial do Apache Kafka nem a experiência prática de operar o sistema em produção. Ele existe para consolidar e organizar o conhecimento necessário para explicar esses conceitos com segurança em uma entrevista — e, por consequência, no dia a dia de quem já trabalha com a ferramenta.",
    intro3:
      "Contribuições são bem-vindas: correções técnicas, novos capítulos, novas perguntas de entrevista ou melhorias de acessibilidade e design podem ser propostas diretamente no repositório do projeto.",
    trademarkDisclaimer:
      'Este projeto não possui vínculo oficial com a Apache Software Foundation, com o Apache Kafka ou com a Confluent. "Apache Kafka" e "Kafka" são marcas da Apache Software Foundation.',
    authorTitle: "Autor",
    authorPlaceholder:
      "Espaço reservado para o autor adicionar nome, LinkedIn, GitHub, site pessoal e uma breve apresentação profissional em src/config/site.ts.",
    linkedin: "LinkedIn",
    github: "GitHub",
    personalSite: "Site pessoal",
  },
  readingProgress: {
    yourProgress: "Seu progresso",
    chaptersCompleted: "{completed} de {total} capítulos concluídos ({percent}%)",
    continueReading: "Continuar de onde parou →",
  },
};

export type Dictionary = typeof pt;
