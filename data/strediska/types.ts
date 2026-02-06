export interface StrediskoDate {
  startDate: string
  endDate: string
  days: number
  price: string
  available: boolean
}

export interface StrediskoData {
  id: string
  name: string
  headline: string
  basePrice: string
  iconBullets: string[]
  section3: {
    headline: string
    bodyText: string
    nearbyAttractions: string[]
  }
  programText: string
  detaily: {
    ubytovanie: string[]
    vybavenieStrediska: string[]
    zaujimavostiVOkoli: string[]
  }
  dates: StrediskoDate[]
}
