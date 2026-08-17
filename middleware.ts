import { NextRequest, NextResponse } from "next/server";

// Temporary password gate while /skoly-v-prirode is being rebuilt.
const PROTECTED_PATH = "/skoly-v-prirode";
const GATE_PATH = "/skoly-v-prirode-heslo";
const COOKIE_NAME = "svp_prezradene";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname === PROTECTED_PATH || pathname.startsWith(`${PROTECTED_PATH}/`);
  if (!isProtected) return NextResponse.next();

  if (request.cookies.get(COOKIE_NAME)?.value === "1") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = GATE_PATH;
  url.search = "";
  url.searchParams.set("from", pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/skoly-v-prirode", "/skoly-v-prirode/:path*"],
};
