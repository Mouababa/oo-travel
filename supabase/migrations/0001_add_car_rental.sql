-- Migration: add the 'car_rental' service type (PART 5).
-- Run this against an already-deployed database. For fresh installs the
-- constraint is already included in supabase/schema.sql.

alter table public.bookings
  drop constraint if exists bookings_service_type_check;

alter table public.bookings
  add constraint bookings_service_type_check check (service_type in (
    'flight','hotel','tour','visa','cruise','corporate','legal','car_rental'
  ));
