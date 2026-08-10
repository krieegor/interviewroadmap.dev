// Copiado manualmente de specs/design-system.md (paleta "dark") — este projeto Remotion é isolado do
// app Next.js (renderiza fora do pipeline dele) e não importa globals.css/Tailwind do site.
// Se a paleta do design system mudar, atualizar aqui também.
export const colors = {
  bg: "#0a0e14",
  bgSubtle: "#0f1420",
  surface: "#131a26",
  border: "#1e293b",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  accent: "#fb923c",
  accentSubtle: "#1c1206",
  success: "#22c55e",
} as const;

export const fontFamily =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
