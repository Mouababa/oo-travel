-- Fix: the public "Request a Quote" lead form is being rejected by RLS.
-- schema.sql already defines leads_insert_public (insert to anon,
-- authenticated with check (true)), but it's evidently not in effect on
-- the live database — verified live: an anon insert into leads is
-- rejected with 42501 even though bookings/etc. reject anon correctly
-- for comparison (RLS itself works; this one policy doesn't exist or
-- isn't matching). Drop-and-recreate is safe regardless of the actual
-- cause.

drop policy if exists leads_insert_public on public.leads;
create policy leads_insert_public on public.leads for insert
  to anon, authenticated
  with check (true);
