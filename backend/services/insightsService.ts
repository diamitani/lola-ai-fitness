/**
 * Insights Service - Generate AI-powered progress insights and achievements
 */

import { callLLM, type LLMMessage } from './llm';

export interface ProgressData {
  userId: string;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  weeklyCompletionRate: number; // 0-100
  monthlyCompletionRate: number;
  recentWorkouts: Array<{
    date: string;
    type: string;
    duration: number;
    completed: boolean;
  }>;
  personalRecords?: Array<{
    exercise: string;
    value: number | string;
    date: string;
    type: 'reps' | 'weight' | 'duration';
  }>;
  lastWorkoutDate?: string;
}

export interface Insight {
  insightType: 'achievement' | 'tip' | 'warning' | 'recommendation';
  title: string;
  message: string;
  data?: Record<string, any>;
  action?: string;
  celebrationLevel?: 'milestone' | 'personal-record' | 'consistency' | 'improvement';
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
}

/**
 * Analyze progress and generate insights using AI
 */
export async function generateProgressInsights(progressData: ProgressData): Promise<Insight[]> {
  console.log('Generating insights for user:', progressData.userId);

  // First, run rule-based insights (fast, guaranteed)
  const ruleBasedInsights = generateRuleBasedInsights(progressData);

  // Then, try to enhance with AI-generated insights
  try {
    const aiInsight = await generateAIInsight(progressData);
    if (aiInsight) {
      return [aiInsight, ...ruleBasedInsights];
    }
  } catch (error) {
    console.error('AI insight generation failed, using rule-based only:', error);
  }

  return ruleBasedInsights;
}

/**
 * Generate rule-based insights (deterministic, fast)
 */
function generateRuleBasedInsights(progressData: ProgressData): Insight[] {
  const insights: Insight[] = [];

  // Streak achievements
  if (progressData.currentStreak >= 7) {
    insights.push({
      insightType: 'achievement',
      title: `${progressData.currentStreak}-Day Streak! 🔥`,
      message: `You've completed ${progressData.currentStreak} consecutive workout days! Consistency like this is what builds real, lasting results. Keep this momentum going!`,
      data: {
        currentStreak: progressData.currentStreak,
        longestStreak: progressData.longestStreak,
      },
      celebrationLevel: progressData.currentStreak >= 14 ? 'milestone' : 'consistency',
      priority: 'high',
      timestamp: new Date(),
    });
  }

  // New personal record
  if (progressData.personalRecords && progressData.personalRecords.length > 0) {
    const latestPR = progressData.personalRecords[0]; // Assumes sorted by date desc
    const prDate = new Date(latestPR.date);
    const daysSincePR = Math.floor((Date.now() - prDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSincePR <= 1) {
      insights.push({
        insightType: 'achievement',
        title: `New Personal Record: ${latestPR.exercise}! 🎉`,
        message: `You just hit ${latestPR.value} ${latestPR.type === 'reps' ? 'reps' : latestPR.type === 'weight' ? 'lbs' : 'seconds'} on ${latestPR.exercise}—that's a new PR! Your hard work is paying off. Progressive overload in action!`,
        data: { personalRecord: latestPR },
        celebrationLevel: 'personal-record',
        priority: 'high',
        timestamp: new Date(),
      });
    }
  }

  // High weekly completion
  if (progressData.weeklyCompletionRate >= 85) {
    insights.push({
      insightType: 'achievement',
      title: `${Math.round(progressData.weeklyCompletionRate)}% Weekly Completion!`,
      message: `You completed ${Math.round(progressData.weeklyCompletionRate)}% of your planned workouts this week. That's outstanding consistency! Results are built one workout at a time, and you're nailing it.`,
      data: { weeklyCompletion: progressData.weeklyCompletionRate },
      celebrationLevel: 'consistency',
      priority: 'medium',
      timestamp: new Date(),
    });
  }

  // Low weekly completion (warning)
  if (progressData.weeklyCompletionRate < 50 && progressData.totalWorkouts > 5) {
    insights.push({
      insightType: 'warning',
      title: 'Missing Workouts This Week',
      message: `Life gets busy—I get it! You've completed ${Math.round(progressData.weeklyCompletionRate)}% of planned workouts this week. Remember: even a short 20-minute workout is better than none. What's one small step you can take today to get back on track?`,
      data: { weeklyCompletion: progressData.weeklyCompletionRate },
      action: 'Schedule a short workout today—even 15 minutes counts!',
      priority: 'medium',
      timestamp: new Date(),
    });
  }

  // Streak about to break
  if (progressData.lastWorkoutDate) {
    const daysSinceLastWorkout = Math.floor(
      (Date.now() - new Date(progressData.lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastWorkout >= 2 && progressData.currentStreak >= 5) {
      insights.push({
        insightType: 'recommendation',
        title: 'Keep Your Streak Alive!',
        message: `You've got a ${progressData.currentStreak}-day streak going, but it's been ${daysSinceLastWorkout} days since your last workout. Don't let that hard-earned consistency slip away—knock out a quick session today!`,
        data: {
          currentStreak: progressData.currentStreak,
          daysSinceLastWorkout,
        },
        action: 'Do a quick 20-minute workout today to maintain your streak',
        priority: 'high',
        timestamp: new Date(),
      });
    }
  }

  // Milestone: total workouts
  const milestones = [10, 25, 50, 100, 150, 200];
  if (milestones.includes(progressData.totalWorkouts)) {
    insights.push({
      insightType: 'achievement',
      title: `${progressData.totalWorkouts} Workouts Completed! 🎊`,
      message: `You've officially completed ${progressData.totalWorkouts} workouts! That's ${progressData.totalWorkouts} times you showed up for yourself. Every single one counts. Celebrate this milestone—you've earned it!`,
      data: { totalWorkouts: progressData.totalWorkouts },
      celebrationLevel: 'milestone',
      priority: 'high',
      timestamp: new Date(),
    });
  }

  // Recovery reminder (if working out many days in a row)
  if (progressData.currentStreak >= 6) {
    insights.push({
      insightType: 'tip',
      title: 'Rest Day Reminder',
      message: `You've been crushing it with ${progressData.currentStreak} straight days of workouts! Remember: rest days are when your muscles recover and grow. Consider taking an active rest day (light walk, stretching) to prevent overtraining.`,
      data: { currentStreak: progressData.currentStreak },
      action: 'Schedule a rest or active recovery day this week',
      priority: 'medium',
      timestamp: new Date(),
    });
  }

  return insights;
}

/**
 * Generate AI-powered insight using LLM
 */
async function generateAIInsight(progressData: ProgressData): Promise<Insight | null> {
  const systemPrompt = `You are Lola, an AI fitness coach analyzing user progress data to generate a personalized insight.

User Progress Data:
- Total Workouts: ${progressData.totalWorkouts}
- Current Streak: ${progressData.currentStreak} days
- Longest Streak: ${progressData.longestStreak} days
- Weekly Completion: ${Math.round(progressData.weeklyCompletionRate)}%
- Monthly Completion: ${Math.round(progressData.monthlyCompletionRate)}%
${progressData.lastWorkoutDate ? `- Last Workout: ${progressData.lastWorkoutDate}` : ''}

Recent Workout Pattern (last 7 days):
${progressData.recentWorkouts.map(w => `- ${w.date}: ${w.type} (${w.duration}min) ${w.completed ? '✅' : '❌'}`).join('\n')}

${progressData.personalRecords ? `Personal Records:\n${progressData.personalRecords.slice(0, 3).map(pr => `- ${pr.exercise}: ${pr.value} ${pr.type} (${pr.date})`).join('\n')}` : ''}

Analyze this data and generate ONE personalized, actionable insight. Focus on:
1. Patterns you notice (consistency, improvement, areas for growth)
2. Specific achievements worth celebrating
3. Gentle guidance if there are concerning patterns
4. Motivation and encouragement

Return ONLY valid JSON in this format:
{
  "insightType": "achievement | tip | warning | recommendation",
  "title": "Short, catchy title",
  "message": "2-3 sentence personalized message that's warm and encouraging",
  "action": "One specific thing the user can do (optional)",
  "celebrationLevel": "milestone | personal-record | consistency | improvement (optional)",
  "priority": "high | medium | low"
}`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Analyze my progress and give me an insight.' },
  ];

  try {
    const response = await callLLM(messages, {
      maxTokens: 500,
      temperature: 0.8, // Slightly higher for more creative insights
      provider: 'auto',
    });

    const jsonMatch = response.content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : response.content;
    const insightData = JSON.parse(jsonContent.trim());

    return {
      ...insightData,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('AI insight generation failed:', error);
    return null;
  }
}

/**
 * Detect if user is plateauing
 */
export function detectPlateau(progressData: ProgressData): boolean {
  // Plateau indicators:
  // - No new PRs in last 3 weeks
  // - Same workout completion rate for 4+ weeks
  // - No missed workouts but no improvement

  if (!progressData.personalRecords || progressData.personalRecords.length === 0) {
    return false; // Not enough data
  }

  const lastPR = new Date(progressData.personalRecords[0].date);
  const daysSinceLastPR = Math.floor((Date.now() - lastPR.getTime()) / (1000 * 60 * 60 * 24));

  return daysSinceLastPR > 21 && progressData.totalWorkouts > 15;
}

/**
 * Generate plateau-breaking recommendations
 */
export function generatePlateauRecommendations(): Insight {
  return {
    insightType: 'recommendation',
    title: 'Time to Mix Things Up!',
    message: `I've noticed your progress has been steady, but it might be time to introduce new stimulus to keep growing. When your body adapts to the same routine, progress can slow. Let's shake things up!`,
    action: 'Try one of these: increase weight by 5-10%, add an extra set, try new exercise variations, or take a deload week',
    priority: 'high',
    timestamp: new Date(),
  };
}

/**
 * Get motivational message based on progress
 */
export function getMotivationalMessage(progressData: ProgressData): string {
  if (progressData.currentStreak >= 7) {
    return `You're on fire with that ${progressData.currentStreak}-day streak! Keep this momentum going! 🔥`;
  }

  if (progressData.weeklyCompletionRate >= 90) {
    return `Incredible consistency this week! You're showing up and putting in the work. That's how transformation happens! 💪`;
  }

  if (progressData.totalWorkouts >= 50) {
    return `${progressData.totalWorkouts} workouts completed—that's serious dedication! You're not just trying fitness, you're living it! 🌟`;
  }

  if (progressData.weeklyCompletionRate < 50) {
    return `Every workout counts, even if you miss a few. What matters is getting back on track. You've got this! 💙`;
  }

  return `Keep moving forward, one workout at a time. You're doing great! 💪`;
}
