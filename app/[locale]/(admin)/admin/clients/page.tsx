import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { mockClients, bookingsForClient } from '@/lib/mock-data';

const langLabels: Record<string, string> = {
  pt: 'PT',
  en: 'EN',
  fr: 'FR',
  ar: 'AR',
};

export default async function AdminClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.clients');
  const tc = await getTranslations('common');

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('new')}
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <Input placeholder={tc('search')} />
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('phone')}</TableHead>
                <TableHead>{t('language')}</TableHead>
                <TableHead className="text-end">{t('bookings')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClients.map((c) => (
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
                  <TableCell className="text-end font-medium">
                    {bookingsForClient(c.id).length}
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
