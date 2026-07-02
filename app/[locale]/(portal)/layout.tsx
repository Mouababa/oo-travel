import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app-shell';
import { mockUser } from '@/lib/mock-data';

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

  // In production this comes from the authenticated Supabase session.
  return (
    <AppShell variant="portal" userName={mockUser.full_name}>
      {children}
    </AppShell>
  );
}
