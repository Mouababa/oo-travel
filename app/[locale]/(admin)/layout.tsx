import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app-shell';
import { mockAdmin } from '@/lib/mock-data';

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

  // In production: verify the Supabase session has users.role === 'admin'.
  return (
    <AppShell variant="admin" userName={mockAdmin.full_name}>
      {children}
    </AppShell>
  );
}
