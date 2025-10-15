import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  /* config options here */
    images: {
    remotePatterns: [
       {
        protocol: 'https', // or 'http'
        hostname: 'trailcourses.s3.ap-south-1.amazonaws.com', // Your S3 bucket domain
        port: '',
        pathname: '/**', // Use '**' to allow any path, or specify a path
      },
     
     
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
