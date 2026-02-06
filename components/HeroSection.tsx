'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="pt-4 pb-16 md:py-20 overflow-hidden">
      <style jsx>{`
        .hero-left-column {
          margin-left: 0;
        }
        .hero-headline {
          margin-left: 0;
          width: auto;
          max-width: 100%;
        }
        .hero-subheadline {
          margin-left: 0;
        }
        @media (min-width: 1024px) {
          .hero-left-column {
            margin-left: -30px;
          }
          .hero-headline {
            margin-left: 10px;
            width: 500px;
          }
          .hero-subheadline {
            margin-left: 10px;
          }
        }
      `}</style>
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          textAlign: 'left',
          paddingLeft: '10px',
          paddingRight: '10px'
        }}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-stretch gap-8 lg:gap-12">
          {/* Headlines Container - Order 1 on mobile, left column on desktop */}
          <div 
            className="hero-left-column lg:col-span-5 flex flex-col justify-between text-left order-1 px-4 lg:px-0"
          >
            {/* Top Content: Subheadline + Headline (on mobile) / + Icons (on desktop) */}
            <div>
              {/* Subheadline */}
              <p 
                className="hero-subheadline text-3.5xl font-amatic text-bombovo-red"
                style={{
                  marginBottom: '-10px',
                  lineHeight: '1'
                }}
              >
                BOMBOVO:
              </p>

              {/* Headline */}
              <h1 
                className="hero-headline text-5.5xl font-bold text-bombovo-dark leading-tight"
                style={{
                  display: 'grid',
                  flexWrap: 'wrap',
                  rowGap: '0px',
                  marginTop: '0px'
                }}
              >
                Miesto kam sa vaše dieťa bude chcieť vrátiť
              </h1>

              {/* Icons - DESKTOP ONLY (hidden on mobile) */}
              <div className="hidden lg:flex gap-6 md:gap-8 mt-8 mb-6 lg:mb-0 justify-center lg:justify-start" style={{ marginLeft: '20px' }}>
                {/* Icon 1: 86% Návratnosť Detí */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
                    <img src="/images/hmmicon1.png" alt="Návratnosť Detí" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm md:text-base font-bold text-bombovo-dark leading-tight mb-0.5">86%</p>
                  <p className="text-sm md:text-base text-bombovo-dark leading-tight">Návratnosť<br/>Detí</p>
                </div>

                {/* Icon 2: 50,000+ Detí Odrekreovaných */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
                    <img src="/images/hmmicon2.png" alt="Detí Odanimovaných" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm md:text-base font-bold text-bombovo-dark leading-tight mb-0.5">50,000+</p>
                  <p className="text-sm md:text-base text-bombovo-dark leading-tight">Detí<br/>Odanimovaných</p>
                </div>

                {/* Icon 3: 20+ Rokov Skúseností */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-2">
                    <img src="/images/hmmicon3.png" alt="Rokov Skúseností" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm md:text-base font-bold text-bombovo-dark leading-tight mb-0.5">20+</p>
                  <p className="text-sm md:text-base text-bombovo-dark leading-tight">Rokov<br/>Skúseností</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Pushed to Bottom - Only visible on desktop */}
            <div 
              className="hidden lg:flex flex-row gap-4 justify-start mt-auto"
              style={{ marginLeft: '20px' }}
            >
              <Link href="/letne-tabory">
                <button
                  className="px-8 py-4 bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200"
                >
                  Letné Tábory
                </button>
              </Link>
              <Link href="/skoly-v-prirode">
                <button
                  className="px-8 py-4 bg-[#DF2935] border-2 border-white text-white font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200"
                >
                  Školy v prírode
                </button>
              </Link>
            </div>
          </div>

          {/* Video - Order 2 on mobile, right column on desktop */}
          <div 
            className="lg:col-span-7 order-2 px-4 lg:px-0"
          >
            <div 
              className="relative rounded-3xl overflow-hidden shadow-2xl max-w-full"
            >
              {/* Brand color border frame - thinner on mobile (60% reduced) */}
              <div className="bg-bombovo-blue p-1.5 md:p-4 rounded-3xl">
                {/* Video with 16:9 aspect ratio */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    preload="auto"
                  >
                    <source src="/images/Letne%20Tabory/herovideo.mov" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Icons - MOBILE ONLY (Order 3) */}
          <div className="lg:hidden order-3 px-4">
            <div className="flex gap-6 justify-center" style={{ marginTop: '0px' }}>
              {/* Icon 1: 86% Návratnosť Detí */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center mb-2">
                  <img src="/images/hmmicon1.png" alt="Návratnosť Detí" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm font-bold text-bombovo-dark leading-tight mb-0.5">86%</p>
                <p className="text-sm text-bombovo-dark leading-tight">Návratnosť<br/>Detí</p>
              </div>

              {/* Icon 2: 50,000+ Detí Odrekreovaných */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center mb-2">
                  <img src="/images/hmmicon2.png" alt="Detí Odanimovaných" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm font-bold text-bombovo-dark leading-tight mb-0.5">50,000+</p>
                <p className="text-sm text-bombovo-dark leading-tight">Detí<br/>Odanimovaných</p>
              </div>

              {/* Icon 3: 20+ Rokov Skúseností */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center mb-2">
                  <img src="/images/hmmicon3.png" alt="Rokov Skúseností" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm font-bold text-bombovo-dark leading-tight mb-0.5">20+</p>
                <p className="text-sm text-bombovo-dark leading-tight">Rokov<br/>Skúseností</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons - Order 4 on mobile (after icons), hidden on desktop */}
          <div 
            className="flex lg:hidden flex-col sm:flex-row gap-4 justify-center order-4 px-4"
          >
            <Link href="/letne-tabory">
              <button
                className="px-8 py-4 bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
              >
                Letné Tábory
              </button>
            </Link>
            <Link href="/skoly-v-prirode">
              <button
                className="px-8 py-4 bg-[#DF2935] border-2 border-white text-white font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
              >
                Školy v prírode
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

