import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';
import { ProfileClient } from '@/components/portal/profile-client';
import { getCurrentUser } from '@/lib/data';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portal.profile');

  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <ProfileClient initialUser={user} />
    </div>
  );
}
