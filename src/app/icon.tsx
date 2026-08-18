import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
// Necessário com `output: "export"`: sem isso o build trata a rota como potencialmente dinâmica.
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0e14",
        borderRadius: 6,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 6 9 26" stroke="#fb923c" strokeWidth="4" />
        <path d="M13 16 21 26" stroke="#fb923c" strokeWidth="4" />
      </svg>
    </div>,
    { ...size },
  );
}
