import axios from 'axios';

const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export type LLMProvider = 'deepseek' | 'anthropic';

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function callLLM(
  messages: LLMMessage[],
  systemPrompt?: string,
  provider: LLMProvider = 'deepseek'
): Promise<string> {
  if (provider === 'deepseek') {
    return callDeepSeek(messages, systemPrompt);
  } else {
    return callAnthropic(messages, systemPrompt);
  }
}

async function callDeepSeek(messages: LLMMessage[], systemPrompt?: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not configured');
  }

  const payload = {
    model: 'deepseek-chat',
    messages: systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages,
    max_tokens: 4000,
    temperature: 0.7,
  };

  const response = await axios.post(DEEPSEEK_API_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
  });

  return response.data.choices[0].message.content;
}

async function callAnthropic(messages: LLMMessage[], systemPrompt?: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  // Convert messages format to Anthropic's format
  const anthropicMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: [{ type: 'text', text: msg.content }],
  }));

  const body: any = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: anthropicMessages,
  };
  if (systemPrompt) {
    body.system = [{ type: 'text', text: systemPrompt }];
  }

  const response = await axios.post('https://api.anthropic.com/v1/messages', body, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
  });

  return response.data.content.map((block: any) => block.text).join('');
}

export function extractJSON(text: string): any {
  // Try direct parse
  try {
    return JSON.parse(text.trim());
  } catch {}

  // Strip markdown fences
  const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  try {
    return JSON.parse(stripped);
  } catch {}

  // Find first { ... } block
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }

  throw new Error('Could not parse JSON from response');
}