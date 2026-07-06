'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, X, UserCheck, Users, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ApprovalStatusBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { DeleteAccountModal } from '@/components/admin/delete-account-modal';
import { useToast } from '@/lib/use-toast';
import { approveClientAction } from '@/lib/actions';
import { formatDate, intlLocale } from '@/lib/utils';
import type { User } from '@/lib/types';

const langLabels: Record<string, string> = { pt: 'PT', en: 'EN', fr: 'FR', ar: 'AR' };

function ReviewRow({
  client,
  onResolved,
}: {
  client: User;
  onResolved: (id: string, status: 'approved' | 'rejected') => void;
}) {
  const t = useTranslations('admin.clients');
  const locale = useLocale();
  const { toast } = useToast();
  const [pending, setPending] = useState<'approve' | 'reject' | null>(null);

  async function resolve(approve: boolean) {
    setPending(approve ? 'approve' : 'reject');
    const result = await approveClientAction(client.id, approve);
    setPending(null);
    if (result.ok) {
      onResolved(client.id, approve ? 'approved' : 'rejected');
      toast({
        title: approve ? t('clientApproved') : t('clientRejected'),
        variant: approve ? 'success' : 'danger',
      });
    } else {
      toast({ title: t('approvalError'), variant: 'danger' });
    }
  }

  return (
    <TableRow>
      <TableCell>
        <span className="flex items-center gap-2 font-medium">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
            {client.full_name.charAt(0)}
          </span>
          {client.full_name}
        </span>
      </TableCell>
      <TableCell className="text-text-secondary">{client.email}</TableCell>
      <TableCell className="text-text-secondary">{client.phone ?? '—'}</TableCell>
      <TableCell className="text-text-secondary">
        {formatDate(client.created_at, intlLocale(locale))}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="success"
            size="sm"
            className="gap-1"
            disabled={pending !== null}
            onClick={() => resolve(true)}
          >
            <Check className="h-4 w-4" />
            {t('approve')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="gap-1"
            disabled={pending !== null}
            onClick={() => resolve(false)}
          >
            <X className="h-4 w-4" />
            {t('reject')}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AdminClientsClient({
  initialClients,
  bookingCounts,
}: {
  initialClients: User[];
  bookingCounts: Record<string, number>;
}) {
  const t = useTranslations('admin.clients');
  const tc = useTranslations('common');
  const locale = useLocale();

  const [clients, setClients] = useState<User[]>(initialClients);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  function onResolved(id: string, status: 'approved' | 'rejected') {
    setClients((list) => list.map((c) => (c.id === id ? { ...c, approval_status: status } : c)));
  }

  function onDeleted(id: string) {
    setClients((list) => list.filter((c) => c.id !== id));
  }

  const pending = clients.filter((c) => c.approval_status === 'pending');

  return (
    <>
      <DeleteAccountModal
        client={deleteTarget}
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onDeleted={onDeleted}
      />

      {pending.length > 0 && (
        <Card className="mb-6 border-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-warning" />
              {t('pendingQueueTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('phone')}</TableHead>
                  <TableHead>{t('signedUpOn')}</TableHead>
                  <TableHead className="text-end">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((c) => (
                  <ReviewRow key={c.id} client={c} onResolved={onResolved} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {clients.length === 0 ? (
        <EmptyState icon={Users} title={t('empty')} />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('phone')}</TableHead>
                  <TableHead>{t('language')}</TableHead>
                  <TableHead>{tc('status')}</TableHead>
                  <TableHead className="text-end">{t('bookings')}</TableHead>
                  <TableHead className="text-end">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                          {c.full_name.charAt(0)}
                        </span>
                        {c.full_name}
                      </span>
                    </TableCell>
                    <TableCell className="text-text-secondary">{c.email}</TableCell>
                    <TableCell className="text-text-secondary">{c.phone ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant="neutral">{langLabels[c.preferred_language]}</Badge>
                    </TableCell>
                    <TableCell>
                      <ApprovalStatusBadge status={c.approval_status} />
                    </TableCell>
                    <TableCell className="text-end font-medium">
                      {bookingCounts[c.id] ?? 0}
                    </TableCell>
                    <TableCell className="text-end">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(c)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        aria-label={t('deleteAccount')}
                        title={t('deleteAccount')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
