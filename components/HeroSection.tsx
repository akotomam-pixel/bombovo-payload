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
        {/*
          Unified grid/flex layout — icons and buttons are single elements.

          Mobile (flex-col, order classes):
            order-1: headline
            order-2: video
            order-3: icons
            order-4: buttons

          Desktop (CSS grid, explicit row/col placement):
            col 1-5 row 1: headline
            col 6-12 rows 1-3: video (spans all rows)
            col 1-5 row 2: icons
            col 1-5 row 3: buttons
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Headline — col 1-5, row 1 on desktop | order-1 on mobile */}
          <div
            className="hero-left-column lg:col-start-1 lg:col-span-5 lg:row-start-1 flex flex-col text-left order-1 px-4 lg:px-0"
          >
            <p
              className="hero-subheadline text-4xl font-amatic text-bombovo-red"
              style={{
                marginBottom: '-10px',
                lineHeight: '1',
                fontSize: '60px'
              }}
            >
              BOMBOVO:
            </p>

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
          </div>

          {/* Video — col 6-12, rows 1-3 on desktop | order-2 on mobile */}
          <div
            className="lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-end-4 order-2 px-4 lg:px-0"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-full">
              {/* Brand color border frame */}
              <div className="bg-bombovo-blue p-1.5 md:p-4 rounded-3xl">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  >
                    <source src="/images/Videos/homepage2.2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Icons — single element — col 1-5, row 2 on desktop | order-3 on mobile */}
          <div
            className="hero-left-column lg:col-start-1 lg:col-span-5 lg:row-start-2 order-3 px-4 lg:px-0"
          >
            <div className="flex gap-6 lg:gap-8 justify-center lg:justify-start" style={{ marginLeft: '20px' }}>
              {/* Icon 1: 86% Návratnosť Detí */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-2">
                  <img src="/images/hmmicon1.png" alt="Návratnosť Detí" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm lg:text-base font-bold text-bombovo-dark leading-tight mb-0.5">86%</p>
                <p className="text-sm lg:text-base text-bombovo-dark leading-tight">Návratnosť<br/>Detí</p>
              </div>

              {/* Icon 2: 50,000+ Detí Odanimovaných */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-2">
                  <img src="/images/hmmicon2.png" alt="Detí Odanimovaných" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm lg:text-base font-bold text-bombovo-dark leading-tight mb-0.5">50,000+</p>
                <p className="text-sm lg:text-base text-bombovo-dark leading-tight">Detí<br/>Odanimovaných</p>
              </div>

              {/* Icon 3: 20+ Rokov Skúseností */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-2">
                  <img src="/images/hmmicon3.png" alt="Rokov Skúseností" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm lg:text-base font-bold text-bombovo-dark leading-tight mb-0.5">20+</p>
                <p className="text-sm lg:text-base text-bombovo-dark leading-tight">Rokov<br/>Skúseností</p>
              </div>
            </div>
          </div>

          {/* Buttons — single element — col 1-5, row 3 on desktop | order-4 on mobile */}
          <div
            className="hero-left-column lg:col-start-1 lg:col-span-5 lg:row-start-3 order-4 px-4 lg:px-0"
          >
            <div
              className="flex flex-col sm:flex-row lg:flex-row gap-4 justify-center lg:justify-start"
              style={{ marginLeft: '20px' }}
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
                  className="px-8 py-4 bg-[#DF2935] border-2 border-[#080708] text-[#080708] font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
                >
                  Školy v prírode
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
