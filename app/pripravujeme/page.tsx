import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PridajSaDoTimuPage() {
  return (
    <main className="min-h-screen">
      {/* Section 0: Top Bar - Grey Background */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      
      {/* Header - Sticky Navigation */}
      <Header />
      
      {/* Section 1: Headline - White Background */}
      <section className="pt-12 pb-8 md:pt-16 md:pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-bombovo-dark text-center">
            <span className="relative inline-block">
              Pridaj Sa Do{' '}
              <span className="font-handwritten text-bombovo-red text-5xl md:text-6xl lg:text-7xl">
                Bombovo
              </span>
              {' '}Timu!
              {/* Yellow underline under entire text */}
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                style={{ height: '12px' }}
              >
                <path
                  d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
                  stroke="#FDCA40"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                  stroke="#FDCA40"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h1>
        </div>
      </section>

      {/* Section 2: Split Screen with Photos and Buttons - White Background */}
      <section className="pb-12 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Container with hand-drawn blue borders */}
          <div className="relative">
            {/* Top horizontal hand-drawn blue line - DESKTOP ONLY */}
            <div className="hidden md:block absolute top-0 left-0 right-0 h-3 overflow-hidden z-10">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 1440 12" 
                preserveAspectRatio="none"
                style={{ filter: 'url(#roughness-top)' }}
              >
                <defs>
                  <filter id="roughness-top">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="turbulence"/>
                    <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
                  </filter>
                </defs>
                <path 
                  d="M-10,6 Q90,3 180,6 Q270,8 360,5 Q450,3 540,7 Q630,9 720,6 Q810,3 900,7 Q990,8 1080,6 Q1170,4 1260,7 Q1350,6 1450,6"
                  fill="none"
                  stroke="#3772FF"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path 
                  d="M-10,5 Q90,2 180,5 Q270,7 360,4 Q450,2 540,6 Q630,8 720,5 Q810,2 900,6 Q990,7 1080,5 Q1170,3 1260,6 Q1350,5 1450,5"
                  fill="none"
                  stroke="#3772FF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </div>
            
            {/* Grid for split screen */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative pt-6">
              {/* Vertical hand-drawn blue line in the middle (desktop only) */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 overflow-hidden z-10">
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 12 800" 
                  preserveAspectRatio="none"
                  style={{ filter: 'url(#roughness-vertical)' }}
                >
                  <defs>
                    <filter id="roughness-vertical">
                      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="turbulence"/>
                      <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
                    </filter>
                  </defs>
                  <path 
                    d="M6,-10 Q3,100 6,200 Q8,300 5,400 Q3,500 7,600 Q9,700 6,810"
                    fill="none"
                    stroke="#3772FF"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path 
                    d="M5,-10 Q2,100 5,200 Q7,300 4,400 Q2,500 6,600 Q8,700 5,810"
                    fill="none"
                    stroke="#3772FF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </div>
              
              {/* Right Side - Animator (Shows FIRST on mobile with order-1) */}
              <div className="flex flex-col items-center px-4 py-6 md:px-6 md:py-8 order-1 lg:order-2">
                {/* Red Button - NOW ON TOP */}
                <Link href="/prihlaska-animator" className="w-full mb-6" style={{ maxWidth: '600px' }}>
                  <button className="w-full px-8 py-5 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-xl rounded-2xl hover:translate-y-0.5 transition-all duration-200">
                    Prihláška Animátor
                  </button>
                </Link>
                
                {/* Photo - BELOW BUTTON */}
                <div 
                  className="w-full rounded-2xl overflow-hidden"
                  style={{ maxWidth: '600px', height: '500px', minHeight: '500px' }}
                >
                  <img 
                    src="/images/prihlaskaanimatory.jpg"
                    alt="Prihláška Animátor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Left Side - Zdravotnik (Shows SECOND on mobile with order-2) */}
              <div className="flex flex-col items-center px-4 py-6 md:px-6 md:py-8 order-2 lg:order-1">
                {/* Yellow Button - NOW ON TOP */}
                <Link href="/prihlaska-zdravotnik" className="w-full mb-6" style={{ maxWidth: '600px' }}>
                  <button className="w-full px-8 py-5 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-xl rounded-2xl hover:translate-y-0.5 transition-all duration-200">
                    Prihláška Zdravotník
                  </button>
                </Link>
                
                {/* Photo - BELOW BUTTON */}
                <div 
                  className="w-full rounded-2xl overflow-hidden"
                  style={{ maxWidth: '600px', height: '500px', minHeight: '500px' }}
                >
                  <img 
                    src="/images/prihlaskazdravotnik.JPG"
                    alt="Prihláška Zdravotník"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* No bottom horizontal line as requested */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-bombovo-gray">
        <Footer />
      </div>
    </main>
  )
}
