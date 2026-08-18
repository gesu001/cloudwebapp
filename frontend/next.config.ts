import type { NextConfig } from "next";

// Set EC2_HOST in .env so this doesn't need updating when the instance address changes
const allowedDevOrigins = process.env.EC2_HOST ? [process.env.EC2_HOST, 'localhost'] : ['localhost'];

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;