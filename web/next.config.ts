import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
