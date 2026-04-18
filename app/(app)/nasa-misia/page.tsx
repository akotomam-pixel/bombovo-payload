'use client'

import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'

export default function NasaMisiaPage() {
  return (
    <main className="min-h-screen">
      {/* Section 0: Top Bar - Grey Background */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      
      {/* Section 1: Header - Sticky Navigation */}
      <Header />
      
      {/* Section 1: Why Kids Love Bombovo */}
      <section className="pt-8 pb-6 md:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto md:px-4 lg:px-8">
          {/* Main Headline - OUTSIDE THE FRAME */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark mb-8 text-center px-4">
            {/* Mobile Layout */}
            <span className="md:hidden block">
              Prečo deti
              <br />
              <span className="relative inline-block">
                <span className="font-amatic text-bombovo-red text-4xl">
                  milujú Bombovo?
                </span>
                <svg
                  className="absolute left-0 -bottom-2 w-full"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  style={{ height: '12px' }}
                >
                  <path
                    d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
                    stroke="#FDCA40"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                    stroke="#FDCA40"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </span>
            </span>
            
            {/* Desktop Layout */}
            <span className="hidden md:inline relative">
              Prečo deti{' '}
              <span className="font-amatic text-bombovo-red text-4xl md:text-5xl lg:text-6xl">
                milujú Bombovo?
              </span>
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                style={{ height: '12px' }}
              >
                <path
                  d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
                  stroke="#FDCA40"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                  stroke="#FDCA40"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h1>

          {/* Grey-bordered container - STARTS BELOW HEADLINE */}
          <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-12 bg-bombovo-gray">

            {/* Section A - Mobile: Text, Photo, Review / Desktop: Text Left, Image Right */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 mb-12">
              {/* Text */}
              <div className="flex flex-col justify-center space-y-6 order-1 lg:order-none">
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Už viac ako 20 rokov v Bombove máme od začiatku jednu misiu: <span className="font-bold">robiť deťom šťastnými každý deň, ktorý u nás strávia.</span> Výsledkom je, že namiesto toho, aby sme si plnili peňaženky, sme malá rodinná cestovná kancelária, ku ktorej sa až 86% detí vracia každý rok.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Originálny program vytvára <span className="font-bold">nezabudnuteľné zážitky</span>, pre ktoré deti prosia rodičov, aby sa mohli vrátiť späť.
                </p>
                
                {/* Review - DESKTOP ONLY */}
                <div className="hidden lg:block mt-6 p-6 rounded-2xl bg-white border-4 border-bombovo-red shadow-lg">
                  <p className="text-lg md:text-xl italic text-bombovo-dark leading-relaxed mb-4">
                    "Čo je viac ako to, že vaše dieťa žiari šťastím? Dcéra bola prvýkrát, ostala by aj o týždeň dlhšie. Úžasný prístup, ubytovanie a program geniálny. Ďakujeme a určite sa nezúčastnila naposledy."
                  </p>
                  <p className="text-base md:text-lg text-bombovo-dark font-semibold">
                    — V. Marčeková
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="flex items-center justify-center order-2 lg:order-none">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                  <img 
                    src="/images/nasamissia1.JPG"
                    alt="Prečo deti milujú Bombovo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Review - MOBILE ONLY */}
              <div className="lg:hidden order-3 mt-6 p-6 rounded-2xl bg-white border-4 border-bombovo-red shadow-lg">
                <p className="text-lg md:text-xl italic text-bombovo-dark leading-relaxed mb-4">
                  "Čo je viac ako to, že vaše dieťa žiari šťastím? Dcéra bola prvýkrát, ostala by aj o týždeň dlhšie. Úžasný prístup, ubytovanie a program geniálny. Ďakujeme a určite sa nezúčastnila naposledy."
                </p>
                <p className="text-base md:text-lg text-bombovo-dark font-semibold">
                  — V. Marčeková
                </p>
              </div>
            </div>

            {/* Section B - Mobile: Headline, Text, Photo / Desktop: Image Left, Text Right */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
              {/* Image - Desktop order */}
              <div className="flex items-start justify-center order-2 lg:order-1">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                  <img 
                    src="/images/nasamissia2.JPG"
                    alt="Leto aké ste mali vy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="flex flex-col justify-center space-y-6 order-1 lg:order-2">
                {/* Subheadline */}
                <h3 className="text-2xl md:text-3xl font-semibold text-bombovo-dark">
                  Leto, Aké Ste Mali Vy
                </h3>
                
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  V dnešnej dobe viac ako 80% detí strávi leto pred telefónom alebo za počítačom. Keď dáte dieťa do Bombova, meníte jeho leto, ktoré by inak bolo strávené scrollovaním a bojmi o telefón, na leto plné dobrodružstiev vonku - také, aké ste mali vy.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  <span className="font-bold">Namiesto nudy a obrazoviek dostane vaše dieťa príbeh.</span> Namiesto sociálnych médií dostane skutočných priateľov. Namiesto závislosti dostane dieťa slobodu byť dieťaťom.
                </p>
              </div>
            </div>

            {/* CTA Button */}
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
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-16">
            <span className="relative inline-block">
              Bombovo = Kvalita pred Kvantitou
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                style={{ height: '12px' }}
              >
                <path
                  d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
                  stroke="#FDCA40"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                  stroke="#FDCA40"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h2>

          <p className="text-base md:text-lg text-bombovo-dark text-center mb-12 leading-relaxed max-w-4xl mx-auto">
            Aj keď toto pravidlo nie je pre väčšinu cestovných kancelárií populárne, u nás uprednostňujeme šťastie dieťaťa pred tým, aby sme sa stali najväčšia cestovná kancelária na Slovensku.
          </p>

          {/* Three Points */}
          <div className="space-y-8">
            {/* Point 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-bombovo-blue flex items-center justify-center border-4 border-bombovo-dark shadow-lg">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-bombovo-dark mb-3">
                  Nemáme žiadne skryté poplatky.
                </h3>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Čo vidíte, to zaplatíte. Žiadne prekvapenia pri fakturácii. U nás sa vaše deti nebudú nudiť - všetky výlety a aktivity sú v cene.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-bombovo-red flex items-center justify-center border-4 border-bombovo-dark shadow-lg">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-bombovo-dark mb-3">
                  Naši animátori prechádzajú dôkladným školením.
                </h3>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Nie sú to náhodní študenti, ktorí potrebujú prácu na leto. Sú to vyškolení profesionáli, ktorým záleží na deťoch viac ako na výplatnej páske.
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-bombovo-yellow flex items-center justify-center border-4 border-bombovo-dark shadow-lg">
                  <span className="text-bombovo-dark font-bold text-2xl">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-bombovo-dark mb-3">
                  Naše programy sú originálne.
                </h3>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Nezaložené na kópiách konkurencie, ale na 20+ rokoch skúseností s tým, čo skutočne funguje a čo baví deti natoľko, že zabudnú na telefóny.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Icons/Stats */}
      <section className="py-8 md:py-10 bg-bombovo-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
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

            {/* Stat 2 */}
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

            {/* Stat 3 */}
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

      {/* Blue Divider 1 */}
      <div className="bg-bombovo-gray">
        <WaveDivider color="blue" variant={1} />
      </div>

      {/* Section 4: Call to Action */}
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

      {/* Section 5: Animators */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-12">
            Spoznaj Náš skúsený Animačný tím
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-md md:max-w-none mx-auto">
            {/* Animator 1 */}
            <div className="border-4 border-bombovo-blue rounded-3xl p-4 text-center bg-bombovo-gray">
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#90EE90' }}
              >
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-sm font-bold text-bombovo-dark mb-2 whitespace-nowrap px-1">
                Matej "Uli" Uller
              </h3>
              <p className="text-xs text-bombovo-dark mb-3 leading-snug min-h-[2.5rem] px-1">
                Garant Fest Family Fest a skúsený animátor
              </p>
              <Link href="/animatori/uli">
                <button className="px-4 py-2 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-xs rounded-full hover:translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                  Zisti o mne
                </button>
              </Link>
            </div>

            {/* Animator 2 */}
            <div className="border-4 border-bombovo-blue rounded-3xl p-4 text-center bg-bombovo-gray">
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#90EE90' }}
              >
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-sm font-bold text-bombovo-dark mb-2 whitespace-nowrap px-1">
                Matej "Baran" Majerčík
              </h3>
              <p className="text-xs text-bombovo-dark mb-3 leading-snug min-h-[2.5rem] px-1">
                Garant Fest Family Fest a skúsený animátor s dlhoročnými skúsenosťami
              </p>
              <Link href="/animatori/baran">
                <button className="px-4 py-2 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-xs rounded-full hover:translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                  Zisti o mne
                </button>
              </Link>
            </div>

            {/* Animator 3 */}
            <div className="border-4 border-bombovo-blue rounded-3xl p-4 text-center bg-bombovo-gray">
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#90EE90' }}
              >
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-sm font-bold text-bombovo-dark mb-2 whitespace-nowrap px-1">
                Sofia "Sofa" Pračková
              </h3>
              <p className="text-xs text-bombovo-dark mb-3 leading-snug min-h-[2.5rem] px-1">
                Garant tábora Babinec a animátorka s dlhoročnými skúsenosťami
              </p>
              <Link href="/animatori/sofa">
                <button className="px-4 py-2 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-xs rounded-full hover:translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                  Zisti o mne
                </button>
              </Link>
            </div>

            {/* Animator 4 */}
            <div className="border-4 border-bombovo-blue rounded-3xl p-4 text-center bg-bombovo-gray">
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#90EE90' }}
              >
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-sm font-bold text-bombovo-dark mb-2 whitespace-nowrap px-1">
                Nicol "Stará" Kalinová
              </h3>
              <p className="text-xs text-bombovo-dark mb-3 leading-snug min-h-[2.5rem] px-1">
                Garant tábora Babinec a energická animátorka milovaná deťmi
              </p>
              <Link href="/animatori/stara">
                <button className="px-4 py-2 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-xs rounded-full hover:translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                  Zisti o mne
                </button>
              </Link>
            </div>

            {/* Animator 5 */}
            <div className="border-4 border-bombovo-blue rounded-3xl p-4 text-center bg-bombovo-gray">
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#90EE90' }}
              >
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-sm font-bold text-bombovo-dark mb-2 whitespace-nowrap px-1">
                Ivo "Laco" Ďurkovič
              </h3>
              <p className="text-xs text-bombovo-dark mb-3 leading-snug min-h-[2.5rem] px-1">
                Garat Fest Family Fest a skúsený animátor s pozitívnou energiou
              </p>
              <Link href="/animatori/laco">
                <button className="px-4 py-2 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-xs rounded-full hover:translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                  Zisti o mne
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  )
}
