import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { AdminDocumentsClient } from '@/components/admin/documents-client';
import { allDocuments, clientNameMap } from '@/lib/data';

export default async function AdminDocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.documents');

  const docs = await allDocuments();
  const names = await clientNameMap(docs.map((d) => d.client_id));

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <AdminDocumentsClient initialDocs={docs} names={names} />
    </>
  );
}
