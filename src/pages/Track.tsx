import { useState, useEffect } from 'react';
import { C, F } from '../theme';
import type { Profile } from '../types';
import { getWorkoutStats, type WorkoutStats } from '../services/workoutTracking';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/shared/Spinner';

interface TrackProps {
  profile: Profile;
}

export function Track({ profile }: TrackProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const workoutStats = await getWorkoutStats(user.uid);
        setStats(workoutStats);
      } catch (error) {
        console.error('Failed to load workout stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: '40px 0' }}>
        <Spinner label="Loading your progress..." />
      </div>
    );
  }

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const done = stats?.weeklyCompletion || Array(7).fill(false);

  return (
    <div style={{ padding: '22px 20px', maxWidth: 520, margin: '0 auto' }} className="fu">
      <h2 style={{ fontFamily: F.display, fontSize: 28, marginBottom: 4 }}>Progress</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>
        You're doing amazing, {profile.name}. 💪
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        {[
          {
            val: String(stats?.totalWorkouts || 0),
            label: 'Workouts',
            sub: 'all time',
            dark: true
          },
          {
            val: stats?.currentStreak ? `🔥 ${stats.currentStreak}` : '0',
            label: 'Day streak',
            sub: stats?.currentStreak ? 'keep going!' : 'start today!'
          },
          {
            val: stats?.avgDuration ? `${stats.avgDuration} min` : '--',
            label: 'Avg session',
            sub: 'per workout'
          },
          {
            val: String(stats?.personalRecords || 0),
            label: 'PRs this week',
            sub: 'new records!'
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: s.dark ? C.dark : C.surface,
              borderRadius: 14,
              padding: '18px 16px',
              border: `1.5px solid ${s.dark ? 'transparent' : C.border}`,
            }}
          >
            <p style={{ fontSize: 28, fontWeight: 700, color: s.dark ? C.peach : C.text }}>
              {s.val}
            </p>
            <p style={{ fontWeight: 700, fontSize: 13, color: s.dark ? '#fff' : C.text, marginTop: 2 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 11, color: s.dark ? '#888' : C.muted }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          background: C.surface,
          borderRadius: 16,
          padding: '18px',
          border: `1.5px solid ${C.border}`,
          marginBottom: 18,
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>This Week</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {days.map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: done[i]
                    ? `linear-gradient(135deg,${C.rose},${C.peach})`
                    : C.border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 5,
                }}
              >
                {done[i] && (
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <p style={{ fontSize: 11, color: C.muted }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: C.surface,
          borderRadius: 16,
          padding: '18px',
          border: `1.5px solid ${C.border}`,
          marginBottom: 18,
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Monthly Activity</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80 }}>
          {(stats?.monthlyActivity || Array(12).fill(0)).map((v, i) => {
            const maxVal = Math.max(...(stats?.monthlyActivity || [6]));
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: '100%',
                    background: i === 11 ? `linear-gradient(180deg,${C.rose},${C.peach})` : C.roseLight,
                    borderRadius: 4,
                    height: `${Math.max((v / maxVal) * 64, v > 0 ? 4 : 0)}px`,
                  }}
                />
                {i % 3 === 0 && <p style={{ fontSize: 9, color: C.muted }}>W{Math.floor(i / 3) + 1}</p>}
              </div>
            );
          })}
        </div>
      </div>
      {(stats?.recentSessions || []).length > 0 ? (
        <>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, marginTop: 4 }}>Recent Workouts</h3>
          {stats!.recentSessions.map((session, i, arr) => {
            const sessionDate = new Date(session.completedAt);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let dateLabel = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (sessionDate.toDateString() === today.toDateString()) {
              dateLabel = 'Today';
            } else if (sessionDate.toDateString() === yesterday.toDateString()) {
              dateLabel = 'Yesterday';
            }

            const emoji = ['🍑', '💪', '⚡', '🔥'][i % 4];

            return (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '13px 0',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: C.roseLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{session.dayTitle}</p>
                  <p style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>{dateLabel}</p>
                </div>
                <p style={{ color: C.muted, fontSize: 13 }}>
                  {session.duration ? `${session.duration} min` : `${session.exercises.length} ex`}
                </p>
              </div>
            );
          })}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🎯</p>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Start your journey!</p>
          <p style={{ color: C.muted, fontSize: 14 }}>Complete your first workout to see your progress here.</p>
        </div>
      )}
    </div>
  );
}
