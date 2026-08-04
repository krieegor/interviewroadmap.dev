import type { ReactNode } from "react";
import { Callout } from "./Callout";

type BlockProps = { children: ReactNode; title?: string };

export function Definicao({ children, title = "Definição" }: BlockProps) {
  return (
    <Callout title={title} tone="neutral">
      {children}
    </Callout>
  );
}

export function Atencao({ children, title = "Atenção" }: BlockProps) {
  return (
    <Callout title={title} tone="amber">
      {children}
    </Callout>
  );
}

export function DicaEntrevista({ children, title = "Dica de entrevista" }: BlockProps) {
  return (
    <Callout title={title} tone="accent">
      {children}
    </Callout>
  );
}

export function Pegadinha({ children, title = "Pegadinha" }: BlockProps) {
  return (
    <Callout title={title} tone="red">
      {children}
    </Callout>
  );
}

export function ExemploFinanceiro({ children, title = "Exemplo financeiro" }: BlockProps) {
  return (
    <Callout title={title} tone="emerald">
      {children}
    </Callout>
  );
}

export function RespostaCurta({ children, title = "Resposta rápida" }: BlockProps) {
  return (
    <Callout title={title} tone="neutral">
      {children}
    </Callout>
  );
}

export function RespostaSenior({ children, title = "Resposta nível Sênior" }: BlockProps) {
  return (
    <Callout title={title} tone="accent">
      {children}
    </Callout>
  );
}

export function ErroComum({ children, title = "Erro comum" }: BlockProps) {
  return (
    <Callout title={title} tone="red">
      {children}
    </Callout>
  );
}

export function Resumo({ children, title = "Resumo" }: BlockProps) {
  return (
    <Callout title={title} tone="neutral">
      {children}
    </Callout>
  );
}

export function PerguntaDerivada({ children, title = "Pode vir a seguir" }: BlockProps) {
  return (
    <Callout title={title} tone="accent">
      {children}
    </Callout>
  );
}
