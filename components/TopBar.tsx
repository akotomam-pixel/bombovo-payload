'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

function BannerText() {
  return (
    <>
      Školy v prírode na školský rok 2026/27 v predaji.{' '}
      <Link
        href="/skoly-v-prirode"
        className="underline hover:text-bombovo-yellow transition-colors"
      >
        Využite zľavu 30 € do 31.10 →
      </Link>
    </>
  )
}

export default function TopBar() {
  return (
    <div className="bg-bombovo-blue text-white py-2 overflow-hidden relative">
      {/* Mobile: a single static line. The scrolling marquee's duplicate
          copies were bleeding into each other on narrow screens — the
          banner text is wide relative to a phone's 100vw, so one copy's
          overflow visually ran into the next, reading as garbled repeated
          text. A static line sidesteps that, and is easier to tap besides. */}
      <div className="text-center text-sm font-medium px-4 md:hidden">
        <BannerText />
      </div>

      {/* Desktop: the scrolling marquee, unchanged. */}
      <motion.div
        className="hidden whitespace-nowrap md:flex"
        animate={{
          x: ["0vw", "-100vw"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 15,
            ease: "linear",
          },
        }}
      >
        {/* Display multiple instances with increased spacing between repetitions */}
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="text-sm md:text-base font-medium inline-block"
            style={{
              minWidth: '100vw',
              textAlign: 'center',
              paddingRight: '100vw' // Adds full screen width of spacing after each sentence
            }}
          >
            <BannerText />
          </span>
        ))}
      </motion.div>
    </div>
  )
}



