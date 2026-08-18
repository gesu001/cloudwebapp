import type { NextConfig } from "next";

// Set EC2_HOST in .env so this doesn't need updating when the instance address changes
const allowedDevOrigins = process.env.EC2_HOST ? [process.env.EC2_HOST, 'localhost'] : ['localhost'];

const nextConfig: NextConfig = {
  allowedDevOrigins,
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }, { key: 'Access-Control-Allow-Methods', value: 'GET,POST,DELETE,OPTIONS' }, { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-client-id' }] }];
  },
};

export default nextConfig;