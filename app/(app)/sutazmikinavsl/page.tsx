import { Suspense } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { camps as fallbackCamps } from '@/lib/campsData'
import SutazMikinaVslClient from './SutazMikinaVslClient'

export const metadata = {
  title: 'Vyhraj BOMBOVO mikinu | Bombovo',
  description: 'Napíš nám o svojom tábore a zvýš si šancu na výhru BOMBOVO mikiny.',
  robots: { index: false, follow: false },
}

export default async function SutazMikinaVslPage() {
  let camps: { id: string; name: string }[] = fallbackCamps.map((c) => ({
    id: c.id,
    name: c.name,
  }))

  try {
    const payload = await getPayload({ config })
    const campsData = await payload.find({ collection: 'camps', limit: 100, sort: 'order' })

    if (campsData.docs.length > 0) {
      camps = campsData.docs.map((c: any) => ({ id: String(c.id), name: c.name }))
    }
  } catch (err) {
    console.error('SutazMikinaVslPage: failed to fetch Payload data', err)
  }

  return (
    <Suspense fallback={null}>
      <SutazMikinaVslClient camps={camps} />
    </Suspense>
  )
}
