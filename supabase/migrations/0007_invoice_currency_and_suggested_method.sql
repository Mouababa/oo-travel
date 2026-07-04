-- Migration: multi-currency invoices + admin payment-method suggestion.
-- Main customers are Moroccan and Brazilian, then the rest of the world —
-- admin needs to bill in BRL, USD, or MAD, and can either suggest a specific
-- payment method for the client to use or leave it open to choose from
-- whatever's valid for that currency.
--
-- total_brl keeps its name for now (renaming touches the PIX/webhook code
-- paths too, which aren't live yet — task pending) but holds the amount in
-- whatever `currency` specifies, not necessarily BRL.

alter table public.invoices
  add column if not exists currency text default 'BRL'
    check (currency in ('BRL','USD','MAD')),
  add column if not exists suggested_payment_method text
    check (suggested_payment_method in ('pix','cih_transfer'));

-- PIX is Mercado Pago's Brazilian instant-payment rail — it can only ever
-- settle in BRL, so a non-BRL invoice must never suggest it.
alter table public.invoices
  add constraint invoices_pix_requires_brl
  check (suggested_payment_method <> 'pix' or currency = 'BRL');
