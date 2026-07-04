import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { AdminBookingsClient } from '@/components/admin/bookings-client';
import { allBookings, clientNameMap } from '@/lib/data';

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.bookings');

  const bookings = await allBookings();
  const names = await clientNameMap(bookings.map((b) => b.client_id));

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <AdminBookingsClient initialBookings={bookings} names={names} locale={locale} />
    </>
  );
}
