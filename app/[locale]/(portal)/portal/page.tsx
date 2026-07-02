import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  CalendarCheck,
  FileText,
  Receipt,
  MessageSquare,
  Plus,
  Upload,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { BookingStatusBadge } from '@/components/status-badge';
import { ServiceIcon } from '@/components/service-icon';
import { BookingsChart } from '@/components/portal/bookings-chart';
import { PhotoBackdrop } from '@/components/public/photo-card';
import { scenePhoto } from '@/lib/images';
import {
  bookingsForClient,
  documentsForClient,
  invoicesForClient,
  messagesForClient,
  mockUser,
} from '@/lib/mock-data';
import { formatBRL } from '@/lib/utils';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portal.dashboard');
  const tb = await getTranslations('portal.bookings');
  const ts = await getTranslations('services.items');

  const bookings = bookingsForClient(mockUser.id);
  const docs = documentsForClient(mockUser.id);
  const invoices = invoicesForClient(mockUser.id);
  const messages = messagesForClient(mockUser.id);

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled').length;
  const pendingDocs = docs.filter((d) => d.review_status !== 'approved').length;
  const openInvoices = invoices.filter((i) => i.status !== 'paid').length;
  const unread = messages.filter((m) => m.direction === 'inbound' && !m.read_at).length;

  const nextTrip = bookings
    .filter((b) => b.travel_date && b.status !== 'cancelled')
    .sort((a, b) => (a.travel_date! < b.travel_date! ? -1 : 1))[0];

  // Bookings grouped by service type, for the analytics chart.
  const byType = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.service_type] = (acc[b.service_type] ?? 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(byType).map(([type, count]) => ({
    label: ts(`${type}.name`),
    count,
  }));

  const daysToGo = nextTrip?.travel_date
    ? Math.max(
        0,
        Math.ceil(
          (new Date(nextTrip.travel_date).getTime() - Date.now()) / 86_400_000,
        ),
      )
    : null;

  return (
    <>
      {/* Immersive welcome banner */}
      <PhotoBackdrop
        src={scenePhoto('dubai', 1400, 480)}
        seed="dashboard-dubai"
        width={1400}
        height={480}
        className="mb-6 rounded-2xl border border-accent/15"
      >
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm text-text-secondary">{t('welcomeBack')}</p>
            <h1 className="mt-1 font-heading text-3xl font-bold tracking-heading text-text-primary">
              {mockUser.full_name}
            </h1>
            {nextTrip ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                <ServiceIcon
                  type={nextTrip.service_type}
                  className="h-4 w-4 text-accent"
                />
                {t('nextTripTitle')}: {nextTrip.destination}
              </p>
            ) : (
              <p className="mt-2 text-sm text-text-secondary">{t('nextTripNone')}</p>
            )}
          </div>
          {daysToGo !== null && (
            <div className="glass-raised flex items-center gap-3 self-start rounded-xl px-5 py-3 sm:self-auto">
              <span className="font-heading text-4xl font-bold text-gradient">
                {daysToGo}
              </span>
              <span className="text-sm text-text-secondary">{t('daysToGo')}</span>
            </div>
          )}
        </div>
      </PhotoBackdrop>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label={t('statBookings')} value={activeBookings} />
        <StatCard
          icon={FileText}
          label={t('statDocuments')}
          value={pendingDocs}
          tone="warning"
        />
        <StatCard
          icon={Receipt}
          label={t('statInvoices')}
          value={openInvoices}
          tone="danger"
        />
        <StatCard
          icon={MessageSquare}
          label={t('statMessages')}
          value={unread}
          tone="success"
        />
      </div>

      {/* Quick actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <QuickAction href="/portal/bookings/new" icon={Plus} label={t('newRequest')} />
          <QuickAction href="/portal/documents" icon={Upload} label={t('uploadDocs')} />
          <QuickAction href="/portal/invoices" icon={CreditCard} label={t('payInvoice')} />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t('recentBookings')}</CardTitle>
            <Link
              href="/portal/bookings"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('viewAll')}
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tb('service')}</TableHead>
                  <TableHead>{tb('destination')}</TableHead>
                  <TableHead>{tb('status')}</TableHead>
                  <TableHead className="text-end">{tb('amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.slice(0, 4).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <ServiceIcon
                          type={b.service_type}
                          className="h-4 w-4 text-text-secondary"
                        />
                        {ts(`${b.service_type}.name`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-text-secondary">{b.destination}</TableCell>
                    <TableCell>
                      <BookingStatusBadge status={b.status} />
                    </TableCell>
                    <TableCell className="text-end font-medium">
                      {b.amount_brl ? formatBRL(b.amount_brl) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>{tb('title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsChart data={chartData} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="lift flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-medium transition-all hover:border-accent/40 hover:shadow-glow"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
        <Icon className="h-4 w-4" />
      </span>
      {label}
    </Link>
  );
}
