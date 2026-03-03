import type { Metadata } from 'next'
import { The_Girl_Next_Door } from 'next/font/google'
import Script from 'next/script'
import React from 'react'

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
      <head>
        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn.cookieyes.com/client_data/500b87a6adab5aa80a/script.js"
          strategy="beforeInteractive"
        />
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KF2WTPS8');`}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KF2WTPS8"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
