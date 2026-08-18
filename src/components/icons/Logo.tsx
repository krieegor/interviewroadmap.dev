// Logo próprio do interviewroadmap.dev: lambda (λ) estilizada, geométrica, inspirada na iconografia
// "hazard stripe" de jogos como Half-Life/Black Mesa, mas com traço e proporções originais
// (não é o símbolo oficial da Valve). Usa currentColor pra herdar a cor de destaque do projeto.
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3.5 6.5 20.5" />
      <path d="M10 12 16.5 20.5" />
    </svg>
  );
}
