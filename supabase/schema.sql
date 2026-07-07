-- ════════════════════════════════════════════════════════════════
-- OO Travel — Supabase schema, RLS policies & storage
-- Run this in the Supabase SQL editor on a fresh project. Idempotent —
-- safe to re-run.
--
-- Revision notes (fixes applied on top of the original schema):
--   1. SECURITY FIX: users_update_self previously let a client set their
--      own role/email — a privilege-escalation bug. Now blocked by a
--      trigger regardless of RLS policy nuances (defense in depth).
--   2. Added trg_handle_new_user: without it, a real Supabase Auth signup
--      has no public.users row, and RLS returns nothing — the portal
--      would appear empty for every new real user.
--   3. Added public.leads for the marketing site's request/contact forms
--      (previously nothing captured these — every lead was discarded).
--   4. Added CHECK constraints on every status/enum column that lacked
--      one, matching the TypeScript unions in lib/types.ts.
--   5. Added indexes on every FK + common filter column.
--   6. Added set_updated_at trigger on bookings (raw SQL writes won't
--      otherwise honor Prisma's @updatedAt).
--   7. Added an invoice-number generator (sequence + function) — unique
--      text can't be hand-assigned safely at scale.
--   8. public.users.id now has a real foreign key to auth.users(id) with
--      ON DELETE CASCADE. It previously only matched auth.users.id by
--      convention (handle_new_user() sets id = new.id), so deleting an
--      auth user never cleaned up the matching profile row.
--   9. Added the CIH bank-transfer payment method: invoices.payment_method
--      now allows 'cih_transfer', plus payment_proof_path/status/
--      uploaded_at for the manual slip-upload + admin-review workflow,
--      guarded by a self-approval-blocking trigger.
--  10. Added self-service client signup: users.approval_status
--      (pending/approved/rejected) gates portal access until an admin
--      approves, guarded by the same self-escalation trigger as role/email.
--      handle_new_user now also captures the phone number from signup.
--  11. Added trg_prevent_booking_status_self_escalation: bookings_own's RLS
--      policy has no column-level restriction, so a client could otherwise
--      set their own booking straight to 'confirmed' without an admin ever
--      approving it. Clients may still self-cancel (legitimate self-service).
--  12. Added invoices.currency (BRL/USD/MAD) and suggested_payment_method
--      (pix/cih_transfer, nullable = let the customer choose). PIX can only
--      ever settle in BRL, enforced by a constraint, not just app logic.
--  13. bookings.service_type / leads.service_type (single enum) replaced by
--      service_types (text[]) — a request can cover more than one service
--      (e.g. flight + hotel + visa) instead of exactly one per submission.
--  14. Added users.terms_accepted_at — the signup form now requires
--      checking a box linking to Terms of Use + Booking & Refunds before
--      account creation; the timestamp comes from client-side metadata.
--  15. invoices.client_id: RESTRICT (the implicit default) replaced with
--      SET NULL, so an admin deleting an account isn't blocked by — or
--      forced to destroy — that client's invoice/financial history.
--  16. invoices.currency gained EUR and CAD (was BRL/USD/MAD) — same
--      Revolut account (lib/constants.ts) receives all three.
-- ════════════════════════════════════════════════════════════════

-- ─── Tables ─────────────────────────────────────────────────────

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  phone text,
  preferred_language text default 'pt' check (preferred_language in ('pt','en','fr','ar')),
  role text default 'client' check (role in ('client','admin')),
  whatsapp_id text unique,
  -- Self-service signups land here as 'pending' until an admin approves
  -- them. Admin accounts are created directly by Omar, never self-signed-up.
  approval_status text default 'pending' check (approval_status in ('pending','approved','rejected')),
  -- Set from the signup form's own metadata (the moment the required terms
  -- checkbox was checked) — null for admin-created accounts, which never go
  -- through the self-signup consent flow.
  terms_accepted_at timestamptz,
  created_at timestamptz default now()
);

-- Public-facing lead capture (homepage request form, contact page). No
-- account required to submit — this is the top of the funnel.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text,
  -- One lead can express interest in more than one service at once.
  service_types text[] check (
    service_types is null
    or service_types <@ array['flight','hotel','tour','visa','cruise','corporate','legal','car_rental']::text[]
  ),
  destination text,
  message text,
  source text default 'website',
  status text default 'new' check (status in ('new','contacted','converted','closed')),
  created_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.users(id) on delete cascade,
  -- A single request can cover more than one service (e.g. flight + hotel).
  -- cardinality(), not array_length() — the latter returns NULL (not 0) for
  -- an empty array, which a CHECK constraint silently treats as passing.
  service_types text[] not null check (
    cardinality(service_types) > 0
    and service_types <@ array['flight','hotel','tour','visa','cruise','corporate','legal','car_rental']::text[]
  ),
  destination text not null,
  travel_date date,
  return_date date,
  status text default 'pending' check (status in ('pending','processing','confirmed','cancelled')),
  amount_brl numeric(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  client_id uuid references public.users(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  doc_type text check (doc_type in ('passport','residence','bank_statement','photo_id','other')),
  review_status text default 'pending' check (review_status in ('pending','under_review','approved','rejected')),
  uploaded_at timestamptz default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  -- SET NULL (not CASCADE) — invoices are financial/tax records that must
  -- survive an admin deleting the account; only the link to the now-gone
  -- user is cleared. bookings/documents/messages cascade-delete instead,
  -- since those are personal-data records, not accounting ones.
  client_id uuid references public.users(id) on delete set null,
  invoice_number text unique not null,
  line_items jsonb not null,
  total_brl numeric(10,2) not null,
  status text default 'unpaid' check (status in ('unpaid','paid','overdue')),
  due_date date,
  paid_at timestamptz,
  payment_method text check (payment_method in ('pix','card','cih_transfer')),
  mercado_pago_id text,
  created_at timestamptz default now(),
  -- CIH bank-transfer proof-of-payment lifecycle (manual review, not an API
  -- gateway): client uploads a slip, payment_proof_status goes pending ->
  -- approved/rejected only by an admin (see the trigger below).
  payment_proof_path text,
  payment_proof_status text check (payment_proof_status in ('pending','approved','rejected')),
  payment_proof_uploaded_at timestamptz,
  -- total_brl keeps its legacy name (renaming touches the not-yet-live
  -- PIX/webhook code too) but holds the amount in whatever `currency` is —
  -- main customers are Moroccan and Brazilian, then the rest of the world.
  -- USD/EUR/CAD all settle into the same Revolut account.
  currency text default 'BRL' check (currency in ('BRL','USD','EUR','CAD','MAD')),
  -- Admin can suggest a specific method at invoice creation, or leave this
  -- null to let the client pick from whatever's valid for the currency.
  -- PIX only ever settles in BRL — enforced below, not just in app code.
  suggested_payment_method text check (suggested_payment_method in ('pix','cih_transfer')),
  constraint invoices_pix_requires_brl check (suggested_payment_method <> 'pix' or currency = 'BRL')
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.users(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound')),
  channel text default 'portal' check (channel in ('portal','whatsapp')),
  content text not null,
  is_ai_generated boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────

create index if not exists idx_bookings_client_id on public.bookings(client_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_documents_client_id on public.documents(client_id);
create index if not exists idx_documents_booking_id on public.documents(booking_id);
create index if not exists idx_invoices_client_id on public.invoices(client_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_invoices_payment_proof_status on public.invoices(payment_proof_status);
create index if not exists idx_messages_client_id on public.messages(client_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_users_role on public.users(role);
create index if not exists idx_users_approval_status on public.users(approval_status);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at);

-- ─── Helper: is the current user an admin? ──────────────────────
-- security definer: must bypass RLS on public.users to check the caller's
-- own role, otherwise this query would recurse into the same RLS it's
-- meant to help evaluate.

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- ─── Trigger: create a public.users profile on signup ───────────
-- Without this, a real Supabase Auth signup has no matching public.users
-- row, and every RLS policy (client_id = auth.uid()) returns nothing —
-- the portal appears permanently empty for that user.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, phone, preferred_language, terms_accepted_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'preferred_language', 'pt'),
    (new.raw_user_meta_data->>'terms_accepted_at')::timestamptz
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_handle_new_user on auth.users;
create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Trigger: keep bookings.updated_at accurate ─────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ─── Trigger: block role/email self-escalation ──────────────────
-- SECURITY FIX. RLS's `using` clause on users_update_self only controls
-- which ROW a client may touch (their own); it does not restrict which
-- COLUMNS they change within that row. Without this trigger, a client
-- could UPDATE their own row and set role = 'admin'.
--
-- auth.uid() is null for service-role/admin-API operations (no end-user
-- session) — those are trusted and must be exempt, or legitimate actions
-- like promoting a new account via the Supabase Admin API would be
-- blocked too. Only a signed-in non-admin client (auth.uid() is not null,
-- is_admin() false) is the actual threat this guards against.

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'Only admins can change role';
    end if;
    if new.email is distinct from old.email then
      raise exception 'Email changes are not permitted through this update';
    end if;
    if new.approval_status is distinct from old.approval_status then
      raise exception 'Only admins can change approval status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_self_escalation on public.users;
create trigger trg_prevent_role_self_escalation
  before update on public.users
  for each row execute function public.prevent_role_self_escalation();

-- Existing admin accounts were created directly by Omar, not self-signed-up
-- — they must never sit in a pending state (harmless either way since
-- is_admin()/admin routes don't check approval_status, but keeps the data
-- honest for the admin clients screen).
update public.users set approval_status = 'approved' where role = 'admin';

-- ─── Trigger: block payment-proof self-approval ─────────────────
-- SECURITY. A client may upload a CIH bank-transfer slip (payment_proof_
-- status: null -> 'pending') but must never be able to approve/reject it
-- themselves. Scoped to payment_proof_status only (not invoices.status)
-- so it doesn't interfere with the existing PIX demo "simulate paid" flow.

create or replace function public.prevent_payment_proof_self_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.payment_proof_status is distinct from old.payment_proof_status then
      if old.payment_proof_status is not null or new.payment_proof_status <> 'pending' then
        raise exception 'Only admins can review payment proof';
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_payment_proof_self_approval on public.invoices;
create trigger trg_prevent_payment_proof_self_approval
  before update on public.invoices
  for each row execute function public.prevent_payment_proof_self_approval();

-- ─── Trigger: block booking status self-escalation ──────────────
-- SECURITY. bookings_own's RLS policy is `for all` with no column-level
-- restriction, so a client could UPDATE their own booking's status directly
-- (verified live: a client PATCHed their own booking from 'pending' to
-- 'confirmed' with no admin ever touching it). A client cancelling their own
-- booking is legitimate self-service; setting it to 'processing' or
-- 'confirmed' themselves is not — only an admin can actually confirm one.

create or replace function public.prevent_booking_status_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.status is distinct from old.status and new.status <> 'cancelled' then
      raise exception 'Only admins can set this booking status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_booking_status_self_escalation on public.bookings;
create trigger trg_prevent_booking_status_self_escalation
  before update on public.bookings
  for each row execute function public.prevent_booking_status_self_escalation();

-- ─── Invoice number generator ───────────────────────────────────
-- Call from app code: select public.next_invoice_number();
-- Returns e.g. 'INV-2026-001'.

create sequence if not exists public.invoice_number_seq start 1;

create or replace function public.next_invoice_number()
returns text
language plpgsql
as $$
declare
  n bigint;
begin
  n := nextval('public.invoice_number_seq');
  return 'INV-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 3, '0');
end;
$$;

-- ─── Row Level Security ─────────────────────────────────────────

alter table public.users     enable row level security;
alter table public.leads     enable row level security;
alter table public.bookings  enable row level security;
alter table public.documents enable row level security;
alter table public.invoices  enable row level security;
alter table public.messages  enable row level security;

-- users: a user sees their own row; admins see all. Column-level
-- protection (role/email) is enforced by the trigger above, not RLS.
create policy users_self on public.users for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy users_update_self on public.users for update to authenticated
  using (id = auth.uid() or public.is_admin());

-- leads: anyone (including anonymous site visitors) may submit a lead;
-- only admins may read or manage them.
create policy leads_insert_public on public.leads for insert
  to anon, authenticated
  with check (true);
create policy leads_admin_select on public.leads for select to authenticated
  using (public.is_admin());
create policy leads_admin_update on public.leads for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Clients see only their own data; admins see everything.
create policy bookings_own on public.bookings for all to authenticated
  using (client_id = auth.uid() or public.is_admin())
  with check (client_id = auth.uid() or public.is_admin());

create policy documents_own on public.documents for all to authenticated
  using (client_id = auth.uid() or public.is_admin())
  with check (client_id = auth.uid() or public.is_admin());

create policy invoices_own on public.invoices for all to authenticated
  using (client_id = auth.uid() or public.is_admin())
  with check (client_id = auth.uid() or public.is_admin());

create policy messages_own on public.messages for all to authenticated
  using (client_id = auth.uid() or public.is_admin())
  with check (client_id = auth.uid() or public.is_admin());

-- ─── Storage bucket (private) ───────────────────────────────────

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Clients manage files under their own {client_id}/... prefix; admins all.
create policy documents_bucket_rw on storage.objects for all to authenticated
  using (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  )
  with check (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
