import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app-shell';
import { getCurrentUser } from '@/lib/data';

// Private client area — never index (robots.ts also disallows the path).
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // middleware.ts already gates unauthenticated access to this route group.
  const user = await getCurrentUser();

  return (
    <AppShell variant="portal" userName={user?.full_name ?? ''}>
      {children}
    </AppShell>
  );
}
