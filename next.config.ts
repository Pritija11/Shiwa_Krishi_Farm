import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shiwa-krishi-farm-images.s3.ap-south-1.amazonaws.com",
        pathname: "/products/**",
      },
    ],
  },
};

export default nextConfig;