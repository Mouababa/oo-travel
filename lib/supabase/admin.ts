import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client — bypasses RLS entirely and can call the Auth Admin
 * API (e.g. deleting a user's auth record, which no amount of RLS
 * permission can do from the regular cookie-scoped client). Only ever use
 * this for privileged, explicitly admin-gated server-side operations —
 * never import it into client code or expose it via an unguarded action.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
