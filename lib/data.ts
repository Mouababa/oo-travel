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
  BookingStatus,
  Document,
  Invoice,
  InvoiceLineItem,
  Currency,
  SuggestedPaymentMethod,
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

/** Self-signed-up clients awaiting admin review, oldest first (FIFO queue). */
export async function pendingClients(): Promise<User[]> {
  if (MOCK_MODE) return mockClients.filter((c) => c.approval_status === 'pending');
  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'client')
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: true });
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
  service_types?: ServiceType[];
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
    service_types: ServiceType[];
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

/** Admin-only: creates a booking on a client's behalf (e.g. formalizing a
 * phone/WhatsApp request into the system). Mirrors createInvoice's shape. */
export async function createBookingForClient(input: {
  client_id: string;
  service_types: ServiceType[];
  destination: string;
  travel_date?: string;
  return_date?: string;
  notes?: string;
}): Promise<{ ok: boolean; booking?: Booking; error?: string }> {
  if (MOCK_MODE) return { ok: true };

  if (!(await isCurrentUserAdmin())) {
    return { ok: false, error: 'not authorized' };
  }
  if (input.service_types.length === 0) {
    return { ok: false, error: 'at least one service is required' };
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from('bookings')
    .insert({
      client_id: input.client_id,
      service_types: input.service_types,
      destination: input.destination,
      travel_date: input.travel_date || null,
      return_date: input.return_date || null,
      notes: input.notes || null,
    })
    .select('*')
    .single();

  return error ? { ok: false, error: error.message } : { ok: true, booking: row as Booking };
}

/** Admin-only: adjusts which services are included on an existing booking
 * (e.g. the client asked for flight + hotel, admin confirms flight now and
 * removes hotel to handle separately) without creating a new request. */
export async function updateBookingServices(
  bookingId: string,
  serviceTypes: ServiceType[],
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };

  if (!(await isCurrentUserAdmin())) {
    return { ok: false, error: 'not authorized' };
  }
  if (serviceTypes.length === 0) {
    return { ok: false, error: 'at least one service is required' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ service_types: serviceTypes })
    .eq('id', bookingId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };

  if (!(await isCurrentUserAdmin())) {
    return { ok: false, error: 'not authorized' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
  return error ? { ok: false, error: error.message } : { ok: true };
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

/** Admin-only: reply to a client from the dashboard. RLS (messages_own)
 * already allows an admin to write any client_id, but is_admin() is checked
 * here too so the UI can show a clear error instead of a raw DB rejection. */
export async function sendAdminMessage(
  clientId: string,
  content: string,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };

  if (!(await isCurrentUserAdmin())) {
    return { ok: false, error: 'not authorized' };
  }

  return sendMessage(clientId, content, 'outbound');
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
 * Admin-only: issues a new invoice for a client (optionally tied to one of
 * their bookings). The invoice number comes from the DB sequence
 * (next_invoice_number()) rather than being assigned in app code, so two
 * concurrent admins can never collide on the same number.
 */
export async function createInvoice(input: {
  client_id: string;
  booking_id?: string;
  line_items: InvoiceLineItem[];
  due_date?: string;
  currency?: Currency;
  suggested_payment_method?: SuggestedPaymentMethod;
}): Promise<{ ok: boolean; invoice?: Invoice; error?: string }> {
  if (MOCK_MODE) return { ok: true };

  if (!(await isCurrentUserAdmin())) {
    return { ok: false, error: 'not authorized' };
  }
  if (input.line_items.length === 0) {
    return { ok: false, error: 'at least one line item is required' };
  }
  // PIX only ever settles in BRL — the DB constraint would reject this too,
  // but check here for a clear error instead of a raw constraint violation.
  if (input.suggested_payment_method === 'pix' && input.currency && input.currency !== 'BRL') {
    return { ok: false, error: 'PIX can only be suggested for BRL invoices' };
  }

  const supabase = await createClient();
  const { data: invoiceNumber, error: numberError } = await supabase.rpc('next_invoice_number');
  if (numberError) return { ok: false, error: numberError.message };

  const total_brl = input.line_items.reduce((sum, li) => sum + li.amount_brl, 0);

  const { data: row, error } = await supabase
    .from('invoices')
    .insert({
      client_id: input.client_id,
      booking_id: input.booking_id || null,
      invoice_number: invoiceNumber,
      line_items: input.line_items,
      total_brl,
      due_date: input.due_date || null,
      currency: input.currency || 'BRL',
      suggested_payment_method: input.suggested_payment_method || null,
    })
    .select('*')
    .single();

  return error ? { ok: false, error: error.message } : { ok: true, invoice: row as Invoice };
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

/**
 * Admin-only: approve or reject a self-service client signup. RLS + the
 * prevent_role_self_escalation trigger both guard this at the DB layer too
 * — is_admin() is checked here so the UI gets a clean error instead of a
 * raw exception.
 */
export async function approveClient(
  clientId: string,
  approve: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (MOCK_MODE) return { ok: true };

  if (!(await isCurrentUserAdmin())) {
    return { ok: false, error: 'not authorized' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('users')
    .update({ approval_status: approve ? 'approved' : 'rejected' })
    .eq('id', clientId);
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
