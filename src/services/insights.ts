import { callLLM } from './llm';
import type { Profile, Plan } from '../types';
import type { WorkoutStats } from './workoutTracking';
import { BODY_GOALS, PROBLEM_AREAS, EQUIPMENT_OPTIONS } from '../types';

export interface WorkoutInsight {
  type: 'motivation' | 'tip' | 'warning' | 'achievement';
  title: string;
  message: string;
  icon: string;
}

/**
 * Generate personalized workout insights using AI
 */
export async function generateInsights(
  profile: Profile,
  plan: Plan | null,
  stats: WorkoutStats
): Promise<WorkoutInsight[]> {
  const systemPrompt = `You are Lola, a knowledgeable and motivating fitness coach. Generate 2-3 personalized workout insights based on the user's progress and profile. Each insight should be concise (1-2 sentences).

Return a JSON array of insights with this structure:
[
  {
    "type": "motivation" | "tip" | "warning" | "achievement",
    "title": "Brief title (3-5 words)",
    "message": "Concise insight message (1-2 sentences)",
    "icon": "appropriate emoji"
  }
]

Types:
- motivation: Encouraging messages to keep going
- tip: Practical advice to improve workouts
- warning: Gentle reminders about rest, form, or recovery
- achievement: Celebrate milestones and progress

Focus on being warm, specific to their data, and actionable.`;

  const userMessage = `Profile:
- Name: ${profile.name}
- Goals: ${BODY_GOALS.filter(g => profile.goals.includes(g.id)).map(g => g.label).join(', ')}
- Focus areas: ${PROBLEM_AREAS.filter(a => profile.areas.includes(a.id)).map(a => a.label).join(', ') || 'Full body'}
- Equipment: ${EQUIPMENT_OPTIONS.filter(e => profile.equipment.includes(e.id)).map(e => e.label).join(', ')}
- Level: ${profile.level}

Progress:
- Total workouts: ${stats.totalWorkouts}
- Current streak: ${stats.currentStreak} days
- Longest streak: ${stats.longestStreak} days
- Avg session: ${stats.avgDuration || 0} min
- This week: ${stats.weeklyCompletion.filter(d => d).length}/7 days completed
${plan ? `- Has active ${plan.days?.length}-day workout plan` : '- No active plan yet'}

Generate 2-3 personalized insights based on this data. Be specific and encouraging!`;

  try {
    const response = await callLLM(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      'deepseek'
    );

    const insights = JSON.parse(response);

    // Validate and return
    if (Array.isArray(insights) && insights.length > 0) {
      return insights.slice(0, 3);
    }

    // Fallback insights
    return getDefaultInsights(stats, profile);
  } catch (error) {
    console.error('Failed to generate insights:', error);
    return getDefaultInsights(stats, profile);
  }
}

/**
 * Fallback insights when AI fails
 */
function getDefaultInsights(stats: WorkoutStats, profile: Profile): WorkoutInsight[] {
  const insights: WorkoutInsight[] = [];

  // Streak insights
  if (stats.currentStreak >= 7) {
    insights.push({
      type: 'achievement',
      title: 'Amazing streak!',
      message: `${stats.currentStreak} days strong! You're building incredible consistency, ${profile.name}.`,
      icon: '🔥',
    });
  } else if (stats.currentStreak >= 3) {
    insights.push({
      type: 'motivation',
      title: 'Keep it going!',
      message: `${stats.currentStreak} days in a row! Every workout counts toward your goals.`,
      icon: '💪',
    });
  } else if (stats.totalWorkouts === 0) {
    insights.push({
      type: 'motivation',
      title: 'Start your journey!',
      message: 'Your first workout is the hardest and most important. You\'ve got this!',
      icon: '🌟',
    });
  }

  // Weekly completion
  const weeklyDays = stats.weeklyCompletion.filter(d => d).length;
  if (weeklyDays >= 4) {
    insights.push({
      type: 'achievement',
      title: 'Crushing it this week!',
      message: `${weeklyDays} workouts this week! Your dedication is inspiring.`,
      icon: '✨',
    });
  } else if (weeklyDays >= 2) {
    insights.push({
      type: 'tip',
      title: 'One more workout',
      message: 'Try to hit one more session this week to build momentum!',
      icon: '🎯',
    });
  }

  // Rest reminder
  if (stats.currentStreak >= 5) {
    insights.push({
      type: 'warning',
      title: 'Rest is important',
      message: 'Remember to listen to your body. Rest days help you come back stronger!',
      icon: '🧘‍♀️',
    });
  }

  return insights.slice(0, 3);
}

/**
 * Get a quick motivational message
 */
export async function getMotivationalMessage(profile: Profile): Promise<string> {
  const systemPrompt = `You are Lola, a warm and motivating fitness coach. Generate a single short motivational message (1 sentence, max 15 words) for ${profile.name}. Be encouraging, specific to fitness, and uplifting.`;

  try {
    const response = await callLLM(
      [{ role: 'user', content: `Generate a motivational message for my workout today.` }],
      systemPrompt,
      'deepseek'
    );
    return response.trim().replace(/['"]/g, '');
  } catch (error) {
    const messages = [
      "You're stronger than you think!",
      "Every workout brings you closer to your goals!",
      "Your future self will thank you for showing up today!",
      "Progress, not perfection. You've got this!",
      "The only bad workout is the one you didn't do!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
