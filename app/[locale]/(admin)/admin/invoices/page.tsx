import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { AdminInvoicesClient } from '@/components/admin/invoices-client';
import { allInvoices, clientNameMap } from '@/lib/data';

export default async function AdminInvoicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.invoices');

  const invoices = await allInvoices();
  const names = await clientNameMap(
    invoices.map((i) => i.client_id).filter((id): id is string => Boolean(id)),
  );

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('create')}
          </Button>
        }
      />
      <AdminInvoicesClient initialInvoices={invoices} names={names} />
    </>
  );
}
