import type { LomyContent } from '@/data/lomy/types'
import { lomyContent } from '@/data/lomy/content'
import { horskyHotelMinciarContent } from '@/data/horsky-hotel-minciar/content'
import { hotelMartinskeHoleContent } from '@/data/hotel-martinske-hole/content'
import { penzionRohacanContent } from '@/data/penzion-rohacan/content'
import { hotelOsrblieContent } from '@/data/hotel-osrblie/content'
import { penzionPalusakContent } from '@/data/penzion-palusak/content'
import { penzionLaganContent } from '@/data/penzion-lagan/content'

/**
 * Every stredisko rebuilt on the Lomy architecture, keyed by slug.
 *
 * Single source of truth for both the detail-page router
 * (app/(app)/skoly-v-prirode/[strediskoId]/page.tsx) and the overview-grid
 * card (components/StrediskoCard.tsx) — pure data, safe to import from a
 * client component too, unlike the router itself which also pulls in the
 * server-only Payload client.
 */
export const REBUILT_STREDISKA: Record<string, LomyContent> = {
  'horsky-hotel-lomy': lomyContent,
  'horsky-hotel-minciar': horskyHotelMinciarContent,
  'hotel-martinske-hole': hotelMartinskeHoleContent,
  'penzion-rohacan': penzionRohacanContent,
  'hotel-osrblie': hotelOsrblieContent,
  'penzion-palusak': penzionPalusakContent,
  'penzion-lagan': penzionLaganContent,
}
