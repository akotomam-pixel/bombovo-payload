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
        {/* Pre-initialize dataLayer so events queued before GTM loads are not lost */}
        <Script id="gtm-datalayer-init" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>
        {/* Ecomail web tracking */}
        <Script id="ecomail-tracker" strategy="afterInteractive">
          {`;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)};
p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
n.src='//d1fc8wv8zag5ca.cloudfront.net/2.14.0/sp.js';
g.parentNode.insertBefore(n,g)}}(window,document,'script','','ecotrack'));
window.ecotrack('newTracker','cf','d2dpiwfhf3tz0r.cloudfront.net',{
  appId:'${process.env.NEXT_PUBLIC_ECOMAIL_ACCOUNT_ID}',cookieDomain:null
});
window.ecotrack('setUserIdFromLocation','ecmid');
window.ecotrack('trackPageView');`}
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
        {children}
      </body>
    </html>
  )
}
