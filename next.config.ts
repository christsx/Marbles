import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["mermaid"],
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async headers() {
    return [
      {
        source: "/dashboard/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
