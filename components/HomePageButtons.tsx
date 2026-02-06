'use client'

import Link from 'next/link'

export default function HomePageButtons() {
  return (
    // Only visible on mobile (< 768px)
    <div className="md:hidden bg-bombovo-gray px-6 py-6">
      <div className="flex justify-center items-center gap-8">
        {/* Letné tábory - Black text with yellow hand-drawn underline */}
        <Link 
          href="/letne-tabory"
          className="relative group"
        >
          <span className="text-bombovo-dark font-semibold text-lg">
            Letné tábory
          </span>
          {/* Yellow hand-drawn underline */}
          <svg 
            className="absolute -bottom-1 left-0 w-full h-2 text-bombovo-yellow"
            viewBox="0 0 120 6"
            preserveAspectRatio="none"
          >
            <path
              d="M1 3 Q30 1, 60 3 T119 3"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        {/* Pre školy - Black text with red hand-drawn underline */}
        <Link 
          href="/skoly-v-prirode"
          className="relative group"
        >
          <span className="text-bombovo-dark font-semibold text-lg">
            Pre školy
          </span>
          {/* Red hand-drawn underline */}
          <svg 
            className="absolute -bottom-1 left-0 w-full h-2 text-bombovo-red"
            viewBox="0 0 120 6"
            preserveAspectRatio="none"
          >
            <path
              d="M1 3 Q30 1, 60 3 T119 3"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
