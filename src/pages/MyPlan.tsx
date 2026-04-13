import { useState, useEffect } from 'react';
import { PrimaryBtn } from '../components/shared/PrimaryBtn';
import { Spinner } from '../components/shared/Spinner';
import { CheckCircle } from '../components/shared/CheckCircle';
import { Section } from '../components/shared/Section';
import { C, F } from '../theme';
import type { Profile, Plan } from '../types';
import { LEVELS } from '../types';
import { searchExerciseVideo, type YouTubeVideo } from '../services/youtube';
import { saveWorkoutSession, getTodayDateString } from '../services/workoutTracking';
import { useAuth } from '../contexts/AuthContext';
import { Video, Check } from 'lucide-react';

interface MyPlanProps {
  profile: Profile;
  plan: Plan | null;
  onGenerate: () => void;
  generating: boolean;
}

export function MyPlan({ profile, plan, onGenerate, generating }: MyPlanProps) {
  const { user } = useAuth();
  const [activeDay, setActiveDay] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [videos, setVideos] = useState<Record<string, YouTubeVideo | null>>({});
  const [loadingVideo, setLoadingVideo] = useState<string | null>(null);
  const [savingWorkout, setSavingWorkout] = useState(false);
  const [workoutSaved, setWorkoutSaved] = useState(false);

  // Load video for an exercise on demand
  const loadVideo = async (exerciseName: string) => {
    if (videos[exerciseName] || loadingVideo === exerciseName) return;
    setLoadingVideo(exerciseName);
    const video = await searchExerciseVideo(exerciseName);
    setVideos(prev => ({ ...prev, [exerciseName]: video }));
    setLoadingVideo(null);
  };

  // Save completed workout
  const finishWorkout = async () => {
    if (!user || !plan || !day) return;
    setSavingWorkout(true);
    try {
      const completedExercises = day.exercises
        .filter((_, i) => completed[`${activeDay}-${i}`])
        .map(ex => ex.name);

      await saveWorkoutSession(user.uid, {
        date: getTodayDateString(),
        dayIndex: activeDay,
        dayTitle: day.title,
        exercises: completedExercises,
        duration: undefined, // Can add duration tracking later
      });

      setWorkoutSaved(true);
      setTimeout(() => setWorkoutSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setSavingWorkout(false);
    }
  };

  if (generating) {
    return (
      <div style={{ padding: '40px 0' }}>
        <Spinner label="Building your plan..." />
      </div>
    );
  }

  if (!plan) {
    return (
      <div
        style={{ padding: '40px 24px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}
        className="fu"
      >
        <div
          style={{ fontSize: 56, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}
        >
          📋
        </div>
        <h2 style={{ fontFamily: F.display, fontSize: 28, marginBottom: 8 }}>No plan yet</h2>
        <p
          style={{
            color: C.muted,
            fontSize: 15,
            marginBottom: 28,
            lineHeight: 1.65,
          }}
        >
          Lola will create a complete weekly workout plan tailored exactly to your goals and equipment.
        </p>
        <PrimaryBtn onClick={onGenerate}>Build My Plan ✨</PrimaryBtn>
      </div>
    );
  }

  const day = plan.days?.[activeDay];
  const totalEx = day?.exercises?.length || 0;
  const doneCount = Object.entries(completed).filter(
    ([k, v]) => k.startsWith(`${activeDay}-`) && v
  ).length;

  return (
    <div style={{ padding: '22px 20px', maxWidth: 520, margin: '0 auto' }} className="fu">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: 28 }}>Your Plan</h2>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>
            {profile.frequency} · {LEVELS.find(l => l.id === profile.level)?.label}
          </p>
        </div>
        <button
          onClick={onGenerate}
          style={{
            background: C.roseLight,
            border: 'none',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 700,
            color: C.roseDark,
            cursor: 'pointer',
            fontFamily: F.body,
          }}
        >
          Refresh ↺
        </button>
      </div>

      {plan.weekSummary && (
        <div
          style={{
            background: C.roseLight,
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 18,
            fontSize: 14,
            color: C.roseDark,
            lineHeight: 1.6,
          }}
        >
          💡 {plan.weekSummary}
        </div>
      )}

      {/* Day tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          marginBottom: 18,
        }}
      >
        {(plan.days || []).map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 22,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: F.body,
              transition: 'all 0.15s',
              background: activeDay === i ? C.rose : C.surface,
              color: activeDay === i ? '#fff' : C.text,
              border: `2px solid ${activeDay === i ? C.rose : C.border}`,
            }}
          >
            {d.dayLabel || `Day ${i + 1}`}
          </button>
        ))}
      </div>

      {day && (
        <>
          {/* Day header */}
          <div
            style={{
              background: `linear-gradient(135deg,${C.dark} 60%,#3D2518)`,
              borderRadius: 18,
              padding: '20px',
              marginBottom: 16,
              color: '#fff',
            }}
          >
            <p
              style={{
                color: C.peach,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              {day.focus}
            </p>
            <h3 style={{ fontFamily: F.display, fontSize: 22 }}>{day.title}</h3>
            <p style={{ color: '#aaa', fontSize: 13, marginTop: 3 }}>{day.tagline}</p>
            {totalEx > 0 && (
              <>
                <div
                  style={{
                    marginTop: 14,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    height: 5,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg,${C.rose},${C.peach})`,
                      borderRadius: 8,
                      width: `${(doneCount / totalEx) * 100}%`,
                      transition: 'width 0.4s',
                    }}
                  />
                </div>
                <p style={{ color: '#aaa', fontSize: 11, marginTop: 5 }}>
                  {doneCount}/{totalEx} exercises done
                </p>
              </>
            )}
          </div>

          {/* Warmup */}
          {day.warmup?.length > 0 && (
            <Section label="🔥 Warm-up">
              {day.warmup.map((w, i) => (
                <div
                  key={i}
                  style={{
                    background: C.cream,
                    borderRadius: 10,
                    padding: '10px 14px',
                    marginBottom: 7,
                    fontSize: 14,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {w}
                </div>
              ))}
            </Section>
          )}

          {/* Exercises */}
          {day.exercises?.length > 0 && (
            <Section label="💪 Exercises">
              {day.exercises.map((ex, i) => {
                const key = `${activeDay}-${i}`;
                const done = !!completed[key];
                return (
                  <div
                    key={i}
                    onClick={() => setCompleted(c => ({ ...c, [key]: !done }))}
                    style={{
                      background: done ? C.greenLight : C.surface,
                      border: `2px solid ${done ? C.green : C.border}`,
                      borderRadius: 14,
                      padding: '14px 16px',
                      marginBottom: 10,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            textDecoration: done ? 'line-through' : 'none',
                            color: done ? C.muted : C.text,
                          }}
                        >
                          {ex.name}
                        </p>
                        <p style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
                          {ex.sets} sets · {ex.reps} reps · {ex.rest} rest
                        </p>
                        {ex.tip && (
                          <p
                            style={{
                              fontSize: 12,
                              color: C.green,
                              marginTop: 5,
                              fontStyle: 'italic',
                            }}
                          >
                            💡 {ex.tip}
                          </p>
                        )}
                      </div>
                      <CheckCircle done={done} />
                    </div>
                    {/* Video tutorial link */}
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                      {videos[ex.name] ? (
                        <a
                          href={videos[ex.name]!.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            color: C.rose,
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          <Video size={14} />
                          Watch tutorial on YouTube
                        </a>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadVideo(ex.name);
                          }}
                          disabled={loadingVideo === ex.name}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            color: loadingVideo === ex.name ? C.muted : C.rose,
                            background: 'none',
                            border: 'none',
                            cursor: loadingVideo === ex.name ? 'default' : 'pointer',
                            fontWeight: 600,
                            fontFamily: F.body,
                            padding: 0,
                          }}
                        >
                          <Video size={14} />
                          {loadingVideo === ex.name ? 'Loading...' : 'Find video tutorial'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </Section>
          )}

          {/* Cooldown */}
          {day.cooldown?.length > 0 && (
            <Section label="🧘‍♀️ Cool-down">
              {day.cooldown.map((w, i) => (
                <div
                  key={i}
                  style={{
                    background: C.cream,
                    borderRadius: 10,
                    padding: '10px 14px',
                    marginBottom: 7,
                    fontSize: 14,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {w}
                </div>
              ))}
            </Section>
          )}

          {/* Finish Workout Button */}
          {doneCount > 0 && (
            <div style={{ marginTop: 18, marginBottom: 18 }}>
              <PrimaryBtn
                onClick={finishWorkout}
                disabled={savingWorkout || workoutSaved}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: workoutSaved
                    ? C.green
                    : `linear-gradient(135deg,${C.rose},${C.peach})`,
                }}
              >
                {savingWorkout ? (
                  'Saving...'
                ) : workoutSaved ? (
                  <>
                    <Check size={18} />
                    Workout Saved!
                  </>
                ) : (
                  `Finish Workout (${doneCount}/${totalEx})`
                )}
              </PrimaryBtn>
            </div>
          )}

          {/* Motivation */}
          {day.motivation && (
            <div
              style={{
                background: `linear-gradient(135deg,${C.rose},${C.peach})`,
                borderRadius: 14,
                padding: '18px 20px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: F.display,
                  fontSize: 17,
                  color: '#fff',
                  fontStyle: 'italic',
                  lineHeight: 1.55,
                }}
              >
                "{day.motivation}"
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}