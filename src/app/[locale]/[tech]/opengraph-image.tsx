import { ImageResponse } from "next/og";
import { getTechConfig } from "@/config/tech";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { isTech, techs, type Tech } from "@/lib/tech/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Necessário com `output: "export"`: sem isso o build trata a rota como potencialmente dinâmica.
export const dynamic = "force-static";

// Gera a tupla completa (locale+tech) "de baixo pra cima" em vez de depender dos params do segmento pai
// (ver nota em perguntas/[slug]/page.tsx e specs/architecture.md seção 14 sobre o bug do Next 16 com
// retorno vazio por combinação de pai). Rotas de imagem de metadata também precisam disso.
export function generateStaticParams() {
  const params: Array<{ locale: Locale; tech: Tech }> = [];
  for (const locale of locales) {
    for (const tech of techs) {
      params.push({ locale, tech });
    }
  }
  return params;
}

export const dynamicParams = false;

export default async function TechOpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}) {
  const { locale: rawLocale, tech: rawTech } = await params;
  // `generateStaticParams` já restringe o build a combinações válidas: fallback só evita erro de tipo.
  const techConfig =
    isLocale(rawLocale) && isTech(rawTech) ? getTechConfig(rawTech, rawLocale) : getTechConfig("kafka", "pt");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0e14",
          color: "#e2e8f0",
          fontSize: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: "#fb923c",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 24, color: "#94a3b8" }}>Gratuito &amp; open source</div>
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 56, fontWeight: 600, maxWidth: 1000 }}>
          {techConfig.name}
        </div>
        <div
          style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#94a3b8", maxWidth: 940 }}
        >
          {techConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
