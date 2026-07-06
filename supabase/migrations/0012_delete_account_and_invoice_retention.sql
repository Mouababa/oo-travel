-- Migration: let admins delete any client account, without destroying
-- financial records.
--
-- bookings/documents/messages already cascade-delete with the user (fine —
-- those are personal-data records LGPD's "right to be forgotten" expects to
-- go away). invoices.client_id had no explicit ON DELETE action, so
-- Postgres defaulted to RESTRICT: deleting an account with any invoice
-- history would fail outright. Invoices are financial/tax records that
-- must survive account deletion, so this switches to SET NULL — the
-- invoice row (and its accounting trail) stays, only the link to the
-- now-deleted user is cleared.

alter table public.invoices drop constraint if exists invoices_client_id_fkey;
alter table public.invoices
  add constraint invoices_client_id_fkey
  foreign key (client_id) references public.users(id) on delete set null;
