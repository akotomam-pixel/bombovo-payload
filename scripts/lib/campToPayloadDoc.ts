// Maps a hardcoded camp file (data/camps/*.ts) to a Payload Camps document.
// Shared by the one-off camp creation scripts.
import type { CampDetailData } from '../../data/camps/types'

// Lomy stredisko photos already in Payload (same set Trhlina uses)
export const LOMY_STREDISKO_MEDIA_IDS = [421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431]

export function toPayloadDoc(d: CampDetailData, campTypes: string[], galleryIds: number[], order = 0) {
  const items = (arr: string[]) => arr.map((item) => ({ item }))
  const paragraphs = (arr: string[]) => arr.map((paragraph) => ({ paragraph }))
  return {
    name: d.name,
    slug: d.id,
    order,
    poSezone: false,
    cardImage: galleryIds[0],
    campTypes,
    headline: d.headline,
    headlineHighlight: d.headlineHighlight,
    bulletPoints: d.bulletPoints.map((text) => ({ text })),
    location: d.location,
    age: d.age,
    price: d.price,
    heroGallery: galleryIds.map((photo) => ({ photo })),
    section2_headline: d.section2.headline,
    section2_description: paragraphs(d.section2.description),
    ratings: d.section2.ratings,
    section3_headline: d.section3.headline,
    section3_text: paragraphs(d.section3.text),
    reviews: d.section3.reviews,
    vTomtoTaboreZazites: items(d.section4.details.vTomtoTaboreZazites),
    vCene: items(d.section4.details.vCene),
    lokalita: d.section4.details.lokalita,
    doprava: d.section4.details.doprava,
    ubytovanie: items(d.section4.details.ubytovanie),
    zaPriplatok: items(d.section4.details.zaPriplatok),
    hasStredisko: d.section4.hasStredisko ?? false,
    strediskoName: d.section4.strediskoName,
    strediskoDescription: d.section4.strediskoDescription,
    strediskoGallery: LOMY_STREDISKO_MEDIA_IDS.map((photo) => ({ photo })),
    mapLat: d.section4.mapCoordinates?.lat,
    mapLng: d.section4.mapCoordinates?.lng,
    dates: d.section5.dates.map((t) => ({
      start: t.start,
      end: t.end,
      days: t.days,
      originalPrice: t.originalPrice,
      discountedPrice: t.discountedPrice,
      registrationId: t.registrationId != null ? String(t.registrationId) : undefined,
      profisTerminId: t.profisTerminId,
      id_ZajezdHotel: t.id_ZajezdHotel,
      vypredane: false,
    })),
  }
}
