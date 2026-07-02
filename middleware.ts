import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication (locale prefix is stripped before matching).
const PROTECTED = ['/portal', '/admin'];

// In mock mode there is no real Supabase session, so the auth gate is
// bypassed entirely — the portal/admin remain reachable without signing in.
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const path = stripLocale(request.nextUrl.pathname);
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + '/'));

  // Refresh the Supabase session cookie on every request.
  const { response: supabaseResponse, user } = await updateSession(request);

  if (isProtected && !user && !MOCK_MODE) {
    const locale = request.nextUrl.pathname.split('/')[1] || routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Hand off to next-intl, preserving any cookies Supabase set.
  const intlResponse = intlMiddleware(request);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });
  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
