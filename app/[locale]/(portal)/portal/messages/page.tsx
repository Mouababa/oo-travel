import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { MessagesClient } from '@/components/portal/messages-client';
import { getCurrentUser, messagesForClient } from '@/lib/data';

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portal.messages');

  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const messages = await messagesForClient(user.id);

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <MessagesClient initialMessages={messages} />
    </>
  );
}
