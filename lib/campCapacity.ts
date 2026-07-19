import { Pool } from 'pg'

let pool: Pool | null = null
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URI })
  return pool
}

export type ClaimResult = 'no-limit' | 'claimed' | 'claimed-fills-term' | 'full'

// Reserves one seat against a per-term capacity limit that lives only in our own DB,
// separate from whatever capacity Profis itself thinks the term has (used when we're
// only allowed to sell a fixed number of a term's spots, e.g. a shared allocation).
// The UPDATE's WHERE clause makes the check-and-increment atomic, so two people
// submitting at the same instant can't both slip through once the limit is reached.
// Returns 'no-limit' when the term has no capacityLimit configured — the common case,
// where this feature is a no-op and normal Profis-only booking applies.
export async function claimCampSlot(profisTerminId: number): Promise<ClaimResult> {
  const db = getPool()
  const { rows } = await db.query(
    `SELECT id, capacity_limit FROM camps_dates WHERE profis_termin_id = $1 LIMIT 1`,
    [profisTerminId],
  )
  const row = rows[0]
  if (!row || row.capacity_limit == null) return 'no-limit'

  const claim = await db.query(
    `UPDATE camps_dates
        SET reservations_count = reservations_count + 1
      WHERE id = $1 AND reservations_count < capacity_limit
      RETURNING reservations_count, capacity_limit`,
    [row.id],
  )
  if (claim.rows.length === 0) return 'full'

  const { reservations_count, capacity_limit } = claim.rows[0]
  return Number(reservations_count) >= Number(capacity_limit) ? 'claimed-fills-term' : 'claimed'
}

// Gives back a seat that was claimed but whose booking didn't actually go through
// (e.g. Objednat failed, or an earlier validation step rejected the request).
export async function releaseCampSlot(profisTerminId: number): Promise<void> {
  await getPool().query(
    `UPDATE camps_dates SET reservations_count = GREATEST(reservations_count - 1, 0) WHERE profis_termin_id = $1`,
    [profisTerminId],
  )
}

// Marks the term "vypredané" once the local limit has been reached — reuses the
// existing manual sold-out flag so every part of the site that already checks it
// (camp listing, detail page, registration form) picks this up with no other changes.
export async function markTermSoldOut(profisTerminId: number): Promise<void> {
  await getPool().query(
    `UPDATE camps_dates SET vypredane = true WHERE profis_termin_id = $1`,
    [profisTerminId],
  )
}
