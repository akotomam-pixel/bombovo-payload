import type { Metadata } from 'next'
import PrihlaskaPage from '@/components/prihlaska/PrihlaskaPage'

export const metadata: Metadata = {
  title: 'Prihláška animátor | Bombovo',
  description: 'Prihlás sa na školenie animátorov Bombovo na Horskom hoteli Lomy a staň sa animátorom na školách v prírode a letných táboroch.',
}

export default function PrihlaskaAnimatorPage() {
  return <PrihlaskaPage role="animator" />
}
