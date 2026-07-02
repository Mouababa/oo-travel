import { NextRequest, NextResponse } from 'next/server';
import { generateReply, type ConversationTurn } from '@/lib/claude';
import { sendWhatsAppMessage, isWithinBusinessHours } from '@/lib/zapi';

// POST /api/messages/webhook — Z-API inbound WhatsApp message (Section 5.4).
// In production this is typically fronted by n8n, but the same logic applies.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const phone: string = body?.phone ?? body?.from ?? '';
  const text: string = body?.text?.message ?? body?.message ?? '';

  if (!phone || !text) {
    return NextResponse.json({ error: 'missing phone or text' }, { status: 400 });
  }

  // 1. Look up the client by whatsapp_id and load conversation history.
  // 2. Persist the inbound message in the messages table.
  // 3. During business hours, notify Omar instead of auto-replying.
  if (isWithinBusinessHours()) {
    // TODO: create a portal notification for Omar.
    return NextResponse.json({ queued: true, mode: 'human' });
  }

  // Off-hours: generate an AI reply and send it back via Z-API.
  const history: ConversationTurn[] = [{ role: 'user', content: text }];
  const reply = await generateReply(history, 'pt');
  await sendWhatsAppMessage({ phone, message: reply });

  // TODO: persist the AI reply (is_ai_generated = true) in the messages table.
  return NextResponse.json({ replied: true, mode: 'ai' });
}
