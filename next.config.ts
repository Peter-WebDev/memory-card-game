import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'test' ? '.test' : '.next',
  serverExternalPackages: ['@prisma/client'],
  outputFileTracingIncludes: {
    '/': ['./generated/prisma/**/*'],
    '/api/assets': ['./generated/prisma/**/*'],
  },
  images: {
    // The Food & Drink icons are SVGs (self-hosted in public/icons/food),
    // which next/image only optimizes when SVG is explicitly allowed. The CSP
    // keeps them inert.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.dog.ceo',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.thecatapi.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
