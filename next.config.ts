import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. Permiso para las imágenes de tu base de datos (Supabase)
      {
        protocol: 'https',
        hostname: '**.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 2. NUEVO: Permiso para las imágenes del carrusel temporal (Unsplash)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;