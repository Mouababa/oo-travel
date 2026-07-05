-- Migration: record terms-of-service acceptance at signup.
-- Legal necessity before onboarding real paying clients — the signup form
-- now requires checking a box linking to Terms of Use + Booking & Refunds
-- before an account can be created. The timestamp comes from the client's
-- own metadata (the moment they checked the box), not just "row existed" —
-- admin-created accounts (no self-signup consent flow) correctly stay null.

alter table public.users add column if not exists terms_accepted_at timestamptz;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, phone, preferred_language, terms_accepted_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'preferred_language', 'pt'),
    (new.raw_user_meta_data->>'terms_accepted_at')::timestamptz
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
