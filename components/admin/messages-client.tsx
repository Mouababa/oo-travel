'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { WhatsAppLogo } from '@/components/icons/whatsapp';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { User, Message } from '@/lib/types';

export function AdminMessagesClient({
  clients,
  messagesByClient,
}: {
  clients: User[];
  messagesByClient: Record<string, Message[]>;
}) {
  const t = useTranslations('admin.messages');
  const tm = useTranslations('portal.messages');

  // AI agent enabled/disabled per client — UI-only for now; the schema has
  // no column to persist this yet (would need a users.ai_enabled migration).
  const [aiEnabled, setAiEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(clients.map((c) => [c.id, true])),
  );
  const [selected, setSelected] = useState(clients[0]?.id ?? '');

  const thread = messagesByClient[selected] ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Conversation list */}
      <Card>
        <CardContent className="px-0 py-0">
          <ul className="divide-y divide-border">
            {clients.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-start transition-colors',
                    selected === c.id ? 'bg-primary-light' : 'hover:bg-surface-muted',
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                    {c.full_name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {c.full_name}
                    </span>
                    <span className="block truncate text-xs text-text-secondary">
                      {(messagesByClient[c.id] ?? []).at(-1)?.content ?? '—'}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Thread + AI toggle */}
      <Card className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-medium">
            {clients.find((c) => c.id === selected)?.full_name}
          </span>
          <button
            onClick={() => setAiEnabled((s) => ({ ...s, [selected]: !s[selected] }))}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              aiEnabled[selected]
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-muted text-text-secondary',
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {aiEnabled[selected] ? t('aiOn') : t('aiOff')}
          </button>
        </div>

        <div className="flex-1 space-y-4 p-5">
          {thread.map((m) => {
            const outbound = m.direction === 'outbound';
            return (
              <div key={m.id} className={cn('flex', outbound ? 'justify-end' : 'justify-start')}>
                <div className="max-w-[75%]">
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2.5 text-sm',
                      outbound ? 'bg-primary text-primary-foreground' : 'bg-surface-muted',
                    )}
                  >
                    {m.content}
                  </div>
                  <div
                    className={cn(
                      'mt-1 flex items-center gap-2 text-[11px] text-text-secondary',
                      outbound ? 'justify-end' : 'justify-start',
                    )}
                  >
                    {m.channel === 'whatsapp' && (
                      <span className="inline-flex items-center gap-1">
                        <WhatsAppLogo className="h-3.5 w-3.5" /> WhatsApp
                      </span>
                    )}
                    {m.is_ai_generated && (
                      <Badge variant="info" className="gap-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        {tm('aiBadge')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
