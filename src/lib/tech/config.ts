export type Tech = "kafka" | "java" | "elastic";

export const techs: Tech[] = ["kafka", "java", "elastic"];

export const defaultTech: Tech = "kafka";

export function isTech(value: string): value is Tech {
  return techs.includes(value as Tech);
}

// Trilhas com conteúdo real hoje. Adicionar "java"/"elastic" aqui — só aqui — quando o
// conteúdo delas existir; todo gate do app lê dessa lista única.
export const techsWithContent: Tech[] = ["kafka"];
