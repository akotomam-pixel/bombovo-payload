import SutazMikinaVslFestClient from './SutazMikinaVslFestClient'

export const metadata = {
  title: 'Vyhraj FEST mikinu | Bombovo',
  description: 'Napíš nám úprimne, aký bol tvoj FEST Animátor Fest, a zapoj sa do súťaže o mikinu.',
  robots: { index: false, follow: false },
}

export default function SutazMikinaVslFestPage() {
  return <SutazMikinaVslFestClient />
}
