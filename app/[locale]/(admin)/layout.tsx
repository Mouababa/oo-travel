import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app-shell';
import { getCurrentUser } from '@/lib/data';

// Private admin area — never index (robots.ts also disallows the path).
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // middleware.ts already enforces role === 'admin' for this route group.
  const user = await getCurrentUser();

  return (
    <AppShell variant="admin" userName={user?.full_name ?? ''}>
      {children}
    </AppShell>
  );
}
