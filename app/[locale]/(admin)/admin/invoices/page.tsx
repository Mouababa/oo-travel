import { setRequestLocale } from 'next-intl/server';
import { AdminInvoicesClient } from '@/components/admin/invoices-client';
import { allInvoices, allClients, allBookings, clientNameMap } from '@/lib/data';

export default async function AdminInvoicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [invoices, clients, bookings] = await Promise.all([
    allInvoices(),
    allClients(),
    allBookings(),
  ]);
  const names = await clientNameMap(
    invoices.map((i) => i.client_id).filter((id): id is string => Boolean(id)),
  );

  return (
    <AdminInvoicesClient
      initialInvoices={invoices}
      names={names}
      clients={clients}
      bookings={bookings}
    />
  );
}
