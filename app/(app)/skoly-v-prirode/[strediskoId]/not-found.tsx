import Link from 'next/link'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Shown (with a real HTTP 404) when page.tsx calls notFound() for an unknown stredisko.
export default function StrediskoNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-bombovo-dark mb-6">
            Táto stránka neexistuje
          </h1>
          <Link
            href="/skoly-v-prirode"
            className="inline-block px-8 py-4 bg-bombovo-yellow text-bombovo-dark font-bold text-lg rounded-3xl hover:translate-y-0.5 active:translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bombovo-dark transition-transform duration-150"
          >
            Späť na školy v prírode
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
