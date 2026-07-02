import { NextRequest, NextResponse } from 'next/server';
import { createPixCharge } from '@/lib/mercadopago';
import { mockInvoices, mockUser } from '@/lib/mock-data';

// POST /api/payments/create-pix — create a PIX charge for an invoice.
export async function POST(request: NextRequest) {
  const { invoiceId } = await request.json();

  // In production, load the invoice from Supabase and verify ownership.
  const invoice = mockInvoices.find((i) => i.id === invoiceId) ?? mockInvoices[0];

  const charge = await createPixCharge({
    amount: invoice.total_brl,
    description: `OO Travel — ${invoice.invoice_number}`,
    payerEmail: mockUser.email,
    invoiceNumber: invoice.invoice_number,
  });

  return NextResponse.json(charge);
}
