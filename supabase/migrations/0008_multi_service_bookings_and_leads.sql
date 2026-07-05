-- Migration: allow choosing more than one service per booking/lead request.
-- Previously service_type was a single enum column — a client (or admin,
-- via the new booking-creation feature) could only ever request one
-- service (flight OR hotel OR visa...) per submission. Switches to an
-- array so one request can cover several services at once.

alter table public.bookings add column if not exists service_types text[];
update public.bookings
  set service_types = array[service_type]
  where service_types is null and service_type is not null;
alter table public.bookings alter column service_types set not null;
alter table public.bookings
  add constraint bookings_service_types_valid check (
    array_length(service_types, 1) > 0
    and service_types <@ array['flight','hotel','tour','visa','cruise','corporate','legal','car_rental']::text[]
  );
alter table public.bookings drop column if exists service_type;

alter table public.leads add column if not exists service_types text[];
update public.leads
  set service_types = array[service_type]
  where service_types is null and service_type is not null;
alter table public.leads
  add constraint leads_service_types_valid check (
    service_types is null
    or service_types <@ array['flight','hotel','tour','visa','cruise','corporate','legal','car_rental']::text[]
  );
alter table public.leads drop column if exists service_type;
