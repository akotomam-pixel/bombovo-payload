import { NextResponse } from 'next/server'
import { soapCall } from '@/lib/profis'

export async function GET() {
  try {
    // VelikostTricka is accessed via ExterniProcedura (not ExterniTabulka).
    // Response format: <Table><Columns><Item>ID</Item><Item>Nazev</Item></Columns>
    //                          <Rows><Row><Item>1</Item><Item>122</Item></Row>...</Rows></Table>
    const raw = await soapCall('Ostatni', 'ExterniProcedura', `
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

    const sizes: { id: number; nazev: string }[] = []

    // Each <Row> has two <Item> children: ID and Nazev (in Columns order)
    const rowBlocks = xml.match(/<Row>[\s\S]*?<\/Row>/g) ?? []
    for (const row of rowBlocks) {
      const items = [...row.matchAll(/<Item>([^<]*)<\/Item>/g)].map(m => m[1].trim())
      if (items.length >= 2 && items[0]) {
        const id = Number(items[0])
        const nazev = items[1]
        if (id > 0 && nazev) sizes.push({ id, nazev })
      }
    }

    console.log('[tshirt-sizes] Parsed sizes:', sizes)
    return NextResponse.json({ sizes })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[tshirt-sizes] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
