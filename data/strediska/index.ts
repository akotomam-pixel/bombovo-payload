import { stredEuropyKrahule } from './stred-europy-krahule'
import { penzionRohacan } from './penzion-rohacan'
import { penzionSabina } from './penzion-sabina'
import { hotelZuna } from './hotel-zuna'
import { hotelMartinskeHole } from './hotel-martinske-hole'
import { horskyHotelMinciar } from './horsky-hotel-minciar'
import { horskyHotelLomy } from './horsky-hotel-lomy'
import { StrediskoData } from './types'

const allStrediska: StrediskoData[] = [
  stredEuropyKrahule,
  penzionRohacan,
  penzionSabina,
  hotelZuna,
  hotelMartinskeHole,
  horskyHotelMinciar,
  horskyHotelLomy
]

export function getStrediskoById(id: string): StrediskoData | null {
  return allStrediska.find(s => s.id === id) || null
}

export { allStrediska }
