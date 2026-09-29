import type { ReactNode } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Ochrana osobných údajov | Bombovo',
  description:
    'Zásady ochrany osobných údajov CK BOMBOVO: poučenie o právach dotknutej osoby a informačná povinnosť prevádzkovateľa.',
}

const PDF_URL = '/documents/ochrana-osobnych-udajov.pdf'

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark tracking-[-0.02em] mt-16 mb-6 pb-3 border-b-2 border-bombovo-yellow">
      {children}
    </h2>
  )
}

function P({ children }: { children: ReactNode }) {
  return <p className="mb-5">{children}</p>
}

function Operator() {
  return (
    <p className="mb-5">
      <strong className="text-bombovo-dark">Prevádzkovateľ</strong>
      <br />
      BOMBOVO, cestovná kancelária, s.r.o., Široká 5049/24, 949 05 Nitra, IČO 36 539 961
    </p>
  )
}

function Letters({ items }: { items: [string, ReactNode][] }) {
  return (
    <ul className="mt-3 space-y-3">
      {items.map(([letter, text]) => (
        <li key={letter} className="flex gap-3">
          <span className="shrink-0 w-6 font-bold text-bombovo-blue">{letter})</span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  )
}

function Numbered({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-6">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="shrink-0 w-8 h-8 rounded-full bg-bombovo-gray text-bombovo-dark font-bold text-sm flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">{item}</div>
        </li>
      ))}
    </ol>
  )
}

const linkClass =
  'text-bombovo-blue underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-blue focus-visible:ring-offset-2 rounded-sm'

export default function GDPRPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-grow bg-white px-4 md:px-8 py-12 md:py-20">
        <article className="max-w-3xl mx-auto text-base md:text-lg text-bombovo-dark/85 leading-[1.7]">
          <h1 className="text-4xl md:text-6xl font-bold text-bombovo-dark tracking-[-0.03em] leading-tight mb-10">
            Ochrana osobných údajov
          </h1>

          <section
            aria-label="Prevádzkovateľ"
            className="rounded-3xl bg-bombovo-gray/50 border border-bombovo-gray p-6 md:p-8"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-bombovo-blue mb-2">Prevádzkovateľ</p>
            <p className="text-bombovo-dark font-bold">BOMBOVO, cestovná kancelária, s.r.o.</p>
            <p>Široká 5049/24, 949 05 Nitra</p>
            <p>IČO 36 539 961</p>
            <p className="mt-3">
              E-mail:{' '}
              <a href="mailto:bombovo@bombovo.sk" className={linkClass}>
                bombovo@bombovo.sk
              </a>
              <br />
              Telefón:{' '}
              <a href="tel:+421915774213" className={linkClass}>
                +421 915 774 213
              </a>
            </p>
          </section>

          <H2>Poučenie o právach dotknutej osoby</H2>
          <Operator />
          <P>
            Dotknutá osoba má v zmysle § 28 zákona č. 122/2013 Z. z. o ochrane osobných údajov a o zmene a doplnení
            niektorých zákonov v znení neskorších predpisov (ďalej len „Zákon“) právo:
          </P>

          <Numbered
            items={[
              <>
                Na základe písomnej žiadosti od prevádzkovateľa vyžadovať:
                <Letters
                  items={[
                    ['a', 'potvrdenie, či sú alebo nie sú osobné údaje o nej spracúvané,'],
                    [
                      'b',
                      'vo všeobecne zrozumiteľnej forme informácie o spracúvaní osobných údajov v informačnom systéme v rozsahu podľa § 15 ods. 1 písm. a) až e) druhý až šiesty bod Zákona; pri vydaní rozhodnutia podľa § 28 ods. 5 Zákona je dotknutá osoba oprávnená oboznámiť sa s postupom spracúvania a vyhodnocovania operácií,',
                    ],
                    [
                      'c',
                      'vo všeobecne zrozumiteľnej forme presné informácie o zdroji, z ktorého získal jej osobné údaje na spracúvanie,',
                    ],
                    [
                      'd',
                      'vo všeobecne zrozumiteľnej forme zoznam jej osobných údajov, ktoré sú predmetom spracúvania,',
                    ],
                    [
                      'e',
                      'opravu alebo likvidáciu svojich nesprávnych, neúplných alebo neaktuálnych osobných údajov, ktoré sú predmetom spracúvania,',
                    ],
                    [
                      'f',
                      'likvidáciu jej osobných údajov, ktorých účel spracúvania sa skončil; ak sú predmetom spracúvania úradné doklady obsahujúce osobné údaje, môže požiadať o ich vrátenie,',
                    ],
                    [
                      'g',
                      'likvidáciu jej osobných údajov, ktoré sú predmetom spracúvania, ak došlo k porušeniu Zákona,',
                    ],
                    [
                      'h',
                      'blokovanie jej osobných údajov z dôvodu odvolania súhlasu pred uplynutím času jeho platnosti, ak prevádzkovateľ spracúva osobné údaje na základe súhlasu dotknutej osoby.',
                    ],
                  ]}
                />
              </>,
              <>
                Právo dotknutej osoby podľa § 28 ods. 1 písm. e) a f) Zákona možno obmedziť, len ak takéto obmedzenie
                vyplýva z osobitného zákona alebo jeho uplatnením by bola porušená ochrana dotknutej osoby, alebo by boli
                porušené práva a slobody iných osôb.
              </>,
              <>
                Na základe písomnej žiadosti má právo u prevádzkovateľa namietať voči
                <Letters
                  items={[
                    [
                      'a',
                      'spracúvaniu jej osobných údajov, o ktorých predpokladá, že sú alebo budú spracúvané na účely priameho marketingu bez jej súhlasu, a žiadať ich likvidáciu,',
                    ],
                    [
                      'b',
                      'využívaniu osobných údajov uvedených v § 10 ods. 3 písm. d) zákona o ochrane osobných údajov na účely priameho marketingu v poštovom styku,',
                    ],
                    [
                      'c',
                      'poskytovaniu osobných údajov uvedených v § 10 ods. 3 písm. d) zákona o ochrane osobných na účely priameho marketingu.',
                    ],
                  ]}
                />
              </>,
              <>
                Na základe písomnej žiadosti alebo osobne, ak vec neznesie odklad, má právo u prevádzkovateľa kedykoľvek
                namietať voči spracúvaniu osobných údajov v prípadoch podľa § 10 ods. 3 písm. a), e), f) alebo g) Zákona
                vyslovením oprávnených dôvodov alebo predložením dôkazov o neoprávnenom zasahovaní do jej práv a právom
                chránených záujmov, ktoré sú alebo môžu byť v konkrétnom prípade takýmto spracúvaním osobných údajov
                poškodené; ak tomu nebránia zákonné dôvody a preukáže sa, že námietka dotknutej osoby je oprávnená,
                prevádzkovateľ je povinný osobné údaje, ktorých spracúvanie dotknutá osoba namietala, bez zbytočného
                odkladu blokovať a zlikvidovať ihneď, ako to okolnosti dovolia.
              </>,
              <>
                Na základe písomnej žiadosti alebo osobne, ak vec neznesie odklad, u prevádzkovateľa kedykoľvek namietať a
                nepodrobiť sa rozhodnutiu prevádzkovateľa, ktoré by malo pre ňu právne účinky alebo významný dosah, ak sa
                také rozhodnutie vydá výlučne na základe úkonov automatizovaného spracúvania jej osobných údajov. Dotknutá
                osoba má právo žiadať prevádzkovateľa o preskúmanie vydaného rozhodnutia metódou odlišnou od
                automatizovanej formy spracúvania, pričom prevádzkovateľ je povinný žiadosti dotknutej osoby vyhovieť, a to
                tak, že rozhodujúcu úlohu pri preskúmaní rozhodnutia bude mať oprávnená osoba; o spôsobe preskúmania a
                výsledku zistenia prevádzkovateľ informuje dotknutú osobu v lehote podľa § 29 ods. 3 Zákona, t.j. do
                tridsiatich (30) dní od doručenia žiadosti. Dotknutá osoba nemá toto právo iba v prípade, ak to ustanovuje
                osobitný zákon, v ktorom sú upravené opatrenia na zabezpečenie oprávnených záujmov dotknutej osoby, alebo
                ak v rámci predzmluvných vzťahov alebo počas existencie zmluvných vzťahov prevádzkovateľ vydal
                rozhodnutie, ktorým vyhovel požiadavke dotknutej osoby, alebo ak prevádzkovateľ na základe zmluvy prijal
                iné primerané opatrenia na zabezpečenie oprávnených záujmov dotknutej osoby.
              </>,
              <>
                Ak dotknutá osoba uplatní svoje právo
                <Letters
                  items={[
                    [
                      'a',
                      'písomne a z obsahu jej žiadosti vyplýva, že uplatňuje svoje právo, žiadosť sa považuje za podanú podľa Zákona; žiadosť podanú elektronickou poštou alebo faxom dotknutá osoba doručí písomne najneskôr do troch dní odo dňa jej odoslania,',
                    ],
                    [
                      'b',
                      'osobne ústnou formou do zápisnice, z ktorej musí byť zrejmé, kto právo uplatnil, čoho sa domáha a kedy a kto vyhotovil zápisnicu, jeho podpis a podpis dotknutej osoby; kópiu zápisnice je prevádzkovateľ povinný odovzdať dotknutej osobe,',
                    ],
                    [
                      'c',
                      'u sprostredkovateľa podľa písmena a) alebo písmena b) § 28 ods. 6 Zákona je ten povinný túto žiadosť alebo zápisnicu odovzdať prevádzkovateľovi bez zbytočného odkladu.',
                    ],
                  ]}
                />
              </>,
              <>
                Dotknutá osoba pri podozrení, že jej osobné údaje sa neoprávnene spracúvajú, môže podať úradu návrh na
                začatie konania o ochrane osobných údajov.
              </>,
              <>Ak dotknutá osoba nemá spôsobilosť na právne úkony v plnom rozsahu, jej práva môže uplatniť zákonný zástupca.</>,
              <>Ak dotknutá osoba nežije, jej práva, ktoré mala podľa tohto zákona, môže uplatniť blízka osoba.</>,
            ]}
          />

          <H2>Informačná povinnosť prevádzkovateľa</H2>
          <Operator />
          <P>
            Prevádzkovateľ vyhlasuje, že pri spracúvaní osobných údajov dotknutých osôb postupuje v súlade so zákonom č.
            122/2013 Z. z. o ochrane osobných údajov a o zmene a doplnení niektorých zákonov v znení neskorších predpisov
            (ďalej len „Zákon“), spracúva osobné údaje len v rozsahu nevyhnutne potrebnom na naplnenie vymedzeného alebo
            ustanoveného účelu a prijal primerané technické, personálne a organizačné opatrenia na zabezpečenie ochrany
            spracúvaných osobných údajov v súlade so Zákonom.
          </P>
          <P>
            Dotknutá osoba je na účely vedenia personálno-mzdovej agendy a vedenia účtovníctva povinná poskytnúť svoje
            osobné údaje prevádzkovateľovi, a to v rozsahu podľa osobitných predpisov. Dotknutá osoba je povinná svoje
            osobné údaje poskytnúť na základe platnej legislatívy SR.
          </P>
          <P>
            Dotknutá osoba je na účely obstarania zájazdu a iných služieb cestovného ruchu povinná poskytnúť svoje osobné
            údaje, a to v rozsahu určenom v zmluve o obstaraní zájazdu. Dotknutá osoba je povinná svoje osobné údaje
            poskytnúť na základe zmluvy o obstaraní zájazdu, zmluvy o preprave osôb a na základe zákona č. 281/2001 Z.z. o
            zájazdoch, podmienkach podnikania cestovných kancelárií a cestovných agentúr v platnom znení (ďalej len „Zákon
            o zájazdoch“). Uvedená osoba je povinná osobné údaje poskytnúť aj za spolucestujúcich podľa § 5 Zákona o
            zájazdoch. V prípade odmietnutia poskytnúť osobné údaje nebude objednávateľovi poskytnutá služba.
          </P>
          <P>
            Prevádzkovateľ spracúva na účely podpory predaja a marketingu osobné údaje dotknutých osôb v rozsahu
            fotografia, meno, priezvisko, telefón, email, bydlisko, údaje o vzdelaní, a to na základe súhlasu dotknutej
            osoby. Súhlas udeľuje dotknutá osoba dobrovoľne na neurčitý čas. Svoj súhlas môže dotknutá osoba kedykoľvek
            odvolať. Fotografie dotknutých osôb sa zverejňujú na web stránke prevádzkovateľa www.bombovo.sk, na fun page na
            sociálnej sieti Facebook, v katalógoch a iných marketingových materiáloch. Referencie klientov sa zverejňujú na
            web stránke prevádzkovateľa v rozsahu meno, priezvisko. Zverejňujú sa aj údaje o vzdelaní zamestnancov a
            konateľov na web stránke prevádzkovateľa na účely preukázania odbornej spôsobilosti prevádzkovateľa.
          </P>
          <P>
            Osobné údaje na účely vernostného programu prevádzkovateľ spracúva v rozsahu meno, priezvisko, telefón, email,
            bydlisko, miesto zájazdu, termín, a to na základe súhlasu dotknutej osoby. Súhlas udeľuje dotknutá osoba
            dobrovoľne na neurčitý čas. Svoj súhlas môže dotknutá osoba kedykoľvek odvolať.
          </P>
          <P>
            Prevádzkovateľ spracúva osobné údaje dotknutej osoby aj prostredníctvom sprostredkovateľov – obchodných
            manažérov (predajcov), animátorov a siete províznych predajcov, ktorých aktuálny zoznam je zverejnený na web
            stránke www.bombovo.sk.
          </P>
          <P>
            Osobné údaje dotknutých osôb sú poskytované obchodným partnerom prevádzkovateľa zásadne na účely zabezpečenia
            objednaných služieb, a to v rozsahu nevyhnutnom na daný účel. Osobné údaje sú poskytované najmä dopravcom,
            ubytovacím zariadeniam a partnerským organizáciám prevádzkovateľa. Osobné údaje sú v nevyhnutnom rozsahu
            sprístupnené poskytovateľovi webhostingu, externému IT technikovi a správcovi web stránky prevádzkovateľa.
            Aktuálny zoznam je zverejnený na web stránke prevádzkovateľa www.bombovo.sk.
          </P>
          <P>
            Dotknutá osoba je zodpovedná za pravdivosť, správnosť, úplnosť a aktuálnosť osobných údajov poskytnutých
            prevádzkovateľovi, a to ako svojich údajov, tak aj údajov osôb, v prospech ktorých bola zmluva uzatvorená (§ 5
            Zákona o zájazdoch). Každú zmenu osobných údajov je povinná prevádzkovateľovi bezodkladne oznámiť.
          </P>

          <H2>Používanie údajov z Google účtov</H2>
          <P>
            Interná aplikácia „Bombovo Claude“ pristupuje k reklamnému účtu Google Ads spoločnosti Bombovo výlučne na
            účely správy a vyhodnocovania vlastných reklamných kampaní. Údaje nepredávame ani neposkytujeme tretím
            stranám. Použitie informácií získaných z Google API je v súlade s{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Google API Services User Data Policy
            </a>{' '}
            vrátane požiadaviek Limited Use.
          </P>

          <div className="mt-14 pt-8 border-t border-bombovo-gray">
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-3xl bg-bombovo-blue text-white font-bold text-base shadow-[0_4px_14px_-4px_rgba(55,114,255,0.45)] transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-blue focus-visible:ring-offset-2"
            >
              Stiahnuť PDF verziu
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
