import Link from 'next/link'
import { lomyContent } from '@/data/lomy/content'

const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

/**
 * Redesigned overview-grid card for Horský hotel Lomy only — the other
 * strediská keep the original inline card in SkolyVPrirodClient. Price and
 * discount figures come from data/lomy/content.ts (the same source the
 * rebuilt Lomy page itself uses), not the generic Payload `price` string,
 * since that content file is the confirmed, actively-maintained number for
 * this stredisko.
 */
export default function LomyStrediskoCard({
  name,
  image,
  vypredane,
}: {
  name: string
  image: string
  vypredane?: boolean
}) {
  const { price, discount } = lomyContent.hero

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5 transition-shadow duration-300 ${
        vypredane
          ? 'cursor-default'
          : 'shadow-[0_2px_6px_-2px_rgba(8,7,8,0.10),0_20px_44px_-20px_rgba(55,114,255,0.35)] hover:shadow-[0_4px_10px_-2px_rgba(8,7,8,0.14),0_28px_60px_-18px_rgba(55,114,255,0.45)]'
      }`}
    >
      {vypredane && (
        <div
          className="absolute pointer-events-none z-10 text-white font-black text-sm text-center tracking-widest uppercase"
          style={{
            top: '36px',
            right: '-42px',
            width: '180px',
            padding: '9px 0',
            background: '#DC2626',
            transform: 'rotate(45deg)',
            boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
            letterSpacing: '0.12em',
          }}
        >
          Vypredané
        </div>
      )}

      <div className={vypredane ? 'grayscale opacity-75' : ''}>
        {/* Photo */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={`${name} – rekreačné stredisko pre školy v prírode`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

          {!vypredane && (
            <div className="absolute left-4 top-4 h-[86px] w-[86px] rounded-full bg-white shadow-[0_4px_14px_-2px_rgba(8,7,8,0.4)]">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#DF2935"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="3 5.2"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[17px] font-black leading-none tracking-tight text-bombovo-red">
                  {discount.amount}
                </span>
                <span className="my-[5px] h-px w-6 bg-bombovo-red/60" />
                <span className="text-[10px] font-bold leading-none tracking-tight text-bombovo-red">
                  {discount.deadline}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            style={{ fontFamily: SUBHEAD }}
            className="text-[26px] font-bold leading-[1.1] text-bombovo-dark"
          >
            {name}
          </h3>

          {vypredane ? (
            <div className="mt-5 flex-1 rounded-2xl bg-gray-300 p-4 text-center text-lg font-bold text-gray-500">
              Vypredané
            </div>
          ) : (
            <>
              <div className="mt-4 flex flex-col gap-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-[#7A807A]">{price.prefix}</span>
                  <span className="text-xl font-semibold tabular-nums text-[#6B726B] line-through decoration-2 decoration-[#6B726B]">
                    {price.amount}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[34px] font-black leading-none tabular-nums text-bombovo-dark">
                    {price.discounted}
                  </span>
                  <span className="text-sm text-[#9AA09A]">{price.unit}</span>
                </div>
              </div>

              <Link
                href={`/skoly-v-prirode/${lomyContent.slug}`}
                aria-label={`Škola v prírode na Horskom Hoteli Lomy`}
                className="mt-7 block"
              >
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-bombovo-dark bg-bombovo-yellow px-6 py-3.5 text-lg font-bold text-bombovo-dark shadow-[3px_3px_0_0_#080708] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#080708] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue">
                  Zistiť viac
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
