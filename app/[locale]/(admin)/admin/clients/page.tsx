import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { AdminClientsClient } from '@/components/admin/clients-client';
import { allClients, allBookings } from '@/lib/data';

export default async function AdminClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.clients');

  const [clients, bookings] = await Promise.all([allClients(), allBookings()]);
  const bookingCounts = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.client_id] = (acc[b.client_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <AdminClientsClient initialClients={clients} bookingCounts={bookingCounts} />
    </>
  );
}
