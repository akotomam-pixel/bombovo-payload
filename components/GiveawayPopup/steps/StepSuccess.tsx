'use client'

import { useEffect } from 'react'

interface Props {
  successHeadline: string
  successBody: string
  onClose: () => void
}

export default function StepSuccess({ onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 10000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="flex flex-col items-center gap-4 w-full text-center">
      <div className="text-6xl">🎉</div>

      <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark leading-tight pb-2">
        <span className="relative inline-block">
          Si v hre o tábor zadarmo!
          <svg
            className="absolute left-0 -bottom-2 w-full"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            style={{ height: '10px' }}
          >
            <path
              d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
              stroke="#DF2935"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h2>

      <p className="text-bombovo-dark/50 font-medium text-base leading-relaxed">
        Sleduj svoj email — víťaza oznámime pred letom. Veľa šťastia! 🤞
      </p>
    </div>
  )
}
