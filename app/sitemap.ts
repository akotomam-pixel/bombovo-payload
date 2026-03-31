import type { MetadataRoute } from 'next'
import { camps } from '@/lib/campsData'

const BASE = 'https://bombovo.sk'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/letne-tabory`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/skoly-v-prirode`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/kontakt`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/faq`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/nasa-misia`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/o-nas`, priority: 0.6, changeFrequency: 'monthly' },
  ]

  const campPages: MetadataRoute.Sitemap = camps.map((camp) => ({
    url: `${BASE}/letne-tabory/${camp.id}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...campPages]
}
