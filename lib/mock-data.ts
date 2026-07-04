import type { Booking, Document, Invoice, Message, User } from './types';

// In-memory sample data powering the UI while integrations are stubbed.
// Replace with Supabase queries once credentials are wired in.

export const mockUser: User = {
  id: 'u_001',
  email: 'maria.silva@example.com',
  full_name: 'Maria Silva',
  phone: '+55 11 98888-1234',
  preferred_language: 'pt',
  role: 'client',
  approval_status: 'approved',
  whatsapp_id: '5511988881234',
  created_at: '2026-01-12T10:00:00Z',
};

export const mockAdmin: User = {
  id: 'u_admin',
  email: 'omar@ootravel.com.br',
  full_name: 'Omar Oukhira',
  phone: '+55 11 93321-0241',
  preferred_language: 'pt',
  role: 'admin',
  approval_status: 'approved',
  created_at: '2025-09-01T08:00:00Z',
};

export const mockClients: User[] = [
  mockUser,
  {
    id: 'u_002',
    email: 'ahmed.benali@example.com',
    full_name: 'Ahmed Ben Ali',
    phone: '+212 6 12 34 56 78',
    preferred_language: 'ar',
    role: 'client',
    approval_status: 'pending',
    whatsapp_id: '212612345678',
    created_at: '2026-02-20T14:30:00Z',
  },
  {
    id: 'u_003',
    email: 'claire.dubois@example.com',
    full_name: 'Claire Dubois',
    phone: '+33 6 11 22 33 44',
    preferred_language: 'fr',
    role: 'client',
    approval_status: 'approved',
    whatsapp_id: '33611223344',
    created_at: '2026-03-05T09:15:00Z',
  },
  {
    id: 'u_004',
    email: 'john.carter@example.com',
    full_name: 'John Carter',
    phone: '+1 415 555 0199',
    preferred_language: 'en',
    role: 'client',
    approval_status: 'approved',
    created_at: '2026-04-18T16:45:00Z',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b_1001',
    client_id: 'u_001',
    service_type: 'flight',
    destination: 'Lisboa, Portugal',
    travel_date: '2026-07-14',
    return_date: '2026-07-28',
    status: 'confirmed',
    amount_brl: 8450.0,
    notes: 'Ida e volta, classe econômica, bagagem despachada.',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-10T10:00:00Z',
  },
  {
    id: 'b_1002',
    client_id: 'u_001',
    service_type: 'visa',
    destination: 'Portugal (D7)',
    travel_date: '2026-07-10',
    status: 'processing',
    amount_brl: 1200.0,
    notes: 'Preparação de documentação para visto de residência.',
    created_at: '2026-06-02T11:30:00Z',
    updated_at: '2026-06-15T09:00:00Z',
  },
  {
    id: 'b_1003',
    client_id: 'u_001',
    service_type: 'hotel',
    destination: 'Lisboa, Portugal',
    travel_date: '2026-07-14',
    return_date: '2026-07-21',
    status: 'pending',
    amount_brl: 3200.0,
    created_at: '2026-06-12T15:00:00Z',
    updated_at: '2026-06-12T15:00:00Z',
  },
  {
    id: 'b_2001',
    client_id: 'u_002',
    service_type: 'tour',
    destination: 'Dubai, UAE',
    travel_date: '2026-09-02',
    return_date: '2026-09-09',
    status: 'confirmed',
    amount_brl: 15600.0,
    created_at: '2026-05-20T12:00:00Z',
    updated_at: '2026-06-01T12:00:00Z',
  },
  {
    id: 'b_3001',
    client_id: 'u_003',
    service_type: 'cruise',
    destination: 'Mediterrâneo',
    travel_date: '2026-08-11',
    return_date: '2026-08-20',
    status: 'processing',
    amount_brl: 22000.0,
    created_at: '2026-05-28T10:00:00Z',
    updated_at: '2026-06-09T10:00:00Z',
  },
  {
    id: 'b_4001',
    client_id: 'u_004',
    service_type: 'corporate',
    destination: 'São Paulo → New York',
    travel_date: '2026-07-01',
    return_date: '2026-07-05',
    status: 'cancelled',
    amount_brl: 18900.0,
    created_at: '2026-04-25T08:00:00Z',
    updated_at: '2026-05-02T08:00:00Z',
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'd_001',
    booking_id: 'b_1002',
    client_id: 'u_001',
    file_name: 'passaporte_maria.pdf',
    storage_path: 'u_001/b_1002/1718000000_passaporte_maria.pdf',
    doc_type: 'passport',
    review_status: 'approved',
    uploaded_at: '2026-06-03T10:00:00Z',
  },
  {
    id: 'd_002',
    booking_id: 'b_1002',
    client_id: 'u_001',
    file_name: 'comprovante_renda.pdf',
    storage_path: 'u_001/b_1002/1718100000_comprovante_renda.pdf',
    doc_type: 'bank_statement',
    review_status: 'under_review',
    uploaded_at: '2026-06-08T14:20:00Z',
  },
  {
    id: 'd_003',
    booking_id: 'b_1002',
    client_id: 'u_001',
    file_name: 'foto_3x4.jpg',
    storage_path: 'u_001/b_1002/1718200000_foto_3x4.jpg',
    doc_type: 'photo_id',
    review_status: 'pending',
    uploaded_at: '2026-06-15T09:30:00Z',
  },
  {
    id: 'd_004',
    booking_id: 'b_3001',
    client_id: 'u_003',
    file_name: 'passeport_claire.pdf',
    storage_path: 'u_003/b_3001/1717900000_passeport_claire.pdf',
    doc_type: 'passport',
    review_status: 'rejected',
    uploaded_at: '2026-06-01T11:00:00Z',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'i_001',
    booking_id: 'b_1001',
    client_id: 'u_001',
    invoice_number: 'INV-2026-001',
    line_items: [
      { label: 'Passagem aérea GRU ⇄ LIS (econômica)', amount_brl: 7450.0 },
      { label: 'Taxa de emissão e assistência', amount_brl: 1000.0 },
    ],
    total_brl: 8450.0,
    currency: 'BRL',
    status: 'paid',
    due_date: '2026-06-10',
    paid_at: '2026-06-08T13:22:00Z',
    payment_method: 'pix',
    mercado_pago_id: 'mp_abc123',
    created_at: '2026-06-01T09:00:00Z',
  },
  {
    id: 'i_002',
    booking_id: 'b_1002',
    client_id: 'u_001',
    invoice_number: 'INV-2026-002',
    line_items: [
      { label: 'Assessoria de visto D7 — Portugal', amount_brl: 1200.0 },
    ],
    total_brl: 1200.0,
    currency: 'BRL',
    status: 'unpaid',
    due_date: '2026-07-01',
    created_at: '2026-06-08T10:00:00Z',
  },
  {
    id: 'i_003',
    booking_id: 'b_1003',
    client_id: 'u_001',
    invoice_number: 'INV-2026-003',
    line_items: [
      { label: 'Hospedagem Lisboa — 7 noites', amount_brl: 3200.0 },
    ],
    total_brl: 3200.0,
    currency: 'BRL',
    status: 'overdue',
    due_date: '2026-06-20',
    created_at: '2026-06-01T09:00:00Z',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm_001',
    client_id: 'u_001',
    direction: 'inbound',
    channel: 'whatsapp',
    content: 'Olá Omar! Já consegui separar o comprovante de renda. Posso enviar por aqui?',
    is_ai_generated: false,
    read_at: '2026-06-08T14:00:00Z',
    created_at: '2026-06-08T13:55:00Z',
  },
  {
    id: 'm_002',
    client_id: 'u_001',
    direction: 'outbound',
    channel: 'whatsapp',
    content:
      'Olá Maria! Pode sim — o ideal é subir pelo portal, na aba Documentos, para mantermos tudo organizado. Qualquer dúvida estou por aqui. — Equipe do Omar',
    is_ai_generated: true,
    created_at: '2026-06-08T13:57:00Z',
  },
  {
    id: 'm_003',
    client_id: 'u_001',
    direction: 'inbound',
    channel: 'portal',
    content: 'Perfeito, acabei de subir o arquivo. Obrigada!',
    is_ai_generated: false,
    created_at: '2026-06-08T14:20:00Z',
  },
  {
    id: 'm_004',
    client_id: 'u_001',
    direction: 'outbound',
    channel: 'portal',
    content:
      'Recebido, Maria. Vou revisar e te dou um retorno em breve sobre o andamento do visto. — Equipe do Omar',
    is_ai_generated: false,
    read_at: '2026-06-08T15:00:00Z',
    created_at: '2026-06-08T14:45:00Z',
  },
];

export function bookingsForClient(clientId: string) {
  return mockBookings.filter((b) => b.client_id === clientId);
}

export function invoicesForClient(clientId: string) {
  return mockInvoices.filter((i) => i.client_id === clientId);
}

export function documentsForClient(clientId: string) {
  return mockDocuments.filter((d) => d.client_id === clientId);
}

export function messagesForClient(clientId: string) {
  return mockMessages.filter((m) => m.client_id === clientId);
}

export function clientName(clientId: string) {
  return mockClients.find((c) => c.id === clientId)?.full_name ?? 'Cliente';
}
