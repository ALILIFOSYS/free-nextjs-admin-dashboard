import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  /* config options here */
    images: {
    domains: [
      'trailcourses.s3.ap-south-1.amazonaws.com', // Your S3 bucket domain
      // Add other domains as needed
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
