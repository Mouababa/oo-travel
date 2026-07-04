-- Migration: self-service client signup + admin approval gate.
-- Previously the only way for a client to get portal access was for Omar to
-- create their account manually. This lets a customer sign up on their own
-- (supabase.auth.signUp), landing in 'pending' until an admin approves them.

alter table public.users
  add column if not exists approval_status text default 'pending'
    check (approval_status in ('pending','approved','rejected'));

create index if not exists idx_users_approval_status on public.users(approval_status);

-- Existing admin accounts were created directly by Omar (via the Admin API),
-- not through self-signup — they should never sit in a pending state.
update public.users set approval_status = 'approved' where role = 'admin';

-- Capture the phone number submitted at signup — handle_new_user previously
-- only copied full_name/preferred_language, silently dropping it.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, phone, preferred_language)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'preferred_language', 'pt')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Extend the existing role/email self-escalation guard to also cover
-- approval_status — otherwise a pending client could UPDATE their own row
-- and set approval_status = 'approved', skipping review entirely.
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
