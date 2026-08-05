import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  reactStrictMode: true,
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
