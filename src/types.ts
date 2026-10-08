export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'male' | 'female';
export type WeightGoal = 'lose' | 'maintain' | 'gain';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export interface MedicalCondition {
  id: string;
  label: string;
  severity: 'red' | 'amber';
  description: string;
  recommendation: string;
}

export interface UserFormData {
  unitSystem: UnitSystem;
  name: string;
  age: number | '';
  gender: Gender;
  // Metric inputs
  heightCm: number | '';
  weightKg: number | '';
  targetWeightKg: number | '';
  // Imperial inputs
  heightFt: number | '';
  heightIn: number | '';
  weightLbs: number | '';
  targetWeightLbs: number | '';
  // Planning
  goal: WeightGoal;
  activityLevel: ActivityLevel;
  weeklyPaceKg: number; // e.g. 0.25, 0.5, 0.75, 1.0 kg/week
  // Medical
  selectedConditions: string[];
  otherConditionText: string;
  confirmedRiskAcknowledgement: boolean;
}

export interface FlagItem {
  id: string;
  severity: 'red' | 'amber';
  title: string;
  description: string;
  recommendation: string;
}

export interface Milestone {
  checkpoint: string;
  weightKg: number;
  weightLbs: number;
  projectedDate: string;
  weekNumber: number;
  cumulativeChangeKg: number;
}

export interface CalculationResults {
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
  isPediatric: boolean;
  pediatricNote?: string;
  bmr: number;
  tdee: number;
  activityMultiplier: number;
  idealBodyWeightKg: number;
  idealBodyWeightLbs: number;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  healthyWeightMinLbs: number;
  healthyWeightMaxLbs: number;
  currentWeightKg: number;
  currentWeightLbs: number;
  targetWeightKg: number;
  targetWeightLbs: number;
  weightDiffKg: number;
  
  // Caloric targets & safety caps
  dailyCaloricTarget: number;
  uncappedDailyCaloricTarget: number;
  appliedCalorieFloor: boolean;
  calorieFloorValue: number;
  actualWeeklyPaceKg: number;
  dailyDeficitSurplus: number;
  weeksToGoal: number;

  // Medical flags
  flagLevel: 'red' | 'amber' | 'green';
  flagItems: FlagItem[];

  // Macros (grams & kcal)
  macros: {
    preset: 'balanced' | 'high_protein' | 'low_carb' | 'custom';
    proteinGrams: number;
    proteinCalories: number;
    proteinPct: number;
    carbGrams: number;
    carbCalories: number;
    carbPct: number;
    fatGrams: number;
    fatCalories: number;
    fatPct: number;
  };

  // Milestones
  milestones: Milestone[];
}

export interface TestCase {
  id: string;
  name: string;
  badge: string;
  scenario: string;
  data: Partial<UserFormData>;
  expectedSummary: string;
}

export interface MealOption {
  title: string;
  description: string;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  ingredients: string[];
  trainerNote: string;
}

export interface MealSlot {
  slotName: string;
  timeGuidance: string;
  calorieTarget: number;
  caloriePercent: number;
  options: MealOption[];
}

export interface PersonalDietPlan {
  goalType: WeightGoal;
  totalDailyCalories: number;
  dailyWaterMl: number;
  trainerStrategy: string;
  corePrinciples: string[];
  medicalDietAdjustments: string[];
  slots: MealSlot[];
}

export type ExerciseIllustrationType =
  | 'squat'
  | 'pushup'
  | 'bridge'
  | 'birddog'
  | 'row'
  | 'deadbug'
  | 'calfraises'
  | 'wallsit'
  | 'chairmarch'
  | 'stepup';

export interface ExerciseItem {
  id: string;
  name: string;
  illustration: ExerciseIllustrationType;
  targetMuscles: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  tempo: string;
  equipment: string;
  difficulty: 'Gentle / Beginner' | 'Moderate' | 'Challenging';
  executionSteps: string[];
  breathingCue: string;
  safetyModification: string;
}

export interface HomeWorkoutRoutine {
  id: string;
  routineTitle: string;
  targetAudience: string;
  clinicalTag: string;
  weeklyFrequency: string;
  estimatedMinutes: number;
  warmup: string[];
  exercises: ExerciseItem[];
  cooldown: string[];
  medicalPrecautions: string[];
}

