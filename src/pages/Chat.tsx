import { useState, useRef, useEffect } from 'react';
import { C, F } from '../theme';
import { callLLM } from '../services/llm';
import type { Profile, Plan } from '../types';
import { BODY_GOALS, PROBLEM_AREAS, EQUIPMENT_OPTIONS } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  profile: Profile;
  plan: Plan | null;
}

export function Chat({ profile, plan }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hey ${profile.name}! 🌸 I'm Lola, your personal coach. Ask me anything — workouts, nutrition, form tips, motivation, or anything about your plan. I'm here for you! 💪`,
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const systemPrompt = `You are Lola, a warm, knowledgeable, and motivating female-focused personal trainer and wellness coach. You are talking to ${profile.name}.

Her profile:
- Goals: ${BODY_GOALS.filter(g => profile.goals.includes(g.id)).map(g => g.label).join(', ')}
- Focus areas: ${PROBLEM_AREAS.filter(a => profile.areas.includes(a.id)).map(a => a.label).join(', ') || 'none specified'}
- Equipment: ${EQUIPMENT_OPTIONS.filter(e => profile.equipment.includes(e.id)).map(e => e.label).join(', ')}
- Environment: ${profile.environment}
- Frequency: ${profile.frequency}
- Level: ${profile.level}
- Notes: ${profile.notes || 'none'}
${plan ? `- She has an active ${plan.days?.length}-day workout plan` : '- She doesn\'t have a plan yet'}

Be warm, encouraging, specific, and practical. Keep responses concise but helpful. Use her name occasionally. Use emojis naturally but not excessively. Never suggest equipment she doesn't have.`;

  async function send() {
    if (!input.trim() || thinking) return;
    const userMsg = { role: 'user' as const, content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setThinking(true);
    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callLLM(apiMessages, systemPrompt, 'deepseek');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Hmm, something went wrong. Try again! 💪' },
      ]);
    }
    setThinking(false);
  }

  const quickTips = [
    'What should I eat before working out?',
    'How do I know if my form is right?',
    'I feel tired today — should I skip?',
    'How long until I see results?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', maxWidth: 520, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <h2 style={{ fontFamily: F.display, fontSize: 24 }}>
          Chat with <span style={{ color: C.rose }}>Lola</span>
        </h2>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>Your personal AI coach, always here 🌸</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              animation:
                i === messages.length - 1
                  ? m.role === 'user'
                    ? 'slideIn 0.3s ease'
                    : 'slideInLeft 0.3s ease'
                  : 'none',
            }}
          >
            {m.role === 'assistant' && (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg,${C.rose},${C.peach})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                  marginRight: 8,
                  marginTop: 2,
                }}
              >
                🌸
              </div>
            )}
            <div
              style={{
                maxWidth: '78%',
                padding: '12px 16px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background:
                  m.role === 'user' ? `linear-gradient(135deg,${C.rose},${C.peach})` : C.surface,
                color: m.role === 'user' ? '#fff' : C.text,
                fontSize: 14,
                lineHeight: 1.6,
                border: m.role === 'assistant' ? `1.5px solid ${C.border}` : 'none',
                boxShadow: m.role === 'user' ? `0 4px 14px rgba(232,130,106,0.3)` : 'none',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {thinking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: `linear-gradient(135deg,${C.rose},${C.peach})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              🌸
            </div>
            <div
              style={{
                background: C.surface,
                border: `1.5px solid ${C.border}`,
                borderRadius: '18px 18px 18px 4px',
                padding: '12px 16px',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map(j => (
                <div
                  key={j}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: C.rose,
                    animation: `pulse 1.2s ease ${j * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick tips (only show at start) */}
        {messages.length === 1 && !thinking && (
          <div style={{ marginTop: 6 }}>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Quick questions:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {quickTips.map((tip, i) => (
                <button
                  key={i}
                  onClick={() => setInput(tip)}
                  style={{
                    background: C.roseLight,
                    border: `1.5px solid ${C.peach}`,
                    borderRadius: 20,
                    padding: '9px 14px',
                    fontSize: 13,
                    color: C.roseDark,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: F.body,
                    fontWeight: 600,
                  }}
                >
                  {tip}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '12px 16px 20px',
          borderTop: `1px solid ${C.border}`,
          background: 'rgba(253,248,245,0.97)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask Lola anything..."
            rows={1}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 22,
              border: `2px solid ${input ? C.rose : C.border}`,
              fontFamily: F.body,
              fontSize: 14,
              color: C.text,
              background: C.surface,
              outline: 'none',
              resize: 'none',
              lineHeight: 1.5,
              maxHeight: 100,
              overflowY: 'auto',
              transition: 'border 0.2s',
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || thinking}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: input.trim() && !thinking ? `linear-gradient(135deg,${C.rose},${C.peach})` : C.border,
              border: 'none',
              cursor: input.trim() && !thinking ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <svg width="18" height="18" fill="none" stroke={input.trim() && !thinking ? '#fff' : C.muted} strokeWidth="2.2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}