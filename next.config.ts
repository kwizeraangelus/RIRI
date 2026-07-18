// next.config.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,


  typescript: {
    ignoreBuildErrors: true,
  },
  
  
  
  images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'pub-9385971443a8400dac08aad37bb4f49c.r2.dev',
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "::1",
        port: "8000",
        pathname: "/media/**",
      },

      {
        protocol: "https",
        hostname: "api.riri.rw",
        port: "",
        pathname: "/uploads/**",
      },
      // ⭐ ADDED: Backup matching for the media prefix path rule
      {
        protocol: "https",
        hostname: "api.riri.rw",
        port: "",
        pathname: "/media/**",
      },
      // ⭐ ADD UNSPLASH SUPPORT
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
