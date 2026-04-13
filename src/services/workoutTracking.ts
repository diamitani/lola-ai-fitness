import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export interface WorkoutSession {
  id: string;
  date: string; // ISO date
  dayIndex: number;
  dayTitle: string;
  exercises: string[]; // Exercise names completed
  duration?: number; // minutes
  notes?: string;
  completedAt: string; // ISO timestamp
}

export interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  weeklyCompletion: boolean[]; // Last 7 days
  monthlyActivity: number[]; // Last 12 weeks
  recentSessions: WorkoutSession[];
  avgDuration: number;
  personalRecords: number; // This week
}

/**
 * Save a completed workout session
 */
export async function saveWorkoutSession(
  uid: string,
  session: Omit<WorkoutSession, 'id' | 'completedAt'>
): Promise<void> {
  const sessionWithTimestamp: WorkoutSession = {
    ...session,
    id: `${Date.now()}_${session.dayIndex}`,
    completedAt: new Date().toISOString(),
  };

  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    [`workoutHistory.${sessionWithTimestamp.id}`]: sessionWithTimestamp,
    lastWorkout: sessionWithTimestamp.completedAt,
  });
}

/**
 * Get workout statistics for a user
 */
export async function getWorkoutStats(uid: string): Promise<WorkoutStats> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const workoutHistory: Record<string, WorkoutSession> = userData?.workoutHistory || {};
  const sessions = Object.values(workoutHistory).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  // Calculate stats
  const totalWorkouts = sessions.length;
  const { currentStreak, longestStreak } = calculateStreaks(sessions);
  const weeklyCompletion = getWeeklyCompletion(sessions);
  const monthlyActivity = getMonthlyActivity(sessions);
  const recentSessions = sessions.slice(0, 4);
  const avgDuration = calculateAverageDuration(sessions);
  const personalRecords = countWeeklyPRs(sessions);

  return {
    totalWorkouts,
    currentStreak,
    longestStreak,
    weeklyCompletion,
    monthlyActivity,
    recentSessions,
    avgDuration,
    personalRecords,
  };
}

/**
 * Calculate current and longest streaks
 */
function calculateStreaks(sessions: WorkoutSession[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const dates = sessions.map(s => s.date).sort();
  const uniqueDates = Array.from(new Set(dates));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if last workout was today or yesterday
  const lastWorkoutDate = new Date(uniqueDates[uniqueDates.length - 1]);
  lastWorkoutDate.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 1) {
    currentStreak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const current = new Date(uniqueDates[i + 1]);
      const prev = new Date(uniqueDates[i]);
      const diff = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i]);
    const prev = new Date(uniqueDates[i - 1]);
    const diff = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

/**
 * Get workout completion for the last 7 days (M-Sun)
 */
function getWeeklyCompletion(sessions: WorkoutSession[]): boolean[] {
  const completion = Array(7).fill(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get Monday of current week
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day; // adjust when day is Sunday
  monday.setDate(monday.getDate() + diff);

  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((sessionDate.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 0 && daysDiff < 7) {
      completion[daysDiff] = true;
    }
  });

  return completion;
}

/**
 * Get workout count for the last 12 weeks
 */
function getMonthlyActivity(sessions: WorkoutSession[]): number[] {
  const activity = Array(12).fill(0);
  const today = new Date();

  sessions.forEach(session => {
    const sessionDate = new Date(session.completedAt);
    const weeksDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

    if (weeksDiff >= 0 && weeksDiff < 12) {
      activity[11 - weeksDiff]++;
    }
  });

  return activity;
}

/**
 * Calculate average workout duration
 */
function calculateAverageDuration(sessions: WorkoutSession[]): number {
  const sessionsWithDuration = sessions.filter(s => s.duration);
  if (sessionsWithDuration.length === 0) return 0;

  const total = sessionsWithDuration.reduce((sum, s) => sum + (s.duration || 0), 0);
  return Math.round(total / sessionsWithDuration.length);
}

/**
 * Count personal records this week (placeholder - can be enhanced)
 */
function countWeeklyPRs(sessions: WorkoutSession[]): number {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekSessions = sessions.filter(
    s => new Date(s.completedAt) >= weekAgo
  );

  // Simple heuristic: count unique exercises this week
  const uniqueExercises = new Set(
    thisWeekSessions.flatMap(s => s.exercises)
  );

  return Math.min(uniqueExercises.size, 5); // Cap at 5 for display
}

/**
 * Get today's workout date string (YYYY-MM-DD)
 */
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
