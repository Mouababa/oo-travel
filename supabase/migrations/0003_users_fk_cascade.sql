-- Migration: tie public.users.id to auth.users.id with ON DELETE CASCADE.
--
-- public.users.id previously had no foreign key at all — it only matched
-- auth.users.id by convention (handle_new_user() sets id = new.id on
-- signup). Deleting an auth user therefore never cleaned up their profile
-- row, silently leaving it orphaned (discovered while cleaning up a test
-- account: the auth user deleted with 200, but the public.users row was
-- still there afterward).
--
-- Run this against an already-deployed database. For fresh installs the
-- fix is already included in supabase/schema.sql.

alter table public.users
  add constraint users_id_fkey foreign key (id) references auth.users(id) on delete cascade;
