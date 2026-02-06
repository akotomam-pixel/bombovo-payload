'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="bg-bombovo-blue text-white py-2 overflow-hidden relative">
      <motion.div
        className="flex whitespace-nowrap"
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
            Tábory na leto 2026 sú v predaji!{' '}
            <Link 
              href="/letne-tabory" 
              className="underline hover:text-bombovo-yellow transition-colors"
            >
              Zaregistruj sa teraz →
            </Link>
          </span>
        ))}
      </motion.div>
    </div>
  )
}



