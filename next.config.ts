import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's default optimization quality (75) was visibly softening product
    // photos in the grid/card views. 90 keeps them crisp while still
    // benefiting from responsive resizing and modern-format conversion.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shiwa-krishi-farm-media.s3.ap-south-1.amazonaws.com",
        pathname: "/products/**",
      },
      {
        protocol: "https",
        hostname: "shiwa-krishi-farm-media.s3.ap-south-1.amazonaws.com",
        pathname: "/gallery/**",
      },
    ],
  },
};

export default nextConfig;