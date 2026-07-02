import { MercadoPagoConfig, Payment } from 'mercadopago';

export interface PixCharge {
  payment_id: string;
  qr_code: string;
  qr_code_base64: string;
  ticket_url?: string;
  expires_at: string;
}

const MOCK_MODE =
  process.env.NEXT_PUBLIC_MOCK_MODE === 'true' || !process.env.MERCADO_PAGO_ACCESS_TOKEN;

/**
 * Create a PIX charge via Mercado Pago. Returns the QR code + copy-paste key.
 * In mock mode a fake but well-formed payload is returned so the modal renders.
 */
export async function createPixCharge(params: {
  amount: number;
  description: string;
  payerEmail: string;
  invoiceNumber: string;
}): Promise<PixCharge> {
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  if (MOCK_MODE) {
    return {
      payment_id: `mock_${Date.now()}`,
      qr_code: `00020126580014br.gov.bcb.pix0136mock-${params.invoiceNumber}5204000053039865802BR6009SAO PAULO62070503***6304ABCD`,
      // 1x1 transparent PNG placeholder.
      qr_code_base64:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      expires_at: expiresAt,
    };
  }

  const config = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  });
  const payment = new Payment(config);

  const result = await payment.create({
    body: {
      transaction_amount: params.amount,
      description: params.description,
      payment_method_id: 'pix',
      payer: { email: params.payerEmail },
      external_reference: params.invoiceNumber,
      date_of_expiration: expiresAt,
    },
  });

  const tx = result.point_of_interaction?.transaction_data;

  return {
    payment_id: String(result.id),
    qr_code: tx?.qr_code ?? '',
    qr_code_base64: tx?.qr_code_base64 ?? '',
    ticket_url: tx?.ticket_url,
    expires_at: expiresAt,
  };
}

/**
 * Verify a Mercado Pago webhook signature. Stub returns true in mock mode.
 */
export function verifyWebhookSignature(
  _signature: string | null,
  _requestId: string | null,
  _dataId: string,
): boolean {
  if (MOCK_MODE) return true;
  // TODO: implement HMAC validation per Mercado Pago docs using
  // MERCADO_PAGO_WEBHOOK_SECRET and the x-signature / x-request-id headers.
  return Boolean(process.env.MERCADO_PAGO_WEBHOOK_SECRET);
}
