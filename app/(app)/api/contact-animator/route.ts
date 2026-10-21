import type { NextRequest } from 'next/server'
import { handlePrihlaska } from '@/lib/prihlaska/handler'

/** Application for the animator školenie: internal notification + confirmation to the applicant. */
export async function POST(request: NextRequest) {
  return handlePrihlaska(request, 'animator')
}
