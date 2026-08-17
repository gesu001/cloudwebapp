import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['ec2-34-235-125-35.compute-1.amazonaws.com', 'localhost'],
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }, { key: 'Access-Control-Allow-Methods', value: 'GET,POST,DELETE,OPTIONS' }, { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-client-id' }] }];
  },
};

export default nextConfig;