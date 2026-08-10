import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Necessário com `output: "export"` — sem isso o build trata a rota como potencialmente dinâmica.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e14",
    theme_color: "#ea580c",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
