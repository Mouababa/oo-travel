'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, X, FileText, Download, Inbox } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
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
import { EmptyState } from '@/components/empty-state';
import { useToast } from '@/lib/use-toast';
import { mockDocuments, clientName } from '@/lib/mock-data';
import { formatDate, intlLocale } from '@/lib/utils';
import type { Document, ReviewStatus } from '@/lib/types';

export default function AdminDocumentsPage() {
  const t = useTranslations('admin.documents');
  const td = useTranslations('docType');
  const locale = useLocale();
  const { toast } = useToast();

  const [docs, setDocs] = useState<Document[]>(mockDocuments);

  function setStatus(id: string, status: ReviewStatus) {
    setDocs((list) => list.map((d) => (d.id === id ? { ...d, review_status: status } : d)));
    toast({
      title: status === 'approved' ? t('approved') : t('rejected'),
      variant: status === 'approved' ? 'success' : 'danger',
    });
  }

  const queue = docs.filter(
    (d) => d.review_status === 'pending' || d.review_status === 'under_review',
  );

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {queue.length === 0 ? (
        <EmptyState icon={Inbox} title={t('queueEmpty')} />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>{t('client')}</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-end">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 text-text-secondary" />
                        {d.file_name}
                      </span>
                      <span className="ms-6 text-xs text-text-secondary">
                        {formatDate(d.uploaded_at, intlLocale(locale))}
                      </span>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {clientName(d.client_id)}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {td(d.doc_type ?? 'other')}
                    </TableCell>
                    <TableCell>
                      <ReviewStatusBadge status={d.review_status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" aria-label="download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          className="gap-1"
                          onClick={() => setStatus(d.id, 'approved')}
                        >
                          <Check className="h-4 w-4" />
                          {t('approve')}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="gap-1"
                          onClick={() => setStatus(d.id, 'rejected')}
                        >
                          <X className="h-4 w-4" />
                          {t('reject')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
