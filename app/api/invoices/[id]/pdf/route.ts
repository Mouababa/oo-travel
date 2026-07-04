import { createElement } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import { InvoiceDocument } from '@/lib/pdf/invoice-document';
import type { Invoice } from '@/lib/types';

// @react-pdf/renderer needs Node APIs (fs, Buffer) — not Edge-compatible.
export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS (invoices_own) already restricts this to the invoice's own client or
  // an admin — no extra authorization check needed here.
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const { data: client } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', invoice.client_id)
    .single();

  const buffer = await renderToBuffer(
    // @react-pdf/renderer types renderToBuffer as accepting only its own
    // <Document> element, not a custom wrapper component — InvoiceDocument
    // always returns one, so this is safe.
    createElement(InvoiceDocument, {
      invoice: invoice as Invoice,
      clientName: client?.full_name ?? '—',
      clientEmail: client?.email ?? '—',
    }) as Parameters<typeof renderToBuffer>[0],
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
    },
  });
}
