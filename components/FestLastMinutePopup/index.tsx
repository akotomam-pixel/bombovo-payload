'use client'

import { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import PopupModal from './PopupModal'
import type { PopupContent } from './PopupModal'

const SESSION_KEY = 'bombovo_fest_last_minute_seen'
const SUBMITTED_KEY = 'bombovo_fest_last_minute_submitted'
const SUPPRESS_DAYS = 2

interface Props extends PopupContent {
  delaySeconds: number
}

export default function FestLastMinutePopup({ delaySeconds, ...content }: Props) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [maxSize, setMaxSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    setMaxSize({
      w: window.innerWidth - 80,
      h: window.innerHeight - 30,
    })
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Already seen this session — don't show
    if (sessionStorage.getItem(SESSION_KEY)) return

    // Submitted within the last 2 days — don't show
    const submittedAt = localStorage.getItem(SUBMITTED_KEY)
    if (submittedAt) {
      const elapsed = Date.now() - Number(submittedAt)
      if (elapsed < SUPPRESS_DAYS * 24 * 60 * 60 * 1000) return
    }

    // Pre-fetch the popup image in the background so it's cached when popup opens
    if (content.photoUrl) {
      const preload = new window.Image()
      preload.src = `/_next/image?url=${encodeURIComponent(content.photoUrl)}&w=1200&q=80`
    }

    const timer = setTimeout(() => {
      setVisible(true)
    }, delaySeconds * 1000)

    return () => clearTimeout(timer)
  }, [mounted, delaySeconds, content.photoUrl])

  const handleClose = useCallback(() => {
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }, [])

  if (!mounted) return null

  return ReactDOM.createPortal(
    <>
      {visible && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full h-full flex items-center justify-center md:px-4 md:py-4">
              <PopupModal {...content} onClose={handleClose} maxSize={maxSize} />
            </div>
          </div>
        </>
      )}
    </>,
    document.body,
  )
}
