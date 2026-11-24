import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 1920 covers the header on a wide screen. 3840 is intentionally absent.
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384, 480],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
