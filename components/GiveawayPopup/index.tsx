'use client'

import { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import PopupModal from './PopupModal'
import type { PopupContent } from './PopupModal'

const SESSION_KEY = 'bombovo_giveaway_seen'

interface Props extends PopupContent {
  delaySeconds: number
}

export default function GiveawayPopup({ delaySeconds, ...content }: Props) {
  const pathname = usePathname()

  // Don't show the popup on the dedicated giveaway landing page
  if (pathname === '/sutaz') return null
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [maxSize, setMaxSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    // Capture the screen size once on first load and lock it as the max
    setMaxSize({
      w: window.innerWidth - 80,
      h: window.innerHeight - 30,
    })
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Already seen this session — don't show
    if (sessionStorage.getItem(SESSION_KEY)) return

    const timer = setTimeout(() => {
      setVisible(true)
    }, delaySeconds * 1000)

    return () => clearTimeout(timer)
  }, [mounted, delaySeconds])

  const handleClose = useCallback(() => {
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }, [])

  if (!mounted) return null

  return ReactDOM.createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full h-full flex items-center justify-center md:px-4 md:py-4">
              <PopupModal {...content} onClose={handleClose} maxSize={maxSize} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
