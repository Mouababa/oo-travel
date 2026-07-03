'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles } from 'lucide-react';
import { WhatsAppLogo } from '@/components/icons/whatsapp';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/use-toast';
import { sendMessageAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';

export function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const t = useTranslations('portal.messages');
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setSending(true);
    setInput('');

    // Optimistic append — replaced by a real refresh once Realtime/polling is
    // wired; for now the sent copy is authoritative locally.
    const optimistic: Message = {
      id: `pending_${Date.now()}`,
      client_id: '',
      direction: 'inbound',
      channel: 'portal',
      content: text,
      is_ai_generated: false,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);

    const result = await sendMessageAction(text);
    setSending(false);
    if (!result.ok) {
      toast({ title: t('sendError'), variant: 'danger' });
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <Card className="flex min-h-0 flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m) => {
            const outbound = m.direction === 'outbound';
            return (
              <div
                key={m.id}
                className={cn('flex', outbound ? 'justify-start' : 'justify-end')}
              >
                <div className="max-w-[75%]">
                  <div
                    className={cn(
                      'rounded-xl px-4 py-2.5 text-sm',
                      outbound
                        ? 'border border-border bg-surface-raised text-text-primary'
                        : 'bg-accent text-white shadow-glow',
                    )}
                  >
                    {m.content}
                  </div>
                  <div
                    className={cn(
                      'mt-1 flex items-center gap-2 text-[11px] text-text-secondary',
                      outbound ? 'justify-start' : 'justify-end',
                    )}
                  >
                    <span>{outbound ? t('team') : t('you')}</span>
                    {m.channel === 'whatsapp' && (
                      <span className="inline-flex items-center gap-1">
                        <WhatsAppLogo className="h-3.5 w-3.5" /> WhatsApp
                      </span>
                    )}
                    {m.is_ai_generated && (
                      <Badge variant="info" className="gap-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        {t('aiBadge')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            disabled={sending}
            className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />
          <Button type="submit" size="icon" aria-label="send" disabled={sending}>
            <Send className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
