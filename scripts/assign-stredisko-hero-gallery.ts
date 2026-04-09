import { config as loadDotenv } from 'dotenv'
import path from 'path'

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL ?? ''
const ADMIN_PASS = process.env.PAYLOAD_ADMIN_PASSWORD ?? ''

// Prefer long-lived token to avoid login overhead.
// Set in `.env.local` as PAYLOAD_API_TOKEN (JWT string).
const API_TOKEN =
  process.env.PAYLOAD_API_TOKEN ??
  process.env.PAYLOAD_JWT ??
  process.env.PAYLOAD_TOKEN ??
  ''

type MediaDoc = { id: number; filename: string }

function parseArgs(argv: string[]) {
  const args = new Map<string, string>()
  for (const raw of argv.slice(2)) {
    const [k, ...rest] = raw.split('=')
    if (!k || rest.length === 0) continue
    args.set(k.replace(/^--/, ''), rest.join('='))
  }
  const slug = args.get('slug') ?? ''
  const prefix = args.get('prefix') ?? ''
  const prefixesRaw = args.get('prefixes') ?? ''
  const prefixes = prefixesRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const to = Number.parseInt(args.get('to') ?? '', 10)
  const count = Number.parseInt(args.get('count') ?? '', 10)
  const dense = (args.get('dense') ?? '0') === '1'
  const from = Number.parseInt(args.get('from') ?? '1', 10)
  const verify = (args.get('verify') ?? '1') !== '0'
  const allowMissing = (args.get('allowMissing') ?? '0') === '1'

  if (!slug) throw new Error('Missing required arg: --slug=penzion-sabina')
  if (!prefix && prefixes.length === 0) throw new Error('Missing required arg: --prefix=sabina (or --prefixes=a,b,c)')
  if (!Number.isFinite(from) || from <= 0) throw new Error('Invalid arg: --from must be >= 1')

  const hasTo = Number.isFinite(to) && to > 0
  const hasCount = Number.isFinite(count) && count > 0
  if (!hasTo && !hasCount) throw new Error('Missing required arg: --to=25 (or use --dense=1 --count=15)')
  if (hasTo && hasCount) throw new Error('Use either --to=... or --count=..., not both')
  if (hasCount && !dense) throw new Error('When using --count=..., also pass --dense=1')

  return { slug, prefix, prefixes, from, to: hasTo ? to : undefined, count: hasCount ? count : undefined, dense, verify, allowMissing }
}

async function login(): Promise<string> {
  if (API_TOKEN) return API_TOKEN

  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  if (!res.ok) throw new Error(`Login failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as { token?: string }
  if (!data.token) throw new Error('No token in login response')
  return data.token
}

async function getMediaMatchingPrefix(token: string, prefix: string): Promise<MediaDoc[]> {
  // Try server-side filtering first (cheaper than scanning everything).
  // If Payload rejects the operator, we fall back to unfiltered pagination.
  const base = `${BASE_URL}/api/media?limit=100&depth=0&sort=-id`
  const candidates: string[] = [
    `${base}&where[filename][like]=${encodeURIComponent(prefix)}`,
    `${base}&where[filename][contains]=${encodeURIComponent(prefix)}`,
  ]

  for (const firstUrl of candidates) {
    try {
      let all: MediaDoc[] = []
      let page = 1
      while (true) {
        const url = `${firstUrl}&page=${page}`
        const res = await fetch(url, { headers: { Authorization: `JWT ${token}` } })
        if (!res.ok) throw new Error(await res.text())
        const data = (await res.json()) as { docs: MediaDoc[]; hasNextPage?: boolean }
        all = all.concat(data.docs)
        if (!data.hasNextPage) break
        page++
      }
      return all
    } catch {
      // continue to next operator
    }
  }

  // Fallback: fetch all, then filter locally.
  let all: MediaDoc[] = []
  let page = 1
  while (true) {
    const res = await fetch(`${base}&page=${page}`, { headers: { Authorization: `JWT ${token}` } })
    if (!res.ok) throw new Error(`Media fetch failed (${res.status}): ${await res.text()}`)
    const data = (await res.json()) as { docs: MediaDoc[]; hasNextPage?: boolean }
    all = all.concat(data.docs)
    if (!data.hasNextPage) break
    page++
  }
  const re = new RegExp(prefix, 'i')
  return all.filter((m) => re.test(m.filename ?? ''))
}

async function getMediaMatchingPrefixes(token: string, prefixes: string[]): Promise<MediaDoc[]> {
  const uniq = new Map<number, MediaDoc>()
  for (const p of prefixes) {
    const docs = await getMediaMatchingPrefix(token, p)
    for (const d of docs) uniq.set(d.id, d)
  }
  return Array.from(uniq.values())
}

async function getStredisko(
  token: string,
  slug: string,
): Promise<{ id: number; heroGallery?: Array<{ photo: { id: number; filename: string } }> }> {
  const res = await fetch(
    `${BASE_URL}/api/strediska?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  if (!res.ok) throw new Error(`Stredisko fetch failed (${res.status}): ${await res.text()}`)
  const data = (await res.json()) as {
    docs: Array<{ id: number; heroGallery?: Array<{ photo: { id: number; filename: string } }> }>
  }
  if (!data.docs.length) throw new Error(`Stredisko not found: ${slug}`)
  return data.docs[0]
}

async function updateHeroGallery(token: string, strediskoId: number, heroGallery: Array<{ photo: number }>) {
  const res = await fetch(`${BASE_URL}/api/strediska/${strediskoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ heroGallery }),
  })
  if (!res.ok) throw new Error(`Update failed for stredisko ${strediskoId}: ${await res.text()}`)
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function makeNumberExtractor(prefixOrPrefixes: string | string[]) {
  const parts = Array.isArray(prefixOrPrefixes) ? prefixOrPrefixes : [prefixOrPrefixes]
  const alternation = parts.map(escapeRegex).join('|')
  const re = new RegExp(`^(?:${alternation})[\\s-_]*0*(\\d+)(?:\\D|$)`, 'i')
  return (filename: string): number | null => {
    const match = filename.match(re)
    if (!match) return null
    return Number.parseInt(match[1], 10)
  }
}

async function main() {
  const { slug, prefix, prefixes, from, to, count, dense, verify, allowMissing } = parseArgs(process.argv)
  const token = await login()

  const effectivePrefixes = prefixes.length ? prefixes : [prefix]
  const numberFromFilename = makeNumberExtractor(effectivePrefixes)
  const allMedia = (await getMediaMatchingPrefixes(token, effectivePrefixes)).filter(
    (m) => numberFromFilename(m.filename ?? '') !== null,
  )

  // For each number, pick the highest ID (newest).
  const byNumber = new Map<number, MediaDoc>()
  for (const doc of allMedia) {
    const n = numberFromFilename(doc.filename ?? '')
    if (n === null) continue
    if (n < from) continue
    if (!dense && typeof to === 'number' && n > to) continue
    const existing = byNumber.get(n)
    if (!existing || doc.id > existing.id) byNumber.set(n, doc)
  }

  let picked: Array<{ n: number; doc: MediaDoc }> = []
  let desiredCount = 0
  let missing: number[] = []

  if (dense) {
    desiredCount = count ?? 0
    const nums = Array.from(byNumber.keys()).sort((a, b) => a - b)
    picked = nums.slice(0, desiredCount).map((n) => ({ n, doc: byNumber.get(n)! }))

    if (picked.length < desiredCount && allowMissing) {
      const usedIds = new Set(picked.map((p) => p.doc.id))
      const extras = allMedia
        .filter((m) => !usedIds.has(m.id))
        .sort((a, b) => b.id - a.id)

      while (picked.length < desiredCount && extras.length) {
        const next = extras.shift()
        if (!next) break
        picked.push({ n: 1_000_000 + picked.length, doc: next })
      }
    }

    if (picked.length < desiredCount && !allowMissing) {
      throw new Error(`Not enough numbered photos to fill --count=${desiredCount} (found ${picked.length})`)
    }
  } else {
    const end = to ?? 0
    desiredCount = end - from + 1
    missing = []
    for (let n = from; n <= end; n++) {
      const doc = byNumber.get(n)
      if (!doc) missing.push(n)
      else picked.push({ n, doc })
    }

    if (missing.length && !allowMissing) {
      throw new Error(
        `Missing media for: ${missing.join(', ')} (expected filenames like "${prefix}${from}" … "${prefix}${to}"). ` +
          `If you want to fill gaps with other "${prefix}" images, rerun with --allowMissing=1`,
      )
    }

    if (missing.length && allowMissing) {
      // Fill gaps with other prefix-matching media not already used.
      const usedIds = new Set(picked.map((p) => p.doc.id))
      const extras = allMedia
        .filter((m) => !usedIds.has(m.id))
        .sort((a, b) => b.id - a.id)

      while (picked.length < desiredCount && extras.length) {
        const next = extras.shift()
        if (!next) break
        picked.push({ n: 1_000_000 + picked.length, doc: next })
      }
    }

    if (missing.length) {
      console.log(`⚠ Missing numbered files for: ${missing.join(', ')}`)
    }
  }

  console.log(
    `✓ Picked ${picked.length} media for "${effectivePrefixes.join('|')}" ` +
      (dense ? `(dense first ${desiredCount})` : `(${from}..${to})`),
  )
  picked
    .slice()
    .sort((a, b) => a.n - b.n)
    .forEach(({ n, doc }) => console.log(`  ${n}: ${doc.filename} → id:${doc.id}`))

  const stredisko = await getStredisko(token, slug)
  console.log(`✓ Found stredisko "${slug}" (id:${stredisko.id})`)

  const heroGallery = picked
    .slice()
    .sort((a, b) => a.n - b.n)
    .slice(0, desiredCount)
    .map(({ doc }) => ({ photo: doc.id }))
  await updateHeroGallery(token, stredisko.id, heroGallery)
  console.log(`✓ Updated heroGallery (${heroGallery.length} photos)`)

  if (verify) {
    const updated = await getStredisko(token, slug)
    const updatedNames = updated.heroGallery?.map((x) => x.photo?.filename).filter(Boolean) ?? []
    console.log('✓ Verified heroGallery order:')
    updatedNames.forEach((name, i) => console.log(`  [${i + 1}] ${name}`))
  }
}

main()
  .catch((err) => {
    console.error('✗', err.message)
    process.exit(1)
  })
  .then(() => process.exit(0))
