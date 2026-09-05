import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { The_Girl_Next_Door, Comic_Neue } from 'next/font/google'
import Script from 'next/script'
import React from 'react'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/next'
import { PostHogProvider } from '@/components/PostHogProvider'

const theGirlNextDoor = The_Girl_Next_Door({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-amatic',
  display: 'swap',
})

// Sub-headings across the Lomy page. Comic Sans MS was being used as a system
// font: it ships with Windows, so it worked in development, but iOS does not
// have it and Safari fell through to `cursive`, which there is the Snell
// Roundhand script. It is also proprietary and cannot be self-hosted, so this is
// Comic Neue — the open face drawn as its successor — loaded properly and
// therefore identical on every device.
const comicNeue = Comic_Neue({
  weight: ['400', '700'],
  // Comic Neue ships one subset; checked its cmap directly and every Slovak
  // diacritic (a c d e i l n o r s t u y z with their marks) is present.
  subsets: ['latin'],
  variable: '--font-subhead',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bombovo - Letné tábory pre deti',
  description: 'Najlepšie letné tábory a školy v prírode pre deti vo veku 6-17 rokov na Slovensku',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // advertorialsvp-1 suppresses the CookieYes banner (see middleware.ts) — every
  // other route keeps it, since the header is only ever set for that one path.
  const headersList = await headers()
  const suppressCookieYes = headersList.get('x-suppress-cookieyes') === '1'

  return (
    <html lang="sk" className={`${theGirlNextDoor.variable} ${comicNeue.variable}`}>
      <head>
        {!suppressCookieYes && (
          <script
            id="cookieyes"
            type="text/javascript"
            src="https://cdn-cookieyes.com/client_data/500b87a6adab5aa80a1d290c0e3a5bdb/script.js"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Bombovo',
              url: 'https://bombovo.sk',
              description: 'Detské letné tábory a školy v prírode pre deti od 6 do 17 rokov na Slovensku',
              sameAs: [
                'https://www.facebook.com/Bombovo.sk/',
                'https://www.instagram.com/bombovo/?hl=en',
              ],
            }),
          }}
        />
        {/* Pre-initialize dataLayer so events queued before GTM loads are not lost */}
        <Script id="gtm-datalayer-init" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>
        {/* Ecomail web tracking — library loaded dynamically so ecotrack calls only
            run inside onload, guaranteeing the library exists before use */}
        <Script id="ecomail-tracker" strategy="afterInteractive">
          {`(function() {
  var s = document.createElement('script');
  s.src = '//d70shl7vidtft.cloudfront.net/ecmtr-2.4.2.js';
  s.async = true;
  s.onload = function() {
    window.ecotrack('newTracker', 'cf', 'd2dpiwfhf3tz0r.cloudfront.net', { appId: 'bombovo' });
    window.ecotrack('setUserIdFromLocation', 'ecmid');
    window.ecotrack('trackPageView');
  };
  document.head.appendChild(s);
})();`}
        </Script>
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
        <NextTopLoader color="#F5A623" showSpinner={false} />
        <PostHogProvider>{children}</PostHogProvider>
        <Analytics />
      </body>
    </html>
  )
}
