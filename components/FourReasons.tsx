'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const reasons = [
  {
    number: 1,
    title: '86% Návratnosť Detí',
    content: '„Môžem ísť znova?" To je najčastejšia veta, ktorú počujeme po tom, čo deti strávia len jeden týždeň v Bombove. Či už ide o školu v prírode alebo letný tábor…\n\nNaše strediská a animátori ponúkajú niečo, čo inde nenájdete. Deti, rodičia, ale aj učiteľky odchádzajú z našich stredísk očarení.',
    color: 'from-bombovo-blue to-blue-300',
  },
  {
    number: 2,
    title: 'Žiadne Skryté Platby',
    content: 'Väčšina cestovných kancelárií vám ponúka základnú cenu za tábor bez pridaného výletu počas týždňa. Ak nechcete aby sa vaše dieťa nudilo, musíte si za tento výlet priplatiť.\n\nV Bombove platíte za celý tábor hneď a často lacnejšie ako inde. U nás sa ani bez príplatku nikto nudiť nebude!',
    color: 'from-bombovo-red to-red-300',
  },
  {
    number: 3,
    title: 'Školený a Skúsený Personál',
    content: 'Nám nie je jedno, kto sa bude starať o vaše deti. Od animátorov až po kuchárov zabezpečujeme, že náš personál prešiel výberovým konaním a školením.\n\nPráve preto máte istotu, že sú vaše deti v bezpečných a zodpovedných rukách.',
    color: 'from-bombovo-yellow to-yellow-300',
  },
  {
    number: 4,
    title: 'U Nás Záleží Na Kvalite!',
    content: 'Bombovo nie je veľká firma. Sme malá, kvalitou orientovaná firma, ktorej záleží hlavne na kvalite. Chceme, aby každé dieťa, ktoré k nám príde, dostalo lásku, zábavu a starostlivosť, ktorú si zaslúži.\n\nA robíme všetko preto, aby sa nám to podarilo.',
    color: 'from-bombovo-gray to-gray-300',
  },
]

const reasonImages: Record<number, string> = {
  1: '/images/homepage/Secio3.1.JPG',
  2: '/images/homepage/secion3.2.JPG',
  3: '/images/homepage/Secion3.3.JPG',
  4: '/images/homepage/Secion3.4.JPG',
}

export default function FourReasons() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-4"
        >
          4 Dôvody Prečo ísť do Bombova
        </h2>

        {/* Reasons */}
        <div className="mt-16 space-y-12 relative">
          {/* Connecting line - DESKTOP ONLY */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-bombovo-blue -translate-x-1/2 opacity-20" />

          {reasons.map((reason, index) => (
            <div
              key={reason.number}
              className="relative"
            >
              {/*
                Unified layout — single image element per reason.
                Mobile (flex-col, no order): HTML order = text → image (stacked).
                Desktop (flex-row, md:order classes active):
                  even index → text (order-1) | number (order-2) | image (order-3)
                  odd index  → image (order-1) | number (order-2) | text (order-3)
              */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-8">

                {/* Text */}
                <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:order-1' : 'md:order-3'}`}>
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-bombovo-dark mb-3 md:mb-4">
                      {reason.title}
                    </h3>
                    <p className="text-sm md:text-base text-bombovo-dark leading-relaxed whitespace-pre-line">
                      {reason.content}
                    </p>
                  </div>
                </div>

                {/* Number Circle — desktop only, always in the middle */}
                <div className="hidden md:flex md:order-2 relative z-10 flex-shrink-0 items-center justify-center">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-bombovo-blue flex items-center justify-center shadow-xl border-4 border-bombovo-dark"
                  >
                    <span className="text-white font-bold text-3xl md:text-4xl">
                      {reason.number}.
                    </span>
                  </div>
                </div>

                {/* Image — single element, loads once */}
                <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'}`}>
                  <div className="relative rounded-3xl h-56 md:h-64 overflow-hidden shadow-lg">
                    <img
                      src={reasonImages[reason.number]}
                      alt={`Reason ${reason.number}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link href="/letne-tabory">
            <button
              className="px-8 py-4 bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200"
            >
              Pozri letné tábory
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
