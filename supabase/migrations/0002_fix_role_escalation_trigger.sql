-- Migration: fix prevent_role_self_escalation to distinguish "a signed-in
-- non-admin client trying to promote themselves" (must block) from
-- "a service-role/admin-API operation with no end-user session" (must
-- allow — auth.uid() is null in that context, so the original version
-- misread it as non-admin and blocked ALL role changes, including
-- legitimate ones like promoting a new account via the Supabase Admin API).
--
-- Run this against an already-deployed database. For fresh installs the
-- fix is already included in supabase/schema.sql.

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
