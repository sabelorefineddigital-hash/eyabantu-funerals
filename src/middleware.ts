import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "ntf_session";

function secretKey() {
  const s = process.env.AUTH_SECRET ?? "ntf-demo-secret-change-in-production-min-32-chars!!";
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const role = String(payload.role ?? "");

    if (pathname.startsWith("/print")) {
      if (role !== "OWNER" && role !== "STAFF") {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    if (pathname.startsWith("/owner")) {
      if (role !== "OWNER") {
        const url = req.nextUrl.clone();
        url.pathname = "/staff";
        return NextResponse.redirect(url);
      }
    }

    if (pathname.startsWith("/staff")) {
      if (role === "OWNER") {
        const url = req.nextUrl.clone();
        url.pathname = "/owner";
        return NextResponse.redirect(url);
      }
      if (role !== "STAFF") {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/owner", "/owner/:path*", "/staff", "/staff/:path*", "/print", "/print/:path*"],
};
