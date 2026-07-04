'use server';

// Server Actions — the bridge client components use to call the data layer
// (lib/data.ts's server Supabase client only works in a request context;
// client components can't import it directly).
//
// Every mutating action derives the actor's identity from the server-side
// session (getCurrentUser / auth.getUser) rather than trusting a
// client-supplied id. RLS would block a mismatched write either way, but
// not trusting client input for the identity itself is the more defensible
// pattern and gives clearer error messages than a silent RLS rejection.

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import * as data from '@/lib/data';
import type {
  ServiceType,
  ReviewStatus,
  InvoiceLineItem,
  BookingStatus,
  Currency,
  SuggestedPaymentMethod,
} from '@/lib/types';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
const MOCK_USER_ID = 'u_001'; // matches lib/mock-data.ts's mockUser.id

export async function submitLeadAction(input: {
  full_name: string;
  email: string;
  whatsapp?: string;
  service_type?: ServiceType;
  destination?: string;
  message?: string;
}) {
  return data.createLead(input);
}

export async function createBookingAction(input: {
  service_type: ServiceType;
  destination: string;
  travel_date?: string;
  return_date?: string;
  notes?: string;
}) {
  const user = await data.getCurrentUser();
  if (!user) return { ok: false, error: 'not authenticated' };

  const result = await data.createBooking(user.id, input);
  if (result.ok) revalidatePath('/[locale]/portal/bookings', 'page');
  return result;
}

export async function updateBookingStatusAction(bookingId: string, status: BookingStatus) {
  const result = await data.updateBookingStatus(bookingId, status);
  if (result.ok) {
    revalidatePath('/[locale]/admin/bookings', 'page');
    revalidatePath('/[locale]/portal/bookings', 'page');
  }
  return result;
}

export async function sendMessageAction(content: string) {
  const user = await data.getCurrentUser();
  if (!user) return { ok: false, error: 'not authenticated' };

  const result = await data.sendMessage(user.id, content, 'inbound');
  if (result.ok) revalidatePath('/[locale]/portal/messages', 'page');
  return result;
}

export async function setDocumentReviewStatusAction(documentId: string, status: ReviewStatus) {
  const result = await data.setDocumentReviewStatus(documentId, status);
  if (result.ok) revalidatePath('/[locale]/admin/documents', 'page');
  return result;
}

export async function markInvoicePaidAction(invoiceId: string) {
  const result = await data.markInvoicePaid(invoiceId, 'pix');
  if (result.ok) {
    revalidatePath('/[locale]/portal/invoices', 'page');
    revalidatePath('/[locale]/admin/invoices', 'page');
  }
  return result;
}

export async function createInvoiceAction(input: {
  client_id: string;
  booking_id?: string;
  line_items: InvoiceLineItem[];
  due_date?: string;
  currency?: Currency;
  suggested_payment_method?: SuggestedPaymentMethod;
}) {
  const result = await data.createInvoice(input);
  if (result.ok) {
    revalidatePath('/[locale]/admin/invoices', 'page');
    revalidatePath('/[locale]/portal/invoices', 'page');
  }
  return result;
}

export async function updateProfileAction(input: {
  full_name?: string;
  phone?: string;
  preferred_language?: string;
}) {
  const user = await data.getCurrentUser();
  if (!user) return { ok: false, error: 'not authenticated' };

  const result = await data.updateProfile(user.id, input);
  if (result.ok) revalidatePath('/[locale]/portal/profile', 'page');
  return result;
}

/**
 * Uploads a document to the private `documents` storage bucket under the
 * authenticated user's own {client_id}/... prefix (required by the bucket's
 * RLS policy), then inserts the matching public.documents row.
 */
export async function uploadDocumentAction(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file) return { ok: false, error: 'missing file' };

  if (MOCK_MODE) {
    console.log('[data:mock] document uploaded →', MOCK_USER_ID, file.name);
    return {
      ok: true,
      document: {
        id: `local_${Date.now()}`,
        client_id: MOCK_USER_ID,
        file_name: file.name,
        storage_path: `${MOCK_USER_ID}/${Date.now()}_${file.name}`,
        doc_type: 'other' as const,
        review_status: 'pending' as const,
        uploaded_at: new Date().toISOString(),
      },
    };
  }

  const user = await data.getCurrentUser();
  if (!user) return { ok: false, error: 'not authenticated' };

  const supabase = await createClient();
  const path = `${user.id}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage.from('documents').upload(path, file);
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: row, error: insertError } = await supabase
    .from('documents')
    .insert({
      client_id: user.id,
      file_name: file.name,
      storage_path: path,
      doc_type: 'other',
    })
    .select('*')
    .single();

  if (insertError) return { ok: false, error: insertError.message };

  revalidatePath('/[locale]/portal/documents', 'page');
  revalidatePath('/[locale]/admin/documents', 'page');
  return { ok: true, document: row };
}

/**
 * Uploads a CIH bank-transfer slip for a specific invoice. Stored in the
 * same private `documents` bucket under a payment-proofs/ subfolder of the
 * client's own prefix (bucket RLS already scopes access by folder owner).
 * RLS on invoices_own additionally guarantees the invoiceId belongs to the
 * caller (or an admin) before the UPDATE is allowed to take effect.
 */
export async function uploadPaymentProofAction(invoiceId: string, formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file) return { ok: false, error: 'missing file' };

  if (MOCK_MODE) {
    console.log('[data:mock] payment proof uploaded →', invoiceId, file.name);
    return { ok: true };
  }

  const user = await data.getCurrentUser();
  if (!user) return { ok: false, error: 'not authenticated' };

  const supabase = await createClient();
  const path = `${user.id}/payment-proofs/${invoiceId}_${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage.from('documents').upload(path, file);
  if (uploadError) return { ok: false, error: uploadError.message };

  const { error: updateError } = await supabase
    .from('invoices')
    .update({
      payment_method: 'cih_transfer',
      payment_proof_path: path,
      payment_proof_status: 'pending',
      payment_proof_uploaded_at: new Date().toISOString(),
    })
    .eq('id', invoiceId);

  if (updateError) return { ok: false, error: updateError.message };

  revalidatePath('/[locale]/portal/invoices', 'page');
  revalidatePath('/[locale]/admin/invoices', 'page');
  return { ok: true };
}

export async function verifyPaymentProofAction(invoiceId: string, approve: boolean) {
  const result = await data.verifyPaymentProof(invoiceId, approve);
  if (result.ok) {
    revalidatePath('/[locale]/admin/invoices', 'page');
    revalidatePath('/[locale]/portal/invoices', 'page');
  }
  return result;
}

export async function approveClientAction(clientId: string, approve: boolean) {
  const result = await data.approveClient(clientId, approve);
  if (result.ok) revalidatePath('/[locale]/admin/clients', 'page');
  return result;
}
