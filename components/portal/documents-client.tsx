'use client';

import { useCallback, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Download, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ReviewStatusBadge } from '@/components/status-badge';
import { useToast } from '@/lib/use-toast';
import { uploadDocumentAction } from '@/lib/actions';
import { formatDate, intlLocale, cn } from '@/lib/utils';
import type { Document } from '@/lib/types';

// File-type icon colour: PDF red, JPG blue, PNG teal, else muted.
function fileColor(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'text-danger';
  if (ext === 'jpg' || ext === 'jpeg') return 'text-accent';
  if (ext === 'png') return 'text-success';
  return 'text-text-muted';
}

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/heic': ['.heic'],
};
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export function DocumentsClient({ initialDocs }: { initialDocs: Document[] }) {
  const t = useTranslations('portal.documents');
  const td = useTranslations('docType');
  const locale = useLocale();
  const { toast } = useToast();

  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return;
      setUploading(true);

      for (const file of accepted) {
        const fd = new FormData();
        fd.set('file', file);
        const result = await uploadDocumentAction(fd);
        if (result.ok && result.document) {
          setDocs((d) => [result.document as Document, ...d]);
        } else {
          toast({ title: t('uploadError'), variant: 'danger' });
        }
      }

      setUploading(false);
      toast({ title: t('uploadSuccess'), variant: 'success' });
    },
    [t, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'mb-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all',
          isDragActive
            ? 'border-solid border-accent bg-accent/10 shadow-glow'
            : 'border-accent/30 bg-surface/50 hover:border-accent/50',
        )}
      >
        <input {...getInputProps()} />
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </span>
        <p className="font-medium">{uploading ? t('uploading') : t('dropzone')}</p>
        <p className="text-sm text-text-secondary">{t('dropzoneHint')}</p>
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('fileName')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('uploadedAt')}</TableHead>
                <TableHead className="text-end" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <span className="flex items-center gap-2 font-medium">
                      <FileText className={cn('h-4 w-4', fileColor(d.file_name))} />
                      {d.file_name}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {td(d.doc_type ?? 'other')}
                  </TableCell>
                  <TableCell>
                    <ReviewStatusBadge status={d.review_status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-text-secondary">
                    {formatDate(d.uploaded_at, intlLocale(locale))}
                  </TableCell>
                  <TableCell className="text-end">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
