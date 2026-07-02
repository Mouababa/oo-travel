import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/mercadopago';

// POST /api/payments/webhook — Mercado Pago payment notifications (Section 5.3).
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-signature');
  const requestId = request.headers.get('x-request-id');
  const body = await request.json().catch(() => ({}));

  const dataId = body?.data?.id ?? '';

  if (!verifyWebhookSignature(signature, requestId, dataId)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  // On `payment.updated` with status `approved`:
  //   1. Look up the invoice by external_reference / mercado_pago_id.
  //   2. Update invoices.status = 'paid', paid_at = now().
  //   3. Send confirmation email (Resend) to the client + Omar.
  // TODO: implement once Supabase credentials are configured.

  return NextResponse.json({ received: true });
}
