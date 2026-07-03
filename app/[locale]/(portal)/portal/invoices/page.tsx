import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { InvoicesClient } from '@/components/portal/invoices-client';
import { getCurrentUser, invoicesForClient } from '@/lib/data';

export default async function InvoicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portal.invoices');

  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const invoices = await invoicesForClient(user.id);

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <InvoicesClient initialInvoices={invoices} />
    </>
  );
}
