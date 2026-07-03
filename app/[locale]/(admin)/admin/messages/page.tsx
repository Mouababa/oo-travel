import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { AdminMessagesClient } from '@/components/admin/messages-client';
import { allClients, allMessages } from '@/lib/data';
import type { Message } from '@/lib/types';

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.messages');

  const [clients, messages] = await Promise.all([allClients(), allMessages()]);
  const messagesByClient = messages.reduce<Record<string, Message[]>>((acc, m) => {
    (acc[m.client_id] ??= []).push(m);
    return acc;
  }, {});

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <AdminMessagesClient clients={clients} messagesByClient={messagesByClient} />
    </>
  );
}
