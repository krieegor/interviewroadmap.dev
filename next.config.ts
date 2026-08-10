import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx"],
  reactStrictMode: true,
  images: {
    // Export estático não tem servidor pra otimizar imagem sob demanda. As imagens do site são
    // poucas e pequenas (foto de autor, ícones SVG) — não vale trocar por um loader externo.
    unoptimized: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter", "remark-mdx-frontmatter"],
    rehypePlugins: [
      "rehype-slug",
      path.resolve(process.cwd(), "src/lib/mdx/rehype-keep-heading-with-next.mjs"),
    ],
  },
});

export default withMDX(nextConfig);
