const { withPayload } = require("@payloadcms/next/withPayload");
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ]
  },
  async redirects() {
    return [
      { source: '/detske-tabory', destination: '/letne-tabory', permanent: true },
      { source: '/detske-tabory/', destination: '/letne-tabory', permanent: true },
      { source: '/landingpages/10-dovodov', destination: '/advertorial-1', permanent: true },
    ]
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // UploadThing CDN — all subdomains and paths
      { protocol: 'https', hostname: 'utfs.io', pathname: '/**' },
      { protocol: 'https', hostname: '**.ufs.sh', pathname: '/**' },
      // Placeholder images (used as fallback when Payload has no photos)
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
    minimumCacheTTL: 2678400,
  },
}

module.exports = withPayload(nextConfig)



