import type { Dictionary } from "./pt";

export const en: Dictionary = {
  skipToContent: "Skip to main content",
  nav: {
    livro: "Book",
    perguntas: "Questions",
    casos: "Case studies",
    glossario: "Glossary",
    simulador: "Simulator",
    sobre: "About",
  },
  breadcrumbs: {
    ariaLabel: "Breadcrumb",
    home: "Home",
  },
  header: {
    githubLabel: "GitHub repository",
    searchButton: "Search",
    mobileMenuLabel: "Open navigation menu",
    mobileMenuTitle: "Navigation",
    mainNavLabel: "Main navigation",
    mobileNavLabel: "Main navigation (mobile)",
  },
  localeSwitcher: {
    label: "Language",
    pt: "Português",
    en: "English",
  },
  theme: {
    enableLight: "Switch to light theme",
    enableDark: "Switch to dark theme",
  },
  search: {
    dialogTitle: "Search content",
    placeholder: "Search chapters, questions and terms...",
    noResults: 'Nothing found for "{query}".',
    typeChapter: "Chapter",
    typeQuestion: "Question",
    typeTerm: "Term",
  },
  footer: {
    disclaimer:
      "is free, open source material. It has no official affiliation with Apache Kafka, Confluent, the Apache Software Foundation, Elastic NV, Oracle, Amazon Web Services (AWS), or Google Cloud.",
    sobre: "About",
    github: "GitHub",
    viewRelease: "View {tag} on GitHub",
  },
  copyLink: {
    copy: "Copy link",
    copied: "Link copied!",
  },
  chapterPager: {
    ariaLabel: "Chapter pagination",
    previous: "Previous",
    next: "Next",
  },
  chapterProgress: {
    completed: "Completed",
    markCompleted: "Mark as completed",
  },
  bookSidebar: {
    ariaLabel: "Book contents",
    mobileSummary: "Book contents",
  },
  toc: {
    title: "On this page",
    mobileTitle: "On this page",
  },
  notFound: {
    errorLabel: "Error 404",
    title: "Page not found",
    description: "The content you're looking for may have been moved, renamed, or not published yet.",
    home: "Back to home",
    book: "Go to the book",
  },
  home: {
    badge: "Free & open source",
    ctaStart: "Start studying",
    ctaQuestions: "See the 50 questions",
    ctaSimulate: "Simulate an interview",
    summaryTitle: "Book contents",
    seeSummary: "See full contents →",
    conceptsTitle: "Core concepts",
    openSourceText:
      "This material is 100% free, with no signup and no paywall. The source code is open — content contributions and fixes are welcome.",
    githubCta: "See on GitHub →",
  },
  livroIndex: {
    title: "The book",
    description: "Full table of contents of {siteName}, organized by parts and chapters.",
    intro:
      "Organized into progressive parts, from fundamentals to production observability. Each chapter can be read independently, but the order below is recommended for beginners.",
    downloadPdf: "Download PDF (print-ready)",
    empty: "Chapters are still being published.",
  },
  perguntasIndex: {
    title: "Interview questions",
    description:
      "The most common Apache Kafka interview questions for Java developers, with a quick answer and a senior-level answer — {siteName}.",
    intro:
      "50 real Kafka interview questions, each with the interviewer's goal, a quick answer, a senior-level answer, an in-depth explanation, a financial example, and common pitfalls.",
    empty: "Questions are still being published.",
    questionLabel: "Question {id}",
  },
  perguntaDetail: {
    questionOf: "Question {id} of 50",
    relatedChapters: "Related chapters",
    paginationAriaLabel: "Question pagination",
    previous: "Previous",
    next: "Next",
  },
  casosIndex: {
    title: "Case studies",
    description:
      "Real-world case studies of event-driven financial systems built with Apache Kafka — {siteName}.",
    intro:
      "End-to-end financial system scenarios, tying together topic topology, key choice, idempotency, retry, DLQ, replay, and observability.",
    empty: "Case studies are still being published.",
  },
  casoDetail: {
    relatedChapters: "Related chapters",
  },
  glossarioIndex: {
    title: "Glossary",
    description:
      "Essential Apache Kafka terms, with short and detailed definitions and how they relate to other concepts — {siteName}.",
    intro: "Essential Kafka terms. The glossary doesn't replace the chapters — it points to them.",
    indexAriaLabel: "Term index",
    empty: "The glossary is still being published.",
    relatedLabel: "Related:",
    seeChapter: "See chapter →",
  },
  glossarioDetail: {
    relatedTerms: "Related terms",
    relatedChapters: "Related chapters",
    previous: "Previous",
    next: "Next",
  },
  simuladorPage: {
    title: "Interview simulator",
    description: "Simulate a Kafka technical interview: pick a level and topic, answer, and see your result.",
    intro:
      "Choose the level and topic, answer each question before revealing the answer, and honestly mark how you did. The result stays only in your browser.",
  },
  simulator: {
    configureTitle: "Set up your practice run",
    levelLabel: "Level",
    allLevels: "All",
    topicLabel: "Topic",
    allTopics: "All",
    questionCountLabel: "Number of questions",
    modeLabel: "Mode",
    modeLabels: {
      aberta: "Open-ended",
      "multipla-escolha": "Multiple choice",
    },
    modeDescriptions: {
      aberta: "You have to explain the concept out loud before revealing the answer.",
      "multipla-escolha":
        "Pick the correct option out of 4 choices, ENEM-style, to quickly validate what you know.",
    },
    startButton: "Start practice run",
    noQuestionsFound: "No questions found for this filter.",
    back: "Back",
    resultTitle: "Result",
    questionsCount: "{count} question(s) —",
    allLevelsResult: "all levels",
    totalTime: "total time {time}",
    correct: "Got it",
    partial: "Partial",
    unknown: "Didn't know",
    restart: "Restart",
    questionOf: "Question {index} of {total}",
    revealAnswer: "Reveal answer",
    seeFullAnswer: "See full answer →",
    nextQuestion: "Next",
    closeAnswerPanel: "Close",
    levelLabels: {
      pleno: "Mid-level",
      senior: "Senior",
      "tech-lead": "Tech Lead",
    },
  },
  simulatorHistory: {
    title: "Your history",
    testsDone: "Practice runs done",
    questionsAnswered: "Questions answered",
    overallAccuracy: "Overall accuracy",
    byTopic: "By topic",
    correctSuffix: "correct",
    partialSuffix: "partial",
    unknownSuffix: "didn't know",
    allLevels: "All levels",
    allTopics: "All topics",
  },
  sobre: {
    title: "About the project",
    intro1:
      "is free, open source material created to help Java Backend developers prepare for Apache Kafka technical interviews — from architecture fundamentals to delivery guarantees, idempotency, and observability.",
    intro2:
      "This content doesn't replace the official Apache Kafka documentation or the hands-on experience of running the system in production. It exists to consolidate and organize the knowledge needed to explain these concepts confidently in an interview — and, as a result, in the day-to-day work of anyone already using the tool.",
    intro3:
      "Contributions are welcome: technical corrections, new chapters, new interview questions, or accessibility and design improvements can be proposed directly in the project's repository.",
    trademarkDisclaimer:
      'This project has no official affiliation with the Apache Software Foundation, Apache Kafka, Confluent, Elastic NV, Oracle, Amazon Web Services, or Google Cloud. "Apache Kafka" and "Kafka" are trademarks of the Apache Software Foundation; "Elasticsearch" is a trademark of Elastic NV; "Java" and "Oracle" are trademarks of Oracle Corporation; "AWS" and "Amazon Web Services" are trademarks of Amazon.com, Inc.; "Google Cloud" and "GCP" are trademarks of Google LLC.',
    authorTitle: "Author",
    authorPlaceholder:
      "Placeholder for the author to add name, LinkedIn, GitHub, personal site and a short professional bio in src/config/site.ts.",
    linkedin: "LinkedIn",
    github: "GitHub",
    personalSite: "Personal site",
  },
  readingProgress: {
    yourProgress: "Your progress",
    chaptersCompleted: "{completed} of {total} chapters completed ({percent}%)",
    continueReading: "Continue where you left off →",
  },
  trackSelector: {
    badge: "Free & open source",
    heroIntro:
      "A free, open-source technical interview prep platform. Every technology track follows the same format: a navigable book, real interview questions, a glossary, and a practice simulator — no paid course, no sign-up, no ads.",
    tracksLabel: "Tracks",
    heroCaptionProducer: "Producer",
    heroCaptionPartitions: "Partitions keep the order",
    heroCaptionConsumerGroup: "Consumer Group distributes the processing",
    heroPrevStep: "Previous step",
    heroNextStep: "Next step",
    heroGoToStep: "Go to step",
    howItWorksTitle: "The same format, every track",
    featureBookTitle: "Like a real book",
    featureBookDescription:
      "Chapters organized into progressive parts, covering what actually comes up in interviews.",
    featureQuestionsTitle: "Interview questions",
    featureQuestionsDescription:
      "Each question with a quick answer, a senior-level answer, an in-depth explanation, and common pitfalls.",
    featureGlossaryTitle: "Glossary",
    featureGlossaryDescription:
      "Essential terms with short and detailed definitions, linked back to the chapters where they appear.",
    featureSimulatorTitle: "Simulator",
    featureSimulatorDescription:
      "Practice at your own pace — open-ended mode (explain out loud) or multiple choice, everything saved only in your browser.",
    title: "Choose your track",
    intro: "interviewroadmap.dev is a free, open-source technical interview prep platform, organized by technology.",
    availableBadge: "Available - Access now!",
    unavailableBadge: "Unavailable",
    unavailableBadgeSuffix: "Coming soon!",
    openSourceText: "This project is free and open source. Contributions are welcome.",
    githubCta: "View on GitHub",
  },
  comingSoon: {
    title: "Under construction",
    message: "This track doesn't have published content yet. Check back soon.",
    backToSelector: "← Choose another track",
  },
  trackSwitcher: {
    backToSelector: "← Switch track",
  },
};
