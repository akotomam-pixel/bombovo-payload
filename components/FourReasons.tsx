'use client'

import Link from 'next/link'

interface Reason {
  headline: string
  text: string
  photo?: { url: string } | null
}

interface FourReasonsProps {
  headline: string
  reasons: Reason[]
}

export default function FourReasons({ headline, reasons }: FourReasonsProps) {
  if (reasons.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-4">
          {headline}
        </h2>

        {/* Reasons */}
        <div className="mt-16 space-y-12 relative">
          {/* Connecting line - DESKTOP ONLY */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-bombovo-blue -translate-x-1/2 opacity-20" />

          {reasons.map((reason, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row md:items-center md:gap-8">

                {/* Text */}
                <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:order-1' : 'md:order-3'}`}>
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-bombovo-dark mb-3 md:mb-4">
                      {reason.headline}
                    </h3>
                    <p className="text-sm md:text-base text-bombovo-dark leading-relaxed whitespace-pre-line">
                      {reason.text}
                    </p>
                  </div>
                </div>

                {/* Number Circle — desktop only */}
                <div className="hidden md:flex md:order-2 relative z-10 flex-shrink-0 items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-bombovo-blue flex items-center justify-center shadow-xl border-4 border-bombovo-dark">
                    <span className="text-white font-bold text-3xl md:text-4xl">{index + 1}.</span>
                  </div>
                </div>

                {/* Image */}
                <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'}`}>
                  <div className="relative rounded-3xl h-56 md:h-64 overflow-hidden shadow-lg">
                    {reason.photo?.url && (
                      <img
                        src={reason.photo.url}
                        alt={reason.headline}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link href="/letne-tabory">
            <button className="px-8 py-4 bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200">
              Pozri letné tábory
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
