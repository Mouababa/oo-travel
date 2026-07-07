import path from 'node:path';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { CONTACT, SITE_NAME } from '@/lib/seo';
import { bankDetailsForCurrency } from '@/lib/constants';
import type { Invoice } from '@/lib/types';

// Server-only module — rendered by app/api/invoices/[id]/pdf/route.ts (Node
// runtime). @react-pdf/renderer's Image accepts a local file path in Node,
// so the logo is read straight off disk rather than fetched over HTTP.
const LOGO_PATH = path.join(process.cwd(), 'public', 'brand', 'oo-travel-logo.png');

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#18181b' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { width: 40, height: 40 },
  brand: { fontSize: 16, fontWeight: 700, marginTop: 6 },
  invoiceTitle: { fontSize: 20, fontWeight: 700, textAlign: 'right' },
  invoiceNumber: { fontSize: 11, color: '#71717a', textAlign: 'right', marginTop: 2 },
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
});

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
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
        <View style={styles.headerRow}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's
                Image renders into a PDF, not the DOM; there's no alt prop. */}
            <Image src={LOGO_PATH} style={styles.logo} />
            <Text style={styles.brand}>{SITE_NAME}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
        </View>

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
