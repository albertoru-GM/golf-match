import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      { protocol: 'https', hostname: 'valderrama.com' },
      { protocol: 'https', hostname: 'www.realclubdegolfelprat.com' },
      { protocol: 'https', hostname: 'www.esmadrid.com' },
      { protocol: 'http', hostname: 'centronacionalgolf.com' },
      { protocol: 'https', hostname: 'www.ccvm.es' },
      { protocol: 'https', hostname: 'www.rcph.es' },
      { protocol: 'https', hostname: 'www.golfpark.es' },
      { protocol: 'https', hostname: 'www.golflamoraleja.com' },
      { protocol: 'https', hostname: 'www.rshecc.es' },
      { protocol: 'https', hostname: 'www.golfretamares.com' },
      { protocol: 'https', hostname: 'www.encingolf.com' },
    ],
  },
};

export default nextConfig;
