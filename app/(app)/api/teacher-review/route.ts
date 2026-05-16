import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { teacherName, schoolName, stars, q1, q2, q3, q4, stredisko, kidCount } = body

    if (!teacherName || typeof teacherName !== 'string' || teacherName.trim().length === 0) {
      return NextResponse.json({ error: 'Meno učiteľa je povinné.' }, { status: 400 })
    }
    if (!schoolName || typeof schoolName !== 'string' || schoolName.trim().length === 0) {
      return NextResponse.json({ error: 'Názov školy je povinný.' }, { status: 400 })
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Hodnotenie musí byť číslo od 1 do 5.' }, { status: 400 })
    }
    if (!q1 || typeof q1 !== 'string' || q1.trim().length < 5) {
      return NextResponse.json({ error: 'Prosím odpovedzte na otázku o ubytovaní.' }, { status: 400 })
    }
    if (!q2 || typeof q2 !== 'string' || q2.trim().length < 5) {
      return NextResponse.json({ error: 'Prosím odpovedzte na otázku o animačnom tíme.' }, { status: 400 })
    }
    if (!q3 || typeof q3 !== 'string' || q3.trim().length < 5) {
      return NextResponse.json({ error: 'Prosím odpovedzte, čo sa vám páčilo.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const data: Record<string, unknown> = {
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      stars,
      reviewText: q3.trim(),
      q1: q1.trim(),
      q2: q2.trim(),
      q3: q3.trim(),
      status: 'approved',
    }

    if (q4 && typeof q4 === 'string' && q4.trim().length > 0) {
      data.q4 = q4.trim()
    }
    if (stredisko && typeof stredisko === 'string' && stredisko.trim().length > 0) {
      data.stredisko = stredisko.trim()
    }
    if (kidCount !== undefined && kidCount !== null && kidCount !== '') {
      const parsed = Number(kidCount)
      if (!isNaN(parsed) && parsed > 0) data.kidCount = parsed
    }

    await payload.create({ collection: 'teacher-reviews', data })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[teacher-review] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
