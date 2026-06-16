import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["mermaid"],
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
