const { withPayload } = require("@payloadcms/next/withPayload");
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['bysquare'],
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
      // Facebook ad short links — temporary (307) so they can be repointed.
      // Next.js passes incoming query params (e.g. fbclid) through to the destination.
      ...[
        ['/svp1', 'ABO-Svp-video-direct', 'ad-1'],
        ['/svp2', 'ABO-Svp-video-direct', 'ad-2'],
        ['/svp3', 'ABO-Svp-video-direct', 'ad-3'],
        ['/svp4', 'ABO-Svp-video-direct', 'ad-4'],
        ['/svp5', 'ABO-retargeting-svp', 'ad-2-rt'],
        ['/svp-rt', 'ABO-retargeting-svp', 'ad-2-rt'],
      ].map(([source, campaign, content]) => ({
        source,
        destination: `/skoly-v-prirode?utm_source=facebook&utm_medium=paid&utm_campaign=${campaign}&utm_content=${content}&utm_term=textlink`,
        permanent: false,
      })),
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



