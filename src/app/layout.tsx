import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

// `[locale]/layout.tsx` também define `metadataBase`, mas só cobre rotas sob `/[locale]/**`. Definir
// aqui de novo cobre o resto da árvore (not-found.tsx, error.tsx, e as rotas de imagem
// icon.tsx/opengraph-image.tsx na raiz), que senão resolvem OG/Twitter image contra o fallback do Next
// (`http://localhost:3000`) e disparam o warning "metadataBase property... is not set" no build.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
