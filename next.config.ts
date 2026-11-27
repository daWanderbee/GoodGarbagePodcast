import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // ponytail: Vercel's optimizer quota ran out (402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED),
    // so images are served as-is. Keep public/ images pre-compressed (WebP).
    unoptimized: true,
    // Episode artwork: YouTube thumbnails, with the podcast host's show art as fallback.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "d3t3ozftmdmh3i.cloudfront.net" },
    ],
  },
};

export default nextConfig;
