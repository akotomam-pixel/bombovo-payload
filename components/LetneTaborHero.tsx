'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import WaveDivider from '@/components/WaveDivider'

interface HeroPhoto {
  url: string
}

interface Props {
  headline: string
  body: string
  photos: HeroPhoto[]
}

function renderBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

export default function LetneTaborHero({ headline, body, photos }: Props) {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  const count = photos.length

  useEffect(() => {
    if (count < 2) return
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActive((prev) => (prev + 1) % count)
        setAnimating(false)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [count])

  // position index relative to active: 0 = front, 1 = mid, 2 = back
  const getPos = (i: number) => ((i - active + count) % count)

  const posStyles: Record<number, React.CSSProperties> = {
    0: {
      zIndex: 3,
      transform: 'translate(0, 0) rotate(0deg) scale(1)',
      opacity: 1,
      filter: 'none',
    },
    1: {
      zIndex: 2,
      transform: 'translate(28px, 18px) rotate(4deg) scale(0.90)',
      opacity: 0.55,
      filter: 'brightness(0.7)',
    },
    2: {
      zIndex: 1,
      transform: 'translate(50px, 32px) rotate(7deg) scale(0.82)',
      opacity: 0.3,
      filter: 'brightness(0.5)',
    },
  }

  return (
    <section className="bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8 md:pb-12">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

          {/* ── LEFT: Stacked photo carousel ── */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div
              className="relative"
              style={{ width: '100%', maxWidth: 480, aspectRatio: '4/3' }}
            >
              {photos.map((photo, i) => {
                const pos = getPos(i)
                if (pos > 2) return null
                const style = posStyles[pos]
                return (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
                    style={{
                      ...style,
                      transition: animating && pos === 0
                        ? 'opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease'
                        : 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease, filter 0.6s ease',
                    }}
                  >
                    <Image
                      src={photo.url}
                      alt={`Letný tábor ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 480px"
                      priority={i === active}
                    />
                  </div>
                )
              })}

            </div>
          </div>

          {/* ── RIGHT: Text ── */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold text-bombovo-dark leading-tight mb-6">
              {headline}
            </h1>
            <div className="space-y-4">
              {body.split('\n').filter(line => line.trim() !== '').map((para, i) => (
                <p key={i} className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  {renderBold(para)}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Blue hand-drawn divider at the bottom */}
      <WaveDivider color="blue" variant={2} />
    </section>
  )
}
