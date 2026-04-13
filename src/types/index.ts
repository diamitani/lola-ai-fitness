export interface BodyGoal {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface ProblemArea {
  id: string;
  label: string;
  icon: string;
}

export interface EquipmentOption {
  id: string;
  label: string;
  icon: string;
}

export interface Environment {
  id: string;
  label: string;
  icon: string;
}

export interface Level {
  id: string;
  label: string;
  desc: string;
}

export interface Profile {
  name: string;
  goals: string[];
  areas: string[];
  equipment: string[];
  environment: string;
  frequency: string;
  level: string;
  notes: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tip?: string;
}

export interface WorkoutDay {
  dayLabel: string;
  title: string;
  tagline: string;
  focus: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
  motivation: string;
}

export interface Plan {
  weekSummary: string;
  days: WorkoutDay[];
}

export const BODY_GOALS: BodyGoal[] = [
  { id: "lose_fat", label: "Lose fat & slim down", icon: "🔥", desc: "Burn calories, reduce body fat" },
  { id: "tone", label: "Get toned & defined", icon: "✨", desc: "Lean muscle, sculpted look" },
  { id: "shape_butt", label: "Shape & lift my butt", icon: "🍑", desc: "Glute-focused growth & lift" },
  { id: "build_muscle", label: "Build muscle & strength", icon: "💪", desc: "Size, strength, power" },
  { id: "flat_tummy", label: "Flatten my tummy", icon: "⚡", desc: "Core strength & ab definition" },
  { id: "full_body", label: "Full body transformation", icon: "🌟", desc: "Everything, top to bottom" },
  { id: "flexibility", label: "Flexibility & mobility", icon: "🧘‍♀️", desc: "Move better, feel better" },
];

export const PROBLEM_AREAS: ProblemArea[] = [
  { id: "arms", label: "Arms", icon: "💪" },
  { id: "belly", label: "Belly", icon: "🫁" },
  { id: "thighs", label: "Thighs", icon: "🦵" },
  { id: "butt", label: "Butt", icon: "🍑" },
  { id: "back", label: "Back", icon: "🔙" },
  { id: "chest", label: "Chest", icon: "❤️" },
  { id: "love_handles", label: "Love handles", icon: "〰️" },
  { id: "calves", label: "Calves", icon: "🦶" },
];

export const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  { id: "nothing", label: "Nothing at all", icon: "🚫" },
  { id: "mat", label: "Yoga / gym mat", icon: "🧘" },
  { id: "resistance_bands", label: "Resistance bands", icon: "〰️" },
  { id: "dumbbells", label: "Dumbbells", icon: "🏋️" },
  { id: "barbell", label: "Barbell & plates", icon: "🏋️‍♀️" },
  { id: "kettlebell", label: "Kettlebell(s)", icon: "⚫" },
  { id: "pull_up_bar", label: "Pull-up bar", icon: "🔝" },
  { id: "cable_machine", label: "Cable machine", icon: "🔗" },
  { id: "full_gym", label: "Full gym access", icon: "🏟️" },
  { id: "bench", label: "Bench / box", icon: "📦" },
  { id: "jump_rope", label: "Jump rope", icon: "🪢" },
  { id: "bike", label: "Spin / stationary bike", icon: "🚴‍♀️" },
];

export const ENVIRONMENTS: Environment[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "gym", label: "Gym", icon: "🏋️" },
  { id: "outdoors", label: "Outdoors", icon: "🌿" },
  { id: "hotel", label: "Hotel / travel", icon: "🧳" },
  { id: "park", label: "Park", icon: "🌳" },
];

export const FREQUENCIES = ["2x / week", "3x / week", "4x / week", "5x / week", "Daily"];

export const LEVELS: Level[] = [
  { id: "beginner", label: "Beginner", desc: "New to working out" },
  { id: "intermediate", label: "Intermediate", desc: "Some experience" },
  { id: "advanced", label: "Advanced", desc: "Consistent & experienced" },
];