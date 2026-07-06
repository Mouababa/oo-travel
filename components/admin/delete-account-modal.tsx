'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/lib/use-toast';
import { deleteUserAccountAction } from '@/lib/actions';
import type { User } from '@/lib/types';

export function DeleteAccountModal({
  client,
  open,
  onClose,
  onDeleted,
}: {
  client: User | null;
  open: boolean;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const t = useTranslations('admin.clients');
  const tc = useTranslations('common');
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!client) return;
    setDeleting(true);
    const result = await deleteUserAccountAction(client.id);
    setDeleting(false);

    if (result.ok) {
      toast({ title: t('accountDeleted'), variant: 'success' });
      onDeleted(client.id);
      onClose();
    } else {
      toast({ title: t('deleteError'), variant: 'danger' });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('deleteTitle')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
          <p className="text-sm text-text-secondary">
            {t('deleteWarning', { name: client?.full_name ?? '' })}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            {tc('cancel')}
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting} className="gap-2">
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('confirmDelete')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
