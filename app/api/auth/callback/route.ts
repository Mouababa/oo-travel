import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Exchanges the PKCE `code` Supabase appends to signup-confirmation and
// magic-link emails for a real session cookie. Without this route, those
// emails redirected straight to a page with an unused `?code=...` in the
// URL and no session ever got established — @supabase/ssr's browser client
// does not do this exchange automatically for the query-param PKCE flow.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const locale = searchParams.get('locale') || 'pt';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/${locale}/portal`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/login`);
}
