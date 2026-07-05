import { Resend } from 'resend';

// Lazily constructed — importing this module must never crash a route that
// doesn't actually send email (e.g. during build, or if the key is briefly
// unset). The key is only required at the moment an email is actually sent.
let client: Resend | null = null;
function getClient(): Resend {
  if (!client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

const FROM = 'OO Travel <notifications@ootravel.com.br>';
const REPLY_TO = 'contact@ootravel.com.br';

/**
 * Sends a transactional email. Callers should treat this as best-effort —
 * a delivery failure must never break the underlying booking/invoice/
 * message action that triggered it (see lib/email/transactional.ts).
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await getClient().emails.send({
      from: FROM,
      to,
      replyTo: REPLY_TO,
      subject,
      html,
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown error' };
  }
}
