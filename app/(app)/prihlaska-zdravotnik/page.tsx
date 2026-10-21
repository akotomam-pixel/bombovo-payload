import type { Metadata } from 'next'
import PrihlaskaPage from '@/components/prihlaska/PrihlaskaPage'

export const metadata: Metadata = {
  title: 'Prihláška zdravotník | Bombovo',
  description: 'Prihlás sa ako zdravotník na školy v prírode, lyžiarske výcviky a letné tábory Bombovo.',
}

export default function PrihlaskaZdravotnikPage() {
  return <PrihlaskaPage role="zdravotnik" />
}
