-- Migration: block clients from self-confirming their own bookings.
-- SECURITY. bookings_own's RLS policy is `for all` with no column-level
-- restriction, so a client could UPDATE their own booking's status directly
-- (verified live: a client PATCHed their own booking from 'pending' to
-- 'confirmed' with no admin ever touching it). A client cancelling their own
-- booking is legitimate self-service; setting it to 'processing' or
-- 'confirmed' themselves is not — only an admin can actually confirm one.

create or replace function public.prevent_booking_status_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.status is distinct from old.status and new.status <> 'cancelled' then
      raise exception 'Only admins can set this booking status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_booking_status_self_escalation on public.bookings;
create trigger trg_prevent_booking_status_self_escalation
  before update on public.bookings
  for each row execute function public.prevent_booking_status_self_escalation();
