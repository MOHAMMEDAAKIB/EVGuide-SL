import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  
  // Allow cross-origin requests from local network IPs during development
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Allow access from local network IPs (e.g., 192.168.x.x, 172.x.x.x)
    'http://192.168.*',
    'http://172.19.*',
    'http://10.*',
  ],
};

export default nextConfig;
