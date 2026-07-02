'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check, Loader2, CheckCircle2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/use-toast';
import { formatBRL } from '@/lib/utils';
import type { Invoice } from '@/lib/types';
import type { PixCharge } from '@/lib/mercadopago';

const EXPIRY_SECONDS = 30 * 60;

export function PixModal({
  invoice,
  open,
  onClose,
  onPaid,
}: {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onPaid: (id: string) => void;
}) {
  const t = useTranslations('portal.invoices');
  const { toast } = useToast();
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [seconds, setSeconds] = useState(EXPIRY_SECONDS);

  // Create the PIX charge when the modal opens.
  useEffect(() => {
    if (!open || !invoice) return;
    setLoading(true);
    setPaid(false);
    setSeconds(EXPIRY_SECONDS);
    fetch('/api/payments/create-pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId: invoice.id }),
    })
      .then((r) => r.json())
      .then((data: PixCharge) => setCharge(data))
      .finally(() => setLoading(false));
  }, [open, invoice]);

  // Countdown timer (Section 5.3).
  useEffect(() => {
    if (!open || paid) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [open, paid]);

  function copy() {
    if (!charge) return;
    navigator.clipboard.writeText(charge.qr_code);
    setCopied(true);
    toast({ title: t('pixCopied'), variant: 'success' });
    setTimeout(() => setCopied(false), 2000);
  }

  // Demo helper — in production this is driven by the Mercado Pago webhook.
  function simulatePaid() {
    if (!invoice) return;
    setPaid(true);
    toast({ title: t('pixPaid'), variant: 'success' });
    setTimeout(() => {
      onPaid(invoice.id);
      onClose();
    }, 1500);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <Dialog open={open} onClose={onClose} title={t('pixTitle')}>
      {loading || !charge ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : paid ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <CheckCircle2 className="h-14 w-14 text-success" />
          <p className="text-lg font-semibold">{t('pixPaid')}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {invoice && (
            <p className="text-2xl font-semibold">{formatBRL(invoice.total_brl)}</p>
          )}
          <p className="text-sm text-text-secondary">{t('pixScan')}</p>

          <div className="rounded-lg border border-border bg-surface p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${charge.qr_code_base64}`}
              alt="PIX QR Code"
              className="h-44 w-44 [image-rendering:pixelated]"
            />
          </div>

          <div className="flex w-full items-center gap-2 rounded-md border border-border bg-surface-muted p-2">
            <code className="flex-1 truncate font-mono text-xs">{charge.qr_code}</code>
            <Button size="sm" variant="outline" onClick={copy} className="gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {t('pixCopy')}
            </Button>
          </div>

          <p className="text-sm text-text-secondary">
            {t('pixExpires', { time: `${mm}:${ss}` })}
          </p>

          <Button onClick={simulatePaid} variant="success" className="w-full">
            {t('pixPaid')}
          </Button>
        </div>
      )}
    </Dialog>
  );
}
