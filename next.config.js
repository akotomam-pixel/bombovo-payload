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
        pathname: '/f/*',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/*',
      },
    ],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      {
        // Strip Payload's Critical-CH header from all public routes so browsers
        // don't make a second round-trip request on every cold visit.
        source: '/((?!admin).*)',
        headers: [
          { key: 'Critical-CH', value: '' },
          { key: 'Accept-CH', value: '' },
        ],
      },
    ]
  },
}

module.exports = withPayload(nextConfig)



