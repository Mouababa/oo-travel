import { createHash } from 'crypto';
import { headers, cookies } from 'next/headers';
import { META_PIXEL_ID } from './analytics';

const CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const GRAPH_VERSION = 'v21.0';

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

type MetaEventName = 'Lead' | 'CompleteRegistration';

/**
 * Sends a server-side event to Meta's Conversions API, matched to the
 * browser-side pixel event via `eventId` (fbq's `eventID` third arg) so
 * Meta dedupes the pair into one event instead of double-counting.
 *
 * Best-effort: analytics delivery must never block or fail the caller's
 * actual business action (lead creation, signup).
 */
export async function sendMetaCapiEvent(params: {
  eventName: MetaEventName;
  eventId: string;
  eventSourceUrl: string;
  email?: string;
  phone?: string;
}) {
  if (!CAPI_ACCESS_TOKEN || !META_PIXEL_ID) return;

  try {
    const hdrs = await headers();
    const cookieStore = await cookies();

    const userData: Record<string, unknown> = {
      client_ip_address: hdrs.get('x-forwarded-for')?.split(',')[0]?.trim(),
      client_user_agent: hdrs.get('user-agent') ?? undefined,
      fbp: cookieStore.get('_fbp')?.value,
      fbc: cookieStore.get('_fbc')?.value,
    };
    if (params.email) userData.em = [sha256(params.email)];
    if (params.phone) userData.ph = [sha256(params.phone.replace(/\D/g, ''))];

    await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${CAPI_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: params.eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: params.eventId,
              event_source_url: params.eventSourceUrl,
              action_source: 'website',
              user_data: userData,
            },
          ],
        }),
      },
    );
  } catch {
    // Swallow — a failed analytics call must never surface as a user-facing error.
  }
}
