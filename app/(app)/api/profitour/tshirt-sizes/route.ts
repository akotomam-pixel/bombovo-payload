import { NextResponse } from 'next/server'
import { soapCall, extractTag } from '@/lib/profis'

export async function GET() {
  try {
    const raw = await soapCall('Ostatni', 'ExterniTabulka', `
      <ns:Context>
        <ns:UzivatelHeslo>${process.env.PROFIS_HESLO}</ns:UzivatelHeslo>
        <ns:UzivatelLogin>${process.env.PROFIS_LOGIN}</ns:UzivatelLogin>
        <ns:VypsatNazvy>false</ns:VypsatNazvy>
        <ns:id_Jazyk>${process.env.PROFIS_ID_JAZYK}</ns:id_Jazyk>
        <ns:id_Republika>${process.env.PROFIS_ID_REPUBLIKA}</ns:id_Republika>
      </ns:Context>
      <ns:Data>
        <ns:Nazev>VelikostTricka</ns:Nazev>
        <ns:Parametry/>
      </ns:Data>`)

    const xml = raw._raw as string
    console.log('[tshirt-sizes] Raw response:', xml.slice(0, 1000))

    // Parse rows: each <a:ExterniRadek> contains <a:Hodnoty> with <a:ExterniHodnota> entries
    const sizes: { id: number; nazev: string }[] = []
    const rowBlocks = xml.match(/<[a-z]:ExterniRadek[\s\S]*?<\/[a-z]:ExterniRadek>/g) ?? []

    for (const row of rowBlocks) {
      // Extract all name/value pairs within this row
      const hodnotaBlocks = row.match(/<[a-z]:ExterniHodnota[\s\S]*?<\/[a-z]:ExterniHodnota>/g) ?? []
      let id: number | null = null
      let nazev: string | null = null

      for (const h of hodnotaBlocks) {
        const sloupec = extractTag(h, 'Sloupec') ?? extractTag(h, 'a:Sloupec') ?? extractTag(h, 'b:Sloupec')
        const hodnota = extractTag(h, 'Hodnota') ?? extractTag(h, 'a:Hodnota') ?? extractTag(h, 'b:Hodnota')
        if (!sloupec || hodnota === null) continue
        if (sloupec === 'ID') id = Number(hodnota)
        if (sloupec === 'Nazev' || sloupec === 'Název') nazev = hodnota
      }

      if (id !== null && nazev !== null) sizes.push({ id, nazev })
    }

    console.log('[tshirt-sizes] Parsed sizes:', sizes)
    return NextResponse.json({ sizes })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[tshirt-sizes] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
