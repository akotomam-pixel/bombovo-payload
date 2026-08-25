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
      {/* Mobile: scrolling, same as desktop — but built differently. The old
          version duplicated the text 5x assuming each copy fits within
          100vw; on a phone the text is wider than that, so one copy's
          overflow ran into the next and read as garbled repeated text.
          This version duplicates it exactly twice and slides the row by
          exactly half its own (content-measured, not viewport-guessed)
          width, so the loop is seamless regardless of how wide the text
          actually renders. */}
      <div className="overflow-hidden md:hidden">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 12,
              ease: 'linear',
            },
          }}
        >
          <span className="shrink-0 px-6 text-sm font-medium">
            <BannerText />
          </span>
          <span className="shrink-0 px-6 text-sm font-medium" aria-hidden="true">
            <BannerText />
          </span>
        </motion.div>
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



