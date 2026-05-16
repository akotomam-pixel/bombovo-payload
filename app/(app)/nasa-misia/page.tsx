import configPromise from '@payload-config'
import { getPayload } from 'payload'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'

const POINT_COLORS = [
  { bg: 'bg-bombovo-blue', text: 'text-white' },
  { bg: 'bg-bombovo-red', text: 'text-white' },
  { bg: 'bg-bombovo-yellow', text: 'text-bombovo-dark' },
]

async function getNasaMisia() {
  try {
    const payload = await getPayload({ config: configPromise })
    return await payload.findGlobal({ slug: 'nasa-misia', depth: 1 })
  } catch {
    return null
  }
}

function mediaUrl(field: unknown): string | null {
  if (!field || typeof field !== 'object') return null
  return (field as Record<string, unknown>).url as string ?? null
}

export default async function NasaMisiaPage() {
  const data = await getNasaMisia() as Record<string, any> | null

  const missionHeadline = data?.missionHeadline || 'Prečo deti milujú Bombovo?'
  const missionText1 = data?.missionText1 || 'Už viac ako 20 rokov v Bombove máme od začiatku jednu misiu: robiť deťom šťastnými každý deň, ktorý u nás strávia. Výsledkom je, že namiesto toho, aby sme si plnili peňaženky, sme malá rodinná cestovná kancelária, ku ktorej sa až 86% detí vracia každý rok.'
  const missionText2 = data?.missionText2 || 'Originálny program vytvára nezabudnuteľné zážitky, pre ktoré deti prosia rodičov, aby sa mohli vrátiť späť.'
  const missionImageUrl = mediaUrl(data?.missionImage) || '/images/nasamissia1.JPG'
  const testimonialQuote = data?.testimonialQuote || 'Čo je viac ako to, že vaše dieťa žiari šťastím? Dcéra bola prvýkrát, ostala by aj o týždeň dlhšie. Úžasný prístup, ubytovanie a program geniálny. Ďakujeme a určite sa nezúčastnila naposledy.'
  const testimonialAuthor = data?.testimonialAuthor || 'V. Marčeková'

  const summerHeadline = data?.summerHeadline || 'Leto, Aké Ste Mali Vy'
  const summerText1 = data?.summerText1 || 'V dnešnej dobe viac ako 80% detí strávi leto pred telefónom alebo za počítačom. Keď dáte dieťa do Bombova, meníte jeho leto, ktoré by inak bolo strávené scrollovaním a bojmi o telefón, na leto plné dobrodružstiev vonku - také, aké ste mali vy.'
  const summerText2 = data?.summerText2 || 'Namiesto nudy a obrazoviek dostane vaše dieťa príbeh. Namiesto sociálnych médií dostane skutočných priateľov. Namiesto závislosti dostane dieťa slobodu byť dieťaťom.'
  const summerImageUrl = mediaUrl(data?.summerImage) || '/images/nasamissia2.JPG'

  const kvalitaHeadline = data?.kvalitaHeadline || 'Bombovo = Kvalita pred Kvantitou'
  const kvalitaIntroText = data?.kvalitaIntroText || 'Aj keď toto pravidlo nie je pre väčšinu cestovných kancelárií populárne, u nás uprednostňujeme šťastie dieťaťa pred tým, aby sme sa stali najväčšia cestovná kancelária na Slovensku.'
  const kvalitaPoints: { pointHeadline: string; pointText: string }[] = data?.kvalitaPoints?.length
    ? data.kvalitaPoints
    : [
        { pointHeadline: 'Nemáme žiadne skryté poplatky.', pointText: 'Čo vidíte, to zaplatíte. Žiadne prekvapenia pri fakturácii. U nás sa vaše deti nebudú nudiť - všetky výlety a aktivity sú v cene.' },
        { pointHeadline: 'Naši animátori prechádzajú dôkladným školením.', pointText: 'Nie sú to náhodní študenti, ktorí potrebujú prácu na leto. Sú to vyškolení profesionáli, ktorým záleží na deťoch viac ako na výplatnej páske.' },
        { pointHeadline: 'Naše programy sú originálne.', pointText: 'Nezaložené na kópiách konkurencie, ale na 20+ rokoch skúseností s tým, čo skutočne funguje a čo baví deti natoľko, že zabudnú na telefóny.' },
      ]

  const teamHeadline = data?.teamHeadline || 'Spoznaj Náš skúsený Animačný tím'
  const teamMembers: { name: string; description: string; photo: unknown }[] = data?.teamMembers?.length
    ? data.teamMembers
    : [
        { name: 'Matej "Uli" Uller', description: 'Garant Fest Family Fest a skúsený animátor', photo: null },
        { name: 'Matej "Baran" Majerčík', description: 'Garant Fest Family Fest a skúsený animátor s dlhoročnými skúsenosťami', photo: null },
        { name: 'Sofia "Sofa" Pračková', description: 'Garant tábora Babinec a animátorka s dlhoročnými skúsenosťami', photo: null },
        { name: 'Nicol "Stará" Kalinová', description: 'Garant tábora Babinec a energická animátorka milovaná deťmi', photo: null },
        { name: 'Ivo "Laco" Ďurkovič', description: 'Garant Fest Family Fest a skúsený animátor s pozitívnou energiou', photo: null },
      ]

  const ReviewBox = () => (
    <div className="mt-6 p-6 rounded-2xl bg-white border-4 border-bombovo-red shadow-lg">
      <p className="text-lg md:text-xl italic text-bombovo-dark leading-relaxed mb-4">
        "{testimonialQuote}"
      </p>
      <p className="text-base md:text-lg text-bombovo-dark font-semibold">
        — {testimonialAuthor}
      </p>
    </div>
  )

  return (
    <main className="min-h-screen">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* Section 1: Mission */}
      <section className="pt-8 pb-6 md:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto md:px-4 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark mb-8 text-center px-4">
            <span className="md:hidden block">
              {missionHeadline}
            </span>
            <span className="hidden md:inline relative">
              {missionHeadline}
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                style={{ height: '12px' }}
              >
                <path d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8" stroke="#FDCA40" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9" stroke="#FDCA40" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
              </svg>
            </span>
          </h1>

          <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-12 bg-bombovo-gray">
            {/* Section A */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 mb-12">
              <div className="flex flex-col justify-center space-y-6 order-1 lg:order-none">
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{missionText1}</p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{missionText2}</p>
                <div className="hidden lg:block">
                  <ReviewBox />
                </div>
              </div>

              <div className="flex items-center justify-center order-2 lg:order-none">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                  <img
                    src={missionImageUrl}
                    alt="Prečo deti milujú Bombovo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:hidden order-3">
                <ReviewBox />
              </div>
            </div>

            {/* Section B */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
              <div className="flex items-start justify-center order-2 lg:order-1">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                  <img
                    src={summerImageUrl}
                    alt="Leto aké ste mali vy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6 order-1 lg:order-2">
                <h3 className="text-2xl md:text-3xl font-semibold text-bombovo-dark">
                  {summerHeadline}
                </h3>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{summerText1}</p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{summerText2}</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/letne-tabory">
                <button className="px-6 py-3 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-sm md:text-base rounded-full hover:translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                  Preskúmaj naše letné tábory
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Kvalita */}
      <section className="pt-6 pb-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-16">
            <span className="relative inline-block">
              {kvalitaHeadline}
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                style={{ height: '12px' }}
              >
                <path d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8" stroke="#FDCA40" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9" stroke="#FDCA40" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
              </svg>
            </span>
          </h2>

          <p className="text-base md:text-lg text-bombovo-dark text-center mb-12 leading-relaxed max-w-4xl mx-auto">
            {kvalitaIntroText}
          </p>

          <div className="space-y-8">
            {kvalitaPoints.map((point, i) => {
              const color = POINT_COLORS[i % POINT_COLORS.length]
              return (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${color.bg} flex items-center justify-center border-4 border-bombovo-dark shadow-lg`}>
                      <span className={`${color.text} font-bold text-2xl`}>{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-bombovo-dark mb-3">{point.pointHeadline}</h3>
                    <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{point.pointText}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Stats */}
      <section className="py-8 md:py-10 bg-bombovo-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src="/images/hmmicon1.png" alt="Návratnosť Detí" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-bombovo-dark">86%</p>
                <p className="text-base md:text-lg text-bombovo-dark font-medium">Návratnosť<br/>Detí</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src="/images/hmmicon2.png" alt="Detí Odanimovaných" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-bombovo-dark">50,000+</p>
                <p className="text-base md:text-lg text-bombovo-dark font-medium">Detí<br/>Odanimovaných</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src="/images/hmmicon3.png" alt="Rokov Skúseností" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-bombovo-dark">20+</p>
                <p className="text-base md:text-lg text-bombovo-dark font-medium">Rokov<br/>Skúseností</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-bombovo-gray">
        <WaveDivider color="blue" variant={1} />
      </div>

      {/* Section 4: CTA */}
      <section className="py-8 md:py-10 bg-bombovo-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-bombovo-dark mb-6 leading-tight">
            Pripravení dať svojmu dieťaťu leto, na ktoré nikdy nezabudne?
          </h2>
          <Link href="/letne-tabory">
            <button className="px-12 py-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
              Pozri naše letné tábory
            </button>
          </Link>
        </div>
      </section>

      {/* Section 5: Team */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-12">
            {teamHeadline}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-md md:max-w-none mx-auto">
            {teamMembers.map((member, i) => {
              const photoUrl = mediaUrl(member.photo)
              return (
                <div key={i} className="border-4 border-bombovo-blue rounded-3xl p-4 text-center bg-bombovo-gray">
                  {photoUrl ? (
                    <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden">
                      <img src={photoUrl} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: '#90EE90' }}
                    >
                      <span className="text-3xl">👤</span>
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-bombovo-dark mb-2 px-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-bombovo-dark leading-snug min-h-[2.5rem] px-1">
                    {member.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="bg-white">
        <Footer />
      </div>
    </main>
  )
}
