import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Necessário com `output: "export"`: sem isso o build trata a rota como potencialmente dinâmica.
export const dynamic = "force-static";

export default async function OpengraphImage() {
  return new ImageResponse(
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
      <div style={{ display: "flex", marginTop: 32, fontSize: 56, fontWeight: 600, maxWidth: 960 }}>
        {siteConfig.name}
      </div>
      <div
        style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#94a3b8", maxWidth: 900 }}
      >
        {siteConfig.description}
      </div>
    </div>,
    { ...size },
  );
}
