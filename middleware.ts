import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication (locale prefix is stripped before matching).
const PROTECTED = ['/portal', '/admin'];
// Routes that additionally require role === 'admin'. Being signed in is not
// enough — without this check any authenticated client could reach /admin.
const ADMIN_ONLY = ['/admin'];

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
  const isAdminOnly = ADMIN_ONLY.some((p) => path === p || path.startsWith(p + '/'));
  const locale = request.nextUrl.pathname.split('/')[1] || routing.defaultLocale;

  // Refresh the Supabase session cookie on every request.
  const { response: supabaseResponse, user, role } = await updateSession(request);

  if (isProtected && !user && !MOCK_MODE) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Signed in but not an admin trying to reach /admin — send to the portal
  // rather than the login screen (they don't need to sign in again).
  if (isAdminOnly && user && role !== 'admin' && !MOCK_MODE) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/portal`;
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
