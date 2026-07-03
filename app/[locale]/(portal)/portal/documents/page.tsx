import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { DocumentsClient } from '@/components/portal/documents-client';
import { getCurrentUser, documentsForClient } from '@/lib/data';

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portal.documents');

  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const docs = await documentsForClient(user.id);

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <DocumentsClient initialDocs={docs} />
    </>
  );
}
