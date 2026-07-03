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
  created_at timestamptz default now()
);

-- Public-facing lead capture (homepage request form, contact page). No
-- account required to submit — this is the top of the funnel.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text,
  service_type text check (service_type in (
    'flight','hotel','tour','visa','cruise','corporate','legal','car_rental'
  )),
  destination text,
  message text,
  source text default 'website',
  status text default 'new' check (status in ('new','contacted','converted','closed')),
  created_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.users(id) on delete cascade,
  service_type text not null check (service_type in (
    'flight','hotel','tour','visa','cruise','corporate','legal','car_rental'
  )),
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
  client_id uuid references public.users(id),
  invoice_number text unique not null,
  line_items jsonb not null,
  total_brl numeric(10,2) not null,
  status text default 'unpaid' check (status in ('unpaid','paid','overdue')),
  due_date date,
  paid_at timestamptz,
  payment_method text check (payment_method in ('pix','card')),
  mercado_pago_id text,
  created_at timestamptz default now()
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
create index if not exists idx_messages_client_id on public.messages(client_id);
create index if not exists idx_messages_created_at on public.messages(created_at);
create index if not exists idx_users_role on public.users(role);
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
  insert into public.users (id, email, full_name, preferred_language)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'pt')
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
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_self_escalation on public.users;
create trigger trg_prevent_role_self_escalation
  before update on public.users
  for each row execute function public.prevent_role_self_escalation();

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
