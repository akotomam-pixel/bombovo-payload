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
      { source: '/pripravujeme', destination: '/pridaj-sa-do-timu', permanent: true },
      // Old WordPress (/produkt/...) and very old /sk/ site URLs → new pages.
      // Order matters: specific slugs before the catch-alls. Pages with no
      // equivalent (old blog, lyžiarske zájazdy, /prih, /na-stiahnutie) are
      // deliberately left as 404 — never redirect those to the homepage.
      ...[
        // Camps
        ['/produkt/detske-tabory/babinec', '/letne-tabory/babinec'],
        ['/produkt/detske-tabory/chlapinec', '/letne-tabory/chlapinec'],
        ['/produkt/detske-tabory/expecto-patronum', '/letne-tabory/expecto'],
        ['/produkt/detske-tabory/fest-animatorfest', '/letne-tabory/fest-animator-fest'],
        // TODO: repoint to the winter Fest page once it is published.
        ['/produkt/detske-tabory/fest-animatorfest-zimny', '/letne-tabory/fest-animator-fest'],
        ['/produkt/detske-tabory/stastna-plutva', '/letne-tabory/stastna-plutva'],
        ['/produkt/detske-tabory/tanecna-planeta', '/letne-tabory/tanecna-planeta'],
        ['/produkt/detske-tabory/v-dracej-nore', '/letne-tabory/v-dracej-nore'],
        ['/produkt/detske-tabory/wood-kemp', '/letne-tabory/woodkemp'],
        ['/produkt/detske-tabory/neverfort', '/letne-tabory/neverfort'],
        ['/produkt/detske-tabory/tajomstvo-zlateho-basketbaloveho-pohara', '/letne-tabory/tajomstvo-basketbaloveho-pohara'],
        ['/produkt/ready-player-one', '/letne-tabory/ready-player-one'],
        ['/produkt/detske-tabory/:slug', '/letne-tabory'],
        ['/kategoria-produktu/detske-tabory', '/letne-tabory'],
        ['/detske-tabory/:slug', '/letne-tabory'],
        ['/galeria-tabory', '/letne-tabory'],
        ['/galeria-tabory/:slug*', '/letne-tabory'],
        ['/tajomstva-stareho-dennika', '/letne-tabory'],
        ['/rezervacia', '/letne-tabory'],
        ['/events/categories', '/letne-tabory'],
        // Školy v prírode
        ['/produkt/skoly-v-prirode/horsky-hotel-lomy', '/skoly-v-prirode/horsky-hotel-lomy'],
        ['/produkt/skoly-v-prirode/horsky-hotel-minciar', '/skoly-v-prirode/horsky-hotel-minciar'],
        ['/produkt/skoly-v-prirode/hotel-martinske-hole', '/skoly-v-prirode/hotel-martinske-hole'],
        ['/produkt/skoly-v-prirode/hotel-zuna', '/skoly-v-prirode/hotel-zuna'],
        ['/produkt/skoly-v-prirode/penzion-sabina', '/skoly-v-prirode/penzion-sabina'],
        ['/produkt/skoly-v-prirode/penzion-stred-europy-krahule', '/skoly-v-prirode/stred-europy-krahule'],
        ['/produkt/skoly-v-prirode/:slug', '/skoly-v-prirode'],
        ['/strediska-carousel', '/skoly-v-prirode'],
        ['/rs-hotel-hlboke', '/skoly-v-prirode'],
        // Team / animátori
        ['/animatori', '/pridaj-sa-do-timu'],
        ['/pod-do-timu', '/pridaj-sa-do-timu'],
        ['/prihlaska-animatora', '/prihlaska-animator'],
        // Very old /sk/ site (.aspx variants included via :slug / :ext)
        ['/sk/tabor-wood-kemp:ext(\\.aspx)?', '/letne-tabory/woodkemp'],
        ['/sk/tabor-wood-kemp-teenager:ext(\\.aspx)?', '/letne-tabory/woodkemp'],
        ['/sk/tabory:ext(\\.aspx)?', '/letne-tabory'],
        ['/sk/tabor-:slug', '/letne-tabory'],
        ['/sk/tabory-:slug', '/letne-tabory'],
        ['/sk/strediska-:slug', '/skoly-v-prirode'],
        ['/index.php', '/'],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
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



