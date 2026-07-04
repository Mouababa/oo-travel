// Shared domain types — mirror the Postgres schema in Section 3.

export type Locale = 'pt' | 'en' | 'fr' | 'ar';
export type Role = 'client' | 'admin';

export type ServiceType =
  | 'flight'
  | 'hotel'
  | 'tour'
  | 'visa'
  | 'cruise'
  | 'corporate'
  | 'legal'
  | 'car_rental';

export type BookingStatus = 'pending' | 'processing' | 'confirmed' | 'cancelled';
export type DocType = 'passport' | 'residence' | 'bank_statement' | 'photo_id' | 'other';
export type ReviewStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';
export type PaymentMethod = 'pix' | 'card' | 'cih_transfer';
/** Main customers are Moroccan and Brazilian, then the rest of the world. */
export type Currency = 'BRL' | 'USD' | 'MAD';
/** Payment methods an admin may suggest at invoice creation — PIX only ever
 * settles in BRL, so it's excluded when currency isn't BRL (see lib/data.ts). */
export type SuggestedPaymentMethod = 'pix' | 'cih_transfer';
export type PaymentProofStatus = 'pending' | 'approved' | 'rejected';
export type MessageDirection = 'inbound' | 'outbound';
export type MessageChannel = 'portal' | 'whatsapp';
export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  whatsapp?: string;
  service_type?: ServiceType;
  destination?: string;
  message?: string;
  source: string;
  status: LeadStatus;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  preferred_language: Locale;
  role: Role;
  whatsapp_id?: string;
  /** Self-service signups start 'pending' until an admin approves them. */
  approval_status: ApprovalStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  service_type: ServiceType;
  destination: string;
  travel_date?: string;
  return_date?: string;
  status: BookingStatus;
  amount_brl?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  booking_id?: string;
  client_id: string;
  file_name: string;
  storage_path: string;
  doc_type: DocType;
  review_status: ReviewStatus;
  uploaded_at: string;
}

export interface InvoiceLineItem {
  label: string;
  amount_brl: number;
}

export interface Invoice {
  id: string;
  booking_id?: string;
  client_id: string;
  invoice_number: string;
  line_items: InvoiceLineItem[];
  /** Legacy name — holds the amount in whatever `currency` is, not always BRL. */
  total_brl: number;
  currency: Currency;
  /** Set by the admin at creation to suggest one method; null lets the
   * client choose from whatever's valid for the invoice's currency. */
  suggested_payment_method?: SuggestedPaymentMethod;
  status: InvoiceStatus;
  due_date?: string;
  paid_at?: string;
  payment_method?: PaymentMethod;
  mercado_pago_id?: string;
  /** CIH bank-transfer proof-of-payment — manual review, not an API gateway. */
  payment_proof_path?: string;
  payment_proof_status?: PaymentProofStatus;
  payment_proof_uploaded_at?: string;
  created_at: string;
}

export interface Message {
  id: string;
  client_id: string;
  direction: MessageDirection;
  channel: MessageChannel;
  content: string;
  is_ai_generated: boolean;
  read_at?: string;
  created_at: string;
}
