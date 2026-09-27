import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ❌ REMOVED trailingSlash to kill the infinite loop

  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
       { protocol: 'https', hostname: 'pub-9385971443a8400dac08aad37bb4f49c.r2.dev' },
       { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
       { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
       { protocol: "http", hostname: "::1", port: "8000", pathname: "/media/**" },
       { protocol: "https", hostname: "api.riri.rw", port: "", pathname: "/uploads/**" },
       { protocol: "https", hostname: "api.riri.rw", port: "", pathname: "/media/**" },
       { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" },
    ],
  },

  // 🌟 CLEAN REWRITE: Catches both with and without trailing slashes safely
  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: "https://riri.rw*", 
      },
    ];
  }
};

export default nextConfig;
