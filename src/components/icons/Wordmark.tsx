// Logotipo em texto do interviewroadmap.dev — separa ".dev" do resto do nome (cor de destaque, peso
// mais leve) pra não ler como uma URL solta ao lado do Logo. Tamanho/peso do resto do nome herdam do
// contexto (header pequeno vs. H1 do hero).
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      InterviewRoadmap<span className="font-normal text-[var(--color-accent)]">.dev</span>
    </span>
  );
}
