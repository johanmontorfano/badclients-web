import type { NextConfig } from "next";

const withMDX = require("@next/mdx")({
    options: {
        remarkPlugins: [
            ["remark-gfm", { strict: true, throwOnError: true }],
            ["remark-frontmatter"],
            ["remark-mdx-frontmatter"]
        ],
    },
});

const nextConfig: NextConfig = withMDX({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});

export default nextConfig;
