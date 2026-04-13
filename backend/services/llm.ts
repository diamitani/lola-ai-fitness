/**
 * LLM Service - Unified interface for DeepSeek and Ollama
 * Handles intelligent provider selection, fallback, and error handling
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: 'deepseek' | 'ollama' | 'template';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cached?: boolean;
}

export interface LLMConfig {
  provider?: 'deepseek' | 'ollama' | 'auto';
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

// Environment configuration
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';

// Provider availability cache
let deepseekAvailable: boolean | null = null;
let ollamaAvailable: boolean | null = null;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute

/**
 * Check if DeepSeek API is available
 */
async function checkDeepSeekAvailability(): Promise<boolean> {
  if (!DEEPSEEK_API_KEY) return false;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5,
      }),
    });

    return response.ok || response.status === 429; // 429 = rate limited but available
  } catch (error) {
    console.error('DeepSeek health check failed:', error);
    return false;
  }
}

/**
 * Check if Ollama is available
 */
async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Ollama health check failed:', error);
    return false;
  }
}

/**
 * Run health checks on providers (cached)
 */
async function runHealthChecks(): Promise<void> {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL && deepseekAvailable !== null) {
    return; // Use cached results
  }

  const [deepseek, ollama] = await Promise.all([
    checkDeepSeekAvailability(),
    checkOllamaAvailability(),
  ]);

  deepseekAvailable = deepseek;
  ollamaAvailable = ollama;
  lastHealthCheck = now;

  console.log('LLM Provider Status:', { deepseek, ollama });
}

/**
 * Select optimal LLM provider based on availability and config
 */
async function selectProvider(config: LLMConfig): Promise<'deepseek' | 'ollama' | 'template'> {
  await runHealthChecks();

  // Explicit provider selection
  if (config.provider === 'deepseek' && deepseekAvailable) return 'deepseek';
  if (config.provider === 'ollama' && ollamaAvailable) return 'ollama';

  // Auto selection (default)
  if (deepseekAvailable) return 'deepseek';
  if (ollamaAvailable) return 'ollama';

  // Fallback to templates
  return 'template';
}

/**
 * Call DeepSeek API
 */
async function callDeepSeek(
  messages: LLMMessage[],
  config: LLMConfig
): Promise<LLMResponse> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not configured');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  return {
    content: data.choices[0].message.content,
    provider: 'deepseek',
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
  };
}

/**
 * Call Ollama (local LLM)
 */
async function callOllama(
  messages: LLMMessage[],
  config: LLMConfig
): Promise<LLMResponse> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3',
      messages,
      stream: false,
      options: {
        temperature: config.temperature || 0.7,
        num_predict: config.maxTokens || 2000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  return {
    content: data.message.content,
    provider: 'ollama',
  };
}

/**
 * Generate template response (fallback when no LLM available)
 */
function generateTemplateResponse(messages: LLMMessage[]): LLMResponse {
  const userMessage = messages.find(m => m.role === 'user')?.content || '';

  // Simple pattern matching for common queries
  if (userMessage.toLowerCase().includes('workout plan')) {
    return {
      content: `I'd love to create a personalized workout plan for you! However, I'm currently unable to generate custom plans. Please check your API configuration or try again later.`,
      provider: 'template',
    };
  }

  if (userMessage.toLowerCase().includes('form') || userMessage.toLowerCase().includes('how to')) {
    return {
      content: `For proper exercise form, I recommend checking out video tutorials on YouTube. Search for "[exercise name] proper form" to see demonstrations from certified trainers.`,
      provider: 'template',
    };
  }

  return {
    content: `I'm here to help with your fitness journey! However, I'm currently running in limited mode. Please check your API configuration for the best experience.`,
    provider: 'template',
  };
}

/**
 * Main LLM call function with intelligent routing and fallback
 */
export async function callLLM(
  messages: LLMMessage[],
  config: LLMConfig = {}
): Promise<LLMResponse> {
  try {
    const provider = await selectProvider(config);

    console.log(`Using LLM provider: ${provider}`);

    switch (provider) {
      case 'deepseek':
        return await callDeepSeek(messages, config);

      case 'ollama':
        return await callOllama(messages, config);

      case 'template':
        return generateTemplateResponse(messages);

      default:
        throw new Error('No LLM provider available');
    }
  } catch (error) {
    console.error('LLM call failed:', error);

    // Try fallback providers
    if (config.provider !== 'ollama' && ollamaAvailable) {
      console.log('Falling back to Ollama...');
      try {
        return await callOllama(messages, config);
      } catch (ollamaError) {
        console.error('Ollama fallback failed:', ollamaError);
      }
    }

    // Final fallback to templates
    console.log('Using template response fallback');
    return generateTemplateResponse(messages);
  }
}

/**
 * Convenience function for single-turn chat
 */
export async function chatWithLola(
  userMessage: string,
  systemPrompt?: string,
  config?: LLMConfig
): Promise<string> {
  const messages: LLMMessage[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: userMessage });

  const response = await callLLM(messages, config);
  return response.content;
}

/**
 * Get provider status for UI display
 */
export async function getProviderStatus(): Promise<{
  deepseek: boolean;
  ollama: boolean;
  active: 'deepseek' | 'ollama' | 'template';
}> {
  await runHealthChecks();

  return {
    deepseek: deepseekAvailable || false,
    ollama: ollamaAvailable || false,
    active: deepseekAvailable ? 'deepseek' : ollamaAvailable ? 'ollama' : 'template',
  };
}
