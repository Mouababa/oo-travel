import { getTranslations } from 'next-intl/server';
import { sendEmail } from '@/lib/email/client';
import { renderEmailShell } from '@/lib/email/shell';
import { SITE_URL } from '@/lib/seo';
import { formatCurrency, formatDate, intlLocale } from '@/lib/utils';
import type { Locale } from '@/lib/types';

// Every function here is fire-and-forget from the caller's perspective —
// sendEmail() never throws, it returns { ok, error } — so a Resend outage
// or bad address can never break the booking/invoice/message action that
// triggered the notification. Errors are only logged.

async function dispatch(
  locale: Locale,
  to: string,
  key: string,
  params: Record<string, string>,
  ctaPath: string,
): Promise<void> {
  const t = await getTranslations({ locale, namespace: 'email' });
  const subject = t(`${key}.subject`, params);
  const title = t(`${key}.title`);
  const body = t(`${key}.body`, params);
  const cta = t(`${key}.cta`);
  const html = renderEmailShell({
    title,
    bodyHtml: `<p style="margin:0;">${body}</p>`,
    ctaLabel: cta,
    ctaUrl: `${SITE_URL}/${locale}${ctaPath}`,
  });
  const result = await sendEmail({ to, subject, html });
  if (!result.ok) {
    console.error(`[email:${key}] failed to send to ${to}:`, result.error);
  }
}

export async function sendInvoiceCreatedEmail(input: {
  to: string;
  locale: Locale;
  name: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate?: string;
}): Promise<void> {
  const t = await getTranslations({ locale: input.locale, namespace: 'email' });
  const dueDateText = input.dueDate
    ? t('dueDateText', { dueDate: formatDate(input.dueDate, intlLocale(input.locale)) })
    : '';
  await dispatch(
    input.locale,
    input.to,
    'invoiceCreated',
    {
      name: input.name,
      invoiceNumber: input.invoiceNumber,
      amount: formatCurrency(input.amount, input.currency, intlLocale(input.locale)),
      dueDateText,
    },
    '/portal/invoices',
  );
}

export async function sendPaymentConfirmedEmail(input: {
  to: string;
  locale: Locale;
  name: string;
  invoiceNumber: string;
}): Promise<void> {
  await dispatch(
    input.locale,
    input.to,
    'paymentConfirmed',
    { name: input.name, invoiceNumber: input.invoiceNumber },
    '/portal/invoices',
  );
}

export async function sendPaymentProofRejectedEmail(input: {
  to: string;
  locale: Locale;
  name: string;
  invoiceNumber: string;
}): Promise<void> {
  await dispatch(
    input.locale,
    input.to,
    'paymentProofRejected',
    { name: input.name, invoiceNumber: input.invoiceNumber },
    '/portal/invoices',
  );
}

export async function sendBookingConfirmedEmail(input: {
  to: string;
  locale: Locale;
  name: string;
  destination: string;
}): Promise<void> {
  await dispatch(
    input.locale,
    input.to,
    'bookingConfirmed',
    { name: input.name, destination: input.destination },
    '/portal/bookings',
  );
}

export async function sendDocumentReviewedEmail(input: {
  to: string;
  locale: Locale;
  name: string;
  docType: string;
  approved: boolean;
}): Promise<void> {
  await dispatch(
    input.locale,
    input.to,
    input.approved ? 'documentApproved' : 'documentRejected',
    { name: input.name, docType: input.docType },
    '/portal/documents',
  );
}

export async function sendNewMessageEmail(input: {
  to: string;
  locale: Locale;
  name: string;
}): Promise<void> {
  await dispatch(input.locale, input.to, 'newMessage', { name: input.name }, '/portal/messages');
}
