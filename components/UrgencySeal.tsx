import { WAVY_CIRCLE_PATH } from '@/components/DiscountSeal'

/**
 * The urgency seal — same scalloped wax-seal shape as DiscountSeal (imported,
 * not redrawn), but built for a count rather than a price: a big number
 * flanked by two small declined words, e.g. POSLEDNÉ / 2 / TERMÍNY.
 *
 * Only rendered when a stredisko has opted in via `terminy.upozornenie` and
 * still has open dates — see lib/terminyStatus.
 *
 * Two nested elements, not one: the caller's `className` (absolute, an
 * offset, a rotation) goes on the outer element, which only carries
 * positioning — never `relative` itself, since Tailwind's stylesheet orders
 * `.relative` after `.absolute` and would silently win regardless of class
 * order in the JSX, knocking the whole seal out of position (this broke the
 * first version). The inner element carries `relative` instead, purely as
 * the containing block for the pulse ring.
 */
export default function UrgencySeal({
  count,
  words,
  size,
  className = '',
}: {
  count: number
  words: { top: string; bottom: string }
  size: number
  className?: string
}) {
  return (
    <span className={className} style={{ display: 'inline-block', width: size, height: size }}>
      <span className="relative block h-full w-full">
        {/* Soft pulse ring, motion-safe only — draws the eye without nagging. */}
        <span
          aria-hidden
          className="motion-safe:animate-ping absolute inset-[6%] rounded-full bg-bombovo-red/50"
          style={{ animationDuration: '2.2s' }}
        />
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          role="img"
          aria-label={`${words.top} ${count} ${words.bottom}`}
          className="relative block"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(223,41,53,0.34))' }}
        >
          <path d={WAVY_CIRCLE_PATH} fill="#DF2935" />

          <text
            x="50"
            y="32"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.3"
            opacity="0.92"
          >
            {words.top}
          </text>

          <text x="50" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="32" fontWeight="800">
            {count}
          </text>

          <text
            x="50"
            y="76.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.3"
            opacity="0.92"
          >
            {words.bottom}
          </text>
        </svg>
      </span>
    </span>
  )
}
