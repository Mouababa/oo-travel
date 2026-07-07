-- Migration: allow EUR and CAD on invoices.currency (was BRL/USD/MAD).
-- The same Revolut account (lib/constants.ts) receives USD, EUR and CAD,
-- so no new bank details are needed — just widening the allowed set.

alter table public.invoices drop constraint if exists invoices_currency_check;
alter table public.invoices
  add constraint invoices_currency_check check (currency in ('BRL','USD','EUR','CAD','MAD'));
