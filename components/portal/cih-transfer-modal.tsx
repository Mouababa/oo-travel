'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDropzone } from 'react-dropzone';
import { Copy, Check, Loader2, UploadCloud, FileText } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/use-toast';
import { uploadPaymentProofAction } from '@/lib/actions';
import { CIH_BANK_DETAILS } from '@/lib/constants';
import { formatBRL, cn } from '@/lib/utils';
import type { Invoice } from '@/lib/types';

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-muted px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-text-muted">{label}</p>
        <p className="truncate font-mono text-sm">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="shrink-0 cursor-pointer rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
        aria-label="copy"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function CihTransferModal({
  invoice,
  open,
  onClose,
  onUploaded,
}: {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  /** Called after a successful upload so the parent can refresh local state. */
  onUploaded: (invoiceId: string) => void;
}) {
  const t = useTranslations('portal.invoices');
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0 || !invoice) return;
      setUploading(true);

      const fd = new FormData();
      fd.set('file', accepted[0]);
      const result = await uploadPaymentProofAction(invoice.id, fd);

      setUploading(false);
      if (result.ok) {
        toast({ title: t('cihUploadSuccess'), variant: 'success' });
        onUploaded(invoice.id);
        onClose();
      } else {
        toast({ title: t('cihUploadError'), variant: 'danger' });
      }
    },
    [invoice, onUploaded, onClose, t, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <Dialog open={open} onClose={onClose} title={t('cihTitle')}>
      <div className="flex flex-col gap-4">
        {invoice && (
          <p className="text-center text-2xl font-semibold">{formatBRL(invoice.total_brl)}</p>
        )}
        <p className="text-center text-sm text-text-secondary">{t('cihInstructions')}</p>

        <div className="space-y-2">
          <CopyRow label={t('cihBankName')} value={CIH_BANK_DETAILS.bankName} />
          <CopyRow label={t('cihAccountHolder')} value={CIH_BANK_DETAILS.accountHolder} />
          <CopyRow label={t('cihIban')} value={CIH_BANK_DETAILS.iban} />
          <CopyRow label={t('cihRib')} value={CIH_BANK_DETAILS.rib} />
          <CopyRow label={t('cihSwift')} value={CIH_BANK_DETAILS.swift} />
          <CopyRow label={t('cihReference')} value={invoice?.invoice_number ?? ''} />
        </div>

        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all',
            isDragActive
              ? 'border-solid border-accent bg-accent/10 shadow-glow'
              : 'border-accent/30 bg-surface/50 hover:border-accent/50',
          )}
        >
          <input {...getInputProps()} />
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </span>
          <p className="text-sm font-medium">
            {uploading ? t('cihUploading') : t('cihDropzone')}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-text-secondary">
            <FileText className="h-3.5 w-3.5" />
            {t('cihDropzoneHint')}
          </p>
        </div>
      </div>
    </Dialog>
  );
}
