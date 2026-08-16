import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['ec2-100-26-21-192.compute-1.amazonaws.com', 'localhost'],
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }, { key: 'Access-Control-Allow-Methods', value: 'GET,POST,DELETE,OPTIONS' }, { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-client-id' }] }];
  },
};

export default nextConfig;