import type { Tech } from "@/lib/tech/config";

// Ícones próprios e simples (linha, currentColor) — não são os logos oficiais de cada tecnologia,
// só um glifo que ajuda a identificar a trilha visualmente no seletor.
export function TechIcon({ tech, className }: { tech: Tech; className?: string }) {
  switch (tech) {
    case "kafka":
      return (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <circle cx="5" cy="12" r="2.2" />
          <circle cx="19" cy="5" r="2.2" />
          <circle cx="19" cy="19" r="2.2" />
          <path d="M7 11l10-4.5M7 13l10 4.5" />
        </svg>
      );
    case "java":
      return (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <path d="M5 10h11v4a5.5 5.5 0 0 1-5.5 5.5h0A5.5 5.5 0 0 1 5 14v-4Z" />
          <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
          <path d="M9 4c-1 1-1 2 0 3M13 4c-1 1-1 2 0 3" />
        </svg>
      );
    case "elastic":
      return (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
      );
  }
}
