import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next's proxy layer (src/proxy.ts, used for admin auth) buffers request
    // bodies and defaults to a 10MB cap — well under the 100MB video upload
    // limit enforced in src/app/api/upload/route.ts, so larger videos were
    // silently truncated before ever reaching that check. Raised with a
    // little headroom above 100MB for multipart/form-data overhead.
    middlewareClientMaxBodySize: "120mb",
  },
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
      {
        protocol: "https",
        hostname: "shiwa-krishi-farm-media.s3.ap-south-1.amazonaws.com",
        pathname: "/hero/**",
      },
      {
        protocol: "https",
        hostname: "shiwa-krishi-farm-media.s3.ap-south-1.amazonaws.com",
        pathname: "/categories/**",
      },
    ],
  },
};

export default nextConfig;