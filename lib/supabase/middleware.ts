import type { CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

/**
 * Refreshes the Supabase auth session and returns the current user (if any)
 * plus their role. In mock mode we short-circuit so the UI is browsable
 * without a backend.
 *
 * `@supabase/ssr` is imported lazily (only in the non-mock branch): its
 * module graph pulls in `@supabase/supabase-js`, which touches
 * `process.version` — a Node.js API unavailable on the Edge Runtime that
 * Next.js middleware always runs on in production. A static top-level import
 * loads that graph unconditionally and crashes middleware on every request
 * (MIDDLEWARE_INVOCATION_FAILED) even when mock mode never calls it.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (MOCK_MODE) {
    return { response, user: null, role: null as string | null };
  }

  const { createServerClient } = await import('@supabase/ssr');
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
      // See lib/supabase/server.ts — without this, Next.js's fetch cache can
      // serve a stale cached role lookup right after a role change.
      global: {
        fetch: (url: RequestInfo | URL, options: RequestInit = {}) =>
          fetch(url, { ...options, cache: 'no-store' }),
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    // Needed to gate /admin — being signed in is not the same as being an
    // admin. RLS (users_self) allows a user to read their own row.
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
    role = data?.role ?? null;
  }

  return { response, user, role };
}
