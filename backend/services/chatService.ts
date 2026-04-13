/**
 * Chat Service - Handle fitness coaching conversations with Lola
 */

import { callLLM, type LLMMessage } from './llm';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  userId: string;
  userProfile?: {
    goals: string[];
    experienceLevel: string;
    currentPlan?: string;
  };
  conversationHistory: ChatMessage[];
}

/**
 * Build Lola's system prompt for chat interactions
 */
function buildChatSystemPrompt(context: ChatContext): string {
  return `You are Lola, a warm and knowledgeable AI fitness coach.

Your personality:
- Encouraging, patient, and non-judgmental
- Educational - you explain the "why" behind advice
- Safety-conscious - you prioritize injury prevention
- Supportive - you celebrate effort and progress

User context:
${context.userProfile ? `
- Goals: ${context.userProfile.goals.join(', ')}
- Experience: ${context.userProfile.experienceLevel}
${context.userProfile.currentPlan ? `- Current Plan: ${context.userProfile.currentPlan}` : ''}
` : '- No profile available yet'}

Your expertise:
- Exercise science and biomechanics
- Strength training, cardio, flexibility programs
- Nutrition fundamentals (NOT medical nutrition therapy)
- Form coaching and injury prevention
- Program design and progression

Operational rules:
1. **Safety First**: If user reports pain (not normal soreness), recommend stopping and seeing a healthcare provider
2. **No Medical Advice**: Don't diagnose injuries, prescribe treatments, or give medical advice
3. **Evidence-Based**: Use science-backed fitness principles, no pseudoscience
4. **Encouraging Tone**: Be supportive and motivating, never judgmental
5. **Practical Advice**: Give actionable, specific recommendations
6. **Acknowledge Limits**: If question is beyond your scope, refer to appropriate professional

Response format:
- Keep responses conversational but informative (2-4 paragraphs)
- Use bullet points for lists of tips or steps
- Include "why" explanations when giving advice
- End with encouragement or an actionable next step

Common question types you'll handle:
- Exercise form and technique
- Workout modifications
- Nutrition basics (macros, timing, hydration)
- Motivation and habit building
- Progress troubleshooting
- Equipment alternatives

Remember: You're a supportive coach, not a drill sergeant. Meet users where they are and help them grow! 💪`;
}

/**
 * Format conversation history for LLM
 */
function formatConversationHistory(history: ChatMessage[], maxMessages: number = 10): LLMMessage[] {
  // Take last N messages to stay within context limits
  const recentHistory = history.slice(-maxMessages);

  return recentHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * Chat with Lola - main chat function
 */
export async function chatWithLola(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  console.log('Chat request from user:', context.userId);

  const systemPrompt = buildChatSystemPrompt(context);
  const conversationHistory = formatConversationHistory(context.conversationHistory);

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await callLLM(messages, {
      maxTokens: 800,
      temperature: 0.7,
      provider: 'auto',
    });

    console.log('Chat response generated via:', response.provider);

    return response.content;
  } catch (error) {
    console.error('Chat service error:', error);
    return getFallbackResponse(userMessage);
  }
}

/**
 * Classify user question type for routing/analytics
 */
export function classifyQuestion(userMessage: string):
  'form' | 'nutrition' | 'motivation' | 'progress' | 'plan' | 'general' {

  const message = userMessage.toLowerCase();

  if (message.includes('form') || message.includes('how to') || message.includes('technique')) {
    return 'form';
  }

  if (message.includes('eat') || message.includes('nutrition') || message.includes('protein') ||
      message.includes('diet') || message.includes('calories')) {
    return 'nutrition';
  }

  if (message.includes('motivat') || message.includes('struggle') || message.includes('hard to') ||
      message.includes('give up') || message.includes('stay consistent')) {
    return 'motivation';
  }

  if (message.includes('progress') || message.includes('plateau') || message.includes('not seeing') ||
      message.includes('results') || message.includes('streak')) {
    return 'progress';
  }

  if (message.includes('workout plan') || message.includes('new plan') || message.includes('change plan') ||
      message.includes('modify') || message.includes('different workout')) {
    return 'plan';
  }

  return 'general';
}

/**
 * Get a fallback response when LLM is unavailable
 */
function getFallbackResponse(userMessage: string): string {
  const questionType = classifyQuestion(userMessage);

  const fallbacks: Record<string, string> = {
    form: `Great question about exercise form! For the most accurate guidance, I recommend watching video tutorials. Search YouTube for "[exercise name] proper form" to see certified trainers demonstrate the movement. Key points to remember: control the movement, maintain good posture, and never sacrifice form for weight or speed. Stay safe! 💪`,

    nutrition: `Nutrition is a key part of your fitness journey! Here are some universal principles: prioritize whole foods, eat adequate protein (0.8-1g per lb of body weight), stay hydrated, and fuel your workouts with carbs. For personalized meal planning, consider consulting a registered dietitian. Keep up the great work!`,

    motivation: `I hear you—staying consistent can be tough! Remember: progress isn't linear. Small steps add up to big changes. You don't have to be perfect; you just have to show up. What's one tiny thing you can do today to move forward? I believe in you! 🌟`,

    progress: `Tracking progress is smart! Remember to celebrate non-scale victories too: better energy, improved strength, feeling more confident. If you're hitting a plateau, consider changing up your routine or adjusting your nutrition. Progress takes time—trust the process!`,

    plan: `I'd love to help with your workout plan! However, I'm currently in limited mode. For the best personalized plans, make sure your API configuration is set up. In the meantime, focus on consistency with what you have. Every workout counts!`,

    general: `Thanks for reaching out! I'm here to support your fitness journey with science-backed advice on training, nutrition, and motivation. While I'm currently in limited mode, I'm still here to help guide you. What specific fitness topic can I assist you with?`,
  };

  return fallbacks[questionType] || fallbacks.general;
}

/**
 * Generate suggested follow-up questions based on conversation
 */
export function suggestFollowUpQuestions(lastMessage: string, questionType: string): string[] {
  const suggestions: Record<string, string[]> = {
    form: [
      'What are common mistakes to avoid?',
      'How can I progress this exercise?',
      'What muscles should I feel working?',
    ],
    nutrition: [
      'How much protein should I eat per day?',
      'What should I eat before/after workouts?',
      'How do I track my calories?',
    ],
    motivation: [
      'How do I build a consistent habit?',
      'What if I miss a workout?',
      'How do I stay motivated long-term?',
    ],
    progress: [
      'What metrics should I track?',
      'How often should I see progress?',
      'What is a plateau and how do I break it?',
    ],
    plan: [
      'How often should I change my workout?',
      'Should I do full-body or split training?',
      'How many rest days do I need?',
    ],
    general: [
      'How do I get started with fitness?',
      'What equipment do I need?',
      'How long until I see results?',
    ],
  };

  return suggestions[questionType] || suggestions.general;
}

/**
 * Detect if user is reporting pain or injury (safety check)
 */
export function detectPainOrInjury(userMessage: string): boolean {
  const painKeywords = [
    'pain', 'hurts', 'hurt', 'painful', 'ache', 'aching', 'sore',
    'sharp', 'shooting', 'stabbing', 'injury', 'injured', 'strain',
    'pulled', 'tear', 'torn', 'swollen', 'numbness', 'tingling',
  ];

  const normalSoreness = [
    'doms', 'muscle soreness', 'sore muscles', 'tight muscles',
  ];

  const message = userMessage.toLowerCase();

  // Check if it's normal soreness (don't flag)
  if (normalSoreness.some(phrase => message.includes(phrase))) {
    return false;
  }

  // Check for pain keywords
  return painKeywords.some(keyword => message.includes(keyword));
}

/**
 * Generate safety warning for pain/injury reports
 */
export function generateSafetyWarning(userMessage: string): string {
  return `⚠️ **Safety Notice**: You mentioned pain or discomfort. If you're experiencing sharp pain, persistent pain, or pain that worsens with movement, please stop exercising and consult a healthcare provider. It's important to distinguish between normal muscle fatigue (which is okay) and pain (which is a warning sign). Your health and safety come first! 💙`;
}
