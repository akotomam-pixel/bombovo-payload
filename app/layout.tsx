import type { Metadata } from 'next'
import { The_Girl_Next_Door } from 'next/font/google'
import './globals.css'

const theGirlNextDoor = The_Girl_Next_Door({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-amatic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bombovo - Letné tábory pre deti',
  description: 'Najlepšie letné tábory a školy v prírode pre deti vo veku 6-17 rokov na Slovensku',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk" className={theGirlNextDoor.variable}>
      <body>{children}</body>
    </html>
  )
}



