import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Card srcset: 480 and 600 for the layout, 1200 for 2×. The img src is the
    // largest of these, so it cannot fall back to a 3840px file.
    deviceSizes: [600, 1200],
    imageSizes: [480],
  },
};

export default nextConfig;
