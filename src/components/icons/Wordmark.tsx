// Logotipo em texto do interviewroadmap.dev — separa ".dev" do resto do nome (cor de destaque, peso
// mais leve) pra não ler como uma URL solta ao lado do Logo. Tamanho/peso do resto do nome herdam do
// contexto (header pequeno vs. H1 do hero). "InterviewRoadmap" reage a group-hover — inofensivo onde não
// há um ancestral `group` (ex.: o `<span>` estático da home), só ativa dentro de um `<Link>` clicável.
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="transition-colors group-hover:text-[var(--color-accent)]">
        InterviewRoadmap
      </span>
      <span className="font-normal text-[var(--color-accent)]">.dev</span>
    </span>
  );
}
