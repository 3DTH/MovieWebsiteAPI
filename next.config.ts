import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'image.tmdb.org', 
      'res.cloudinary.com',
      'img.youtube.com', 
    ],
  },
};

export default nextConfig;
