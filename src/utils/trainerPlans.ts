import {
  CalculationResults,
  ExerciseItem,
  HomeWorkoutRoutine,
  PersonalDietPlan,
  UserFormData,
} from '../types';

/**
 * Generates an exhaustive personal trainer diet and meal plan
 * with exact calories calculated per meal and medical adjustments.
 */
export function generatePersonalTrainerDietPlan(
  results: CalculationResults,
  form: UserFormData
): PersonalDietPlan {
  const totalCalories = results.dailyCaloricTarget;
  const weightKg = results.currentWeightKg;
  const isLoss = form.goal === 'lose';
  const isGain = form.goal === 'gain';

  // Trainer Hydration Recommendation: 35-40 ml per kg body weight + extra for activity
  const baseWater = Math.round(weightKg * 38);
  const dailyWaterMl = Math.min(4500, Math.max(2000, baseWater));

  // Medical Dietary Adjustments
  const medicalDietAdjustments: string[] = [];
  if (form.selectedConditions.includes('hypertension')) {
    medicalDietAdjustments.push(
      'DASH Diet Protocol: Restrict sodium strictly under 2,000 mg/day. Emphasize potassium-rich foods (spinach, bananas, sweet potatoes) and magnesium.'
    );
  }
  if (form.selectedConditions.includes('uncontrolled_diabetes')) {
    medicalDietAdjustments.push(
      'Glycemic Control Protocol: Emphasize low-glycemic complex carbohydrates. Always pair carbohydrates with lean proteins or healthy fats to flatten postprandial glucose curves.'
    );
  }
  if (form.selectedConditions.includes('thyroid_disorder')) {
    medicalDietAdjustments.push(
      'Endocrine Metabolic Support: Ensure dietary iodine, selenium (e.g. 2 Brazil nuts), and zinc. Avoid extreme caloric restriction which downregulates T3 conversion.'
    );
  }
  if (form.selectedConditions.includes('severe_renal')) {
    medicalDietAdjustments.push(
      'Renal Safety Protocol: Protein intake must not exceed nephrologist thresholds. Avoid unmonitored potassium and phosphorus salt substitutes.'
    );
  }
  if (form.selectedConditions.includes('gi_disorders')) {
    medicalDietAdjustments.push(
      'Digestive Optimization: Prioritize easily digestible cooked vegetables, separate fluids from large solid meals by 30 minutes, and chew thoroughly.'
    );
  }

  // Trainer Philosophy & Core Principles
  let trainerStrategy = '';
  const corePrinciples: string[] = [];

  if (isLoss) {
    trainerStrategy =
      'Satiety-Driven Metabolic Preservation: Deficit execution designed to maximize fullness, protect lean muscle mass, and prevent metabolic downregulation through high-volume, fiber-rich, and protein-prioritized foods.';
    corePrinciples.push(
      `Daily Caloric Deficit Target: ${totalCalories} kcal/day (Deficit of -${results.dailyDeficitSurplus} kcal from your ${results.tdee} kcal TDEE).`
    );
    corePrinciples.push(
      `Protein Priority: Aim for ~${results.macros.proteinGrams}g daily (~${(results.macros.proteinGrams / weightKg).toFixed(1)}g per kg of body weight) to spare metabolic muscle tissue.`
    );
    corePrinciples.push(
      'High-Volume Food Strategy: Fill 50% of every lunch and dinner plate with non-starchy cruciferous and green vegetables.'
    );
    corePrinciples.push(
      'Liquid Calorie Elimination: Avoid sugary drinks, fruit juices, and alcohol. Hydrate with water, green tea, or black coffee.'
    );
  } else if (isGain) {
    trainerStrategy =
      'Clean Hypertrophic Mass Construction: Controlled caloric surplus emphasizing nutrient density, glycogen replenishment, and high protein synthesis without excessive visceral fat accumulation.';
    corePrinciples.push(
      `Daily Caloric Surplus Target: ${totalCalories} kcal/day (+${results.dailyDeficitSurplus} kcal surplus over your ${results.tdee} kcal TDEE).`
    );
    corePrinciples.push(
      `Anabolic Building Blocks: ~${results.macros.proteinGrams}g protein paired with ~${results.macros.carbGrams}g complex carbohydrates for glycogen storage.`
    );
    corePrinciples.push(
      'Calorie Density Tactics: Incorporate wholesome nutrient-dense calories: extra virgin olive oil, raw nut butters, avocados, and whole oats.'
    );
    corePrinciples.push(
      'Post-Workout Liquid Fuel: Consume a nutrient-packed smoothie within 60 minutes of training to speed up muscular recovery.'
    );
  } else {
    trainerStrategy =
      'Homeostatic Equilibrium & Body Recomposition: Balancing energy intake precisely with your expenditure to sustain hormonal balance and optimize athletic performance.';
    corePrinciples.push(
      `Maintenance Energy Balance: ${totalCalories} kcal/day to maintain current biometrics.`
    );
    corePrinciples.push(
      'Consistent Meal Pacing: Eat at structured intervals to stabilize circadian insulin and leptin rhythms.'
    );
    corePrinciples.push(
      '80/20 Whole Food Standard: 80% whole single-ingredient foods, 20% flexible lifestyle options.'
    );
  }

  // Calculate meal slot allocations:
  // Breakfast: 25% | Lunch: 35% | Dinner: 30% | Snack/Recovery: 10%
  const bfastKcal = Math.round(totalCalories * 0.25);
  const lunchKcal = Math.round(totalCalories * 0.35);
  const dinnerKcal = Math.round(totalCalories * 0.30);
  const snackKcal = Math.max(120, totalCalories - (bfastKcal + lunchKcal + dinnerKcal));

  const slots = [
    {
      slotName: 'Breakfast (Morning Fuel)',
      timeGuidance: '7:00 AM – 8:30 AM (Within 90 mins of waking)',
      calorieTarget: bfastKcal,
      caloriePercent: 25,
      options: isLoss
        ? [
            {
              title: 'Egg White & Vegetable Scramble with Avocado',
              description: 'High-protein, moderate-fat breakfast that triggers satiety hormones (PYY & GLP-1).',
              calories: bfastKcal,
              proteinGrams: Math.round(bfastKcal * 0.32 / 4),
              carbGrams: Math.round(bfastKcal * 0.35 / 4),
              fatGrams: Math.round(bfastKcal * 0.33 / 9),
              ingredients: [
                '3 large egg whites + 1 whole pasture-raised egg',
                '1 cup fresh baby spinach & diced bell peppers',
                '1 slice 100% whole grain sprouted toast',
                '1/4 medium ripe avocado (healthy monounsaturated fats)',
                '1 cup black coffee or green tea with lemon',
              ],
              trainerNote: 'The combination of albumin protein and dietary fiber blunts morning cortisol spikes and curbs mid-morning cravings.',
            },
            {
              title: 'Greek Yogurt Protein Bowl with Berries & Chia',
              description: 'Slow-digesting casein-rich breakfast offering gut-friendly probiotics.',
              calories: bfastKcal,
              proteinGrams: Math.round(bfastKcal * 0.35 / 4),
              carbGrams: Math.round(bfastKcal * 0.40 / 4),
              fatGrams: Math.round(bfastKcal * 0.25 / 9),
              ingredients: [
                '1.25 cups 0% plain Greek yogurt',
                '1/2 scoop unflavored or vanilla whey/plant protein powder',
                '3/4 cup mixed antioxidant berries (blueberries & raspberries)',
                '1 tbsp organic chia seeds',
                'Pinch of Ceylon cinnamon',
              ],
              trainerNote: 'Chia seeds absorb 10x their weight in water, creating a soothing gel in the stomach that keeps hunger quiet until lunch.',
            },
          ]
        : [
            {
              title: 'Power Oatmeal with Peanut Butter & Banana',
              description: 'Calorie-dense complex carbohydrate breakfast loaded with potassium and sustained energy.',
              calories: bfastKcal,
              proteinGrams: Math.round(bfastKcal * 0.25 / 4),
              carbGrams: Math.round(bfastKcal * 0.50 / 4),
              fatGrams: Math.round(bfastKcal * 0.25 / 9),
              ingredients: [
                '1 cup rolled oats cooked in 1.5 cups milk or fortified soy milk',
                '2 tbsp natural peanut butter or almond butter',
                '1 whole ripe banana sliced',
                '1 tbsp pure honey or real maple syrup',
                '1 scoop whey or plant protein powder mixed in',
              ],
              trainerNote: 'Complex beta-glucan carbs prime your muscles with glycogen for high-output home training sessions.',
            },
            {
              title: 'Whole Egg & Sourdough Toast with Turkey Slices',
              description: 'Classic muscle-building breakfast rich in choline, leucine, and clean lipids.',
              calories: bfastKcal,
              proteinGrams: Math.round(bfastKcal * 0.28 / 4),
              carbGrams: Math.round(bfastKcal * 0.42 / 4),
              fatGrams: Math.round(bfastKcal * 0.30 / 9),
              ingredients: [
                '3 whole pasture-raised scrambled eggs in 1 tsp olive oil',
                '2 thick slices sourdough or artisanal artisan bread',
                '2 slices lean roasted turkey breast',
                '1 glass (250ml) fresh orange juice or whole milk',
              ],
              trainerNote: 'Whole eggs provide cholesterol precursors needed for natural anabolic steroidogenesis and joint lubrication.',
            },
          ],
    },
    {
      slotName: 'Lunch (Midday Performance)',
      timeGuidance: '12:30 PM – 1:30 PM (Midday peak energy)',
      calorieTarget: lunchKcal,
      caloriePercent: 35,
      options: isLoss
        ? [
            {
              title: 'Herb-Grilled Chicken Breast with Quinoa & Steamed Greens',
              description: 'Clean lean protein paired with mineral-dense pseudograin and fibrous broccoli.',
              calories: lunchKcal,
              proteinGrams: Math.round(lunchKcal * 0.38 / 4),
              carbGrams: Math.round(lunchKcal * 0.35 / 4),
              fatGrams: Math.round(lunchKcal * 0.27 / 9),
              ingredients: [
                '160g skinless chicken breast grilled with garlic and rosemary',
                '1/2 cup cooked fluffy quinoa',
                '2 cups steamed broccoli florets and asparagus spears',
                '1 tsp cold-pressed extra virgin olive oil drizzle with lemon',
              ],
              trainerNote: 'Quinoa provides all 9 essential amino acids alongside magnesium to maintain steady cellular energy through the afternoon.',
            },
            {
              title: 'Mediterranean Salmon & Rainbow Power Salad',
              description: 'Cardioprotective omega-3 rich lunch with polyphenol-rich mixed greens.',
              calories: lunchKcal,
              proteinGrams: Math.round(lunchKcal * 0.34 / 4),
              carbGrams: Math.round(lunchKcal * 0.30 / 4),
              fatGrams: Math.round(lunchKcal * 0.36 / 9),
              ingredients: [
                '150g wild-caught baked salmon fillet',
                '3 cups chopped romaine lettuce, cucumber, and cherry tomatoes',
                '2 tbsp crumbled low-fat feta cheese',
                '1/3 cup boiled chickpeas (garbanzo beans)',
                '1 tbsp balsamic vinaigrette',
              ],
              trainerNote: 'Marine omega-3 EPA/DHA reduces systemic inflammation and enhances cellular insulin sensitivity.',
            },
          ]
        : [
            {
              title: 'Steak & Sweet Potato Mass-Building Bowl',
              description: 'Dense iron-rich red meat paired with complex carbohydrates for maximal glycogen synthesis.',
              calories: lunchKcal,
              proteinGrams: Math.round(lunchKcal * 0.32 / 4),
              carbGrams: Math.round(lunchKcal * 0.45 / 4),
              fatGrams: Math.round(lunchKcal * 0.23 / 9),
              ingredients: [
                '180g lean flank steak or lean ground beef (90/10)',
                '1 large baked sweet potato (approx 250g) with 1 tsp butter',
                '1 cup cooked basmati white rice with sea salt',
                '1 cup sauteed green beans in olive oil',
              ],
              trainerNote: 'Red meat delivers natural creatine, highly bioavailable heme iron, and carnitine to fuel home progressive overload.',
            },
            {
              title: 'Hearty Tuna & Avocado Pasta Bowl',
              description: 'High-calorie carbohydrate and clean marine fat bowl that is easy to consume and digest.',
              calories: lunchKcal,
              proteinGrams: Math.round(lunchKcal * 0.30 / 4),
              carbGrams: Math.round(lunchKcal * 0.48 / 4),
              fatGrams: Math.round(lunchKcal * 0.22 / 9),
              ingredients: [
                '1.5 cups cooked whole grain penne or rotini pasta',
                '1 can (150g) solid light tuna in olive oil',
                '1/2 medium avocado diced',
                '1/2 cup sweet yellow corn and cherry tomatoes',
                '1 tbsp grated parmesan cheese',
              ],
              trainerNote: 'Pasta provides easily digestible muscular glycogen recharge without gastrointestinal bloat.',
            },
          ],
    },
    {
      slotName: 'Dinner (Recovery & Repair)',
      timeGuidance: '6:30 PM – 8:00 PM (At least 2.5 hrs before bedtime)',
      calorieTarget: dinnerKcal,
      caloriePercent: 30,
      options: isLoss
        ? [
            {
              title: 'Lean Turkey & Cauliflower-Rice Stir Fry',
              description: 'Ultra-high-volume dinner that fills the stomach while keeping caloric load minimal.',
              calories: dinnerKcal,
              proteinGrams: Math.round(dinnerKcal * 0.40 / 4),
              carbGrams: Math.round(dinnerKcal * 0.30 / 4),
              fatGrams: Math.round(dinnerKcal * 0.30 / 9),
              ingredients: [
                '170g 93% lean ground turkey breast with ginger and low-sodium tamari',
                '2 cups riced cauliflower sauteed with sesame oil (1 tsp)',
                '1 cup sliced snap peas, mushrooms, and water chestnuts',
                '1 tbsp sesame seeds sprinkled on top',
              ],
              trainerNote: 'Cauliflower rice gives you a huge 3-cup meal bowl with under 70 calories from the vegetable base, letting you sleep fully satisfied.',
            },
            {
              title: 'Baked White Fish (Cod or Tilapia) with Roasted Asparagus & Baby Potatoes',
              description: 'Light, hypoallergenic evening protein that supports restful nocturnal sleep.',
              calories: dinnerKcal,
              proteinGrams: Math.round(dinnerKcal * 0.38 / 4),
              carbGrams: Math.round(dinnerKcal * 0.34 / 4),
              fatGrams: Math.round(dinnerKcal * 0.28 / 9),
              ingredients: [
                '180g Atlantic cod fillet seasoned with paprika and lemon pepper',
                '120g roasted baby yellow potatoes (skin-on for potassium)',
                '1.5 cups roasted asparagus spears with 1 tsp avocado oil',
              ],
              trainerNote: 'White fish is lean and easy on digestion, preventing nighttime gastric reflux.',
            },
          ]
        : [
            {
              title: 'Roasted Chicken Thighs with Herbed Rice & Avocado',
              description: 'Succulent higher-fat poultry providing the clean calorie density needed for hypertrophy.',
              calories: dinnerKcal,
              proteinGrams: Math.round(dinnerKcal * 0.28 / 4),
              carbGrams: Math.round(dinnerKcal * 0.45 / 4),
              fatGrams: Math.round(dinnerKcal * 0.27 / 9),
              ingredients: [
                '2 roasted bone-in or boneless chicken thighs (skinless)',
                '1.5 cups fragrant jasmine rice cooked with chicken broth',
                '1/2 medium sliced avocado',
                '1 cup roasted zucchini and bell peppers in extra virgin olive oil',
              ],
              trainerNote: 'Chicken thighs are naturally more calorically dense than breast, making it easier to meet surplus targets without feeling uncomfortably stuffed.',
            },
            {
              title: 'Homemade Beef & Black Bean Burrito Bowls',
              description: 'Nutrient-rich fiesta bowl loaded with bioavailable minerals, fiber, and dense clean energy.',
              calories: dinnerKcal,
              proteinGrams: Math.round(dinnerKcal * 0.30 / 4),
              carbGrams: Math.round(dinnerKcal * 0.46 / 4),
              fatGrams: Math.round(dinnerKcal * 0.24 / 9),
              ingredients: [
                '160g lean ground beef seasoned with cumin, garlic, and sea salt',
                '1 cup warm brown rice',
                '3/4 cup black beans (rinsed)',
                '1/4 cup chunky tomato salsa',
                '2 tbsp guacamole or sour cream',
              ],
              trainerNote: 'Black beans provide sustained fiber and slow carbohydrates that sustain nocturnal protein synthesis.',
            },
          ],
    },
    {
      slotName: 'Smart Snack / Post-Workout Fuel',
      timeGuidance: 'Around 3:30 PM or 30–45 mins Post-Workout',
      calorieTarget: snackKcal,
      caloriePercent: 10,
      options: isLoss
        ? [
            {
              title: 'Crisp Apple Slices with Light String Cheese & Raw Almonds',
              description: 'Balanced protein-fat-fiber trio that halts late afternoon energy crashes.',
              calories: snackKcal,
              proteinGrams: Math.round(snackKcal * 0.25 / 4),
              carbGrams: Math.round(snackKcal * 0.45 / 4),
              fatGrams: Math.round(snackKcal * 0.30 / 9),
              ingredients: [
                '1 medium crisp green or honeycrisp apple',
                '1 low-fat mozzarella string cheese stick',
                '8-10 raw whole almonds',
              ],
              trainerNote: 'Pectin in apples delays gastric emptying while protein from cheese stabilizes insulin.',
            },
            {
              title: 'Protein Recovery Shake (Water / Unsweetened Almond Milk)',
              description: 'Instant branched-chain amino acid delivery for muscle repair with zero excess carbs.',
              calories: snackKcal,
              proteinGrams: Math.round(snackKcal * 0.70 / 4),
              carbGrams: Math.round(snackKcal * 0.15 / 4),
              fatGrams: Math.round(snackKcal * 0.15 / 9),
              ingredients: [
                '1 scoop (25g-30g) pure whey isolate or pea protein',
                '300ml cold water or unsweetened almond milk',
                'Handful of ice cubes',
              ],
              trainerNote: 'Fast-digesting leucine-rich protein triggers mTOR pathways to protect muscle during a caloric deficit.',
            },
          ]
        : [
            {
              title: 'Mass Gainer Smoothie (Peanut Butter, Banana & Oats)',
              description: 'Easy-to-drink 350-450 kcal power shake packed with muscle-building fuel.',
              calories: snackKcal,
              proteinGrams: Math.round(snackKcal * 0.28 / 4),
              carbGrams: Math.round(snackKcal * 0.48 / 4),
              fatGrams: Math.round(snackKcal * 0.24 / 9),
              ingredients: [
                '1 scoop whey or plant protein powder',
                '1 whole ripe banana',
                '2 tbsp creamy peanut butter',
                '1/3 cup fine rolled oats',
                '300ml whole milk or oat milk',
              ],
              trainerNote: 'Liquid calories are the single most effective tool for hardgainers to achieve calorie surpluses without GI distress.',
            },
            {
              title: 'Greek Yogurt with Granola & Mixed Nuts',
              description: 'Crunchy, satisfying bowl providing both fast and slow protein along with energy-dense crunch.',
              calories: snackKcal,
              proteinGrams: Math.round(snackKcal * 0.26 / 4),
              carbGrams: Math.round(snackKcal * 0.44 / 4),
              fatGrams: Math.round(snackKcal * 0.30 / 9),
              ingredients: [
                '1 cup 2% or 5% plain Greek yogurt',
                '1/3 cup honey-almond oat granola',
                '1 tbsp crushed walnuts',
                'Drizzle of real honey',
              ],
              trainerNote: 'Walnuts supply plant-based ALA omega-3s to support muscular tendon health.',
            },
          ],
    },
  ];

  return {
    goalType: form.goal,
    totalDailyCalories: totalCalories,
    dailyWaterMl,
    trainerStrategy,
    corePrinciples,
    medicalDietAdjustments,
    slots,
  };
}

/**
 * Generates tailored home workout routines categorized by patient profile
 * and medical risk status (with exact sets, reps, tempo, and cues).
 */
export function generateTrainerWorkoutPlan(
  results: CalculationResults,
  form: UserFormData
): HomeWorkoutRoutine {
  const age = typeof form.age === 'number' ? form.age : 30;
  const isHypertension = form.selectedConditions.includes('hypertension');
  const isCardiac = form.selectedConditions.includes('cardiac_disease');
  const isJointOrGI =
    form.selectedConditions.includes('gi_disorders') ||
    results.bmi >= 35 ||
    form.otherConditionText.toLowerCase().includes('joint') ||
    form.otherConditionText.toLowerCase().includes('knee') ||
    form.otherConditionText.toLowerCase().includes('back');
  const isSenior = age >= 62;
  const isGain = form.goal === 'gain';

  // ROUTINE A: Cardiac & Hypertension Safe Conditioning
  if (isHypertension || isCardiac) {
    return {
      id: 'routine_cardiac_safe',
      routineTitle: 'Cardiovascular & Blood Pressure Safe Home Routine',
      targetAudience: 'Patients with Hypertension, Cardiac History, or Elevated Vascular Risk',
      clinicalTag: 'Strictly Non-Valsalva · Low Peripheral Resistance · Continuous Rhythmic Breathing',
      weeklyFrequency: '3–4 days per week (e.g. Mon, Wed, Fri, Sat)',
      estimatedMinutes: 25,
      warmup: [
        '3 minutes of relaxed standing or seated arm circles and deep diaphragmatic breathing',
        '2 minutes gentle ankle rolls and gentle standing pelvic tilts',
      ],
      cooldown: [
        '3 minutes slow restorative nasal breathing walking',
        '2 minutes seated hamstring and chest opener stretch (keep head above heart level at all times)',
      ],
      medicalPrecautions: [
        'DO NOT HOLD YOUR BREATH (Avoid the Valsalva maneuver): Breath-holding causes acute spikes in intrathoracic and arterial blood pressure.',
        'Never position your head below your heart level (no bending down deeply for toes).',
        'If you experience dizziness, chest tightness, palpitations, or shortness of breath, stop immediately.',
      ],
      exercises: [
        {
          id: 'ex_cardiac_1',
          name: 'Seated High-Knee March & Arm Reach',
          illustration: 'chairmarch',
          targetMuscles: ['Hip Flexors', 'Abdominals', 'Deltoids', 'Cardiovascular System'],
          sets: 3,
          reps: '20 marches (10 per leg)',
          restSeconds: 60,
          tempo: '2-0-2 (Smooth rhythmic cadence)',
          equipment: 'Sturdy dining chair',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Sit tall on the edge of a sturdy chair with feet flat on the floor.',
            'Lift your right knee toward your chest while raising the opposite left arm gently.',
            'Lower smoothly and immediately lift the left knee with opposite right arm.',
            'Maintain an upright spine; do not slump.',
          ],
          breathingCue: 'Breathe steadily in rhythm with your marching; count repetitions out loud to guarantee you never hold your breath.',
          safetyModification: 'Keep knee lifts lower (2-3 inches off floor) if hip or joint fatigue occurs.',
        },
        {
          id: 'ex_cardiac_2',
          name: 'Wall Push-Up with Elevated Incline',
          illustration: 'pushup',
          targetMuscles: ['Pectorals (Chest)', 'Triceps', 'Shoulders', 'Core'],
          sets: 3,
          reps: '10–12 reps',
          restSeconds: 60,
          tempo: '2-1-2 (2 sec into wall, 1 sec pause, 2 sec push)',
          equipment: 'Flat wall surface',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Stand facing a wall, arms length away, hands flat on wall at shoulder height.',
            'Step feet back 1 to 2 feet so your body forms a gentle diagonal angle.',
            'Bend elbows at a 45-degree angle, lowering your chest toward the wall.',
            'Press through your palms to return to the starting position.',
          ],
          breathingCue: 'Inhale through nose as chest approaches wall; exhale through mouth as you press away.',
          safetyModification: 'Stand closer to the wall for less resistance; ensure wrist comfortable angle.',
        },
        {
          id: 'ex_cardiac_3',
          name: 'Chair Sit-to-Stand (Assisted Squat)',
          illustration: 'squat',
          targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
          sets: 3,
          reps: '10 reps',
          restSeconds: 75,
          tempo: '2-1-2 (2 sec descend, 1 sec touch chair, 2 sec rise)',
          equipment: 'Firm chair',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Sit forward on the chair, feet shoulder-width apart, knees tracked over toes.',
            'Cross arms over chest or reach forward for balance.',
            'Drive through the heels and midfoot to stand completely upright.',
            'Control the descent back down until your glutes softly touch the seat.',
          ],
          breathingCue: 'Exhale audibly as you stand up; inhale deeply as you lower yourself back to the chair.',
          safetyModification: 'Use armrests to assist with pushing if knees feel tender.',
        },
        {
          id: 'ex_cardiac_4',
          name: 'Supported Standing Calf Raises & Balance',
          illustration: 'calfraises',
          targetMuscles: ['Gastrocnemius & Soleus (Calves)', 'Ankle Stabilizers'],
          sets: 3,
          reps: '12–15 reps',
          restSeconds: 45,
          tempo: '1-2-2 (1 sec up, 2 sec hold at peak, 2 sec down)',
          equipment: 'Wall or back of chair for fingertip support',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Stand tall with hands lightly resting on the wall or chair back for balance.',
            'Press evenly through the balls of your feet to elevate your heels as high as comfortable.',
            'Hold the peak contraction at the top for 2 full seconds.',
            'Lower slowly until your heels lightly kiss the floor.',
          ],
          breathingCue: 'Breathe normally; exhale on the rise, inhale as heels lower.',
          safetyModification: 'Can be executed seated if balance feels unsteady.',
        },
      ],
    };
  }

  // ROUTINE B: Joint-Friendly & High-BMI Low-Impact Care
  if (isJointOrGI || results.bmi >= 32) {
    return {
      id: 'routine_joint_friendly',
      routineTitle: 'Low-Impact Joint Protection & Core Strength',
      targetAudience: 'Patients with Osteoarthritis, Joint Sensitivity, or Elevated BMI (BMI ≥ 30)',
      clinicalTag: 'Zero Shear Knee Force · Non-Impact · Lumbar Spinal Sparing',
      weeklyFrequency: '3 days per week (e.g. Mon, Wed, Fri)',
      estimatedMinutes: 25,
      warmup: [
        '3 minutes gentle torso twists and seated shoulder blade shrugs',
        '2 minutes seated leg extensions to lubricate synovial joint fluid in knees',
      ],
      cooldown: [
        '3 minutes gentle calf stretches against a wall',
        '2 minutes supine or seated knee-to-chest gentle hip stretch',
      ],
      medicalPrecautions: [
        'Zero jumping, bouncing, or high-impact ballistic loading.',
        'Never force a joint through pain: muscle effort is expected, sharp joint pain is a signal to stop.',
        'Ensure floor exercises are performed on a supportive yoga mat or carpeted surface.',
      ],
      exercises: [
        {
          id: 'ex_joint_1',
          name: 'Glute Bridge on Floor Mat',
          illustration: 'bridge',
          targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Pelvic Floor'],
          sets: 3,
          reps: '12–15 reps',
          restSeconds: 60,
          tempo: '2-2-2 (2 sec up, 2 sec squeeze at top, 2 sec down)',
          equipment: 'Yoga mat or carpet',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Lie flat on your back with knees bent and feet flat on the floor, hip-width apart.',
            'Place arms flat by your sides, palms down for support.',
            'Engage your glutes and press through heels to lift hips until thighs and torso align.',
            'Squeeze your glutes firmly at the top without hyperextending your lower back.',
          ],
          breathingCue: 'Exhale as you lift hips; inhale as you lower slowly to the floor.',
          safetyModification: 'Place a small cushion under your head if neck feels strained.',
        },
        {
          id: 'ex_joint_2',
          name: 'Bird-Dog Core Stabilizer',
          illustration: 'birddog',
          targetMuscles: ['Erector Spinae', 'Glutes', 'Deltoids', 'Deep Core'],
          sets: 3,
          reps: '10 reps (5 per side)',
          restSeconds: 60,
          tempo: '2-2-2 (Controlled isometric pause at extension)',
          equipment: 'Padded mat',
          difficulty: 'Moderate',
          executionSteps: [
            'Start on hands and knees (tabletop position) with wrists under shoulders and knees under hips.',
            'Keep your spine completely neutral and abdominal wall braced.',
            'Simultaneously reach your right arm straight forward and left leg straight backward.',
            'Hold for 2 seconds with limbs parallel to the floor, then return and alternate sides.',
          ],
          breathingCue: 'Exhale on reach; inhale on return. Keep breathing fluid throughout.',
          safetyModification: 'If wrist or knee pain arises, elevate arms on a low chair, or lift only the legs.',
        },
        {
          id: 'ex_joint_3',
          name: 'Wall Sit Isometric Hold',
          illustration: 'wallsit',
          targetMuscles: ['Quadriceps', 'Glutes', 'Adductors'],
          sets: 3,
          reps: '25–35 seconds hold',
          restSeconds: 60,
          tempo: 'Isometric static hold',
          equipment: 'Smooth wall',
          difficulty: 'Moderate',
          executionSteps: [
            'Lean your back flat against a wall and slide down until knees are bent to approximately 90° (or 60° for beginner joint comfort).',
            'Ensure knees stay behind your toes and directly over your ankles.',
            'Press your lower back firmly against the wall and hold.',
          ],
          breathingCue: 'Breathe continuously in deep, relaxed diaphragmatic breaths; never hold breath.',
          safetyModification: 'Do not go down all the way to 90 degrees; a shallower 45-60 degree bend protects sensitive patellar cartilage.',
        },
        {
          id: 'ex_joint_4',
          name: 'Dead Bug Pelvic Stabilizer',
          illustration: 'deadbug',
          targetMuscles: ['Transverse Abdominis', 'Obliques', 'Hip Stabilizers'],
          sets: 3,
          reps: '12 alternating reaches',
          restSeconds: 45,
          tempo: '2-1-2 (Strict spinal contact)',
          equipment: 'Exercise mat',
          difficulty: 'Moderate',
          executionSteps: [
            'Lie on back with arms reaching up toward ceiling and knees bent at 90 degrees over hips.',
            'Press your lower back firmly into the floor so there is zero gap under your lumbar spine.',
            'Slowly lower your right arm overhead while extending your left leg toward the floor.',
            'Return to center and switch to the opposite arm and leg.',
          ],
          breathingCue: 'Exhale through pursed lips as you reach; inhale as you return to center.',
          safetyModification: 'Keep knees bent and only tap heels to the floor rather than extending legs fully.',
        },
      ],
    };
  }

  // ROUTINE C: Senior & Post-Rehab Foundation (Age >= 62)
  if (isSenior) {
    return {
      id: 'routine_senior_mobility',
      routineTitle: 'Senior Mobility, Balance & Fall-Prevention Routine',
      targetAudience: 'Active Seniors (Age 60+) and Gentle Movement Beginners',
      clinicalTag: 'Balance Confidence · Joint Sparing · Functional Autonomy',
      weeklyFrequency: '3 days per week',
      estimatedMinutes: 20,
      warmup: [
        '3 minutes seated head turns, shoulder rolls, and deep abdominal breathing',
        '2 minutes seated ankle circles and gentle wrist stretches',
      ],
      cooldown: [
        '2 minutes seated chest opening breath',
        '2 minutes gentle standing calf stretch holding a wall',
      ],
      medicalPrecautions: [
        'Always keep a stable chair or wall within arm’s reach for balance confidence.',
        'Never rush transitions from lying down to standing to avoid orthostatic dizziness.',
      ],
      exercises: [
        {
          id: 'ex_senior_1',
          name: 'Chair Sit-to-Stand (Functional Power)',
          illustration: 'squat',
          targetMuscles: ['Quads', 'Glutes', 'Core', 'Hamstrings'],
          sets: 3,
          reps: '8–10 reps',
          restSeconds: 60,
          tempo: '2-1-2',
          equipment: 'Sturdy armchair or dining chair',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Sit with upright posture, feet flat, shoulder-width apart.',
            'Lean slightly forward from the hips and stand up smoothly using your leg strength.',
            'Stand fully upright, pause for 1 second, then lower back down gently.',
          ],
          breathingCue: 'Exhale as you push up to standing; inhale on the controlled sit down.',
          safetyModification: 'Use chair arms to push off with your hands if needed.',
        },
        {
          id: 'ex_senior_2',
          name: 'Incline Wall Push-Up',
          illustration: 'pushup',
          targetMuscles: ['Chest', 'Shoulders', 'Arms'],
          sets: 3,
          reps: '10 reps',
          restSeconds: 60,
          tempo: '2-1-2',
          equipment: 'Wall',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Place hands on wall at shoulder height and width.',
            'Step feet back slightly to a comfortable angle.',
            'Bend elbows to bring nose gently toward wall.',
            'Push back smoothly until arms are straight.',
          ],
          breathingCue: 'Inhale toward wall, exhale pushing away.',
          safetyModification: 'Step feet closer for less effort.',
        },
        {
          id: 'ex_senior_3',
          name: 'Standing Calf Raise & Ankle Stability',
          illustration: 'calfraises',
          targetMuscles: ['Calves', 'Ankles', 'Balance'],
          sets: 3,
          reps: '12 reps',
          restSeconds: 45,
          tempo: '1-2-2',
          equipment: 'Chair back',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Hold the back of the chair with both hands.',
            'Rise up onto your tiptoes as high as comfortable.',
            'Hold 2 seconds, then lower heels softly.',
          ],
          breathingCue: 'Exhale up, inhale down.',
          safetyModification: 'Perform seated if balance feels shaky.',
        },
        {
          id: 'ex_senior_4',
          name: 'Doorway or Towel Isometric Row',
          illustration: 'row',
          targetMuscles: ['Upper Back', 'Posture Muscles'],
          sets: 3,
          reps: '10 reps',
          restSeconds: 60,
          tempo: '2-2-2',
          equipment: 'Doorway frame',
          difficulty: 'Gentle / Beginner',
          executionSteps: [
            'Stand in a doorway with hands grasping the door trim at chest height.',
            'Lean back slightly with straight arms.',
            'Pull chest toward the frame by squeezing shoulder blades together.',
          ],
          breathingCue: 'Exhale on pull, inhale on release.',
          safetyModification: 'Stand closer to doorway for gentle posture cue.',
        },
      ],
    };
  }

  // ROUTINE D: Progressive Hypertrophy & Muscle Gain
  if (isGain) {
    return {
      id: 'routine_muscle_gain',
      routineTitle: 'Progressive Home Hypertrophy & Lean Mass Builder',
      targetAudience: 'Individuals Focused on Weight & Muscle Gain / Body Recomposition',
      clinicalTag: 'Mechanical Tension · Progressive Overload · Hypertrophy Stimulus',
      weeklyFrequency: '4 days per week (e.g. Mon, Tue, Thu, Fri)',
      estimatedMinutes: 35,
      warmup: [
        '3 minutes arm circles, bodyweight air squats, and inchworms',
        '2 minutes thoracic spine open-books on the floor',
      ],
      cooldown: [
        '3 minutes full body static stretching (chest, quads, hamstrings, lats)',
        '2 minutes foam rolling or soft tissue massage with tennis ball',
      ],
      medicalPrecautions: [
        'Prioritize strict form over velocity; time under tension is key for hypertrophy.',
        'Allow 48 hours recovery between working the same muscle groups.',
      ],
      exercises: [
        {
          id: 'ex_gain_1',
          name: 'Tempo Bodyweight Squat (Piston Cadence)',
          illustration: 'squat',
          targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
          sets: 4,
          reps: '12–15 reps',
          restSeconds: 75,
          tempo: '3-0-1 (3 sec slow descent, explosive drive up)',
          equipment: 'Bodyweight',
          difficulty: 'Moderate',
          executionSteps: [
            'Stand with feet slightly wider than shoulders, toes angled out 15 degrees.',
            'Initiate by hinging hips back and bending knees simultaneously.',
            'Lower over 3 full seconds until thighs are parallel to the floor.',
            'Drive up through heels forcefully without locking knees at the top.',
          ],
          breathingCue: 'Inhale on the 3-second descent, exhale forcefully on the drive up.',
          safetyModification: 'Hold a 5-liter water jug or heavy book for loaded resistance once 15 reps is easy.',
        },
        {
          id: 'ex_gain_2',
          name: 'Chair / Stair Step-Up with High Knee Drive',
          illustration: 'stepup',
          targetMuscles: ['Glutes', 'Quadriceps', 'Calves', 'Unilateral Balance'],
          sets: 3,
          reps: '10–12 reps per leg',
          restSeconds: 60,
          tempo: '2-0-2',
          equipment: 'Sturdy chair or bottom stair step',
          difficulty: 'Challenging',
          executionSteps: [
            'Place entire right foot on a sturdy chair or step.',
            'Drive through the right heel to lift your body up, driving the left knee up to hip level.',
            'Lower under strict control without bouncing off the ground.',
            'Complete all reps on one leg before switching sides.',
          ],
          breathingCue: 'Exhale driving upward, inhale stepping back down.',
          safetyModification: 'Use a lower step (6-8 inches) if chair height feels unstable.',
        },
        {
          id: 'ex_gain_3',
          name: 'Standard / Incline Push-Up with Pause',
          illustration: 'pushup',
          targetMuscles: ['Pectorals (Chest)', 'Anterior Deltoids', 'Triceps'],
          sets: 4,
          reps: '10–15 reps',
          restSeconds: 75,
          tempo: '2-1-1 (2 sec down, 1 sec chest pause, 1 sec press)',
          equipment: 'Floor or couch edge',
          difficulty: 'Moderate',
          executionSteps: [
            'Place hands slightly wider than shoulder width.',
            'Brace core and glutes so your body forms a straight line from heels to head.',
            'Lower until chest is 1 inch off floor, pause for 1 second.',
            'Press through palms to lockout.',
          ],
          breathingCue: 'Inhale on way down, exhale driving up.',
          safetyModification: 'Place hands on a sofa or coffee table to modify difficulty.',
        },
        {
          id: 'ex_gain_4',
          name: 'Doorway / Sheet Isometric Back Row',
          illustration: 'row',
          targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Biceps'],
          sets: 4,
          reps: '12 reps',
          restSeconds: 60,
          tempo: '2-2-1 (2 sec pull, 2 sec squeeze, 1 sec release)',
          equipment: 'Sturdy doorway frame or towel knotted in door',
          difficulty: 'Moderate',
          executionSteps: [
            'Grip door frame with palms facing inward, feet close to base of frame.',
            'Lean back until arms are straight, keeping body in a rigid plank.',
            'Pull chest to frame by driving elbows back behind your torso.',
            'Pinch shoulder blades hard together at the top for 2 seconds.',
          ],
          breathingCue: 'Exhale on pull, inhale lowering back.',
          safetyModification: 'Walk feet further back for less bodyweight angle.',
        },
      ],
    };
  }

  // ROUTINE E: Standard Metabolic Fat Burn & Home Tone (Default Weight Loss)
  return {
    id: 'routine_metabolic_fat_burn',
    routineTitle: 'Metabolic Fat Loss & Full-Body Conditioning',
    targetAudience: 'Standard Weight Loss & Healthy Active Individuals',
    clinicalTag: 'Calorie Burn Accelerator · Lean Muscle Preservation · Home Calisthenics',
    weeklyFrequency: '3–4 days per week (e.g. Mon, Wed, Fri, Sat)',
    estimatedMinutes: 28,
    warmup: [
      '3 minutes brisk marching in place, hip openers, and arm swings',
      '2 minutes gentle torso twists and cat-cow spine mobility',
    ],
    cooldown: [
      '3 minutes slow recovery walking with deep diaphragmatic breaths',
      '2 minutes hamstring, chest, and quad static stretches (hold 20-30s each)',
    ],
    medicalPrecautions: [
      'Stay well hydrated before, during, and after training.',
      'Maintain continuous core bracing to protect lumbar spine.',
    ],
    exercises: [
      {
        id: 'ex_burn_1',
        name: 'Bodyweight Squat to Chair Tap',
        illustration: 'squat',
        targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Core'],
        sets: 3,
        reps: '15 reps',
        restSeconds: 60,
        tempo: '2-0-2 (Continuous metabolic pace)',
        equipment: 'Chair for depth gauge (optional)',
        difficulty: 'Moderate',
        executionSteps: [
          'Stand with feet shoulder-width apart, arms out for counter-balance.',
          'Hinge hips back and bend knees, sitting down until hips are parallel to knees.',
          'Drive through heels to stand, squeezing glutes at the top.',
        ],
        breathingCue: 'Inhale lowering down, exhale rising up.',
        safetyModification: 'Reduce depth if knees feel strain.',
      },
      {
        id: 'ex_burn_2',
        name: 'Incline Push-Up (Countertop or Wall)',
        illustration: 'pushup',
        targetMuscles: ['Chest', 'Triceps', 'Core Stabilizers'],
        sets: 3,
        reps: '12–15 reps',
        restSeconds: 60,
        tempo: '2-0-1',
        equipment: 'Kitchen counter or sturdy table',
        difficulty: 'Moderate',
        executionSteps: [
          'Place hands on counter edge, body aligned in a strong plank.',
          'Lower chest to counter by bending elbows at 45 degrees.',
          'Press back to full extension.',
        ],
        breathingCue: 'Inhale descending, exhale pushing away.',
        safetyModification: 'Use a higher surface or wall to reduce difficulty.',
      },
      {
        id: 'ex_burn_3',
        name: 'Glute Bridge with 2-Second Peak Squeeze',
        illustration: 'bridge',
        targetMuscles: ['Glutes', 'Hamstrings', 'Lower Back'],
        sets: 3,
        reps: '15 reps',
        restSeconds: 45,
        tempo: '2-2-2',
        equipment: 'Yoga mat or carpet',
        difficulty: 'Gentle / Beginner',
        executionSteps: [
          'Lie on back with knees bent and feet flat on the floor.',
          'Lift hips toward ceiling until thighs and torso align.',
          'Hold and squeeze glutes hard for 2 seconds at the top.',
          'Lower slowly.',
        ],
        breathingCue: 'Exhale lifting, inhale lowering.',
        safetyModification: 'Keep hands on floor to steady hips.',
      },
      {
        id: 'ex_burn_4',
        name: 'Bird-Dog Quadruped Extension',
        illustration: 'birddog',
        targetMuscles: ['Spinal Erectors', 'Glutes', 'Core Stabilizers'],
        sets: 3,
        reps: '12 alternating reps (6 per side)',
        restSeconds: 45,
        tempo: '2-1-2',
        equipment: 'Padded mat',
        difficulty: 'Moderate',
        executionSteps: [
          'Start on hands and knees with flat back.',
          'Extend right arm forward and left leg backward simultaneously.',
          'Pause for 1 second, return and alternate to opposite side.',
        ],
        breathingCue: 'Exhale on extension, inhale returning to center.',
        safetyModification: 'Only extend leg if balancing arm feels challenging.',
      },
      {
        id: 'ex_burn_5',
        name: 'Wall Sit Isometric Burnout',
        illustration: 'wallsit',
        targetMuscles: ['Quadriceps', 'Glutes', 'Mental Grit'],
        sets: 2,
        reps: '30–45 seconds hold',
        restSeconds: 60,
        tempo: 'Static Isometric',
        equipment: 'Smooth wall',
        difficulty: 'Moderate',
        executionSteps: [
          'Sit against wall with thighs parallel to floor.',
          'Keep knees stacked directly above ankles.',
          'Press arms against wall or keep on chest, breathing deeply until timer ends.',
        ],
        breathingCue: 'Continuous, slow rhythmic breathing.',
        safetyModification: 'Slide up 2-3 inches higher for less quad intensity.',
      },
    ],
  };
}
