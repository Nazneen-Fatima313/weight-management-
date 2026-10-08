import {
  ActivityLevel,
  CalculationResults,
  FlagItem,
  Gender,
  MedicalCondition,
  Milestone,
  UserFormData,
} from '../types';

export const MEDICAL_CONDITIONS: MedicalCondition[] = [
  {
    id: 'pregnancy_breastfeeding',
    label: 'Pregnant or Currently Breastfeeding',
    severity: 'red',
    description: 'Active fetal development and lactation impose critical nutritional demands.',
    recommendation: 'Caloric restriction is strictly contraindicated. Consult your OB/GYN or midwife for healthy gestation/lactation weight guidance.',
  },
  {
    id: 'eating_disorder',
    label: 'History of Eating Disorder (Anorexia, Bulimia, Orthorexia, etc.)',
    severity: 'red',
    description: 'Caloric tracking and scale-focused planning may trigger relapse or harmful psychological distress.',
    recommendation: 'Autonomous calorie restriction is not advised. Work with a specialized physician, clinical dietitian, and therapist.',
  },
  {
    id: 'severe_renal',
    label: 'Advanced Renal Disease / Kidney Failure',
    severity: 'red',
    description: 'Impaired kidney clearance requires specialized micro/macronutrient and protein restrictions.',
    recommendation: 'Standard macro and caloric guidelines are unsafe. Follow a nephrologist-prescribed renal diet exclusively.',
  },
  {
    id: 'cardiac_disease',
    label: 'Congestive Heart Failure or Severe Cardiovascular Disease',
    severity: 'red',
    description: 'Rapid fluid shifts, sodium changes, or strenuous deficits can induce acute cardiac stress.',
    recommendation: 'Direct cardiologist oversight is mandatory before altering body weight or activity routines.',
  },
  {
    id: 'uncontrolled_diabetes',
    label: 'Insulin-Dependent or Uncontrolled Diabetes',
    severity: 'red',
    description: 'Caloric shifts create acute risks of severe hypoglycemia or diabetic ketoacidosis without medication adjustments.',
    recommendation: 'Coordinate any dietary changes directly with your endocrinologist to safely titrate medications.',
  },
  {
    id: 'thyroid_disorder',
    label: 'Thyroid Disease (Hypothyroidism or Hyperthyroidism)',
    severity: 'amber',
    description: 'Thyroid hormone levels modulate basal metabolic rate, causing standard BMR formulas to deviate.',
    recommendation: 'Ensure thyroid panel (TSH, free T4) is clinically stabilized. Expect potentially slower or variable weight responses.',
  },
  {
    id: 'hypertension',
    label: 'Hypertension (High Blood Pressure on Medication)',
    severity: 'amber',
    description: 'Weight loss lowers blood pressure, which may lead to hypotension if medications are not re-evaluated.',
    recommendation: 'Monitor blood pressure frequently; notify your primary doctor as weight changes so dosages can be adjusted.',
  },
  {
    id: 'gi_disorders',
    label: 'Gastrointestinal Conditions or Prior Bariatric Surgery',
    severity: 'amber',
    description: 'Malabsorption, dumping syndrome, or nutrient deficiencies require tailored food choices.',
    recommendation: 'Consult a GI specialist or bariatric dietitian to ensure micronutrient adequacy (B12, iron, calcium).',
  },
  {
    id: 'weight_meds',
    label: 'Medications Affecting Weight (Corticosteroids, Beta-blockers, Antipsychotics, GLP-1s)',
    severity: 'amber',
    description: 'Certain pharmacological agents alter appetite, fluid retention, or insulin dynamics.',
    recommendation: 'Do not discontinue medications. Review with your prescribing physician to set realistic expectations.',
  },
];

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Little to no exercise, desk job
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  very_active: 1.9, // Very hard exercise, physical labor or 2x/day training
};

export const ACTIVITY_DESCRIPTIONS: Record<
  ActivityLevel,
  { title: string; subtitle: string; multiplier: number }
> = {
  sedentary: {
    title: 'Sedentary',
    subtitle: 'Little or no structured exercise, desk occupation',
    multiplier: 1.2,
  },
  light: {
    title: 'Lightly Active',
    subtitle: 'Light activity or 1–3 sessions of moderate exercise/week',
    multiplier: 1.375,
  },
  moderate: {
    title: 'Moderately Active',
    subtitle: 'Moderate exercise 3–5 days/week or active daily work',
    multiplier: 1.55,
  },
  active: {
    title: 'Very Active',
    subtitle: 'Intense exercise 6–7 days/week or demanding physical labor',
    multiplier: 1.725,
  },
  very_active: {
    title: 'Extra Active',
    subtitle: 'Elite endurance training, sports athlete, or heavy manual labor',
    multiplier: 1.9,
  },
};

/**
 * Standard Unit Conversions
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

export function ftInToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Calculates BMI (kg/m^2)
 */
export function calculateBmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * WHO BMI Categorization
 */
export function getBmiCategory(bmi: number): { category: string; color: string } {
  if (bmi < 16.0) return { category: 'Severe Underweight', color: '#dc2626' };
  if (bmi < 17.0) return { category: 'Moderate Underweight', color: '#ea580c' };
  if (bmi < 18.5) return { category: 'Mild Underweight', color: '#d97706' };
  if (bmi < 25.0) return { category: 'Normal Weight', color: '#16a34a' };
  if (bmi < 30.0) return { category: 'Overweight (Pre-obese)', color: '#d97706' };
  if (bmi < 35.0) return { category: 'Obesity Class I', color: '#ea580c' };
  if (bmi < 40.0) return { category: 'Obesity Class II', color: '#dc2626' };
  return { category: 'Obesity Class III (Severe)', color: '#991b1b' };
}

/**
 * BMR using Mifflin-St Jeor Equation
 * Men: BMR = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
 * Women: BMR = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
 */
export function calculateMifflinStJeor(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;
  return Math.round(Math.max(500, bmr));
}

/**
 * Ideal Body Weight (IBW) using Devine Formula (1974)
 * Men: 50.0 kg + 2.3 kg per inch over 5 feet (60 inches)
 * Women: 45.5 kg + 2.3 kg per inch over 5 feet (60 inches)
 */
export function calculateDevineIbw(heightCm: number, gender: Gender): number {
  const totalInches = heightCm / 2.54;
  const inchesOver60 = totalInches - 60;
  const base = gender === 'male' ? 50.0 : 45.5;
  const ibw = base + 2.3 * inchesOver60;
  return Number(Math.max(30, ibw).toFixed(1));
}

/**
 * Calculates healthy weight range based on BMI 18.5 - 24.9
 */
export function calculateHealthyRange(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100;
  const minKg = Number((18.5 * heightM * heightM).toFixed(1));
  const maxKg = Number((24.9 * heightM * heightM).toFixed(1));
  return { minKg, maxKg };
}

/**
 * Primary Medical & Mathematical Engine
 */
export function calculateFullPlan(
  form: UserFormData,
  macroPreset: 'balanced' | 'high_protein' | 'low_carb' | 'custom' = 'balanced'
): CalculationResults {
  // Normalize weight and height into metric for calculation
  let weightKg = 70;
  let heightCm = 170;
  let targetWeightKg = 70;

  if (form.unitSystem === 'metric') {
    weightKg = typeof form.weightKg === 'number' ? form.weightKg : 70;
    heightCm = typeof form.heightCm === 'number' ? form.heightCm : 170;
    targetWeightKg =
      typeof form.targetWeightKg === 'number' && form.targetWeightKg > 0
        ? form.targetWeightKg
        : weightKg;
  } else {
    const wLbs = typeof form.weightLbs === 'number' ? form.weightLbs : 154;
    const ft = typeof form.heightFt === 'number' ? form.heightFt : 5;
    const inch = typeof form.heightIn === 'number' ? form.heightIn : 7;
    const targetLbs =
      typeof form.targetWeightLbs === 'number' && form.targetWeightLbs > 0
        ? form.targetWeightLbs
        : wLbs;

    weightKg = lbsToKg(wLbs);
    heightCm = ftInToCm(ft, inch);
    targetWeightKg = lbsToKg(targetLbs);
  }

  const age = typeof form.age === 'number' ? form.age : 30;
  const gender = form.gender;
  const isPediatric = age < 18;

  // BMI
  const bmi = calculateBmi(weightKg, heightCm);
  const { category: bmiCategory, color: bmiColor } = getBmiCategory(bmi);

  let pediatricNote: string | undefined;
  if (isPediatric) {
    pediatricNote = `Patient age is ${age} years. Clinical standard: BMI in individuals aged 2–19 must be evaluated using age- and sex-specific percentile growth charts (CDC/WHO). Fixed adult cutoffs do not apply. Strict caloric deficits during active developmental growth stages require direct pediatrician oversight.`;
  }

  // BMR & TDEE
  const bmr = calculateMifflinStJeor(weightKg, heightCm, age, gender);
  const activityMultiplier = ACTIVITY_MULTIPLIERS[form.activityLevel] || 1.2;
  const tdee = Math.round(bmr * activityMultiplier);

  // Devine IBW & Healthy Range
  const idealBodyWeightKg = calculateDevineIbw(heightCm, gender);
  const idealBodyWeightLbs = Number(kgToLbs(idealBodyWeightKg).toFixed(1));

  const { minKg: healthyWeightMinKg, maxKg: healthyWeightMaxKg } = calculateHealthyRange(heightCm);
  const healthyWeightMinLbs = Number(kgToLbs(healthyWeightMinKg).toFixed(1));
  const healthyWeightMaxLbs = Number(kgToLbs(healthyWeightMaxKg).toFixed(1));

  // Medical Flags Evaluation
  const flagItems: FlagItem[] = [];
  form.selectedConditions.forEach((condId) => {
    const match = MEDICAL_CONDITIONS.find((c) => c.id === condId);
    if (match) {
      flagItems.push({
        id: match.id,
        severity: match.severity,
        title: match.label,
        description: match.description,
        recommendation: match.recommendation,
      });
    }
  });

  if (form.otherConditionText.trim()) {
    flagItems.push({
      id: 'custom_other',
      severity: 'amber',
      title: `Other Reported Health Condition: ${form.otherConditionText.trim()}`,
      description: 'Custom health condition indicated by user.',
      recommendation: 'Discuss this specific condition with your primary healthcare provider before adopting a caloric deficit.',
    });
  }

  // Severe BMI extreme also raises clinical flags
  if (bmi < 16.0) {
    flagItems.push({
      id: 'severe_underweight_alert',
      severity: 'red',
      title: 'Clinical Severe Thinness Alert (BMI < 16.0)',
      description: 'Critical underweight status risks cardiac arrhythmia, immune compromise, and bone density loss.',
      recommendation: 'Immediate clinical nutritional rehabilitation under medical supervision is required. Do not lose weight.',
    });
  } else if (bmi >= 40.0) {
    flagItems.push({
      id: 'class_iii_obesity_alert',
      severity: 'amber',
      title: 'Class III Obesity Clinical Consideration (BMI ≥ 40.0)',
      description: 'High likelihood of occult obstructive sleep apnea, fatty liver disease, and endothelial stress.',
      recommendation: 'Coordinate with a metabolic physician for structured multi-disciplinary clinical weight management.',
    });
  }

  if (isPediatric && form.goal === 'lose') {
    flagItems.push({
      id: 'pediatric_deficit_alert',
      severity: 'red',
      title: 'Adolescent Calorie Restriction Safety Alert',
      description: 'Intentional caloric deficit in children and teenagers can impair endocrine function and linear growth.',
      recommendation: 'Pediatrician clearance is required before any intentional weight reduction program.',
    });
  }

  const hasRed = flagItems.some((f) => f.severity === 'red');
  const hasAmber = flagItems.some((f) => f.severity === 'amber');
  const flagLevel: 'red' | 'amber' | 'green' = hasRed ? 'red' : hasAmber ? 'amber' : 'green';

  // Calorie targets & safety rules
  // 1 kg body fat = approx 7,700 kcal
  const safePaceRequested = Math.min(1.0, Math.max(0.1, form.weeklyPaceKg || 0.5));
  const dailyPaceCalories = Math.round((safePaceRequested * 7700) / 7); // e.g. 0.5 kg/w = 550 kcal/day

  // Safety caps:
  // Women: min 1,200 kcal/day
  // Men: min 1,500 kcal/day
  const calorieFloorValue = gender === 'female' ? 1200 : 1500;

  let uncappedDailyCaloricTarget = tdee;
  let dailyCaloricTarget = tdee;
  let dailyDeficitSurplus = 0;
  let appliedCalorieFloor = false;
  let actualWeeklyPaceKg = safePaceRequested;

  if (form.goal === 'lose') {
    uncappedDailyCaloricTarget = tdee - dailyPaceCalories;
    if (uncappedDailyCaloricTarget < calorieFloorValue) {
      dailyCaloricTarget = calorieFloorValue;
      appliedCalorieFloor = true;
      dailyDeficitSurplus = Math.max(0, tdee - calorieFloorValue);
      actualWeeklyPaceKg = Number(((dailyDeficitSurplus * 7) / 7700).toFixed(2));
    } else {
      dailyCaloricTarget = uncappedDailyCaloricTarget;
      dailyDeficitSurplus = dailyPaceCalories;
      actualWeeklyPaceKg = safePaceRequested;
    }
  } else if (form.goal === 'gain') {
    // Safe surplus capped at 0.5 kg/week (+550 kcal/day)
    const gainPace = Math.min(0.5, safePaceRequested);
    const surplus = Math.round((gainPace * 7700) / 7);
    uncappedDailyCaloricTarget = tdee + surplus;
    dailyCaloricTarget = uncappedDailyCaloricTarget;
    dailyDeficitSurplus = surplus;
    actualWeeklyPaceKg = gainPace;
  } else {
    // Maintain
    uncappedDailyCaloricTarget = tdee;
    dailyCaloricTarget = tdee;
    dailyDeficitSurplus = 0;
    actualWeeklyPaceKg = 0;
  }

  // Weeks to goal
  const weightDiffKg = Math.abs(weightKg - targetWeightKg);
  let weeksToGoal = 0;
  if (form.goal !== 'maintain' && weightDiffKg > 0 && actualWeeklyPaceKg > 0) {
    weeksToGoal = Math.ceil(weightDiffKg / actualWeeklyPaceKg);
  }

  // Macro Distributions
  let proteinPct = 25;
  let carbPct = 45;
  let fatPct = 30;

  if (macroPreset === 'high_protein') {
    proteinPct = 35;
    carbPct = 35;
    fatPct = 30;
  } else if (macroPreset === 'low_carb') {
    proteinPct = 35;
    carbPct = 25;
    fatPct = 40;
  }

  const proteinCalories = Math.round(dailyCaloricTarget * (proteinPct / 100));
  const carbCalories = Math.round(dailyCaloricTarget * (carbPct / 100));
  const fatCalories = Math.round(dailyCaloricTarget * (fatPct / 100));

  // 4 kcal/g for Protein & Carbs, 9 kcal/g for Fat
  const proteinGrams = Math.round(proteinCalories / 4);
  const carbGrams = Math.round(carbCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  // Milestone checkpoints (25%, 50%, 75%, 100%)
  const milestones: Milestone[] = [];
  const now = new Date();

  if (form.goal !== 'maintain' && weeksToGoal > 0 && weightDiffKg > 0.5) {
    const fractions = [0.25, 0.5, 0.75, 1.0];
    fractions.forEach((frac, idx) => {
      const isLose = form.goal === 'lose';
      const change = weightDiffKg * frac;
      const milestoneWeightKg = isLose ? weightKg - change : weightKg + change;
      const weekEst = Math.max(1, Math.round(weeksToGoal * frac));

      const milestoneDate = new Date(now);
      milestoneDate.setDate(milestoneDate.getDate() + weekEst * 7);

      milestones.push({
        checkpoint: `${Math.round(frac * 100)}% Milestone`,
        weightKg: Number(milestoneWeightKg.toFixed(1)),
        weightLbs: Number(kgToLbs(milestoneWeightKg).toFixed(1)),
        projectedDate: milestoneDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        weekNumber: weekEst,
        cumulativeChangeKg: Number(change.toFixed(1)),
      });
    });
  }

  return {
    bmi,
    bmiCategory,
    bmiColor,
    isPediatric,
    pediatricNote,
    bmr,
    tdee,
    activityMultiplier,
    idealBodyWeightKg,
    idealBodyWeightLbs,
    healthyWeightMinKg,
    healthyWeightMaxKg,
    healthyWeightMinLbs,
    healthyWeightMaxLbs,
    currentWeightKg: Number(weightKg.toFixed(1)),
    currentWeightLbs: Number(kgToLbs(weightKg).toFixed(1)),
    targetWeightKg: Number(targetWeightKg.toFixed(1)),
    targetWeightLbs: Number(kgToLbs(targetWeightKg).toFixed(1)),
    weightDiffKg: Number(weightDiffKg.toFixed(1)),

    dailyCaloricTarget,
    uncappedDailyCaloricTarget,
    appliedCalorieFloor,
    calorieFloorValue,
    actualWeeklyPaceKg,
    dailyDeficitSurplus,
    weeksToGoal,

    flagLevel,
    flagItems,

    macros: {
      preset: macroPreset,
      proteinGrams,
      proteinCalories,
      proteinPct,
      carbGrams,
      carbCalories,
      carbPct,
      fatGrams,
      fatCalories,
      fatPct,
    },

    milestones,
  };
}
