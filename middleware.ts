import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Suppresses the CookieYes consent banner on the advertorialsvp-1 landing page
// only. It must keep showing on every other route (other advertorials, the
// main site, etc.) — the matcher below scopes this middleware to that one
// path, so it never runs (and adds zero overhead) anywhere else.
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-suppress-cookieyes', '1')
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/advertorialsvp-1'],
}
