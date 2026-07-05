import { setRequestLocale } from 'next-intl/server';
import { AdminBookingsClient } from '@/components/admin/bookings-client';
import { allBookings, allClients, clientNameMap } from '@/lib/data';

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [bookings, clients] = await Promise.all([allBookings(), allClients()]);
  const names = await clientNameMap(bookings.map((b) => b.client_id));

  return (
    <AdminBookingsClient
      initialBookings={bookings}
      names={names}
      clients={clients}
      locale={locale}
    />
  );
}
