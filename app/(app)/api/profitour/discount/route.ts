import { NextRequest, NextResponse } from 'next/server'
import { soapCall, extractTag, escapeXml } from '@/lib/profis'

export async function POST(req: NextRequest) {
  let body: { kod?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { kod } = body
  if (!kod?.trim()) {
    return NextResponse.json({ error: 'Prosím zadajte zľavový kód.' }, { status: 400 })
  }

  // Normalize to uppercase so "bombovo" / "Bombovo" / "BOMBOVO" all match
  const normalizedKod = kod.trim().toUpperCase()

  try {
    // SkupinaSlevaParametrKod is an external procedure — must be called via ExterniProcedura
    // with the procedure name in <Nazev> and params as key-value <Pair> elements
    const raw = await soapCall('Ostatni', 'ExterniProcedura', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>false</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
        <ns:Rezim>${process.env.PROFIS_REZIM}</ns:Rezim>
      </ns:Context>
      <ns:Data>
        <ns:Nazev>SkupinaSlevaParametrKod</ns:Nazev>
        <ns:Parametry>
          <ns:Pair>
            <ns:Key>Kod</ns:Key>
            <ns:Value>${escapeXml(normalizedKod)}</ns:Value>
          </ns:Pair>
        </ns:Parametry>
      </ns:Data>`)

    const xml = raw._raw as string
    console.log('[discount] ExterniProcedura/SkupinaSlevaParametrKod response:', xml.slice(0, 500))

    // Response is a table: <Columns><Item>id_SkupinaSlevaParametr</Item></Columns><Rows><Row><Item>123</Item></Row></Rows>
    // Empty <Rows/> means code not found
    const rowMatch = xml.match(/<Rows[^/][\s\S]*?<Item>(\d+)<\/Item>/)
    const idStr = rowMatch?.[1] ?? null

    const id_SkupinaSlevaParametr = idStr ? Number(idStr) : 0

    if (!id_SkupinaSlevaParametr) {
      return NextResponse.json({ error: 'Neplatný zľavový kód.' }, { status: 404 })
    }

    return NextResponse.json({ id_SkupinaSlevaParametr })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[discount] Error:', message)
    return NextResponse.json({ error: 'Neplatný zľavový kód.' }, { status: 404 })
  }
}
