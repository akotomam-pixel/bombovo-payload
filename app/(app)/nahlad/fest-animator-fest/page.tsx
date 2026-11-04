import type { Metadata } from 'next'
import FestMockupClient from './FestMockupClient'

// Private mockup of the new FEST camp page (Page 8 from the design canvas).
// Lives only on the `fest-mockup` branch preview. Not linked anywhere, not indexed.
export const metadata: Metadata = {
  title: 'Fest animátor fest (náhľad)',
  robots: { index: false, follow: false },
}

export default function FestMockupPage() {
  return <FestMockupClient />
}
