/**
 * Content + validation for the two application pages (/prihlaska-animator,
 * /prihlaska-zdravotnik) and their API routes.
 *
 * Plain data only (no React), so the server routes can import the same
 * termíny and validation rules the form uses.
 */

// ─── Training dates — edit here ──────────────────────────────────────────────
// 2027 školenie termíny on Horský hotel Lomy. A single date is preselected.
export const TERMINY_ANIMATOR = ['05.03. – 07.03.2027', '12.03. – 14.03.2027', '19.03. – 21.03.2027']
export const TERMINY_ZDRAVOTNIK = ['06.03. – 07.03.2027', '13.03. – 14.03.2027', '20.03. – 21.03.2027']

export const IBAN = 'SK92 5600 0000 0008 3462 3001'
export const MIESTO = 'Horský hotel Lomy'
export const CONTACT_EMAIL = 'bombovo@bombovo.sk'

export const VZDELANIE_OPTIONS = ['Lekár/ka', 'Sestra', 'Pôrodná asistentka', 'Zdravotnícky záchranár/ka']

export type PrihlaskaRole = 'animator' | 'zdravotnik'

export type PrihlaskaConfig = {
  role: PrihlaskaRole
  /** Used in emails and the H1, e.g. "Animátor". */
  roleName: string
  title: string
  intro: string
  chips: string[]
  terminy: string[]
  fee: number
  feeNote: string
  dobreVediet: { q: string; a: string }[]
}

const NEVIEM_PRIST = {
  q: 'Čo ak nakoniec nebudem môcť prísť?',
  a: 'Ak nebudeš môcť prísť, poplatok ti vrátime v plnej sume. Daj nám čo najskôr vedieť na bombovo@bombovo.sk.',
}

export const PRIHLASKA: Record<PrihlaskaRole, PrihlaskaConfig> = {
  animator: {
    role: 'animator',
    roleName: 'Animátor',
    title: 'Prihláška animátor',
    intro: 'Vyber si termín školenia a vyplň pár údajov. Zaberie ti to len pár minút.',
    chips: ['3-dňové školenie', 'Horský hotel Lomy', 'Poplatok 30 €'],
    terminy: TERMINY_ANIMATOR,
    fee: 30,
    feeNote:
      'Zahŕňa odborné školenie, 2× ubytovanie a plnú penziu počas školenia. Uhrádzaš až po odoslaní prihlášky, do 14 dní.',
    dobreVediet: [
      {
        q: 'Prečo sa školenie platí?',
        a: 'Poplatok 30 € pokrýva odborné školenie, ubytovanie na dve noci a plnú penziu na Horskom hoteli Lomy. Na konci získaš certifikát.',
      },
      NEVIEM_PRIST,
      {
        q: 'Dostanem po školení prácu?',
        a: 'Po úspešnom absolvovaní školenia ťa nominujeme na školy v prírode. Keď ťa pedagógovia a boss (šéf animátor) ohodnotia dobre, môžeš ísť aj na letné tábory.',
      },
      { q: 'Podmienky', a: 'Viac ako 18 rokov k 1. 7. 2027, bezúhonnosť a účasť na školení.' },
    ],
  },
  zdravotnik: {
    role: 'zdravotnik',
    roleName: 'Zdravotník',
    title: 'Prihláška zdravotník',
    intro: 'Vyber si termín školenia a vyplň pár údajov. Zaberie ti to len pár minút.',
    chips: ['2-dňové školenie', 'Horský hotel Lomy', 'Poplatok 20 €'],
    terminy: TERMINY_ZDRAVOTNIK,
    fee: 20,
    feeNote:
      'Zahŕňa odborné školenie, ubytovanie a stravu počas školenia. Uhrádzaš až po odoslaní prihlášky, do 14 dní.',
    dobreVediet: [
      {
        q: 'Kto sa môže prihlásiť?',
        a: 'Odborne spôsobilá osoba: lekár, sestra, pôrodná asistentka alebo zdravotnícky záchranár. Za zdravotníka sa nepovažuje absolvent kurzu Slovenského Červeného kríža, kurzu prvej pomoci ani študent medicíny.',
      },
      {
        q: 'Prečo školenie, keď som zdravotník?',
        a: 'Práca s deťmi v zariadení pre deti a mládež, na škole v prírode, lyžiarskom výcviku či v letnom tábore je iná ako v nemocnici alebo ambulancii. Na školení sa dozvieš, ako takýto pobyt funguje, aké situácie s deťmi môžu nastať a ako sa v nich zachovať, aby si bol/a na všetko pripravený/á.',
      },
      {
        q: 'Koľko zarobím?',
        a: '300 € za 5-dňovú školu v prírode alebo lyžiarsky výcvik, 300 – 350 € za 7-dňový letný tábor. Ubytovanie a stravu hradíme my.',
      },
      NEVIEM_PRIST,
    ],
  },
}

// ─── Form data + validation (shared by client and server) ────────────────────

export type PrihlaskaData = {
  termin: string
  titul: string
  meno: string
  priezvisko: string
  adresa: string
  psc: string
  mesto: string
  telefon: string
  email: string
  vzdelanie: string
  strava: string
  kamarat: string
  gdpr: boolean
}

export const EMPTY_DATA: PrihlaskaData = {
  termin: '',
  titul: '',
  meno: '',
  priezvisko: '',
  adresa: '',
  psc: '',
  mesto: '',
  telefon: '',
  email: '',
  vzdelanie: '',
  strava: '',
  kamarat: '',
  gdpr: false,
}

export type PrihlaskaErrors = Partial<Record<keyof PrihlaskaData, string>>

const REQUIRED = 'Toto pole je povinné.'
const MAX_LEN = 500

/** Returns Slovak error messages per field; an empty object means the data is valid. */
export function validatePrihlaska(role: PrihlaskaRole, d: PrihlaskaData): PrihlaskaErrors {
  const e: PrihlaskaErrors = {}
  const cfg = PRIHLASKA[role]
  const t = (s: string) => (s ?? '').trim()

  if (!cfg.terminy.includes(d.termin)) e.termin = 'Vyber si termín školenia.'
  if (!t(d.meno)) e.meno = REQUIRED
  if (!t(d.priezvisko)) e.priezvisko = REQUIRED
  if (!t(d.adresa)) e.adresa = REQUIRED
  if (!t(d.psc)) e.psc = REQUIRED
  else if (!/^\d{3}\s?\d{2}$/.test(t(d.psc))) e.psc = 'PSČ má 5 číslic, napr. 971 01.'
  if (!t(d.mesto)) e.mesto = REQUIRED
  if (!t(d.telefon)) e.telefon = REQUIRED
  else if ((t(d.telefon).match(/\d/g) ?? []).length < 9) e.telefon = 'Zadaj celé telefónne číslo, napr. 0900 123 456.'
  if (!t(d.email)) e.email = REQUIRED
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t(d.email))) e.email = 'Skontroluj email, niečo v ňom chýba.'
  if (role === 'zdravotnik' && !VZDELANIE_OPTIONS.includes(d.vzdelanie)) e.vzdelanie = 'Vyber svoju odbornosť.'
  if (!d.gdpr) e.gdpr = 'Bez súhlasu ti prihlášku nemôžeme spracovať.'

  for (const key of Object.keys(EMPTY_DATA) as (keyof PrihlaskaData)[]) {
    const v = d[key]
    if (typeof v === 'string' && v.length > MAX_LEN && !e[key]) e[key] = 'Text je príliš dlhý.'
  }
  return e
}

/** The payment note the applicant must write: "Meno Priezvisko, termín". */
export const paymentNote = (d: Pick<PrihlaskaData, 'meno' | 'priezvisko' | 'termin'>) =>
  `${d.meno.trim()} ${d.priezvisko.trim()}, ${d.termin}`
