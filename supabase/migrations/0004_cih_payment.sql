-- Migration: CIH bank-transfer payment method — manual transfer + proof
-- upload, reviewed and approved by admin before the invoice counts as paid.
--
-- Run this against an already-deployed database. For fresh installs the
-- fix is already included in supabase/schema.sql.

-- Allow the new payment method value.
alter table public.invoices
  drop constraint if exists invoices_payment_method_check;
alter table public.invoices
  add constraint invoices_payment_method_check check (payment_method in ('pix','card','cih_transfer'));

-- Proof-of-payment lifecycle for the CIH flow.
alter table public.invoices
  add column if not exists payment_proof_path text,
  add column if not exists payment_proof_status text
    check (payment_proof_status in ('pending','approved','rejected')),
  add column if not exists payment_proof_uploaded_at timestamptz;

create index if not exists idx_invoices_payment_proof_status on public.invoices(payment_proof_status);

-- SECURITY: only an admin may approve/reject a payment proof. A client may
-- only set it from null to 'pending' (the initial upload) — never touch it
-- again afterward. Scoped to payment_proof_status specifically (not the
-- general invoices.status column) so it doesn't interfere with the existing
-- PIX demo "simulate paid" flow, which will be replaced by real Mercado
-- Pago webhooks separately.
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
