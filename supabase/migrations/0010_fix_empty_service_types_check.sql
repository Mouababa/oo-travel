-- Fix: bookings_service_types_valid didn't actually reject an empty array.
-- array_length(ARRAY[]::text[], 1) returns NULL in Postgres, not 0 — a
-- CHECK constraint only fails on FALSE, not NULL, so `array_length(...) > 0`
-- silently passed for an empty array (verified live: an empty service_types
-- array was accepted when it should have been rejected). cardinality()
-- returns 0 for an empty array, avoiding the NULL trap.

alter table public.bookings drop constraint if exists bookings_service_types_valid;
alter table public.bookings
  add constraint bookings_service_types_valid check (
    cardinality(service_types) > 0
    and service_types <@ array['flight','hotel','tour','visa','cruise','corporate','legal','car_rental']::text[]
  );
