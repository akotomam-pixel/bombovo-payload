const { withPayload } = require("@payloadcms/next/withPayload");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'y554alh0y1.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
    minimumCacheTTL: 2678400,
  },
}

module.exports = withPayload(nextConfig)



