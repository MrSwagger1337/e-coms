import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

// List of supported locales
export const locales = ["en", "ar"]
export const defaultLocale = "en"

// Get the preferred locale from the request
function getLocale(request: NextRequest): string {
  // Negotiator expects a plain object, so we need to simulate one
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Use negotiator and intl-localematcher to get the best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // Special case for dashboard routes - don't redirect these
  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  // Special case for API routes - don't redirect these
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // If the pathname doesn't have a locale, redirect to the preferred locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request)

    // Preserve query parameters during redirect
    const search = request.nextUrl.search
    return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${search}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!_next|api).*)"],
}

