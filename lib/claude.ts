import Anthropic from '@anthropic-ai/sdk';
import type { Locale } from './types';

const MODEL = 'claude-sonnet-4-6';

export const SYSTEM_PROMPT = `You are Omar's virtual assistant for OO Travel. Be warm, professional,
and concise. Answer in the client's language. You can confirm bookings,
explain document requirements, and share invoice status. Never quote
prices — say Omar will confirm shortly. Always sign off as 'Omar's team'.`;

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Generate a context-aware reply for the WhatsApp AI agent.
 * Used by the Z-API inbound webhook / n8n workflow for off-hours auto-replies.
 */
export async function generateReply(
  history: ConversationTurn[],
  locale: Locale = 'pt',
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Mock mode — no key configured.
    return "Obrigado pela mensagem! Estamos fora do horário de atendimento, mas o Omar retornará em breve. — Equipe do Omar";
  }

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 500,
    system: `${SYSTEM_PROMPT}\n\nThe client's preferred language code is "${locale}".`,
    messages: history.map((turn) => ({
      role: turn.role,
      content: turn.content,
    })),
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}
