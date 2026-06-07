import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import type { Where } from 'payload'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const advertorial = searchParams.get('advertorial') ?? 'advertorial-3'
  const days = parseInt(searchParams.get('days') ?? '30', 10)

  const since =
    days > 0
      ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      : null

  try {
    const payload = await getPayloadClient()

    const buildWhere = (type: 'view' | 'click'): Where => {
      const conditions: Where[] = [
        { type: { equals: type } },
        { advertorial: { equals: advertorial } },
      ]
      if (since) conditions.push({ createdAt: { greater_than: since } })
      return { and: conditions }
    }

    const [viewsResult, clicksResult] = await Promise.all([
      payload.find({ collection: 'ad-events', where: buildWhere('view'), limit: 0 }),
      payload.find({ collection: 'ad-events', where: buildWhere('click'), limit: 0 }),
    ])

    const views = viewsResult.totalDocs
    const clicks = clicksResult.totalDocs
    const ctr = views > 0 ? Math.round((clicks / views) * 1000) / 10 : 0

    return NextResponse.json({ views, clicks, ctr, advertorial, days })
  } catch (err) {
    console.error('[/api/ad-stats] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
