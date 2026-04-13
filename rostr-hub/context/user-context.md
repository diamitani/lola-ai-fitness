# User Context Template

This file tracks user-specific context that Lola maintains across sessions.

---

## User Profile

**User ID**: `{userId}`  
**Name**: `{userName}`  
**Joined**: `{joinDate}`

### Goals

Primary Goal: `{e.g., lose fat, build muscle, improve endurance, tone up}`  
Secondary Goals: `{list}`  
Timeline: `{e.g., 3 months, 6 months, ongoing}`

### Physical Profile

- **Experience Level**: `beginner | intermediate | advanced`
- **Current Fitness Level**: `{self-reported or assessed}`
- **Age Range**: `{optional, for exercise adaptation}`
- **Injuries/Limitations**: `{list any reported injuries or physical constraints}`

### Equipment Available

- [ ] Bodyweight only
- [ ] Dumbbells (weight range: ___)
- [ ] Resistance Bands
- [ ] Barbell + Weights
- [ ] Pull-up Bar
- [ ] Bench
- [ ] Gym Access (full equipment)
- [ ] Other: ___

### Training Preferences

- **Workouts Per Week**: `{e.g., 3-4}`
- **Time Per Workout**: `{e.g., 30-45 minutes}`
- **Preferred Training Style**: `{strength, HIIT, bodyweight, mixed}`
- **Environment**: `{home, gym, outdoor}`
- **Music/Motivation Preferences**: `{if provided}`

---

## Current State

**Active Workout Plan**: `{plan ID or "none"}`  
**Plan Start Date**: `{date}`  
**Current Week**: `{week number in plan}`  
**Last Workout**: `{date and type}`

### Progress Metrics

- **Current Streak**: `{X days}`
- **Longest Streak**: `{X days}`
- **Total Workouts Completed**: `{count}`
- **Weekly Completion Rate**: `{percentage}`

### Personal Records

| Exercise | Record | Date Achieved |
|----------|--------|---------------|
| Push-ups | 15 reps | 2026-04-12 |
| Squats | 20 reps @ 25 lbs | 2026-04-10 |
| ___ | ___ | ___ |

---

## Conversation Context

**Recent Topics Discussed**:
- `{topic 1}` (discussed on {date})
- `{topic 2}` (discussed on {date})

**Recurring Questions**:
- `{pattern if user asks similar questions}`

**Preferences Learned**:
- User prefers `{specific exercises or styles}`
- User dislikes `{exercises to avoid or minimize}`
- User responds well to `{type of motivation}`

---

## Insights & Patterns

**Strengths**:
- `{e.g., consistent with lower body workouts}`
- `{e.g., strong cardiovascular base}`

**Areas for Growth**:
- `{e.g., needs more upper body work}`
- `{e.g., could improve flexibility}`

**Behavioral Patterns**:
- `{e.g., tends to skip rest days}`
- `{e.g., more consistent on weekday mornings}`
- `{e.g., plateaus every 4 weeks, responds well to deload}`

**Motivational Triggers**:
- ✅ Responds to: `{e.g., progress data, achievement celebrations}`
- ❌ Doesn't respond to: `{e.g., overly technical explanations}`

---

## Adaptations Made

**Date: {date}**  
- Adaptation: `{what was changed}`
- Reason: `{why}`
- Result: `{outcome if known}`

**Date: {date}**  
- Adaptation: `{e.g., reduced volume due to fatigue}`
- Reason: `{user reported soreness, low energy}`
- Result: `{improved recovery, completed next workout}`

---

## Notes & Flags

**Safety Flags**:
- ⚠️ `{any injury history or concerns to watch}`

**Special Considerations**:
- `{dietary restrictions, time constraints, etc.}`

**User Requests**:
- `{specific asks like "always include core work" or "no jumping exercises"}`

---

**This context is updated after every significant interaction and informs Lola's personalized coaching.**
