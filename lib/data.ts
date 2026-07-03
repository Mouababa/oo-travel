// Real data-access layer, branching on MOCK_MODE. Mirrors mock-data.ts's
// function names/shapes so callers don't need to know which mode is active —
// every function here is async (mock-data.ts's were sync), so callers must
// await them.
//
// Server Components use the server Supabase client (lib/supabase/server.ts,
// cookie-based session). Nothing here is safe to import into a 'use client'
// file — client components that need writes use the browser client directly
// (lib/supabase/client.ts) or call these through a Server Action.

import { createClient } from '@/lib/supabase/server';
import {
  mockUser,
  mockClients,
  bookingsForClient as mockBookingsForClient,
  documentsForClient as mockDocumentsForClient,
  invoicesForClient as mockInvoicesForClient,
  messagesForClient as mockMessagesForClient,
  mockBookings,
  mockDocuments,
  mockInvoices,
  mockMessages,
  clientName as mockClientName,
} from '@/lib/mock-data';
import type {
  User,
  Booking,
  Document,
  Invoice,
  Message,
  Lead,
  ServiceType,
  ReviewStatus,
} from '@/lib/types';

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// ─── Current user ──────────────────────────────────────────────

/** The signed-in user's full profile row, or null if not authenticated. */
export async function getCurrentUser(): Promise<User | null> {
  if (MOCK_MODE) return mockUser;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return (data as User) ?? null;
}

/** True if the signed-in user is an admin. Mock mode always returns true
 * on admin routes since the (admin) layout hardcodes mockAdmin. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  if (MOCK_MODE) return true;
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

// ─── Client-facing reads (portal) ───────────────────────────────

export async function bookingsForClient(clientId: string): Promise<Booking[]> {
  if (MOCK_MODE) return mockBookingsForClient(clientId);
  const supabase = await createClient();
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  return (data as Booking[]) ?? [];
}

export async function documentsForClient(clientId: string): Promise<Document[]> {
  if (MOCK_MODE) return mockDocumentsForClient(clientId);
  const supabase = await createClient();
  const { data } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('uploaded_at', { ascending: false });
  return (data as Document[]) ?? [];
}

export async function invoicesForClient(clientId: string): Promise<Invoice[]> {
  if (MOCK_MODE) return mockInvoicesForClient(clientId);
  const supabase = await createClient();
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('due_date', { ascending: false });
  return (data as Invoice[]) ?? [];
}

export async function messagesForClient(clientId: string): Promise<Message[]> {
  if (MOCK_MODE) return mockMessagesForClient(clientId);
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true });
  return (data as Message[]) ?? [];
}

// ─── Admin-facing reads ──────────────────────────────────────────

export async function allClients(): Promise<User[]> {
  if (MOCK_MODE) return mockClients;
  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false });
  return (data as User[]) ?? [];
}

export async function allBookings(): Promise<Booking[]> {
  if (MOCK_MODE) return mockBookings;
  const supabase = await createClient();
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Booking[]) ?? [];
}

export async function allDocuments(): Promise<Document[]> {
  if (MOCK_MODE) return mockDocuments;
  const supabase = await createClient();
  const { data } = await supabase
    .from('documents')
    .select('*')
    .order('uploaded_at', { ascending: false });
  return (data as Document[]) ?? [];
}

export async function allInvoices(): Promise<Invoice[]> {
  if (MOCK_MODE) return mockInvoices;
  const supabase = await createClient();
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .order('due_date', { ascending: false });
  return (data as Invoice[]) ?? [];
}

export async function allMessages(): Promise<Message[]> {
  if (MOCK_MODE) return mockMessages;
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Message[]) ?? [];
}

export async function clientName(clientId: string): Promise<string> {
  if (MOCK_MODE) return mockClientName(clientId);
  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', clientId)
    .single();
  return data?.full_name ?? 'Cliente';
}

/** Batch version — avoids N+1 queries when rendering a table of rows that
 * each need a client name (admin bookings/documents/invoices pages). */
export async function clientNameMap(clientIds: string[]): Promise<Record<string, string>> {
  if (MOCK_MODE) {
    return Object.fromEntries(
      await Promise.all(clientIds.map(async (id) => [id, await mockClientName(id)] as const)),
    );
  }
  const supabase = await createClient();
  const unique = Array.from(new Set(clientIds));
  const { data } = await supabase.from('users').select('id, full_name').in('id', unique);
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.id] = row.full_name;
  return map;
}

// ─── Writes ────────────────────────────────────────────────────

/** Public lead capture — no auth required (RLS: anon insert allowed). */
export async function createLead(input: {
  full_name: string;
  email: string;
  whatsapp?: string;
  service_type?: ServiceType;
  destination?: string;
  message?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) {
    console.log('[data:mock] lead captured →', input);
    return { ok: true };
  }
  const supabase = await createClient();
  const { error } = await supabase.from('leads').insert({ ...input, source: 'website' });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function createBooking(
  clientId: string,
  input: {
    service_type: ServiceType;
    destination: string;
    travel_date?: string;
    return_date?: string;
    notes?: string;
  },
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (MOCK_MODE) {
    console.log('[data:mock] booking created →', clientId, input);
    return { ok: true, id: `mock_${Date.now()}` };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert({ client_id: clientId, ...input })
    .select('id')
    .single();
  return error ? { ok: false, error: error.message } : { ok: true, id: data.id };
}

export async function sendMessage(
  clientId: string,
  content: string,
  direction: 'inbound' | 'outbound' = 'inbound',
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };
  const supabase = await createClient();
  const { error } = await supabase
    .from('messages')
    .insert({ client_id: clientId, content, direction, channel: 'portal' });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function setDocumentReviewStatus(
  documentId: string,
  status: ReviewStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };
  const supabase = await createClient();
  const { error } = await supabase
    .from('documents')
    .update({ review_status: status })
    .eq('id', documentId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function markInvoicePaid(
  invoiceId: string,
  paymentMethod: 'pix' | 'card' = 'pix',
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };
  const supabase = await createClient();
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'paid', paid_at: new Date().toISOString(), payment_method: paymentMethod })
    .eq('id', invoiceId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/**
 * Admin-only: approve or reject a CIH bank-transfer proof. Approving also
 * marks the invoice paid. RLS + the prevent_payment_proof_self_approval
 * trigger both guard this — a non-admin caller gets rejected at the DB
 * layer regardless of what this function does, but is_admin() is checked
 * here too so the UI can show a clear error instead of a raw DB exception.
 */
export async function verifyPaymentProof(
  invoiceId: string,
  approve: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };

  if (!(await isCurrentUserAdmin())) {
    return { ok: false, error: 'not authorized' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('invoices')
    .update(
      approve
        ? {
            payment_proof_status: 'approved',
            status: 'paid',
            paid_at: new Date().toISOString(),
          }
        : { payment_proof_status: 'rejected' },
    )
    .eq('id', invoiceId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateProfile(
  userId: string,
  input: { full_name?: string; phone?: string; preferred_language?: string },
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };
  const supabase = await createClient();
  const { error } = await supabase.from('users').update(input).eq('id', userId);
  return error ? { ok: false, error: error.message } : { ok: true };
}
