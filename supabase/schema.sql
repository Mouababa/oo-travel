-- ════════════════════════════════════════════════════════════════
-- OO Travel — Supabase schema, RLS policies & storage
-- Run this in the Supabase SQL editor (Section 3 + 6.2 of the spec).
-- ════════════════════════════════════════════════════════════════

-- ─── Tables ─────────────────────────────────────────────────────

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  phone text,
  preferred_language text default 'pt' check (preferred_language in ('pt','en','fr','ar')),
  role text default 'client' check (role in ('client','admin')),
  whatsapp_id text unique,
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
  status text default 'pending',
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
  doc_type text,
  review_status text default 'pending',
  uploaded_at timestamptz default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  client_id uuid references public.users(id),
  invoice_number text unique not null,
  line_items jsonb not null,
  total_brl numeric(10,2) not null,
  status text default 'unpaid',
  due_date date,
  paid_at timestamptz,
  payment_method text,
  mercado_pago_id text
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.users(id) on delete cascade,
  direction text not null,
  channel text default 'portal',
  content text not null,
  is_ai_generated boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- ─── Helper: is the current user an admin? ──────────────────────

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- ─── Row Level Security ─────────────────────────────────────────

alter table public.users    enable row level security;
alter table public.bookings enable row level security;
alter table public.documents enable row level security;
alter table public.invoices enable row level security;
alter table public.messages enable row level security;

-- users: a user sees their own row; admins see all.
create policy users_self on public.users for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy users_update_self on public.users for update to authenticated
  using (id = auth.uid() or public.is_admin());

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
