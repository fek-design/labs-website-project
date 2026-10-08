import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "*.local",
        "*.local:3000",
        "192.168.*",
        "10.*",
        "172.16.*",
      ],
    },
  },
};

export default nextConfig;
