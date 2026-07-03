import { NextRequest, NextResponse } from 'next/server';
import { createPixCharge } from '@/lib/mercadopago';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/data';
import { mockInvoices, mockUser } from '@/lib/mock-data';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// POST /api/payments/create-pix — create a PIX charge for an invoice.
export async function POST(request: NextRequest) {
  const { invoiceId } = await request.json();

  if (MOCK_MODE) {
    const invoice = mockInvoices.find((i) => i.id === invoiceId) ?? mockInvoices[0];
    const charge = await createPixCharge({
      amount: invoice.total_brl,
      description: `OO Travel — ${invoice.invoice_number}`,
      payerEmail: mockUser.email,
      invoiceNumber: invoice.invoice_number,
    });
    return NextResponse.json(charge);
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
  }

  // RLS (invoices_own) already scopes this to the caller's own invoices or
  // an admin — .single() naturally 404s for a mismatched/foreign invoiceId.
  const supabase = await createClient();
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: 'invoice not found' }, { status: 404 });
  }

  const charge = await createPixCharge({
    amount: invoice.total_brl,
    description: `OO Travel — ${invoice.invoice_number}`,
    payerEmail: user.email,
    invoiceNumber: invoice.invoice_number,
  });

  return NextResponse.json(charge);
}
