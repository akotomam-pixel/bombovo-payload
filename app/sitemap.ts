import type { MetadataRoute } from 'next'
import { camps } from '@/lib/campsData'
import { isPreviewCamp } from '@/lib/campPreviewGate'
import { getPayloadClient } from '@/lib/payload'
import { allStrediska } from '@/data/strediska'
import { REBUILT_STREDISKA } from '@/data/rebuiltStrediska'

const BASE = 'https://www.bombovo.sk'

// Re-check Payload for new strediská once an hour.
export const revalidate = 3600

// Stredisko slugs: Payload "strediska" plus the rebuilt ones and the hardcoded
// fallback data — the same sources the /skoly-v-prirode/[strediskoId] page reads.
async function strediskoSlugs(): Promise<string[]> {
  const slugs = new Set<string>([...Object.keys(REBUILT_STREDISKA), ...allStrediska.map((s) => s.id)])
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'strediska', limit: 100, depth: 0 })
    for (const doc of result.docs as Array<{ slug?: string }>) {
      if (doc.slug) slugs.add(doc.slug)
    }
  } catch {
    // Payload unavailable — the hardcoded slugs above still cover every page.
  }
  return [...slugs]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/letne-tabory`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/skoly-v-prirode`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/program-skoly-v-prirode`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/skolske-vylety`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/adaptacne-kurzy`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/pre-firmy`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/kontakt`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/faq`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/nasa-misia`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/o-nas`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/pridaj-sa-do-timu`, priority: 0.7, changeFrequency: 'monthly' },
    // /recenzie-skoly-v-prirode is left out on purpose: the page is noindex.
  ]

  const campPages: MetadataRoute.Sitemap = camps.filter((camp) => !isPreviewCamp(camp.id)).map((camp) => ({
    url: `${BASE}/letne-tabory/${camp.id}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const strediskoPages: MetadataRoute.Sitemap = (await strediskoSlugs()).map((slug) => ({
    url: `${BASE}/skoly-v-prirode/${slug}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...campPages, ...strediskoPages]
}
