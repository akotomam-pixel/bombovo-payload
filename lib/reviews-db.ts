import { Pool } from 'pg'

let pool: Pool | null = null

function getPool() {
  if (!pool) {
    // Strip channel_binding param — not supported by node-postgres
    const uri = (process.env.DATABASE_URI ?? '').replace(/[?&]channel_binding=[^&]*/g, '').replace(/\?&/, '?')
    pool = new Pool({ connectionString: uri, ssl: { rejectUnauthorized: false } })
  }
  return pool
}

export type CampReview = {
  id: number
  reviewer_name: string
  reviewer_type: 'tabornik' | 'rodic'
  camp_name: string | null
  stars: number
  review_text: string
  created_at: string
}

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS letne_tabory_reviews (
    id SERIAL PRIMARY KEY,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_type VARCHAR(50) NOT NULL,
    camp_name VARCHAR(255),
    stars INTEGER NOT NULL,
    review_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

const ADD_CAMP_NAME_COLUMN = `
  ALTER TABLE letne_tabory_reviews
  ADD COLUMN IF NOT EXISTS camp_name VARCHAR(255)
`

export async function ensureTable() {
  await getPool().query(CREATE_TABLE)
  // Add camp_name to existing tables that predate this column
  await getPool().query(ADD_CAMP_NAME_COLUMN)
}

export async function insertReview(data: {
  reviewerName: string
  reviewerType: string
  campName?: string
  stars: number
  reviewText: string
}) {
  await ensureTable()
  await getPool().query(
    `INSERT INTO letne_tabory_reviews (reviewer_name, reviewer_type, camp_name, stars, review_text)
     VALUES ($1, $2, $3, $4, $5)`,
    [data.reviewerName, data.reviewerType, data.campName || null, data.stars, data.reviewText],
  )
}

export async function getAllReviews(): Promise<CampReview[]> {
  await ensureTable()
  const result = await getPool().query<CampReview>(
    `SELECT id, reviewer_name, reviewer_type, camp_name, stars, review_text, created_at
     FROM letne_tabory_reviews
     ORDER BY created_at DESC`,
  )
  return result.rows
}
