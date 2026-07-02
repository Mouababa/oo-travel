import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
const SIGNED_URL_TTL = 60 * 60; // 60 minutes (Section 6.3)

// GET /api/documents/signed-url?path=... — issue a short-lived download URL.
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'missing path' }, { status: 400 });
  }

  if (MOCK_MODE) {
    return NextResponse.json({ url: `#mock-signed-url/${encodeURIComponent(path)}` });
  }

  const supabase = await createClient();

  // RLS on storage.objects ensures the user can only sign their own files.
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(path, SIGNED_URL_TTL);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'not found' }, { status: 404 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
