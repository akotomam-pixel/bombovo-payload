import { getPayload } from 'payload'
import config from '@payload-config'
import { camps as fallbackCamps } from '@/lib/campsData'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SutazClient from './SutazClient'

export const metadata = {
  title: 'Vyhraj Tábor Zadarmo | Bombovo',
  description: 'Zapoj sa do súťaže a vyhraj tábor zadarmo pre svoje dieťa.',
}

export default async function SutazPage() {
  let photoUrl: string | null = null
  let camps: { id: string; name: string }[] = fallbackCamps.map((c) => ({
    id: c.id,
    name: c.name,
  }))

  try {
    const payload = await getPayload({ config })

    const [globalData, campsData] = await Promise.all([
      payload.findGlobal({ slug: 'giveaway-popup' }),
      payload.find({ collection: 'camps', limit: 100, sort: 'order' }),
    ])

    const g = globalData as any

    if (g?.photo && typeof g.photo === 'object' && g.photo.url) {
      photoUrl = g.photo.url
    }

    if (campsData.docs.length > 0) {
      camps = campsData.docs.map((c: any) => ({ id: String(c.id), name: c.name }))
    }
  } catch (err) {
    console.error('SutazPage: failed to fetch Payload data', err)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />
      <div className="flex-1">
        <SutazClient photoUrl={photoUrl} camps={camps} />
      </div>
      <Footer />
    </main>
  )
}
