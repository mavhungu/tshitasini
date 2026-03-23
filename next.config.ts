import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
    experimental: {
    // Required to enable "use cache" directive,
    // cacheTag() and cacheLife() in Next.js 16
  },
  images: {
    remotePatterns: [
      // Vercel Blob CDN — uploaded product images
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // Placeholder services for development
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ]
  }
};

export default nextConfig;
