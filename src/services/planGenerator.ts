import { callLLM, extractJSON } from './llm';
import type { Profile, Plan } from '../types';
import { BODY_GOALS, PROBLEM_AREAS, EQUIPMENT_OPTIONS } from '../types';

export async function buildPlan(profile: Profile): Promise<Plan> {
  const goalLabels = BODY_GOALS.filter(g => profile.goals.includes(g.id)).map(g => g.label).join(', ');
  const areaLabels = PROBLEM_AREAS.filter(a => profile.areas.includes(a.id)).map(a => a.label).join(', ') || 'no specific areas';
  const equipLabels = EQUIPMENT_OPTIONS.filter(e => profile.equipment.includes(e.id)).map(e => e.label).join(', ');
  const freqNum = parseInt(profile.frequency) || 3;

  const prompt = `You are Lola, an expert female-focused personal trainer. Create a ${freqNum}-day weekly workout plan.

User profile:
- Name: ${profile.name}
- Goals: ${goalLabels}
- Focus areas (prioritize these): ${areaLabels}
- Available equipment ONLY: ${equipLabels}
- Environment: ${profile.environment}
- Frequency: ${profile.frequency}
- Fitness level: ${profile.level}
- Notes: ${profile.notes || 'none'}

CRITICAL RULES:
1. ONLY use exercises that require the listed equipment — nothing else
2. Prioritize the focus areas heavily
3. Tailor intensity to fitness level
4. Make it realistic and achievable
5. Include proper warmup and cooldown each day

Return ONLY a valid JSON object, no markdown, no explanation, just the raw JSON:
{
  "weekSummary": "2-sentence overview of why this plan fits her goals",
  "days": [
    {
      "dayLabel": "Day 1",
      "title": "Descriptive workout name",
      "tagline": "e.g. 40 min · Glutes & Core",
      "focus": "Primary muscle focus e.g. Lower Body",
      "warmup": ["5 min walk or march in place", "20 leg swings each side", "hip circles 30s"],
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": "12-15",
          "rest": "45s",
          "tip": "Short form tip"
        }
      ],
      "cooldown": ["Pigeon pose 60s each side", "Seated forward fold 60s"],
      "motivation": "One powerful motivating sentence for her today."
    }
  ]
}

Make exactly ${freqNum} workout days. Each day should have 5-7 exercises. Keep JSON valid.`;

  const text = await callLLM([{ role: 'user', content: prompt }], undefined, 'deepseek');
  return extractJSON(text);
}