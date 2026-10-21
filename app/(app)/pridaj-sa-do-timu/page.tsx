import type { Metadata } from 'next'
import PridajSaDoTimuClient from './PridajSaDoTimuClient'

export const metadata: Metadata = {
  title: 'Pridaj sa do tímu | Brigáda animátor a zdravotník | Bombovo',
  description:
    'Hľadáme animátorov a zdravotníkov na školy v prírode a letné tábory. Nová partia, zábava a leto plné zážitkov. Prihlás sa do tímu Bombova.',
}

export default function PridajSaDoTimuPage() {
  return <PridajSaDoTimuClient />
}
