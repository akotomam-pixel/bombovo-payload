import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { teacherName, schoolName, stars, reviewText, stredisko, kidCount } = body

    if (!teacherName || typeof teacherName !== 'string' || teacherName.trim().length === 0) {
      return NextResponse.json({ error: 'Meno učiteľa je povinné.' }, { status: 400 })
    }
    if (!schoolName || typeof schoolName !== 'string' || schoolName.trim().length === 0) {
      return NextResponse.json({ error: 'Názov školy je povinný.' }, { status: 400 })
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Hodnotenie musí byť číslo od 1 do 5.' }, { status: 400 })
    }
    if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length < 10) {
      return NextResponse.json({ error: 'Recenzia musí mať aspoň 10 znakov.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const data: Record<string, unknown> = {
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      stars,
      reviewText: reviewText.trim(),
      status: 'approved',
    }

    if (stredisko && typeof stredisko === 'string' && stredisko.trim().length > 0) {
      data.stredisko = stredisko.trim()
    }
    if (kidCount !== undefined && kidCount !== null && kidCount !== '') {
      const parsed = Number(kidCount)
      if (!isNaN(parsed) && parsed > 0) {
        data.kidCount = parsed
      }
    }

    await payload.create({
      collection: 'teacher-reviews',
      data,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[teacher-review] Error:', err)
    return NextResponse.json({ error: 'Interná chyba servera.' }, { status: 500 })
  }
}
