/**
 * Workout Plan Generator Service
 * Uses LLM to create personalized workout plans based on user profile
 */

import { callLLM, type LLMMessage } from './llm';

export interface UserProfile {
  goals: string[];
  equipment: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutsPerWeek: number;
  timePerWorkout: string;
  preferences?: {
    avoidExercises?: string[];
    preferredStyles?: string[];
    injuries?: string[];
  };
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  equipment: string;
  muscleGroup: string;
  notes: string;
  videoSearchQuery: string;
  alternatives: string[];
}

export interface WorkoutDay {
  day: string;
  focus: string;
  totalTime: string;
  warmup: {
    duration: string;
    exercises: string[];
    notes: string;
  };
  exercises: Exercise[];
  cooldown: {
    duration: string;
    exercises: string[];
    notes: string;
  };
  motivation: string;
}

export interface WorkoutPlan {
  weekId: string;
  planName: string;
  summary: string;
  workouts: WorkoutDay[];
  weeklyTips: string[];
  recoveryNotes: string;
}

/**
 * Build system prompt for workout plan generation
 */
function buildPlanGenerationPrompt(profile: UserProfile): string {
  return `You are Lola, an AI fitness coach. Generate a personalized workout plan.

User Profile:
- Goals: ${profile.goals.join(', ')}
- Equipment: ${profile.equipment.join(', ')}
- Experience: ${profile.experienceLevel}
- Frequency: ${profile.workoutsPerWeek}x per week
- Time per workout: ${profile.timePerWorkout}
${profile.preferences?.injuries ? `- Injuries/Limitations: ${profile.preferences.injuries.join(', ')}` : ''}
${profile.preferences?.avoidExercises ? `- Avoid: ${profile.preferences.avoidExercises.join(', ')}` : ''}

Generate a weekly workout plan following these guidelines:

1. **Safety First**: Match intensity to experience level, include proper warmup/cooldown
2. **Equipment Adaptation**: Only use exercises that work with available equipment
3. **Progressive Overload**: Plan should allow for gradual progression
4. **Muscle Balance**: Ensure balanced muscle group coverage
5. **Recovery**: Include rest days based on frequency

Return ONLY valid JSON in this exact format:
{
  "planName": "Descriptive plan name",
  "summary": "Brief overview of the week's focus",
  "workouts": [
    {
      "day": "Monday",
      "focus": "Full Body / Upper / Lower / etc",
      "totalTime": "45 min",
      "warmup": {
        "duration": "5-10 min",
        "exercises": ["Exercise 1", "Exercise 2"],
        "notes": "Warmup guidance"
      },
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "rest": "60 seconds",
          "equipment": "Dumbbells",
          "muscleGroup": "Chest, Triceps",
          "notes": "Form cues and safety tips",
          "videoSearchQuery": "dumbbell bench press proper form",
          "alternatives": ["Easier: Push-ups on knees", "Harder: Decline push-ups"]
        }
      ],
      "cooldown": {
        "duration": "5 min",
        "exercises": ["Stretch 1", "Stretch 2"],
        "notes": "Cooldown guidance"
      },
      "motivation": "Encouraging message"
    }
  ],
  "weeklyTips": ["Tip 1", "Tip 2", "Tip 3"],
  "recoveryNotes": "Rest day guidance"
}

Make it specific, actionable, and motivating!`;
}

/**
 * Generate a personalized workout plan
 */
export async function generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
  console.log('Generating workout plan for:', profile);

  const systemPrompt = buildPlanGenerationPrompt(profile);

  const messages: LLMMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: 'Generate my personalized workout plan now.',
    },
  ];

  try {
    const response = await callLLM(messages, {
      maxTokens: 2500,
      temperature: 0.7,
      provider: 'auto', // Let LLM service choose best provider
    });

    console.log('LLM Provider used:', response.provider);
    console.log('Token usage:', response.usage);

    // Parse JSON response
    let planData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : response.content;
      planData = JSON.parse(jsonContent.trim());
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError);
      throw new Error('Invalid workout plan format received from AI');
    }

    // Add week ID and return
    const weekId = `week-${new Date().toISOString().split('T')[0]}`;

    return {
      weekId,
      ...planData,
    };
  } catch (error) {
    console.error('Workout plan generation failed:', error);

    // Fallback: return a basic template plan
    return generateFallbackPlan(profile);
  }
}

/**
 * Generate a fallback workout plan when LLM is unavailable
 */
function generateFallbackPlan(profile: UserProfile): WorkoutPlan {
  const isBeginnerWeek = profile.experienceLevel === 'beginner';
  const hasWeights = profile.equipment.some(e => e.toLowerCase().includes('dumbbell'));

  const workouts: WorkoutDay[] = [];

  // Generate simple full-body workouts
  const days = ['Monday', 'Wednesday', 'Friday'].slice(0, profile.workoutsPerWeek);

  days.forEach((day, index) => {
    workouts.push({
      day,
      focus: 'Full Body',
      totalTime: profile.timePerWorkout,
      warmup: {
        duration: '5 min',
        exercises: ['Jumping jacks', 'Arm circles', 'Bodyweight squats'],
        notes: 'Start slowly, gradually increase intensity',
      },
      exercises: [
        {
          name: hasWeights ? 'Goblet Squats' : 'Bodyweight Squats',
          sets: isBeginnerWeek ? 2 : 3,
          reps: '10-12',
          rest: '60 seconds',
          equipment: hasWeights ? 'Dumbbell' : 'Bodyweight',
          muscleGroup: 'Legs, Glutes',
          notes: 'Keep chest up, push through heels',
          videoSearchQuery: hasWeights ? 'goblet squat form' : 'bodyweight squat form',
          alternatives: ['Easier: Chair squats', 'Harder: Jump squats'],
        },
        {
          name: 'Push-Ups',
          sets: isBeginnerWeek ? 2 : 3,
          reps: '8-10',
          rest: '60 seconds',
          equipment: 'Bodyweight',
          muscleGroup: 'Chest, Triceps, Shoulders',
          notes: 'Hands shoulder-width, full range of motion',
          videoSearchQuery: 'push up proper form',
          alternatives: ['Easier: Knee push-ups', 'Harder: Diamond push-ups'],
        },
        {
          name: hasWeights ? 'Dumbbell Rows' : 'Inverted Rows',
          sets: isBeginnerWeek ? 2 : 3,
          reps: '10-12',
          rest: '60 seconds',
          equipment: hasWeights ? 'Dumbbell' : 'Bodyweight',
          muscleGroup: 'Back, Biceps',
          notes: 'Pull elbow to ceiling, squeeze shoulder blade',
          videoSearchQuery: hasWeights ? 'dumbbell row form' : 'inverted row form',
          alternatives: ['Easier: Resistance band rows', 'Harder: Single-arm rows'],
        },
        {
          name: 'Plank',
          sets: isBeginnerWeek ? 2 : 3,
          reps: '30-45 seconds',
          rest: '45 seconds',
          equipment: 'Bodyweight',
          muscleGroup: 'Core',
          notes: 'Straight line from head to heels, engage core',
          videoSearchQuery: 'plank exercise proper form',
          alternatives: ['Easier: Knee plank', 'Harder: Plank with leg lift'],
        },
      ],
      cooldown: {
        duration: '5 min',
        exercises: ['Hamstring stretch', 'Quad stretch', 'Chest stretch'],
        notes: 'Hold each stretch 20-30 seconds, breathe deeply',
      },
      motivation: `Great work today! Focus on form and enjoy the movement.`,
    });
  });

  return {
    weekId: `week-${new Date().toISOString().split('T')[0]}`,
    planName: `${profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)} Full Body Plan`,
    summary: `${profile.workoutsPerWeek}x per week full-body workouts focusing on ${profile.goals[0] || 'general fitness'}`,
    workouts,
    weeklyTips: [
      'Stay consistent - showing up is half the battle',
      'Focus on form over weight or speed',
      'Rest days are when your muscles grow',
    ],
    recoveryNotes: 'Take rest days seriously. Light walking or stretching is great active recovery.',
  };
}

/**
 * Adapt existing plan to new equipment or constraints
 */
export async function adaptWorkoutPlan(
  existingPlan: WorkoutPlan,
  newConstraints: Partial<UserProfile>
): Promise<WorkoutPlan> {
  const systemPrompt = `You are Lola, an AI fitness coach. Adapt the following workout plan to new constraints.

New Constraints:
${newConstraints.equipment ? `- Equipment: ${newConstraints.equipment.join(', ')}` : ''}
${newConstraints.timePerWorkout ? `- Time per workout: ${newConstraints.timePerWorkout}` : ''}
${newConstraints.preferences?.injuries ? `- Injuries: ${newConstraints.preferences.injuries.join(', ')}` : ''}

Original Plan:
${JSON.stringify(existingPlan, null, 2)}

Modify the plan to accommodate the new constraints while maintaining the overall structure and goals. Return the adapted plan in the same JSON format.`;

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Adapt the plan now.' },
  ];

  try {
    const response = await callLLM(messages, { maxTokens: 2500 });

    const jsonMatch = response.content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : response.content;
    const adaptedPlan = JSON.parse(jsonContent.trim());

    return {
      weekId: `week-${new Date().toISOString().split('T')[0]}-adapted`,
      ...adaptedPlan,
    };
  } catch (error) {
    console.error('Plan adaptation failed:', error);
    return existingPlan; // Return original plan if adaptation fails
  }
}
