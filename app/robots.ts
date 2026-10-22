import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private registration/application pages stay out of search results.
      disallow: ['/prihlaska/', '/prihlaska-svp/', '/prihlaska-animator', '/prihlaska-zdravotnik', '/animatori/'],
    },
    sitemap: 'https://www.bombovo.sk/sitemap.xml',
  }
}
