export interface CampDetailData {
  id: string
  name: string
  headline: string
  headlineHighlight: string
  location: string
  age: string
  price: string
  
  bulletPoints: string[]
  
  section2: {
    ratings: {
      kreativita: number
      mystika: number
      sebarozvoj: number
      pohyb: number
      kritickeMyslenie: number
    }
    headline: string
    description: string[]
    buttonText: string
  }
  
  section3: {
    headline: string
    text: string[]
    reviews: {
      text: string
      author: string
    }[]
  }
  
  section4: {
    details: {
      vTomtoTaboreZazites: string[]
      vCene: string[]
      lokalita: string
      doprava: string
      ubytovanie: string[]
      zaPriplatok: string[]
    }
    hasStredisko?: boolean
    strediskoName?: string
    strediskoDescription?: string
    mapCoordinates?: {
      lat: number
      lng: number
    }
  }
  
  section5: {
    dates: {
      registrationId?: number
      start: string
      end: string
      days: number
      originalPrice: string
      discountedPrice: string
    }[]
  }
}
