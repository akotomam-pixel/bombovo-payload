import './globals.css'
import { getPayload } from 'payload'
import config from '@payload-config'
import GiveawayPopup from '@/components/GiveawayPopup'
import { camps as fallbackCamps } from '@/lib/campsData'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let popupProps = {
    isEnabled: false,
    delaySeconds: 20,
    photoUrl: null as string | null,
    step0Headline: 'Chceš vyhrať tábor zadarmo?',
    step0YesLabel: 'Áno, chcem vyhrať!',
    step0NoLabel: 'Nie, ďakujem',
    step1Headline: 'Zadaj Svoje Meno A Vyber Si Tábor',
    step1NamePlaceholder: 'Tvoje meno',
    step1CampDefaultLabel: 'Akýkoľvek Tábor',
    step1NextLabel: 'Ďalej',
    step2Headline: 'Zadaj Svoj Email A Si V Hre O Tábor Zadarmo',
    step2EmailPlaceholder: 'tvoj@email.sk',
    step2SubmitLabel: 'Prihlásiť sa do súťaže',
    step3SuccessHeadline: 'Si v hre! 🎉',
    step3SuccessBody:
      'Tvoja prihláška do súťaže o tábor zadarmo bola úspešne zaznamenaná. Víťaza vyhlásime čoskoro!',
    camps: fallbackCamps.map((c) => ({ id: c.id, name: c.name })),
  }

  try {
    const payload = await getPayload({ config })

    const [globalData, campsData] = await Promise.all([
      payload.findGlobal({ slug: 'giveaway-popup' }),
      payload.find({ collection: 'camps', limit: 100, sort: 'order' }),
    ])

    const g = globalData as any
    const isEnabled = g?.isEnabled ?? false

    // Extract photo URL from media relation
    let photoUrl: string | null = null
    if (g?.photo && typeof g.photo === 'object' && g.photo.url) {
      photoUrl = g.photo.url
    }

    // Build camps list — prefer Payload, fall back to hardcoded
    const payloadCamps =
      campsData.docs.length > 0
        ? campsData.docs.map((c: any) => ({ id: String(c.id), name: c.name }))
        : fallbackCamps.map((c) => ({ id: c.id, name: c.name }))

    popupProps = {
      isEnabled,
      delaySeconds: g?.delaySeconds ?? 20,
      photoUrl,
      step0Headline: g?.step0Headline ?? popupProps.step0Headline,
      step0YesLabel: g?.step0YesLabel ?? popupProps.step0YesLabel,
      step0NoLabel: g?.step0NoLabel ?? popupProps.step0NoLabel,
      step1Headline: g?.step1Headline ?? popupProps.step1Headline,
      step1NamePlaceholder: g?.step1NamePlaceholder ?? popupProps.step1NamePlaceholder,
      step1CampDefaultLabel: g?.step1CampDefaultLabel ?? popupProps.step1CampDefaultLabel,
      step1NextLabel: g?.step1NextLabel ?? popupProps.step1NextLabel,
      step2Headline: g?.step2Headline ?? popupProps.step2Headline,
      step2EmailPlaceholder: g?.step2EmailPlaceholder ?? popupProps.step2EmailPlaceholder,
      step2SubmitLabel: g?.step2SubmitLabel ?? popupProps.step2SubmitLabel,
      step3SuccessHeadline: g?.step3SuccessHeadline ?? popupProps.step3SuccessHeadline,
      step3SuccessBody: g?.step3SuccessBody ?? popupProps.step3SuccessBody,
      camps: payloadCamps,
    }
  } catch (err) {
    // Payload unavailable — keep popup disabled so pages don't break
    console.error('GiveawayPopup: failed to fetch Payload data', err)
  }

  const { isEnabled, ...popupContent } = popupProps

  return (
    <>
      {children}
      {isEnabled && <GiveawayPopup {...popupContent} />}
    </>
  )
}
