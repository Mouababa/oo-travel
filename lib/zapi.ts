const MOCK_MODE =
  process.env.NEXT_PUBLIC_MOCK_MODE === 'true' || !process.env.ZAPI_INSTANCE_ID;

/**
 * Send a WhatsApp message via Z-API. No-op log in mock mode.
 */
export async function sendWhatsAppMessage(params: {
  phone: string;
  message: string;
}): Promise<{ ok: boolean; id?: string }> {
  if (MOCK_MODE) {
    console.log('[zapi:mock] →', params.phone, params.message);
    return { ok: true, id: `mock_${Date.now()}` };
  }

  const url = `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: params.phone, message: params.message }),
  });

  if (!res.ok) {
    return { ok: false };
  }
  const data = await res.json();
  return { ok: true, id: data.messageId };
}

/** Business hours check — Mon–Fri 9am–6pm BRT (UTC-3). */
export function isWithinBusinessHours(now = new Date()): boolean {
  // Convert to BRT.
  const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const day = brt.getUTCDay(); // 0 = Sun
  const hour = brt.getUTCHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}
