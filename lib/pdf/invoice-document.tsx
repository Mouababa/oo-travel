import fs from 'node:fs';
import path from 'node:path';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { CONTACT, SITE_NAME } from '@/lib/seo';
import { bankDetailsForCurrency } from '@/lib/constants';
import type { Invoice } from '@/lib/types';

// Server-only module — rendered by app/api/invoices/[id]/pdf/route.ts (Node
// runtime). Read as a Buffer rather than passed as a path string: on Windows,
// @react-pdf/image's local-path check runs the path through url.parse(),
// which misreads a drive letter ("C:\...") as a URL protocol and falls
// through to a remote fetch() that silently fails — the logo/stamp just
// don't render, no error surfaced. A Buffer skips that resolution entirely.
const LOGO_BUFFER = fs.readFileSync(
  path.join(process.cwd(), 'public', 'brand', 'oo-travel-logo.png'),
);
// Official seal — invoices only, never emails (see lib/email/shell.ts).
const STAMP_BUFFER = fs.readFileSync(
  path.join(process.cwd(), 'public', 'brand', 'oo-travel-stamp.png'),
);

const styles = StyleSheet.create({
  page: { fontSize: 10, fontFamily: 'Helvetica', color: '#18181b' },
  // Full-bleed dark band, same colour as the email header — logo left,
  // INVOICE + number right, both in white so they read against the black.
  headerBand: {
    backgroundColor: '#0b0b12',
    paddingHorizontal: 40,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // The logo PNG is a 726x344 wordmark (ratio ~2.11) — sized to preserve
  // that ratio rather than the old 40x40 square, which squashed it.
  logo: { width: 120, height: 57 },
  invoiceTitle: { fontSize: 20, fontWeight: 700, textAlign: 'right', color: '#ffffff' },
  invoiceNumber: { fontSize: 11, color: '#ffffff', textAlign: 'right', marginTop: 2 },
  body: { padding: 40, paddingTop: 24 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#e4e4e7', marginVertical: 20 },
  columns: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  column: { width: '48%' },
  label: { fontSize: 8, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 10, marginBottom: 2 },
  table: { marginTop: 8 },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#18181b',
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingVertical: 6,
  },
  colDescription: { width: '75%' },
  colAmount: { width: '25%', textAlign: 'right' },
  tableHeaderText: { fontSize: 8, color: '#71717a', textTransform: 'uppercase' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#18181b',
  },
  totalLabel: { fontSize: 12, fontWeight: 700 },
  totalValue: { fontSize: 14, fontWeight: 700 },
  amountInWords: {
    fontSize: 8.5,
    fontStyle: 'italic',
    color: '#71717a',
    marginTop: 6,
    textAlign: 'right',
  },
  // paddingRight clears the stamp (100pt wide, sits bottom-right) so wrapped
  // lines never run underneath it.
  legalNotes: { marginTop: 20, paddingRight: 130 },
  legalNote: { fontSize: 7.5, color: '#a1a1aa', marginBottom: 3, lineHeight: 1.4 },
  bankBox: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 4,
  },
  bankTitle: { fontSize: 9, fontWeight: 700, marginBottom: 6 },
  bankRow: { flexDirection: 'row', marginBottom: 2 },
  bankLabel: { width: 90, fontSize: 8, color: '#71717a' },
  bankValue: { fontSize: 9, fontFamily: 'Courier' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 10,
    fontSize: 8,
    color: '#a1a1aa',
    textAlign: 'center',
  },
  stamp: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    width: 100,
    height: 100,
    opacity: 0.9,
  },
});

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];

// Converts 0-999 to words (the repeating "chunk" unit for thousands/millions).
function chunkToWords(n: number): string {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} hundred`);
    n %= 100;
  }
  if (n >= 20) {
    parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
  } else if (n > 0) {
    parts.push(ONES[n]);
  }
  return parts.join(' ');
}

function integerToWords(n: number): string {
  if (n === 0) return 'zero';
  const scales: [number, string][] = [
    [1_000_000_000, 'billion'],
    [1_000_000, 'million'],
    [1_000, 'thousand'],
  ];
  const parts: string[] = [];
  for (const [value, name] of scales) {
    if (n >= value) {
      parts.push(`${chunkToWords(Math.floor(n / value))} ${name}`);
      n %= value;
    }
  }
  if (n > 0) parts.push(chunkToWords(n));
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CURRENCY_NAMES: Record<string, [singular: string, plural: string]> = {
  BRL: ['Brazilian Real', 'Brazilian Reais'],
  USD: ['US Dollar', 'US Dollars'],
  EUR: ['Euro', 'Euros'],
  CAD: ['Canadian Dollar', 'Canadian Dollars'],
  MAD: ['Moroccan Dirham', 'Moroccan Dirhams'],
};

/** Spells out an amount for the formal "amount in words" line invoices
 * conventionally carry, e.g. "One thousand two hundred US Dollars and 00/100". */
function amountToWords(amount: number, currency: string): string {
  const whole = Math.floor(amount);
  const cents = Math.round((amount - whole) * 100);
  const [singular, plural] = CURRENCY_NAMES[currency] ?? [currency, currency];
  const currencyName = whole === 1 ? singular : plural;
  const centsStr = String(cents).padStart(2, '0');
  return `${capitalize(integerToWords(whole))} ${currencyName} and ${centsStr}/100`;
}

export function InvoiceDocument({
  invoice,
  clientName,
  clientEmail,
}: {
  invoice: Invoice;
  clientName: string;
  clientEmail: string;
}) {
  const currency = invoice.currency || 'BRL';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's
              Image renders into a PDF, not the DOM; there's no alt prop. */}
          <Image src={LOGO_BUFFER} style={styles.logo} />
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.divider} />

          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.label}>Billed to</Text>
              <Text style={styles.value}>{clientName}</Text>
              <Text style={styles.value}>{clientEmail}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{CONTACT.founder}</Text>
              <Text style={styles.value}>{CONTACT.legalName}</Text>
              <Text style={styles.value}>CNPJ {CONTACT.cnpj}</Text>
              <Text style={styles.value}>
                {CONTACT.city}, {CONTACT.region} — {CONTACT.country}
              </Text>
              <Text style={styles.value}>{CONTACT.generalEmail}</Text>
              <Text style={styles.value}>{CONTACT.email}</Text>
            </View>
          </View>

          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.label}>Issue date</Text>
              <Text style={styles.value}>
                {new Date(invoice.created_at).toLocaleDateString('en-GB')}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Due date</Text>
              <Text style={styles.value}>
                {invoice.due_date
                  ? new Date(invoice.due_date).toLocaleDateString('en-GB')
                  : '—'}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.colDescription, styles.tableHeaderText]}>Description</Text>
              <Text style={[styles.colAmount, styles.tableHeaderText]}>Amount</Text>
            </View>
            {invoice.line_items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colDescription}>{item.label}</Text>
                <Text style={styles.colAmount}>{formatMoney(item.amount_brl, currency)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatMoney(invoice.total_brl, currency)}</Text>
          </View>
          <Text style={styles.amountInWords}>
            Amount in words: {amountToWords(invoice.total_brl, currency)}
          </Text>

          {invoice.suggested_payment_method === 'cih_transfer' &&
            (() => {
              const bank = bankDetailsForCurrency(currency);
              return (
                <View style={styles.bankBox}>
                  <Text style={styles.bankTitle}>Bank transfer details</Text>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Bank</Text>
                    <Text style={styles.bankValue}>{bank.bankName}</Text>
                  </View>
                  {bank.bankAddress && (
                    <View style={styles.bankRow}>
                      <Text style={styles.bankLabel}>Bank address</Text>
                      <Text style={styles.bankValue}>{bank.bankAddress}</Text>
                    </View>
                  )}
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Account holder</Text>
                    <Text style={styles.bankValue}>{bank.accountHolder}</Text>
                  </View>
                  {bank.accountNumber && (
                    <View style={styles.bankRow}>
                      <Text style={styles.bankLabel}>Account number</Text>
                      <Text style={styles.bankValue}>{bank.accountNumber}</Text>
                    </View>
                  )}
                  {bank.iban && (
                    <View style={styles.bankRow}>
                      <Text style={styles.bankLabel}>IBAN</Text>
                      <Text style={styles.bankValue}>{bank.iban}</Text>
                    </View>
                  )}
                  {bank.rib && (
                    <View style={styles.bankRow}>
                      <Text style={styles.bankLabel}>RIB</Text>
                      <Text style={styles.bankValue}>{bank.rib}</Text>
                    </View>
                  )}
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>SWIFT/BIC</Text>
                    <Text style={styles.bankValue}>{bank.swift}</Text>
                  </View>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Reference</Text>
                    <Text style={styles.bankValue}>{invoice.invoice_number}</Text>
                  </View>
                </View>
              );
            })()}

          <View style={styles.legalNotes}>
            <Text style={styles.legalNote}>
              This invoice is valid until the due date shown above; prices reflect
              availability and exchange rates at the time of issue and may change if
              payment is not received by then.
            </Text>
            <Text style={styles.legalNote}>
              This document is not a receipt until the invoice status is marked Paid.
            </Text>
            <Text style={styles.legalNote}>
              Refunds follow our Booking & Refunds Policy (ootravel.com.br/legal/booking-terms)
              — supplier cancellation rules may apply and our service fee is non-refundable
              once work has begun.
            </Text>
          </View>
        </View>

        {/* eslint-disable-next-line jsx-a11y/alt-text -- see note on the logo Image above */}
        <Image src={STAMP_BUFFER} style={styles.stamp} />

        <Text style={styles.footer}>
          {SITE_NAME} — {CONTACT.founder} — {CONTACT.legalName} — CNPJ {CONTACT.cnpj}
          {'\n'}
          {CONTACT.city}, {CONTACT.region}, {CONTACT.country} · {CONTACT.generalEmail} ·{' '}
          {CONTACT.phone}
        </Text>
      </Page>
    </Document>
  );
}
