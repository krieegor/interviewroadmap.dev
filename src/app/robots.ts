import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Necessário com `output: "export"`: sem isso o build trata a rota como potencialmente dinâmica.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
