import { useState } from 'react';
import { PrimaryBtn } from '../components/shared/PrimaryBtn';
import { CheckCircle } from '../components/shared/CheckCircle';
import { Chip } from '../components/shared/Chip';
import { C, F, GS } from '../theme';
import type { Profile } from '../types';
import {
  BODY_GOALS,
  PROBLEM_AREAS,
  EQUIPMENT_OPTIONS,
  ENVIRONMENTS,
  FREQUENCIES,
  LEVELS,
} from '../types';

interface OnboardingProps {
  onComplete: (profile: Profile) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [environment, setEnvironment] = useState('');
  const [frequency, setFrequency] = useState('');
  const [level, setLevel] = useState('');
  const [notes, setNotes] = useState('');
  const TOTAL = 7;

  function toggle<T>(arr: T[], setArr: (arr: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  function canNext() {
    if (step === 0) return name.trim().length > 1;
    if (step === 1) return goals.length > 0;
    if (step === 3) return equipment.length > 0;
    if (step === 4) return !!environment;
    if (step === 5) return !!frequency && !!level;
    return true;
  }

  function finish() {
    onComplete({ name, goals, areas, equipment, environment, frequency, level, notes });
  }

  const content = [
    // Step 0
    <div key={0} className="fu">
      <div style={{ textAlign: 'center', marginBottom: 36, marginTop: 16 }}>
        <div
          style={{
            fontSize: 64,
            marginBottom: 12,
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          🌸
        </div>
        <h1 style={{ fontFamily: F.display, fontSize: 38, lineHeight: 1.15, marginBottom: 10 }}>
          Hi, I'm <span style={{ color: C.rose }}>Lola</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.65 }}>
          Your personal AI fitness coach.
          <br />
          Let's build a plan made just for you.
        </p>
      </div>
      <label
        style={{
          display: 'block',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: C.muted,
          marginBottom: 10,
        }}
      >
        First, what's your name?
      </label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && canNext() && setStep(1)}
        placeholder="Your name..."
        style={{
          width: '100%',
          padding: '16px 18px',
          borderRadius: 16,
          border: `2px solid ${name ? C.rose : C.border}`,
          fontFamily: F.body,
          fontSize: 18,
          color: C.text,
          background: C.surface,
          outline: 'none',
          transition: 'border 0.2s',
        }}
      />
    </div>,

    // Step 1 — Goals
    <div key={1} className="fu">
      <h2 style={{ fontFamily: F.display, fontSize: 30, marginBottom: 6 }}>
        What's your <em style={{ color: C.rose }}>goal?</em>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
        Pick all that apply, {name}.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {BODY_GOALS.map(g => (
          <div
            key={g.id}
            onClick={() => toggle(goals, setGoals, g.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: goals.includes(g.id) ? C.roseLight : C.surface,
              border: `2px solid ${goals.includes(g.id) ? C.rose : C.border}`,
              borderRadius: 14,
              padding: '13px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 22 }}>{g.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14 }}>{g.label}</p>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{g.desc}</p>
            </div>
            <CheckCircle done={goals.includes(g.id)} />
          </div>
        ))}
      </div>
    </div>,

    // Step 2 — Problem areas
    <div key={2} className="fu">
      <h2 style={{ fontFamily: F.display, fontSize: 30, marginBottom: 6 }}>
        Any areas to <em style={{ color: C.rose }}>focus on?</em>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
        Optional — Lola will prioritize these.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {PROBLEM_AREAS.map(a => (
          <div
            key={a.id}
            onClick={() => toggle(areas, setAreas, a.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: areas.includes(a.id) ? C.roseLight : C.surface,
              border: `2px solid ${areas.includes(a.id) ? C.rose : C.border}`,
              borderRadius: 12,
              padding: '12px 14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 20 }}>{a.icon}</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{a.label}</span>
          </div>
        ))}
      </div>
    </div>,

    // Step 3 — Equipment
    <div key={3} className="fu">
      <h2 style={{ fontFamily: F.display, fontSize: 30, marginBottom: 6 }}>
        What do you <em style={{ color: C.rose }}>have available?</em>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
        Lola will only program what you have.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {EQUIPMENT_OPTIONS.map(e => (
          <div
            key={e.id}
            onClick={() => {
              if (e.id === 'nothing') {
                setEquipment(['nothing']);
                return;
              }
              const f = equipment.filter(x => x !== 'nothing');
              toggle(f, setEquipment, e.id);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: equipment.includes(e.id) ? C.roseLight : C.surface,
              border: `2px solid ${equipment.includes(e.id) ? C.rose : C.border}`,
              borderRadius: 12,
              padding: '12px 14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 20 }}>{e.icon}</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{e.label}</span>
          </div>
        ))}
      </div>
    </div>,

    // Step 4 — Environment
    <div key={4} className="fu">
      <h2 style={{ fontFamily: F.display, fontSize: 30, marginBottom: 6 }}>
        Where do you <em style={{ color: C.rose }}>work out?</em>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
        Your primary spot.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ENVIRONMENTS.map(e => (
          <div
            key={e.id}
            onClick={() => setEnvironment(e.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: environment === e.id ? C.roseLight : C.surface,
              border: `2px solid ${environment === e.id ? C.rose : C.border}`,
              borderRadius: 14,
              padding: '16px 18px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 26 }}>{e.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{e.label}</span>
            {environment === e.id && (
              <span style={{ marginLeft: 'auto', color: C.rose, fontSize: 18 }}>✓</span>
            )}
          </div>
        ))}
      </div>
    </div>,

    // Step 5 — Frequency + Level
    <div key={5} className="fu">
      <h2 style={{ fontFamily: F.display, fontSize: 30, marginBottom: 22 }}>
        How often & <em style={{ color: C.rose }}>your level?</em>
      </h2>
      <p
        style={{
          fontWeight: 700,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: C.muted,
          marginBottom: 10,
        }}
      >
        Workouts per week
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
        {FREQUENCIES.map(f => (
          <Chip
            key={f}
            label={f}
            selected={frequency === f}
            onClick={() => setFrequency(f)}
          />
        ))}
      </div>
      <p
        style={{
          fontWeight: 700,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: C.muted,
          marginBottom: 10,
        }}
      >
        Experience level
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LEVELS.map(l => (
          <div
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: level === l.id ? C.roseLight : C.surface,
              border: `2px solid ${level === l.id ? C.rose : C.border}`,
              borderRadius: 14,
              padding: '14px 18px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{l.label}</p>
              <p style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{l.desc}</p>
            </div>
            {level === l.id && <span style={{ color: C.rose, fontSize: 20 }}>✓</span>}
          </div>
        ))}
      </div>
    </div>,

    // Step 6 — Notes
    <div key={6} className="fu">
      <h2 style={{ fontFamily: F.display, fontSize: 30, marginBottom: 6 }}>
        Anything else <em style={{ color: C.rose }}>Lola should know?</em>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>
        Injuries, preferences, energy levels — all fair game.
      </p>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={`e.g. "bad right knee, hate burpees, just had a baby, feel low energy lately..."`}
        style={{
          width: '100%',
          padding: '16px 18px',
          borderRadius: 16,
          height: 120,
          border: `2px solid ${C.border}`,
          fontFamily: F.body,
          fontSize: 14,
          color: C.text,
          background: C.surface,
          outline: 'none',
          resize: 'none',
          lineHeight: 1.6,
        }}
      />
      <div
        style={{
          background: C.roseLight,
          borderRadius: 14,
          padding: '16px 18px',
          marginTop: 18,
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 13, color: C.roseDark, marginBottom: 10 }}>
          Your Lola profile 🌸
        </p>
        {[
          ['Goals', BODY_GOALS.filter(g => goals.includes(g.id)).map(g => g.label).join(', ')],
          ['Focus', areas.length ? PROBLEM_AREAS.filter(a => areas.includes(a.id)).map(a => a.label).join(', ') : 'No specific areas'],
          ['Equipment', EQUIPMENT_OPTIONS.filter(e => equipment.includes(e.id)).map(e => e.label).join(', ')],
          ['Environment', ENVIRONMENTS.find(e => e.id === environment)?.label],
          ['Frequency', frequency],
          ['Level', LEVELS.find(l => l.id === level)?.label],
        ].map(([k, v]) => (
          <div key={k as string} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
            <span style={{ fontWeight: 700, fontSize: 12, color: C.roseDark, minWidth: 85 }}>
              {k as string}:
            </span>
            <span style={{ fontSize: 12, color: C.text }}>{v as string}</span>
          </div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>
        {GS}
      </style>
      <div style={{ padding: '18px 24px 0' }}>
        <div style={{ height: 3, background: C.border, borderRadius: 4 }}>
          <div
            style={{
              height: '100%',
              background: `linear-gradient(90deg,${C.rose},${C.peach})`,
              borderRadius: 4,
              width: `${(step / (TOTAL - 1)) * 100}%`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <p style={{ textAlign: 'right', fontSize: 11, color: C.muted, marginTop: 5 }}>
          {step + 1} of {TOTAL}
        </p>
      </div>
      <div
        style={{
          flex: 1,
          padding: '22px 24px 110px',
          maxWidth: 520,
          margin: '0 auto',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        {content[step]}
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(253,248,245,0.97)',
          backdropFilter: 'blur(12px)',
          padding: '14px 24px 28px',
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <PrimaryBtn
            onClick={() => (step < TOTAL - 1 ? setStep(s => s + 1) : finish())}
            disabled={!canNext()}
          >
            {step === TOTAL - 1 ? `Let's go, ${name}! 🌸` : 'Continue →'}
          </PrimaryBtn>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                display: 'block',
                margin: '12px auto 0',
                background: 'none',
                border: 'none',
                color: C.muted,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: F.body,
              }}
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}