import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app-shell';
import { PendingApprovalScreen } from '@/components/portal/pending-approval-screen';
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

  // A self-signed-up client not yet reviewed by an admin sees a dedicated
  // screen instead of the real portal — there's nothing for them to do here
  // yet (no bookings/invoices exist before an admin approves them).
  if (user && user.role === 'client' && user.approval_status !== 'approved') {
    return <PendingApprovalScreen status={user.approval_status === 'rejected' ? 'rejected' : 'pending'} />;
  }

  return (
    <AppShell variant="portal" userName={user?.full_name ?? ''} isAdmin={user?.role === 'admin'}>
      {children}
    </AppShell>
  );
}
