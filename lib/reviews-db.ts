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
  stars: number
  review_text: string
  created_at: string
}

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS letne_tabory_reviews (
    id SERIAL PRIMARY KEY,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_type VARCHAR(50) NOT NULL,
    stars INTEGER NOT NULL,
    review_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`

export async function ensureTable() {
  await getPool().query(CREATE_TABLE)
}

export async function insertReview(data: {
  reviewerName: string
  reviewerType: string
  stars: number
  reviewText: string
}) {
  await ensureTable()
  await getPool().query(
    `INSERT INTO letne_tabory_reviews (reviewer_name, reviewer_type, stars, review_text)
     VALUES ($1, $2, $3, $4)`,
    [data.reviewerName, data.reviewerType, data.stars, data.reviewText],
  )
}

export async function getAllReviews(): Promise<CampReview[]> {
  await ensureTable()
  const result = await getPool().query<CampReview>(
    `SELECT id, reviewer_name, reviewer_type, stars, review_text, created_at
     FROM letne_tabory_reviews
     ORDER BY created_at DESC`,
  )
  return result.rows
}
