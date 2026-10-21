'use client'

import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import Link from 'next/link'
import type { IconType } from 'react-icons'
import {
  PiCaretDownBold,
  PiCertificateDuotone,
  PiConfettiDuotone,
  PiFirstAidKitDuotone,
  PiGiftDuotone,
  PiSealCheckDuotone,
} from 'react-icons/pi'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ─── Editable content ──────────────────────────────────────────────────── */

const HERO_TITLE = 'Zaži brigádu plnú zážitkov, dobrodružstva a nových kamarátov'
const HERO_SUBTITLE = 'Začni kariéru v Bombove'
const HERO_MEDIA_LABEL = 'VIDEO / FOTO: animátori v akcii'

/** Sub-headings across the strediská pages are set in this face (Comic Neue). */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

type RoleId = 'animator' | 'zdravotnik'

type AccordionBody = {
  text?: string
  bullets?: string[]
  /** Smaller, muted line under the main text. */
  note?: string
}

type Role = {
  id: RoleId
  name: string
  photoLabel: string
  items: { icon: IconType; title: string; body: AccordionBody }[]
  cta: { label: string; href: string }
}

const ROLES: Role[] = [
  {
    id: 'animator',
    name: 'Animátor',
    photoLabel: 'FOTO: animátor s deťmi',
    items: [
      {
        icon: PiConfettiDuotone,
        title: 'Čo budeš robiť',
        body: {
          text: 'Pripravuješ a vedieš program pre deti na školách v prírode a letných táboroch. Hry, súťaže, šport, tvorivé dielne aj večerné programy. Si s deťmi celý deň a staráš sa o to, aby si pobyt užili.',
        },
      },
      {
        icon: PiGiftDuotone,
        title: 'Čo ti to dá',
        body: {
          bullets: [
            'Novú partiu ľudí, ktorí sú naladení ako ty',
            'Brigádu, pri ktorej sa zabavíš',
            'Certifikát zo školenia animátorov',
            'Zážitky, na ktoré budeš spomínať',
            '[DOPLNIŤ: odmena za turnus]',
          ],
        },
      },
      {
        icon: PiSealCheckDuotone,
        title: 'Podmienky',
        body: {
          bullets: [
            'Máš viac ako 18 rokov',
            'Si bezúhonný/á',
            'Absolvuješ 3-dňové školenie animátorov v Horskom hoteli Lomy',
          ],
        },
      },
    ],
    cta: { label: 'Chcem byť animátor', href: '/prihlaska-animator' },
  },
  {
    id: 'zdravotnik',
    name: 'Zdravotník',
    photoLabel: 'FOTO: zdravotník na tábore',
    items: [
      {
        icon: PiFirstAidKitDuotone,
        title: 'Čo budeš robiť',
        body: {
          text: 'Staráš sa o zdravie detí na školách v prírode, lyžiarskych výcvikoch a letných táboroch. Si súčasťou tímu a celý pobyt prežiješ s nami.',
        },
      },
      {
        icon: PiGiftDuotone,
        title: 'Čo ti to dá',
        body: {
          bullets: [
            '300 € za 5-dňovú školu v prírode alebo lyžiarsky výcvik',
            '300 – 350 € za 7-dňový letný tábor',
            'Ubytovanie a stravu hradíme my',
            'Partiu ľudí, s ktorými je radosť pracovať',
          ],
        },
      },
      {
        icon: PiCertificateDuotone,
        title: 'Podmienky',
        body: {
          text: 'Si odborne spôsobilá osoba: lekár, sestra, pôrodná asistentka alebo zdravotnícky záchranár.',
          note: 'Za zdravotníka sa nepovažuje absolvent kurzu Slovenského Červeného kríža, kurzu prvej pomoci ani študent medicíny.',
        },
      },
    ],
    cta: { label: 'Chcem byť zdravotník', href: '/prihlaska-zdravotnik' },
  },
]

const FAQ: { q: string; a: string }[] = [
  { q: 'Musím mať skúsenosti s animovaním?', a: '[DOPLNIŤ]' },
  { q: 'Ešte študujem. Môžem sa prihlásiť?', a: '[DOPLNIŤ]' },
  { q: 'Koľko si zarobím?', a: '[DOPLNIŤ]' },
  {
    q: 'Kde a kedy je školenie?',
    a: 'Školenie animátorov prebieha v Horskom hoteli Lomy (Horná Ves, okr. Prievidza). Termíny na rok 2027: [DOPLNIŤ].',
  },
  {
    q: 'Prečo sa školenie platí?',
    a: 'Poplatok za školenie animátorov je 30 €. Zahŕňa odborné školenie, ubytovanie aj stravu počas celého školenia.',
  },
  { q: 'Môžem sa prihlásiť spolu s kamarátom?', a: '[DOPLNIŤ]' },
]

const TESTIMONIALS: { quote: string; name: string; role: string; photoLabel: string }[] = [
  { quote: '[DOPLNIŤ: citát]', name: '[Meno]', role: 'Animátorka, 3 sezóny', photoLabel: 'FOTO' },
  { quote: '[DOPLNIŤ: citát]', name: '[Meno]', role: 'Zdravotníčka, 2 sezóny', photoLabel: 'FOTO' },
  { quote: '[DOPLNIŤ: citát]', name: '[Meno]', role: 'Animátor, 1 sezóna', photoLabel: 'FOTO' },
]

/* ─── Role colours ──────────────────────────────────────────────────────── */
/*
  Animátor is red, zdravotník is yellow, everywhere on the page. The animátor
  panel uses a soft tint of the red so dark text stays comfortable to read;
  the zdravotník panel can take the yellow at full strength.
*/
const ROLE_STYLE: Record<
  RoleId,
  { color: string; panel: string; photoTint: string; pillHover: string; button: string }
> = {
  animator: {
    color: '#DF2935',
    panel: '#FCDDDF',
    photoTint: '#FBE7E8',
    pillHover: 'hover:bg-[#FCE9EA]',
    button:
      'bg-[#DF2935] text-white shadow-[0_3px_0_0_#A81B24,0_10px_22px_-10px_rgba(223,41,53,0.7)] ' +
      'hover:bg-[#CC2430] hover:shadow-[0_3px_0_0_#A81B24,0_16px_28px_-12px_rgba(223,41,53,0.8)] ' +
      'active:translate-y-[3px] active:shadow-[0_0_0_0_#A81B24,0_6px_14px_-10px_rgba(223,41,53,0.65)]',
  },
  zdravotnik: {
    color: '#FDCA40',
    panel: '#FDCA40',
    photoTint: '#FEF1CC',
    pillHover: 'hover:bg-[#FFF6DC]',
    button:
      'bg-[#FDCA40] text-bombovo-dark shadow-[0_3px_0_0_#C99A16,0_10px_22px_-10px_rgba(201,154,22,0.75)] ' +
      'hover:bg-[#F5BD1F] hover:shadow-[0_3px_0_0_#C99A16,0_16px_28px_-12px_rgba(201,154,22,0.85)] ' +
      'active:translate-y-[3px] active:shadow-[0_0_0_0_#C99A16,0_6px_14px_-10px_rgba(201,154,22,0.7)]',
  },
}

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF]'

/* ─── Small building blocks ─────────────────────────────────────────────── */

/** Shows `[DOPLNIŤ…]` markers highlighted so missing copy is easy to spot. */
function WithMarkers({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <mark key={i} className="rounded-[4px] bg-[#3772FF]/12 px-1 font-semibold text-[#2A55C0]">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

/** Solid-colour photo stand-in with a fixed ratio, so real photos drop in without layout shift. */
function Placeholder({
  label,
  ratio,
  tint = '#EFF1EF',
  className = '',
}: {
  label: string
  ratio?: string
  tint?: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center px-4 text-center ${className}`}
      style={{ backgroundColor: tint, aspectRatio: ratio }}
    >
      <span className="text-[13px] font-semibold uppercase leading-[1.5] tracking-[0.06em] text-[#3A403A]/75">
        {label}
      </span>
    </div>
  )
}

/** The two role buttons — identical size and weight, only the colour differs. */
function RoleButton({ role, className = '' }: { role: Role; className?: string }) {
  return (
    <Link
      href={role.cta.href}
      className={
        'inline-flex min-h-[56px] items-center justify-center rounded-[9px] px-6 py-3.5 text-center text-[17px] font-bold leading-tight tracking-[0.02em] ' +
        'transition-[background-color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none ' +
        `${ROLE_STYLE[role.id].button} ${FOCUS} ${className}`
      }
    >
      {role.cta.label}
    </Link>
  )
}

function RoleButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      {ROLES.map((role) => (
        <RoleButton key={role.id} role={role} className="w-full" />
      ))}
    </div>
  )
}

/** Chevron that flips when its accordion is open. */
function Chevron({ open }: { open: boolean }) {
  return (
    <PiCaretDownBold
      aria-hidden
      className={`h-5 w-5 shrink-0 text-bombovo-dark transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
        open ? 'rotate-180' : ''
      }`}
    />
  )
}

/** Height animates via grid rows (0fr → 1fr), the content fades with opacity. */
function Collapse({ open, id, labelledBy, children }: { open: boolean; id: string; labelledBy: string; children: ReactNode }) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
      inert={!open ? true : undefined}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

/* ─── Koho práve hľadáme? ───────────────────────────────────────────────── */

function RolePanel({ role }: { role: Role }) {
  const [open, setOpen] = useState(0)
  const baseId = useId()
  const style = ROLE_STYLE[role.id]

  return (
    <div className="grid gap-7 lg:grid-cols-[55fr_45fr] lg:gap-12">
      {/* Left: role name + framed photo */}
      <div>
        <h3 className="text-[clamp(2.25rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-bombovo-dark">
          {role.name}
        </h3>
        <div className="mt-5 rounded-[24px] bg-white p-3 shadow-[0_1px_2px_rgba(8,7,8,0.05),0_22px_44px_-28px_rgba(8,7,8,0.45)] md:mt-7">
          <Placeholder label={role.photoLabel} ratio="3 / 2" tint={style.photoTint} className="w-full rounded-[14px]" />
        </div>
      </div>

      {/* Right: accordions + CTA */}
      <div className="flex flex-col lg:pt-2">
        <ul className="flex flex-col gap-5">
          {role.items.map((item, i) => {
            const isOpen = open === i
            const Icon = item.icon
            const btnId = `${baseId}-btn-${i}`
            const bodyId = `${baseId}-body-${i}`
            return (
              <li key={item.title}>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={`group flex w-full items-center gap-4 rounded-[10px] py-1 text-left ${FOCUS}`}
                >
                  <Icon aria-hidden className="h-9 w-9 shrink-0 text-bombovo-dark" />
                  <span className="flex-1 text-[19px] font-bold leading-tight text-bombovo-dark transition-opacity duration-150 group-hover:opacity-70 group-active:opacity-50 md:text-[20px]">
                    {item.title}
                  </span>
                  <Chevron open={isOpen} />
                </button>
                <Collapse open={isOpen} id={bodyId} labelledBy={btnId}>
                  <div className="pl-[52px] pr-2 pt-2 text-[16px] leading-[1.7] text-[#1F2320] md:text-[17px]">
                    {item.body.text && (
                      <p>
                        <WithMarkers text={item.body.text} />
                      </p>
                    )}
                    {item.body.bullets && (
                      <ul className="flex flex-col gap-1.5">
                        {item.body.bullets.map((b) => (
                          <li key={b} className="flex gap-3">
                            <span aria-hidden className="mt-[0.7em] h-[6px] w-[6px] shrink-0 rounded-full bg-bombovo-dark" />
                            <span>
                              <WithMarkers text={b} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.body.note && <p className="mt-3 text-[14px] leading-[1.6] text-[#1F2320]/65">{item.body.note}</p>}
                  </div>
                </Collapse>
              </li>
            )
          })}
        </ul>

        {/* Galileo-style CTA: hard offset shadow that the button "presses" into. */}
        <Link
          href={role.cta.href}
          className={
            'mt-8 inline-flex min-h-[56px] w-full items-center justify-center rounded-full border-2 border-bombovo-dark bg-white px-8 py-3.5 text-[17px] font-bold text-bombovo-dark sm:w-auto sm:self-start ' +
            'shadow-[5px_5px_0_0_#080708] transition-[transform,box-shadow] duration-150 ease-out motion-reduce:transition-none ' +
            'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_#080708] ' +
            'active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0_0_0_0_#080708] ' +
            FOCUS
          }
        >
          {role.cta.label}
        </Link>
      </div>
    </div>
  )
}

function KohoHladameSection() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const role = ROLES[active]

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = ROLES.length - 1
    let next = active
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    else return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        {/* Heading row: title left, tab pills right (wrap below on mobile) */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <h2
            className="text-[40px] font-bold leading-[1.02] tracking-[-0.02em] text-bombovo-dark md:text-[56px] lg:text-[64px]"
            style={{ fontFamily: SUBHEAD }}
          >
            Koho práve hľadáme?
          </h2>

          <div role="tablist" aria-label="Pozície" className="flex flex-wrap gap-3" onKeyDown={onKeyDown}>
            {ROLES.map((r, i) => {
              const selected = i === active
              const s = ROLE_STYLE[r.id]
              return (
                <button
                  key={r.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  id={`${baseId}-tab-${r.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={
                    'rounded-full border-[3px] px-7 py-3 text-[17px] leading-none text-bombovo-dark ' +
                    'transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none ' +
                    `${selected ? 'font-bold' : `bg-white font-normal ${s.pillHover}`} ${FOCUS}`
                  }
                  style={{ borderColor: s.color, backgroundColor: selected ? s.color : undefined }}
                >
                  {r.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* The panel — colour follows the active tab */}
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${role.id}`}
          className="mt-8 rounded-[32px] px-5 py-7 transition-[background-color] duration-300 ease-out motion-reduce:transition-none sm:px-8 sm:py-10 md:mt-10 lg:px-12 lg:py-12"
          style={{ backgroundColor: ROLE_STYLE[role.id].panel }}
        >
          {/* key resets the accordion (first item open) on every tab switch */}
          <RolePanel key={role.id} role={role} />
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ───────────────────────────────────────────────────────────────── */

function FaqSection() {
  const [open, setOpen] = useState(-1)
  const baseId = useId()

  return (
    <section className="bg-bombovo-gray">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
        <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-bombovo-dark">
          Časté otázky
        </h2>

        <ul className="mt-7 overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(8,7,8,0.04),0_24px_50px_-34px_rgba(8,7,8,0.35)] md:mt-9">
          {FAQ.map((item, i) => {
            const isOpen = open === i
            const btnId = `${baseId}-q-${i}`
            const bodyId = `${baseId}-a-${i}`
            return (
              <li key={item.q} className={i > 0 ? 'border-t border-[#E6E8E6]' : ''}>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={`flex w-full items-center gap-4 px-5 py-5 text-left transition-[background-color] duration-150 hover:bg-[#F6F7F6] active:bg-[#EEF0EE] md:px-7 ${FOCUS} focus-visible:outline-offset-[-2px]`}
                >
                  <span className="flex-1 text-[17px] font-semibold leading-snug text-bombovo-dark md:text-[18px]">{item.q}</span>
                  <Chevron open={isOpen} />
                </button>
                <Collapse open={isOpen} id={bodyId} labelledBy={btnId}>
                  <p className="px-5 pb-6 text-[16px] leading-[1.7] text-[#1F2320] md:px-7 md:text-[17px]">
                    <WithMarkers text={item.a} />
                  </p>
                </Collapse>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ─── Testimonials ──────────────────────────────────────────────────────── */

function TestimonialsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl py-12 md:py-20">
        <h2 className="px-4 text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-bombovo-dark sm:px-6 lg:px-8">
          Čo hovoria naši animátori a zdravotníci
        </h2>

        {/* Horizontal swipe on mobile, three columns from md up */}
        <ul className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 md:mt-9 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 lg:px-8">
          {TESTIMONIALS.map((t, i) => (
            <li
              key={i}
              className="flex w-[84%] shrink-0 snap-start flex-col rounded-[16px] bg-[#FBFCFB] p-6 ring-1 ring-[#E1E4E1] shadow-[0_1px_2px_rgba(8,7,8,0.04),0_20px_40px_-30px_rgba(8,7,8,0.35)] md:w-auto md:p-7"
            >
              <blockquote className="flex-1 text-[17px] leading-[1.7] text-[#1F2320]">
                „<WithMarkers text={t.quote} />“
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <Placeholder label={t.photoLabel} ratio="1 / 1" className="w-14 shrink-0 rounded-full" />
                <div>
                  <p className="text-[17px] font-bold leading-tight text-bombovo-dark">
                    <WithMarkers text={t.name} />
                  </p>
                  <p className="mt-1 text-[14px] text-[#1F2320]/65">{t.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PridajSaDoTimuClient() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* ─── HERO ─── */}
      <section className="bg-bombovo-gray">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-9 sm:px-6 md:pt-12 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-16">
          <div className="lg:col-span-6">
            <h1 className="text-[clamp(2.1rem,5.2vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.035em] text-bombovo-dark">
              {HERO_TITLE}
            </h1>
            <p
              className="mt-4 text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold leading-tight text-[#3772FF] md:mt-5"
              style={{ fontFamily: SUBHEAD }}
            >
              {HERO_SUBTITLE}
            </p>
            <div className="mt-7 md:mt-9">
              <RoleButtons />
            </div>
          </div>

          {/*
            Media slot. The box owns the ratio; whatever goes inside fills it
            with `absolute inset-0 h-full w-full object-cover`, so swapping the
            placeholder for an <img> now or a
            <video autoPlay muted loop playsInline poster="…"> later keeps the
            layout identical.
          */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-[0_18px_40px_-24px_rgba(8,7,8,0.45)] lg:aspect-[5/4]">
              <Placeholder label={HERO_MEDIA_LABEL} tint="#F9F0D4" className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      <KohoHladameSection />
      <FaqSection />
      <TestimonialsSection />

      {/* ─── FINAL CTA ─── */}
      <section className="bg-bombovo-dark">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 md:py-20">
          <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
            Tak čo, ideš do toho?
          </h2>
          <div className="mt-8">
            <RoleButtons />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
