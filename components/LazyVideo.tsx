'use client'
import { useEffect, useRef } from 'react'

interface LazyVideoProps {
  src: string
  className?: string
  style?: React.CSSProperties
}

export default function LazyVideo({ src, className, style }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.load()
          video.play().catch(() => {})
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      loop
      muted
      playsInline
      preload="none"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}
