import { useTranslations } from 'next-intl';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import type { BookingStatus, InvoiceStatus, ReviewStatus } from '@/lib/types';

const bookingMap: Record<BookingStatus, BadgeProps['variant']> = {
  pending: 'warning',
  processing: 'info',
  confirmed: 'success',
  cancelled: 'danger',
};

const invoiceMap: Record<InvoiceStatus, BadgeProps['variant']> = {
  unpaid: 'warning',
  paid: 'success',
  overdue: 'danger',
};

const reviewMap: Record<ReviewStatus, BadgeProps['variant']> = {
  pending: 'neutral',
  under_review: 'info',
  approved: 'success',
  rejected: 'danger',
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const t = useTranslations('status.booking');
  return <Badge variant={bookingMap[status]}>{t(status)}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const t = useTranslations('status.invoice');
  return <Badge variant={invoiceMap[status]}>{t(status)}</Badge>;
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const t = useTranslations('status.review');
  return <Badge variant={reviewMap[status]}>{t(status)}</Badge>;
}
