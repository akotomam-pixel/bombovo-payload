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



