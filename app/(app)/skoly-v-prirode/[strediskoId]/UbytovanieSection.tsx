'use client'

import DistanceCalculator from './DistanceCalculator'
import type { LomyUbytovanie } from '@/data/lomy/types'

/**
 * "Ubytovanie a lokalita" — the full spec for the venue, where section 3 gave
 * the highlights. The repetition between them is intended.
 *
 * The distance module is the existing DistanceCalculator, which already pairs
 * the lookup with a map side by side, matching the draft's "modul … vedľa mapy".
 */

/** Sub-headings across the page are set in this face by explicit instruction. */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

/** Amenity glyphs, drawn in the same hand as the other sections' icons. */
const VYBAVENIE_ICONS: JSX.Element[] = [
  // Tiered seating around a fire — the amphitheatre.
  (
    <>
      <path d="M5.6 15.4a6.4 6.4 0 0 1 12.8 0" />
      <path d="M2.8 15.4a9.2 9.2 0 0 1 18.4 0" />
      <path d="M12 11.6V6.4M9.9 8.2 12 6.1l2.1 2.1" />
    </>
  ),
  // A pitch with a centre circle.
  (
    <>
      <rect x="2.8" y="5.6" width="18.4" height="12.8" rx="1.8" />
      <path d="M12 5.6v12.8" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  // A gazebo roof over a bench.
  (
    <>
      <path d="M2.8 10.4 12 4.6l9.2 5.8" />
      <path d="M5.4 10.4v9M18.6 10.4v9" />
      <path d="M8 15.4h8M8 15.4v3.6M16 15.4v3.6" />
    </>
  ),
  // A room with a swing — common rooms and the playground.
  (
    <>
      <rect x="3" y="5.4" width="18" height="13.2" rx="2" />
      <path d="M7.2 9.4v5.2M16.8 9.4v5.2" />
      <path d="M7.2 11.4h9.6" />
      <path d="M10.4 14.6v4M13.6 14.6v4" />
    </>
  ),
  // A screen on a stand — projector and TV.
  (
    <>
      <rect x="3" y="4.8" width="18" height="11.4" rx="1.8" />
      <path d="M12 16.2v3M8.4 19.2h7.2" />
      <path d="M7.6 8.6h5.2M7.6 11.8h8.8" />
    </>
  ),
  // Water — the outdoor pool.
  (
    <>
      <path d="M2.6 16.4c1.6 0 1.6 1.4 3.1 1.4s1.6-1.4 3.1-1.4 1.6 1.4 3.2 1.4 1.6-1.4 3.1-1.4 1.6 1.4 3.1 1.4 1.6-1.4 3.2-1.4" />
      <path d="M2.6 12.2c1.6 0 1.6 1.4 3.1 1.4s1.6-1.4 3.1-1.4 1.6 1.4 3.2 1.4 1.6-1.4 3.1-1.4 1.6 1.4 3.1 1.4 1.6-1.4 3.2-1.4" />
      <path d="M7.4 9.6V6.2a1.8 1.8 0 0 1 3.6 0M14.2 9.6V6.2a1.8 1.8 0 0 1 3.6 0" />
    </>
  ),
  // Stacked crates — the materials store.
  (
    <>
      <rect x="3.2" y="12.6" width="7.4" height="6.2" rx="1.2" />
      <rect x="13.4" y="12.6" width="7.4" height="6.2" rx="1.2" />
      <rect x="8.3" y="5.4" width="7.4" height="6.2" rx="1.2" />
    </>
  ),
]

export default function UbytovanieSection({ content }: { content: LomyUbytovanie }) {
  const { heading, ubytovanie, vybavenie, mapa } = content

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2 className="text-[clamp(1.5rem,3vw,2.15rem)] font-bold leading-[1.12] tracking-[-0.03em] text-bombovo-dark">
          {heading}
        </h2>

        {/*
          Two columns: everything the section has to say on the left, the map
          and the distance lookup stacked together on the right.
        */}
        <div className="mt-7 grid gap-8 md:mt-9 lg:grid-cols-12 lg:gap-10">
          {/* Left column — ubytovanie above vybavenie, as plain content. */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div>
            <h3
              className="text-[24px] leading-none text-bombovo-dark md:text-[27px]"
              style={{ fontFamily: SUBHEAD }}
            >
              {ubytovanie.title}
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {ubytovanie.rooms.map((room) => (
                <div
                  key={room.label}
                  className="rounded-[12px] bg-white p-5 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD]"
                >
                  <p className="text-[17px] font-bold text-bombovo-dark">{room.label}</p>
                  <p className="mt-1 text-[17px] leading-[1.65] text-[#1F2320]">{room.detail}</p>
                </div>
              ))}

              {/* Capacity reads as a figure, not another bullet. */}
              <div className="flex items-baseline justify-between gap-4 rounded-[12px] bg-bombovo-dark px-5 py-4">
                <span className="text-[17px] font-medium text-[#E6E8E6]/75">
                  {ubytovanie.capacity.label}
                </span>
                <span className="text-[20px] font-bold leading-none text-bombovo-yellow tabular-nums">
                  {ubytovanie.capacity.value}
                </span>
              </div>
            </div>
            </div>

            {/* Amenities, directly below in the same column. */}
            <div>
            <h3
              className="text-[24px] leading-none text-bombovo-blue md:text-[27px]"
              style={{ fontFamily: SUBHEAD }}
            >
              {vybavenie.title}
            </h3>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {vybavenie.items.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-[12px] bg-[#EFF1EF] px-4 py-3.5"
                >
                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px] text-bombovo-blue"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {VYBAVENIE_ICONS[i]}
                    </svg>
                  </span>
                  <span className="text-[17px] font-medium leading-[1.6] text-bombovo-dark">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            </div>
          </div>

          {/*
            Right column. The map leads on desktop; on mobile the lookup comes
            first, so someone on a phone reaches the input without scrolling
            past a map they cannot act on yet.
          */}
          <div className="flex flex-col lg:col-span-5">
            <iframe
              title="Mapa — Horský hotel Lomy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapa.coordinates.lng - 0.035}%2C${mapa.coordinates.lat - 0.018}%2C${mapa.coordinates.lng + 0.035}%2C${mapa.coordinates.lat + 0.018}&layer=mapnik&marker=${mapa.coordinates.lat}%2C${mapa.coordinates.lng}`}
              className="order-3 mt-6 h-[280px] w-full rounded-[12px] ring-1 ring-[#DDE0DD] md:h-[320px] lg:order-1 lg:mt-0"
              style={{ border: 0 }}
              loading="lazy"
            />

            <h3
              className="order-1 text-[24px] leading-[1.15] text-bombovo-red md:text-[27px] lg:order-2 lg:mt-6"
              style={{ fontFamily: SUBHEAD }}
            >
              {mapa.title}
            </h3>

            <div className="order-2 mt-4 lg:order-3">
              <DistanceCalculator
                strediskoName="Horský hotel Lomy"
                coordinates={mapa.coordinates}
                hideMap
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
