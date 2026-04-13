import { useState, useEffect } from 'react';
import { Spinner } from '../components/shared/Spinner';
import { C, F } from '../theme';
import type { Profile, Plan } from '../types';
import { BODY_GOALS, PROBLEM_AREAS } from '../types';
import { getWorkoutStats } from '../services/workoutTracking';
import { generateInsights, type WorkoutInsight } from '../services/insights';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  profile: Profile;
  plan: Plan | null;
  generating: boolean;
  onGeneratePlan: () => void;
  setTab: (tab: string) => void;
}

export function Home({ profile, plan, generating, onGeneratePlan, setTab }: HomeProps) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<WorkoutInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [stats, setStats] = useState({ currentStreak: 0, totalWorkouts: 0 });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const workoutStats = await getWorkoutStats(user.uid);
        setStats({
          currentStreak: workoutStats.currentStreak,
          totalWorkouts: workoutStats.totalWorkouts,
        });

        // Load AI insights
        setLoadingInsights(true);
        const aiInsights = await generateInsights(profile, plan, workoutStats);
        setInsights(aiInsights);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoadingInsights(false);
      }
    }
    loadData();
  }, [user, profile, plan]);

  return (
    <div style={{ padding: '22px 20px 20px', maxWidth: 520, margin: '0 auto' }}>
      <div className="fu" style={{ marginBottom: 22 }}>
        <p style={{ color: C.muted, fontSize: 13 }}>{greeting} 👋</p>
        <h2 style={{ fontFamily: F.display, fontSize: 34, lineHeight: 1.2, marginTop: 2 }}>
          Hey, <span style={{ color: C.rose }}>{profile.name}</span>
        </h2>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          {insights.map((insight, i) => {
            const bgColor = insight.type === 'achievement' ? C.greenLight :
              insight.type === 'warning' ? '#FFF4E6' :
              insight.type === 'tip' ? '#E8F5FF' :
              C.roseLight;
            const textColor = insight.type === 'achievement' ? C.green :
              insight.type === 'warning' ? '#D97706' :
              insight.type === 'tip' ? '#1E40AF' :
              C.roseDark;

            return (
              <div
                key={i}
                style={{
                  background: bgColor,
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{insight.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: textColor, marginBottom: 2 }}>
                      {insight.title}
                    </p>
                    <p style={{ fontSize: 12, color: textColor, lineHeight: 1.5 }}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="fu1"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}
      >
        {[
          { val: stats.currentStreak ? `🔥 ${stats.currentStreak}` : '0', label: 'Day streak' },
          { val: String(stats.totalWorkouts), label: 'Workouts done' },
          { val: profile.frequency?.split(' ')[0], label: 'Per week' },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background:
                i === 0 ? `linear-gradient(135deg,${C.rose},${C.peach})` : C.surface,
              borderRadius: 14,
              padding: '14px 10px',
              border: `1.5px solid ${i === 0 ? 'transparent' : C.border}`,
              textAlign: 'center',
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 18, color: i === 0 ? '#fff' : C.text }}>
              {s.val}
            </p>
            <p
              style={{
                fontSize: 11,
                color: i === 0 ? 'rgba(255,255,255,0.8)' : C.muted,
                marginTop: 2,
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="fu2"
        style={{
          background: C.surface,
          borderRadius: 16,
          padding: '15px 18px',
          border: `1.5px solid ${C.border}`,
          marginBottom: 18,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: C.muted,
            marginBottom: 9,
          }}
        >
          Your goals
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {BODY_GOALS.filter(g => profile.goals.includes(g.id)).map(g => (
            <span
              key={g.id}
              style={{
                background: C.roseLight,
                color: C.roseDark,
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
              }}
            >
              {g.icon} {g.label}
            </span>
          ))}
          {profile.areas?.length > 0 &&
            PROBLEM_AREAS.filter(a => profile.areas.includes(a.id))
              .slice(0, 3)
              .map(a => (
                <span
                  key={a.id}
                  style={{
                    background: C.greenLight,
                    color: C.green,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 20,
                  }}
                >
                  {a.icon} {a.label}
                </span>
              ))}
        </div>
      </div>

      {/* Plan card */}
      <div
        className="fu3"
        style={{ background: C.dark, borderRadius: 18, overflow: 'hidden', marginBottom: 18 }}
      >
        {generating ? (
          <div style={{ padding: '32px 20px' }}>
            <Spinner label="Building your plan..." />
          </div>
        ) : !plan ? (
          <div style={{ padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>✨</div>
            <h3 style={{ fontFamily: F.display, fontSize: 22, color: '#fff', marginBottom: 6 }}>
              Ready for your plan?
            </h3>
            <p
              style={{
                color: '#aaa',
                fontSize: 14,
                marginBottom: 18,
                lineHeight: 1.65,
              }}
            >
              Lola will build a personalized {profile.frequency} workout plan based on everything you shared.
            </p>
            <button
              onClick={onGeneratePlan}
              style={{
                background: `linear-gradient(135deg,${C.rose},${C.peach})`,
                border: 'none',
                borderRadius: 14,
                padding: '14px 28px',
                fontFamily: F.body,
                fontWeight: 700,
                fontSize: 15,
                color: '#fff',
                cursor: 'pointer',
                boxShadow: `0 8px 24px rgba(232,130,106,0.4)`,
              }}
            >
              Generate My Plan ✨
            </button>
          </div>
        ) : (
          <div>
            <div style={{ padding: '20px 20px 0' }}>
              <p
                style={{
                  color: '#888',
                  fontSize: 11,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Today's Workout
              </p>
              <h3 style={{ fontFamily: F.display, fontSize: 22, color: '#fff' }}>
                {plan.days?.[0]?.title}
              </h3>
              <p style={{ color: '#aaa', fontSize: 13, marginTop: 3 }}>
                {plan.days?.[0]?.tagline}
              </p>
            </div>
            <div style={{ padding: '14px 20px' }}>
              {plan.days?.[0]?.exercises?.slice(0, 3).map((ex, i) => (
                <p
                  key={i}
                  style={{
                    color: '#ccc',
                    fontSize: 13,
                    padding: '5px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span style={{ color: C.peach, marginRight: 8 }}>◆</span>
                  {ex.name} — {ex.sets}×{ex.reps}
                </p>
              ))}
              {(plan.days?.[0]?.exercises?.length || 0) > 3 && (
                <p style={{ color: '#666', fontSize: 12, marginTop: 6 }}>
                  +{plan.days[0].exercises.length - 3} more exercises
                </p>
              )}
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
              <button
                onClick={() => setTab('My Plan')}
                style={{
                  flex: 2,
                  background: `linear-gradient(135deg,${C.rose},${C.peach})`,
                  border: 'none',
                  borderRadius: 12,
                  padding: '13px',
                  fontFamily: F.body,
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                View Full Plan →
              </button>
              <button
                onClick={onGeneratePlan}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: '13px',
                  fontFamily: F.body,
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#aaa',
                  cursor: 'pointer',
                }}
              >
                Refresh ↺
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="fu4"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
      >
        {[
          { icon: '💬', label: 'Chat with Lola', sub: 'Ask anything', action: () => setTab('Chat') },
          { icon: '📹', label: 'Watch Videos', sub: 'Form & tutorials' },
          { icon: '📖', label: 'Read Articles', sub: 'Tips & nutrition' },
          { icon: '📞', label: 'FaceTime Check-in', sub: 'Accountability' },
        ].map((a, i) => (
          <div
            key={i}
            onClick={a.action}
            style={{
              background: C.surface,
              borderRadius: 14,
              padding: '15px',
              border: `1.5px solid ${C.border}`,
              cursor: 'pointer',
            }}
          >
            <p style={{ fontSize: 22, marginBottom: 5 }}>{a.icon}</p>
            <p style={{ fontWeight: 700, fontSize: 13 }}>{a.label}</p>
            <p style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{a.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}