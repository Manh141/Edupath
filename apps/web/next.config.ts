import type { NextConfig } from "next";

const apiGatewayUrl = (
  process.env.NEXT_INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiGatewayUrl}/api/:path*`,
      },
      {
        source: "/gateway/:path*",
        destination: `${apiGatewayUrl}/gateway/:path*`,
      },
    ];
  },
};

export default nextConfig;
