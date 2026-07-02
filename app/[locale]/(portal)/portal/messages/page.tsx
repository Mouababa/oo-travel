'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles } from 'lucide-react';
import { WhatsAppLogo } from '@/components/icons/whatsapp';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { messagesForClient, mockUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';

export default function MessagesPage() {
  const t = useTranslations('portal.messages');
  const [messages, setMessages] = useState<Message[]>(messagesForClient(mockUser.id));
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message (mimics realtime behaviour, Section 5.5).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const msg: Message = {
      id: `local_${Date.now()}`,
      client_id: mockUser.id,
      direction: 'inbound',
      channel: 'portal',
      content: text,
      is_ai_generated: false,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, msg]);
    setInput('');

    // Simulated AI auto-reply.
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `ai_${Date.now()}`,
          client_id: mockUser.id,
          direction: 'outbound',
          channel: 'portal',
          content:
            'Obrigado pela mensagem! O Omar vai te responder em breve. — Equipe do Omar',
          is_ai_generated: true,
          created_at: new Date().toISOString(),
        },
      ]);
    }, 900);
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

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
            className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />
          <Button type="submit" size="icon" aria-label="send">
            <Send className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
