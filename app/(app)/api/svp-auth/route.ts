import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "bombovo123";
const COOKIE_NAME = "svp_prezradene";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/skoly-v-prirode");
  const target = from.startsWith("/skoly-v-prirode") ? from : "/skoly-v-prirode";

  if (password !== PASSWORD) {
    const url = new URL("/skoly-v-prirode-heslo", request.url);
    url.searchParams.set("from", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(target, request.url), 303);
  response.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180,
    path: "/",
  });
  return response;
}
