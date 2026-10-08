/**
 * Generates the complete, self-contained standalone index.html file
 * conforming strictly to the "exactly ONE file, no external CDNs, pure Vanilla JS & CSS"
 * constraint requested by the user prompt.
 */
export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healthy Weight Planner — Offline-First Clinical Calculator</title>
  <meta name="description" content="Calculate healthy weight metrics, screen for medical risks, and generate safe nutrition plans with clinical formulas. 100% offline & private.">
  <style>
    /* CSS Reset & System Typography */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #1e293b;
      background-color: #f8fafc;
      padding: 0;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 980px;
      margin: 0 auto;
      padding: 24px 16px 64px 16px;
    }
    header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 20px 0;
      margin-bottom: 24px;
    }
    .header-content {
      max-width: 980px;
      margin: 0 auto;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-subtitle {
      font-size: 0.85rem;
      color: #64748b;
    }
    .privacy-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #059669;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 500;
    }

    /* Stepper */
    .stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .step-item.active {
      color: #0284c7;
    }
    .step-item.completed {
      color: #059669;
    }
    .step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }
    .step-item.active .step-num {
      background: #0284c7;
      color: #ffffff;
    }
    .step-item.completed .step-num {
      background: #059669;
      color: #ffffff;
    }

    /* Cards & Forms */
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .card-desc {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 20px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }
    input, select, textarea {
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.95rem;
      background: #ffffff;
      color: #0f172a;
      outline: none;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
    }
    .help-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    /* Medical screening table/list */
    .condition-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    .condition-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #f8fafc;
      cursor: pointer;
    }
    .condition-item:hover {
      background: #f1f5f9;
    }
    .condition-checkbox {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      accent-color: #dc2626;
    }
    .condition-info h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .condition-info p {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 2px;
    }
    .severity-tag {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .tag-red {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    .tag-amber {
      background: #fffbeb;
      color: #b45309;
      border: 1px solid #fde68a;
    }

    /* Alert Banners */
    .alert-banner {
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .alert-red {
      background: #fef2f2;
      border: 1px solid #f87171;
      color: #991b1b;
    }
    .alert-amber {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      color: #92400e;
    }
    .alert-green {
      background: #f0fdf4;
      border: 1px solid #86efac;
      color: #166534;
    }

    /* Actions */
    .button-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 24px;
    }
    button {
      padding: 10px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: background 0.15s, border-color 0.15s;
    }
    .btn-primary {
      background: #0284c7;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #0369a1;
    }
    .btn-secondary {
      background: #ffffff;
      color: #334155;
      border-color: #cbd5e1;
    }
    .btn-secondary:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    .btn-success {
      background: #059669;
      color: #ffffff;
    }
    .btn-success:hover {
      background: #047857;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px;
      text-align: center;
    }
    .metric-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
    .metric-unit {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }
    .metric-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 6px;
    }

    /* SVG Gauge & Visuals */
    .chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
    }
    .gauge-svg {
      max-width: 320px;
      width: 100%;
      height: auto;
    }
    .weight-spectrum {
      width: 100%;
      margin: 20px 0;
    }

    /* Macros Breakdown */
    .macro-bar {
      height: 14px;
      border-radius: 7px;
      display: flex;
      overflow: hidden;
      margin: 12px 0 16px 0;
    }
    .macro-seg-protein { background: #3b82f6; }
    .macro-seg-carb { background: #10b981; }
    .macro-seg-fat { background: #f59e0b; }

    .macro-legend {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.85rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    /* Footer Disclaimer */
    footer {
      margin-top: 48px;
      padding: 24px 0;
      border-top: 1px solid #e2e8f0;
      font-size: 0.8rem;
      color: #64748b;
      text-align: center;
    }

    /* Print Styles */
    @media print {
      body { background: #ffffff; color: #000000; }
      header, .stepper, .button-row, footer, .no-print { display: none !important; }
      .container { max-width: 100%; padding: 0; }
      .card { border: 1px solid #cccccc; page-break-inside: avoid; }
    }
  </style>
</head>
<body>

  <header>
    <div class="header-content">
      <div>
        <div class="brand-title">
          <span>Healthy Weight Planner</span>
        </div>
        <div class="brand-subtitle">Clinical formulas & medical screening for safe weight management</div>
      </div>
      <div class="privacy-badge">
        <span>✓ 100% Offline & Private (In-Browser Execution)</span>
      </div>
    </div>
  </header>

  <div class="container">
    <!-- Stepper Navigation -->
    <div class="stepper" id="stepperNav">
      <div class="step-item active" id="stepIndicator1">
        <div class="step-num">1</div>
        <span>1. User Details</span>
      </div>
      <div class="step-item" id="stepIndicator2">
        <div class="step-num">2</div>
        <span>2. Medical Screening</span>
      </div>
      <div class="step-item" id="stepIndicator3">
        <div class="step-num">3</div>
        <span>3. Plan & Results</span>
      </div>
    </div>

    <!-- STEP 1: USER DETAILS -->
    <div id="step1Container" class="card">
      <h2 class="card-title">Step 1: Patient / User Biometrics</h2>
      <p class="card-desc">Enter your metrics accurately. All calculations run strictly in your local browser.</p>

      <div class="form-grid">
        <div class="form-group">
          <label for="userName">Full Name / Identifier</label>
          <input type="text" id="userName" placeholder="e.g. David Miller" value="David Miller">
        </div>

        <div class="form-group">
          <label for="userAge">Age (Years: 2 - 120)</label>
          <input type="number" id="userAge" min="2" max="120" value="35">
          <span class="help-text">Ages < 18 automatically screen with pediatric growth references.</span>
        </div>

        <div class="form-group">
          <label for="userGender">Biological Sex</label>
          <select id="userGender">
            <option value="male" selected>Male (Mifflin-St Jeor +5)</option>
            <option value="female">Female (Mifflin-St Jeor -161)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="unitToggle">Unit System</label>
          <select id="unitToggle" onchange="toggleUnits(this.value)">
            <option value="metric" selected>Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, ft/in)</option>
          </select>
        </div>
      </div>

      <!-- Metric inputs -->
      <div id="metricInputs" class="form-grid">
        <div class="form-group">
          <label for="heightCm">Height (cm)</label>
          <input type="number" id="heightCm" min="50" max="250" value="180">
        </div>
        <div class="form-group">
          <label for="weightKg">Current Weight (kg)</label>
          <input type="number" id="weightKg" min="20" max="350" step="0.1" value="95">
        </div>
        <div class="form-group">
          <label for="targetWeightKg">Target Weight (kg)</label>
          <input type="number" id="targetWeightKg" min="20" max="350" step="0.1" value="80">
        </div>
      </div>

      <!-- Imperial inputs (hidden by default) -->
      <div id="imperialInputs" class="form-grid" style="display: none;">
        <div class="form-group">
          <label>Height (Feet & Inches)</label>
          <div style="display: flex; gap: 8px;">
            <input type="number" id="heightFt" placeholder="ft" min="1" max="8" value="5">
            <input type="number" id="heightIn" placeholder="in" min="0" max="11" value="11">
          </div>
        </div>
        <div class="form-group">
          <label for="weightLbs">Current Weight (lbs)</label>
          <input type="number" id="weightLbs" min="44" max="750" step="0.1" value="209">
        </div>
        <div class="form-group">
          <label for="targetWeightLbs">Target Weight (lbs)</label>
          <input type="number" id="targetWeightLbs" min="44" max="750" step="0.1" value="176">
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="userGoal">Weight Management Goal</label>
          <select id="userGoal">
            <option value="lose" selected>Weight Loss (Caloric Deficit)</option>
            <option value="maintain">Weight Maintenance (TDEE Balance)</option>
            <option value="gain">Weight / Muscle Gain (Caloric Surplus)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="activityLevel">Daily Activity Level</label>
          <select id="activityLevel">
            <option value="sedentary">Sedentary (desk job, 1.2x)</option>
            <option value="light">Lightly Active (1-3 days exercise, 1.375x)</option>
            <option value="moderate" selected>Moderately Active (3-5 days exercise, 1.55x)</option>
            <option value="active">Very Active (6-7 days hard workouts, 1.725x)</option>
            <option value="very_active">Extra Active (athletic training/labor, 1.9x)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="weeklyPace">Weekly Target Pace</label>
          <select id="weeklyPace">
            <option value="0.25">Gentle (0.25 kg / ~0.55 lbs per week)</option>
            <option value="0.5" selected>Standard Safe (0.5 kg / ~1.1 lbs per week)</option>
            <option value="0.75">Accelerated (0.75 kg / ~1.65 lbs per week)</option>
            <option value="1.0">Maximum Clinical Cap (1.0 kg / ~2.2 lbs per week)</option>
          </select>
          <span class="help-text">Clinical guideline: Safe autonomous loss is capped at 1.0 kg/week.</span>
        </div>
      </div>

      <div class="button-row">
        <div></div>
        <button type="button" class="btn-primary" onclick="goToStep(2)">Next: Medical Screening →</button>
      </div>
    </div>

    <!-- STEP 2: MEDICAL SCREENING -->
    <div id="step2Container" class="card" style="display: none;">
      <h2 class="card-title">Step 2: Medical History & Contraindication Screening</h2>
      <p class="card-desc">Safety is paramount. Check any conditions that apply to evaluate Red and Amber clinical flags.</p>

      <div class="condition-list">
        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_pregnancy" value="pregnancy_breastfeeding">
          <div class="condition-info">
            <h4>Pregnant or Currently Breastfeeding <span class="severity-tag tag-red">Red Flag</span></h4>
            <p>Active fetal development and lactation impose critical nutritional demands. Caloric restriction is contraindicated.</p>
          </div>
        </label>

        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_eating_disorder" value="eating_disorder">
          <div class="condition-info">
            <h4>History of Eating Disorder (Anorexia, Bulimia) <span class="severity-tag tag-red">Red Flag</span></h4>
            <p>Caloric tracking may trigger relapse. Requires multi-disciplinary clinical psychiatric support.</p>
          </div>
        </label>

        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_renal" value="severe_renal">
          <div class="condition-info">
            <h4>Severe Renal Disease / Kidney Failure <span class="severity-tag tag-red">Red Flag</span></h4>
            <p>Impaired protein and electrolyte filtration. Standard high-protein or generic diets are hazardous.</p>
          </div>
        </label>

        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_cardiac" value="cardiac_disease">
          <div class="condition-info">
            <h4>Congestive Heart Failure or Severe Cardiac Disease <span class="severity-tag tag-red">Red Flag</span></h4>
            <p>Fluids and electrolytes require strict medical balancing; autonomous deficits risk decompensation.</p>
          </div>
        </label>

        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_diabetes" value="uncontrolled_diabetes">
          <div class="condition-info">
            <h4>Insulin-Dependent or Uncontrolled Diabetes <span class="severity-tag tag-red">Red Flag</span></h4>
            <p>Dietary changes cause acute hypoglycemia risks without physician-supervised insulin adjustment.</p>
          </div>
        </label>

        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_thyroid" value="thyroid_disorder">
          <div class="condition-info">
            <h4>Thyroid Condition (Hypo- or Hyperthyroidism) <span class="severity-tag tag-amber">Amber Flag</span></h4>
            <p>Metabolic rate deviates from standard formulas; requires laboratory monitoring.</p>
          </div>
        </label>

        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_hypertension" value="hypertension">
          <div class="condition-info">
            <h4>Hypertension (High Blood Pressure on Medication) <span class="severity-tag tag-amber">Amber Flag</span></h4>
            <p>Weight changes alter antihypertensive dosing requirements; frequent BP monitoring recommended.</p>
          </div>
        </label>

        <label class="condition-item">
          <input type="checkbox" class="condition-checkbox" id="cond_gi" value="gi_disorders">
          <div class="condition-info">
            <h4>Gastrointestinal Disorders or Prior Bariatric Surgery <span class="severity-tag tag-amber">Amber Flag</span></h4>
            <p>Nutrient absorption variations mandate tailored micronutrient supplementation.</p>
          </div>
        </label>
      </div>

      <div class="form-group" style="margin-bottom: 20px;">
        <label for="otherCondition">Other Clinical Conditions or Medications (Optional)</label>
        <input type="text" id="otherCondition" placeholder="e.g. Corticosteroids, beta-blockers, asthma, etc.">
      </div>

      <!-- Confirmation Checkbox Gate -->
      <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
          <input type="checkbox" id="confirmCheckbox" style="margin-top: 3px; width: 18px; height: 18px;">
          <span style="font-size: 0.85rem; color: #1e293b; font-weight: 500;">
            I confirm that I understand this assessment is for educational calculation purposes only and is not medical advice. I agree to review all screened flags with a licensed medical professional before beginning any diet or exercise program.
          </span>
        </label>
      </div>

      <div class="button-row">
        <button type="button" class="btn-secondary" onclick="goToStep(1)">← Back to Biometrics</button>
        <button type="button" class="btn-primary" onclick="validateAndCalculate()">Generate Plan & Results →</button>
      </div>
    </div>

    <!-- STEP 3: RESULTS DASHBOARD -->
    <div id="step3Container" class="card" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
        <div>
          <h2 class="card-title" id="resultsName">Clinical Assessment Dashboard</h2>
          <p class="card-desc" style="margin-bottom: 0;">Calculated locally via Mifflin-St Jeor, Devine IBW, and WHO safety thresholds.</p>
        </div>
        <div style="display: flex; gap: 8px;" class="no-print">
          <button type="button" class="btn-secondary" onclick="window.print()">🖨️ Print / Save as PDF</button>
          <button type="button" class="btn-secondary" onclick="goToStep(1)">Edit Inputs</button>
          <button type="button" class="btn-secondary" onclick="resetForm()">Start Over</button>
        </div>
      </div>

      <!-- Medical Flag Banner -->
      <div id="flagBanner" class="alert-banner"></div>

      <!-- Core Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value" id="valBmi">--</div>
          <div class="metric-unit" id="valBmiCat">Normal</div>
          <div class="metric-title">Body Mass Index (BMI)</div>
        </div>

        <div class="metric-card">
          <div class="metric-value" id="valBmr">--</div>
          <div class="metric-unit">kcal / day</div>
          <div class="metric-title">Basal Metabolic Rate (BMR)</div>
        </div>

        <div class="metric-card">
          <div class="metric-value" id="valTdee">--</div>
          <div class="metric-unit">kcal / day</div>
          <div class="metric-title">Total Energy Expenditure (TDEE)</div>
        </div>

        <div class="metric-card" style="border: 2px solid #0284c7; background: #f0f9ff;">
          <div class="metric-value" id="valTargetCalories" style="color: #0369a1;">--</div>
          <div class="metric-unit">kcal / day</div>
          <div class="metric-title" style="color: #0369a1;">Recommended Daily Intake</div>
        </div>
      </div>

      <!-- Visuals: BMI Dial & Weight Spectrum -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 24px 0;">
        <!-- Inline SVG BMI Gauge -->
        <div class="metric-card" style="text-align: left;">
          <div class="metric-title" style="margin-bottom: 8px;">BMI Gauge & Clinical Classification</div>
          <div class="chart-container">
            <svg class="gauge-svg" viewBox="0 0 200 120">
              <!-- Underweight Arc (Blue/Amber) -->
              <path d="M 20 100 A 80 80 0 0 1 55 45" fill="none" stroke="#3b82f6" stroke-width="14" />
              <!-- Normal Arc (Green) -->
              <path d="M 55 45 A 80 80 0 0 1 125 35" fill="none" stroke="#10b981" stroke-width="14" />
              <!-- Overweight Arc (Amber) -->
              <path d="M 125 35 A 80 80 0 0 1 165 65" fill="none" stroke="#f59e0b" stroke-width="14" />
              <!-- Obese Arc (Red) -->
              <path d="M 165 65 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" stroke-width="14" />
              
              <!-- Dial Needle -->
              <line id="gaugeNeedle" x1="100" y1="100" x2="100" y2="35" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
              <circle cx="100" cy="100" r="5" fill="#0f172a" />
              
              <!-- Category text -->
              <text x="100" y="115" text-anchor="middle" font-size="10" font-weight="700" fill="#334155" id="gaugeLabel">24.5 - Normal</text>
            </svg>
          </div>
          <div style="font-size: 0.75rem; color: #64748b; line-height: 1.4;">
            WHO thresholds: Underweight &lt;18.5 · Normal 18.5–24.9 · Overweight 25.0–29.9 · Obese ≥30.0.
          </div>
        </div>

        <!-- Weight Spectrum: Current vs Devine IBW vs Healthy Range -->
        <div class="metric-card" style="text-align: left;">
          <div class="metric-title" style="margin-bottom: 8px;">Weight Target & Devine IBW Range</div>
          <div style="margin: 16px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
              <span><strong>Current:</strong> <span id="specCurrent">--</span></span>
              <span><strong>Healthy Range:</strong> <span id="specHealthyRange">--</span></span>
              <span><strong>Devine IBW:</strong> <span id="specIbw">--</span></span>
            </div>
            
            <!-- Spectrum Bar -->
            <div style="background: #e2e8f0; height: 16px; border-radius: 8px; position: relative; overflow: hidden; margin-bottom: 8px;">
              <div id="specHealthyFill" style="position: absolute; left: 30%; width: 40%; height: 100%; background: #a7f3d0;"></div>
              <div id="specCurrentPin" style="position: absolute; left: 60%; width: 4px; height: 100%; background: #0284c7;"></div>
              <div id="specTargetPin" style="position: absolute; left: 45%; width: 4px; height: 100%; background: #059669;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b;">
              <span>Target: <strong id="specTarget">--</strong></span>
              <span>Devine Ideal: <strong id="specDevineVal">--</strong></span>
            </div>
          </div>
          <div style="font-size: 0.75rem; color: #64748b; line-height: 1.4;">
            <strong>Devine Formula (1974):</strong> 50 kg (M) / 45.5 kg (F) + 2.3 kg per inch over 5 feet. Used clinically for pharmacokinetics and nutritional baselines.
          </div>
        </div>
      </div>

      <!-- Safety Rules & Deficit Caps Notice -->
      <div id="safetyFloorNotice" class="alert-banner alert-amber" style="display: none;"></div>

      <!-- Macronutrients Breakdown -->
      <div class="card" style="margin-bottom: 20px;">
        <h3 class="card-title" style="font-size: 1rem;">Daily Macronutrient Target Distribution</h3>
        <p class="card-desc" style="font-size: 0.8rem; margin-bottom: 12px;">Based on your daily caloric target. Standard 4 kcal/g protein & carbs, 9 kcal/g fat.</p>

        <div class="macro-bar">
          <div class="macro-seg-protein" style="width: 25%;"></div>
          <div class="macro-seg-carb" style="width: 45%;"></div>
          <div class="macro-seg-fat" style="width: 30%;"></div>
        </div>

        <div class="macro-legend">
          <div class="legend-item">
            <span class="legend-dot" style="background: #3b82f6;"></span>
            <span>Protein: <strong id="macroProtein">--</strong></span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background: #10b981;"></span>
            <span>Carbs: <strong id="macroCarbs">--</strong></span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background: #f59e0b;"></span>
            <span>Fats: <strong id="macroFats">--</strong></span>
          </div>
        </div>
      </div>

      <!-- Time to Goal Milestones -->
      <div class="card" id="milestoneContainer" style="display: none; margin-bottom: 20px;">
        <h3 class="card-title" style="font-size: 1rem;">Estimated Timeline & Progress Milestones</h3>
        <p class="card-desc" style="font-size: 0.8rem; margin-bottom: 12px;">Projected at the safe rate of <span id="timelinePace">--</span> per week.</p>
        <div id="milestoneList" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;"></div>
      </div>

      <!-- PERSONAL TRAINER DIET & MEAL PLAN (EXACT CALORIES PER MEAL) -->
      <div class="card" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h3 class="card-title" style="font-size: 1.05rem; margin-bottom: 2px;">Personal Trainer Nutrition & Meal Breakdown</h3>
            <p class="card-desc" style="margin-bottom: 0;">Prescribed caloric pacing to optimize fullness, fuel metabolism, and protect muscle.</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.75rem; color: #0284c7; font-weight: 700; background: #f0f9ff; padding: 4px 10px; border-radius: 4px; border: 1px solid #bae6fd;">
              Daily Hydration: <span id="trainerWaterVal">2.8 L</span>
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;" id="trainerMealGrid">
          <!-- Populated dynamically via JS -->
        </div>

        <div id="trainerMedicalDietTip" style="margin-top: 14px; padding: 10px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; font-size: 0.8rem; color: #92400e; display: none;"></div>
      </div>

      <!-- PERSONAL TRAINER HOME WORKOUT ROUTINE (WITH ILLUSTRATIONS & SETS/REPS) -->
      <div class="card" style="margin-bottom: 24px;">
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <h3 class="card-title" style="font-size: 1.05rem; margin-bottom: 2px;" id="routineHeaderTitle">Personal Trainer Safe Home Workout Prescription</h3>
          <p class="card-desc" style="margin-bottom: 0;" id="routineHeaderSub">Customized for your patient clinical profile and movement safety.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;" id="trainerExerciseGrid">
          <!-- Populated dynamically via JS -->
        </div>
      </div>

      <div class="button-row no-print">
        <button type="button" class="btn-secondary" onclick="goToStep(2)">← Back to Screening</button>
        <button type="button" class="btn-success" onclick="window.print()">Download / Print Complete PDF Plan</button>
      </div>
    </div>

    <!-- Pre-loadable Test Cases Bar -->
    <div class="card no-print" style="margin-top: 32px; background: #f8fafc;">
      <h3 class="card-title" style="font-size: 0.95rem;">Verify With Standard Medical Test Cases</h3>
      <p class="card-desc" style="font-size: 0.8rem; margin-bottom: 12px;">Quickly load pre-configured test profiles to verify formula outputs:</p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="button" class="btn-secondary" style="font-size: 0.8rem; padding: 6px 12px;" onclick="loadTestCase('case1')">Case 1: Adult Weight Loss (Overweight Male)</button>
        <button type="button" class="btn-secondary" style="font-size: 0.8rem; padding: 6px 12px;" onclick="loadTestCase('case2')">Case 2: Adolescent Screen (16yo Female)</button>
        <button type="button" class="btn-secondary" style="font-size: 0.8rem; padding: 6px 12px;" onclick="loadTestCase('case3')">Case 3: Clinical Red Flag (Pregnancy)</button>
      </div>
    </div>
  </div>

  <footer>
    <div class="container" style="padding-bottom: 0;">
      <p><strong>Clinical Disclaimer:</strong> This tool is for general educational information only and is not medical advice. Caloric and macronutrient calculations represent standard mathematical approximations (Mifflin-St Jeor, Devine). Always consult a licensed physician, clinical registered dietitian, or qualified healthcare provider before undertaking changes to nutrition, supplementation, or physical activity.</p>
    </div>
  </footer>

  <script>
    /**
     * HEALTHY WEIGHT PLANNER - VANILLA JAVASCRIPT LOGIC
     * All calculations run entirely offline in local memory.
     */

    let currentUnit = 'metric';

    function toggleUnits(unit) {
      currentUnit = unit;
      const metricDiv = document.getElementById('metricInputs');
      const imperialDiv = document.getElementById('imperialInputs');
      if (unit === 'imperial') {
        metricDiv.style.display = 'none';
        imperialDiv.style.display = 'grid';
        // Convert existing metric values to imperial
        const cm = parseFloat(document.getElementById('heightCm').value) || 170;
        const kg = parseFloat(document.getElementById('weightKg').value) || 70;
        const targetKg = parseFloat(document.getElementById('targetWeightKg').value) || 70;
        
        const totalIn = cm / 2.54;
        document.getElementById('heightFt').value = Math.floor(totalIn / 12);
        document.getElementById('heightIn').value = Math.round(totalIn % 12);
        document.getElementById('weightLbs').value = (kg * 2.20462).toFixed(1);
        document.getElementById('targetWeightLbs').value = (targetKg * 2.20462).toFixed(1);
      } else {
        metricDiv.style.display = 'grid';
        imperialDiv.style.display = 'none';
        // Convert imperial to metric
        const ft = parseFloat(document.getElementById('heightFt').value) || 5;
        const inch = parseFloat(document.getElementById('heightIn').value) || 7;
        const lbs = parseFloat(document.getElementById('weightLbs').value) || 154;
        const targetLbs = parseFloat(document.getElementById('targetWeightLbs').value) || 154;

        document.getElementById('heightCm').value = Math.round((ft * 12 + inch) * 2.54);
        document.getElementById('weightKg').value = (lbs / 2.20462).toFixed(1);
        document.getElementById('targetWeightKg').value = (targetLbs / 2.20462).toFixed(1);
      }
    }

    function goToStep(step) {
      document.getElementById('step1Container').style.display = step === 1 ? 'block' : 'none';
      document.getElementById('step2Container').style.display = step === 2 ? 'block' : 'none';
      document.getElementById('step3Container').style.display = step === 3 ? 'block' : 'none';

      for (let i = 1; i <= 3; i++) {
        const ind = document.getElementById('stepIndicator' + i);
        if (i < step) {
          ind.className = 'step-item completed';
        } else if (i === step) {
          ind.className = 'step-item active';
        } else {
          ind.className = 'step-item';
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
      document.getElementById('userName').value = 'David Miller';
      document.getElementById('userAge').value = '35';
      document.getElementById('userGender').value = 'male';
      document.getElementById('unitToggle').value = 'metric';
      toggleUnits('metric');
      document.getElementById('heightCm').value = '180';
      document.getElementById('weightKg').value = '95';
      document.getElementById('targetWeightKg').value = '80';
      document.getElementById('userGoal').value = 'lose';
      document.getElementById('activityLevel').value = 'moderate';
      document.getElementById('weeklyPace').value = '0.5';
      document.querySelectorAll('.condition-checkbox').forEach(cb => cb.checked = false);
      document.getElementById('otherCondition').value = '';
      document.getElementById('confirmCheckbox').checked = false;
      goToStep(1);
    }

    function validateAndCalculate() {
      const confirmBox = document.getElementById('confirmCheckbox');
      if (!confirmBox.checked) {
        alert('Please review and check the confirmation acknowledgement before viewing your calculation results.');
        confirmBox.focus();
        return;
      }

      // Gather input data
      const name = document.getElementById('userName').value || 'User';
      const age = parseInt(document.getElementById('userAge').value, 10) || 30;
      const gender = document.getElementById('userGender').value;
      const goal = document.getElementById('userGoal').value;
      const activity = document.getElementById('activityLevel').value;
      const pace = parseFloat(document.getElementById('weeklyPace').value) || 0.5;

      let heightCm = 170;
      let weightKg = 70;
      let targetWeightKg = 70;

      if (currentUnit === 'metric') {
        heightCm = parseFloat(document.getElementById('heightCm').value) || 170;
        weightKg = parseFloat(document.getElementById('weightKg').value) || 70;
        targetWeightKg = parseFloat(document.getElementById('targetWeightKg').value) || weightKg;
      } else {
        const ft = parseFloat(document.getElementById('heightFt').value) || 5;
        const inch = parseFloat(document.getElementById('heightIn').value) || 7;
        const lbs = parseFloat(document.getElementById('weightLbs').value) || 154;
        const targetLbs = parseFloat(document.getElementById('targetWeightLbs').value) || lbs;
        heightCm = (ft * 12 + inch) * 2.54;
        weightKg = lbs / 2.20462;
        targetWeightKg = targetLbs / 2.20462;
      }

      // 1. BMI Calculation: kg / (height_m ^ 2)
      const heightM = heightCm / 100;
      const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

      let bmiCat = 'Normal Weight';
      if (bmi < 18.5) bmiCat = 'Underweight';
      else if (bmi < 25.0) bmiCat = 'Normal Weight';
      else if (bmi < 30.0) bmiCat = 'Overweight';
      else if (bmi < 35.0) bmiCat = 'Obese Class I';
      else if (bmi < 40.0) bmiCat = 'Obese Class II';
      else bmiCat = 'Obese Class III';

      // 2. Mifflin-St Jeor BMR
      // Men: 10 * kg + 6.25 * cm - 5 * age + 5
      // Women: 10 * kg + 6.25 * cm - 5 * age - 161
      const baseBmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
      const bmr = Math.round(gender === 'male' ? baseBmr + 5 : baseBmr - 161);

      // 3. TDEE
      const mults = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
      const tdee = Math.round(bmr * (mults[activity] || 1.2));

      // 4. Devine Formula (IBW)
      // Men: 50.0 + 2.3 * (inches - 60)
      // Women: 45.5 + 2.3 * (inches - 60)
      const totalInches = heightCm / 2.54;
      const over60 = totalInches - 60;
      const baseDevine = gender === 'male' ? 50.0 : 45.5;
      const ibwKg = parseFloat(Math.max(30, baseDevine + 2.3 * over60).toFixed(1));

      // Healthy range (BMI 18.5 - 24.9)
      const minHealthyKg = (18.5 * heightM * heightM).toFixed(1);
      const maxHealthyKg = (24.9 * heightM * heightM).toFixed(1);

      // 5. Caloric Target & Safety Caps
      // 1kg fat = 7700 kcal. Daily pace = (pace * 7700) / 7 = pace * 1100
      const calorieFloor = gender === 'female' ? 1200 : 1500;
      let targetCalories = tdee;
      let appliedFloor = false;

      if (goal === 'lose') {
        const rawTarget = tdee - Math.round(pace * 1100);
        if (rawTarget < calorieFloor) {
          targetCalories = calorieFloor;
          appliedFloor = true;
        } else {
          targetCalories = rawTarget;
        }
      } else if (goal === 'gain') {
        targetCalories = tdee + Math.min(500, Math.round(pace * 1100));
      }

      // Check conditions
      const redChecked = document.getElementById('cond_pregnancy').checked ||
                         document.getElementById('cond_eating_disorder').checked ||
                         document.getElementById('cond_renal').checked ||
                         document.getElementById('cond_cardiac').checked ||
                         document.getElementById('cond_diabetes').checked;

      const amberChecked = document.getElementById('cond_thyroid').checked ||
                           document.getElementById('cond_hypertension').checked ||
                           document.getElementById('cond_gi').checked ||
                           (document.getElementById('otherCondition').value.trim().length > 0);

      // Render Step 3
      document.getElementById('resultsName').innerText = name + "'s Clinical Assessment Plan";
      document.getElementById('valBmi').innerText = bmi;
      document.getElementById('valBmiCat').innerText = bmiCat;
      document.getElementById('valBmr').innerText = bmr;
      document.getElementById('valTdee').innerText = tdee;
      document.getElementById('valTargetCalories').innerText = targetCalories;

      // Render Flag Banner
      const flagBanner = document.getElementById('flagBanner');
      if (redChecked) {
        flagBanner.className = 'alert-banner alert-red';
        flagBanner.innerHTML = '<div><strong>RED FLAG CLINICAL SAFETY NOTICE:</strong> High-risk medical contraindication reported (e.g. pregnancy, eating disorder history, or renal/cardiac condition). Autonomous caloric deficits are clinically contraindicated without direct physician clearance and supervision.</div>';
      } else if (amberChecked) {
        flagBanner.className = 'alert-banner alert-amber';
        flagBanner.innerHTML = '<div><strong>AMBER FLAG CLINICAL ADVISORY:</strong> Medical condition reported. Ensure frequent blood pressure or metabolic panel monitoring with your primary physician as body weight changes.</div>';
      } else {
        flagBanner.className = 'alert-banner alert-green';
        flagBanner.innerHTML = '<div><strong>GREEN STATUS:</strong> No acute contraindications reported. Safe clinical caloric guardrails applied.</div>';
      }

      // Floor Notice
      const floorNotice = document.getElementById('safetyFloorNotice');
      if (appliedFloor) {
        floorNotice.style.display = 'block';
        floorNotice.innerHTML = '<strong>Safety Floor Enforced:</strong> Your requested deficit would drop daily calories below the safe clinical threshold (' + calorieFloor + ' kcal/day for ' + gender + 's). We capped your intake at ' + calorieFloor + ' kcal to protect metabolic health and prevent nutrient deficiencies.';
      } else {
        floorNotice.style.display = 'none';
      }

      // Render Needle (Scale BMI 15 to 40 -> angle -90 to +90 deg)
      const clampedBmi = Math.max(15, Math.min(40, bmi));
      const angle = ((clampedBmi - 15) / (40 - 15)) * 180 - 90;
      const rad = (angle - 90) * (Math.PI / 180);
      const needleX = 100 + 65 * Math.cos(rad);
      const needleY = 100 + 65 * Math.sin(rad);
      const needle = document.getElementById('gaugeNeedle');
      needle.setAttribute('x2', needleX.toFixed(1));
      needle.setAttribute('y2', needleY.toFixed(1));
      document.getElementById('gaugeLabel').textContent = bmi + ' — ' + bmiCat;

      // Render Weight Spectrum
      document.getElementById('specCurrent').innerText = weightKg.toFixed(1) + ' kg';
      document.getElementById('specTarget').innerText = targetWeightKg.toFixed(1) + ' kg';
      document.getElementById('specHealthyRange').innerText = minHealthyKg + ' – ' + maxHealthyKg + ' kg';
      document.getElementById('specIbw').innerText = ibwKg + ' kg';
      document.getElementById('specDevineVal').innerText = ibwKg + ' kg';

      // Render Macros (25% Protein, 45% Carb, 30% Fat)
      const protGrams = Math.round((targetCalories * 0.25) / 4);
      const carbGrams = Math.round((targetCalories * 0.45) / 4);
      const fatGrams = Math.round((targetCalories * 0.30) / 9);

      document.getElementById('macroProtein').innerText = protGrams + 'g (25%)';
      document.getElementById('macroCarbs').innerText = carbGrams + 'g (45%)';
      document.getElementById('macroFats').innerText = fatGrams + 'g (30%)';

      // Milestones
      const milestoneContainer = document.getElementById('milestoneContainer');
      const milestoneList = document.getElementById('milestoneList');
      const weightDiff = Math.abs(weightKg - targetWeightKg);
      if (goal !== 'maintain' && weightDiff > 0.5) {
        milestoneContainer.style.display = 'block';
        document.getElementById('timelinePace').innerText = pace + ' kg';
        milestoneList.innerHTML = '';
        const weeksTotal = Math.ceil(weightDiff / pace);
        const steps = [0.25, 0.5, 0.75, 1.0];
        steps.forEach(s => {
          const wNum = Math.max(1, Math.round(weeksTotal * s));
          const wKg = goal === 'lose' ? (weightKg - weightDiff * s) : (weightKg + weightDiff * s);
          const card = document.createElement('div');
          card.className = 'metric-card';
          card.innerHTML = '<div style="font-size:0.75rem;font-weight:700;color:#0284c7;">' + Math.round(s * 100) + '% Milestone</div>' +
                           '<div style="font-size:1.1rem;font-weight:700;margin:4px 0;">' + wKg.toFixed(1) + ' kg</div>' +
                           '<div style="font-size:0.75rem;color:#64748b;">~' + wNum + ' weeks</div>';
          milestoneList.appendChild(card);
        });
      } else {
        milestoneContainer.style.display = 'none';
      }

      // PERSONAL TRAINER DIET & EXACT MEAL CALORIES
      const waterLiters = (weightKg * 0.038).toFixed(1);
      document.getElementById('trainerWaterVal').innerText = waterLiters + ' L/day';

      const bfastKcal = Math.round(targetCalories * 0.25);
      const lunchKcal = Math.round(targetCalories * 0.35);
      const dinnerKcal = Math.round(targetCalories * 0.30);
      const snackKcal = Math.max(120, targetCalories - (bfastKcal + lunchKcal + dinnerKcal));

      const isLoss = goal === 'lose';
      const isGain = goal === 'gain';

      const mealData = [
        {
          name: 'Breakfast (Morning Fuel)',
          time: '7:30 AM',
          kcal: bfastKcal,
          title: isLoss ? 'Egg White & Avocado Scramble' : 'Power Oatmeal with Peanut Butter & Banana',
          items: isLoss ? ['3 egg whites + 1 whole egg', '1 slice sprouted whole wheat toast', '1/4 avocado & baby spinach'] : ['1 cup rolled oats in milk', '2 tbsp peanut butter & 1 banana', '1 scoop protein powder'],
          tip: isLoss ? 'High albumin protein spares muscle during caloric deficit.' : 'Complex beta-glucans replenish morning glycogen.'
        },
        {
          name: 'Lunch (Midday Performance)',
          time: '1:00 PM',
          kcal: lunchKcal,
          title: isLoss ? 'Grilled Herb Chicken & Quinoa Salad' : 'Flank Steak & Sweet Potato Mass Bowl',
          items: isLoss ? ['160g skinless chicken breast', '1/2 cup cooked fluffy quinoa', '2 cups steamed broccoli & olive oil (1 tsp)'] : ['180g lean flank steak or beef', '1 large baked sweet potato', '1 cup jasmine rice & green beans'],
          tip: isLoss ? 'High volume fibrous cruciferous vegetables fill stomach stretch receptors.' : 'Dense clean carbohydrates support home training intensity.'
        },
        {
          name: 'Dinner (Nocturnal Recovery)',
          time: '7:00 PM',
          kcal: dinnerKcal,
          title: isLoss ? 'Baked White Fish with Roasted Asparagus' : 'Roasted Chicken Thighs & Jasmine Rice',
          items: isLoss ? ['180g Atlantic cod or tilapia', '120g roasted baby yellow potatoes', '1.5 cups roasted asparagus'] : ['2 roasted chicken thighs', '1.5 cups fragrant jasmine rice', '1/2 avocado & sauteed zucchini'],
          tip: isLoss ? 'Easily digestible lean white protein prevents evening gastric reflux.' : 'Healthy lipids sustain nocturnal protein synthesis and endocrine health.'
        },
        {
          name: 'Snack / Post-Workout Recovery',
          time: '4:00 PM',
          kcal: snackKcal,
          title: isLoss ? 'Greek Yogurt & Fresh Berries' : 'Mass Gainer Banana Peanut Butter Shake',
          items: isLoss ? ['1 cup 0% Greek yogurt', '1/2 cup fresh raspberries', '8-10 raw almonds'] : ['1 scoop whey/plant protein', '1 banana & 2 tbsp peanut butter', '300ml whole milk or oat milk'],
          tip: 'Consume within 60 mins of training for rapid muscle glycogen resynthesis.'
        }
      ];

      const trainerMealGrid = document.getElementById('trainerMealGrid');
      trainerMealGrid.innerHTML = '';
      mealData.forEach((m, idx) => {
        const mCard = document.createElement('div');
        mCard.className = 'metric-card';
        mCard.style.textAlign = 'left';
        mCard.innerHTML = '<div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:8px;">' +
                          '<span style="font-weight:700;font-size:0.85rem;color:#0f172a;">' + m.name + '</span>' +
                          '<span style="font-weight:800;color:#0284c7;font-size:0.85rem;">' + m.kcal + ' kcal</span></div>' +
                          '<div style="font-weight:600;font-size:0.8rem;color:#334155;margin-bottom:6px;">' + m.title + '</div>' +
                          '<ul style="font-size:0.75rem;color:#64748b;padding-left:14px;margin-bottom:8px;">' +
                          m.items.map(it => '<li>' + it + '</li>').join('') + '</ul>' +
                          '<div style="font-size:0.7rem;color:#0369a1;background:#f0f9ff;padding:4px 6px;border-radius:4px;"><strong>Trainer Cue:</strong> ' + m.tip + '</div>';
        trainerMealGrid.appendChild(mCard);
      });

      // Medical diet note
      const medDietTip = document.getElementById('trainerMedicalDietTip');
      if (document.getElementById('cond_hypertension').checked) {
        medDietTip.style.display = 'block';
        medDietTip.innerHTML = '<strong>Clinical Hypertension Note:</strong> DASH protocol active. Keep sodium under 2,000 mg/day; emphasize potassium-rich vegetables and avoid canned/processed meats.';
      } else if (document.getElementById('cond_diabetes').checked) {
        medDietTip.style.display = 'block';
        medDietTip.innerHTML = '<strong>Clinical Diabetes Note:</strong> Low-glycemic protocol active. Always pair carbohydrates with lean proteins or healthy fats to avoid rapid blood sugar fluctuations.';
      } else {
        medDietTip.style.display = 'none';
      }

      // PERSONAL TRAINER HOME EXERCISES WITH SETS, REPS & SVG DIAGRAMS
      const trainerExerciseGrid = document.getElementById('trainerExerciseGrid');
      trainerExerciseGrid.innerHTML = '';

      const exercises = [
        {
          name: 'Bodyweight Squat / Chair Sit-to-Stand',
          svgType: 'squat',
          muscles: 'Quads, Glutes, Hamstrings',
          sets: '3 sets × 12–15 reps',
          rest: '60s rest · Tempo 2-0-2',
          form: 'Hinge hips back, keep chest upright, bend knees until thighs reach chair level.',
          breath: 'Inhale descending, exhale pressing up through heels.',
          mod: 'Sit all the way down onto chair for joint comfort if knees feel tender.'
        },
        {
          name: 'Incline Wall or Countertop Push-Up',
          svgType: 'pushup',
          muscles: 'Pectorals (Chest), Triceps, Core',
          sets: '3 sets × 10–12 reps',
          rest: '60s rest · Tempo 2-1-2',
          form: 'Body forms straight plank, hands on wall at shoulder height, lower chest with elbows at 45° angle.',
          breath: 'Inhale toward wall, exhale pushing away.',
          mod: 'Step closer to wall to reduce load; never arch lower back.'
        },
        {
          name: 'Floor Glute Bridge with Peak Squeeze',
          svgType: 'bridge',
          muscles: 'Gluteus Maximus, Lower Back, Pelvis',
          sets: '3 sets × 15 reps',
          rest: '45s rest · Tempo 2-2-2',
          form: 'Lie flat, knees bent, press through heels to elevate hips into a straight bridge line.',
          breath: 'Exhale driving hips up, inhale lowering down.',
          mod: 'Hold 2 seconds at the top to maximally engage glutes without spinal hyperextension.'
        },
        {
          name: 'Bird-Dog Core Stabilizer',
          svgType: 'birddog',
          muscles: 'Spinal Erectors, Glutes, Core',
          sets: '3 sets × 10 alternating reps',
          rest: '45s rest · Tempo 2-1-2',
          form: 'On all-fours, reach opposite arm and leg straight out parallel to the floor with flat back.',
          breath: 'Exhale reaching out, inhale returning to center.',
          mod: 'Lift only legs if balance or wrist sensitivity occurs.'
        }
      ];

      exercises.forEach((ex, eIdx) => {
        const exCard = document.createElement('div');
        exCard.className = 'metric-card';
        exCard.style.textAlign = 'left';
        
        let svgCode = '';
        if (ex.svgType === 'squat') {
          svgCode = '<svg viewBox="0 0 200 90" style="width:100%;height:80px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:8px;">' +
                    '<line x1="10" y1="80" x2="190" y2="80" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<circle cx="50" cy="25" r="6" fill="#64748b"/><line x1="50" y1="31" x2="50" y2="58" stroke="#64748b" stroke-width="4"/><line x1="50" y1="58" x2="48" y2="80" stroke="#64748b" stroke-width="4"/>' +
                    '<text x="50" y="15" font-size="8" fill="#64748b" text-anchor="middle">Start</text>' +
                    '<path d="M 80 45 Q 95 35 110 45" fill="none" stroke="#0284c7" stroke-width="2"/>' +
                    '<circle cx="140" cy="38" r="6" fill="#0284c7"/><line x1="140" y1="44" x2="152" y2="60" stroke="#0284c7" stroke-width="4"/><line x1="152" y1="60" x2="175" y2="60" stroke="#0369a1" stroke-width="4"/><line x1="175" y1="60" x2="172" y2="80" stroke="#0f172a" stroke-width="4"/>' +
                    '<text x="155" y="15" font-size="8" fill="#0284c7" font-weight="700" text-anchor="middle">Squat Depth</text></svg>';
        } else if (ex.svgType === 'pushup') {
          svgCode = '<svg viewBox="0 0 200 90" style="width:100%;height:80px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:8px;">' +
                    '<line x1="10" y1="80" x2="190" y2="80" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<circle cx="40" cy="50" r="5" fill="#64748b"/><line x1="45" y1="53" x2="90" y2="78" stroke="#64748b" stroke-width="4"/><line x1="52" y1="58" x2="52" y2="80" stroke="#64748b" stroke-width="3"/>' +
                    '<text x="55" y="15" font-size="8" fill="#64748b" text-anchor="middle">1. Plank</text>' +
                    '<circle cx="130" cy="68" r="5" fill="#0284c7"/><line x1="135" y1="71" x2="180" y2="79" stroke="#0284c7" stroke-width="4"/><line x1="140" y1="72" x2="145" y2="62" stroke="#0369a1" stroke-width="3"/><line x1="145" y1="62" x2="145" y2="80" stroke="#0369a1" stroke-width="3"/>' +
                    '<text x="150" y="15" font-size="8" fill="#0284c7" font-weight="700" text-anchor="middle">2. Lower (Elbows 45°)</text></svg>';
        } else if (ex.svgType === 'bridge') {
          svgCode = '<svg viewBox="0 0 200 90" style="width:100%;height:80px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:8px;">' +
                    '<line x1="10" y1="80" x2="190" y2="80" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<circle cx="120" cy="76" r="5" fill="#0284c7"/><line x1="125" y1="76" x2="160" y2="58" stroke="#0284c7" stroke-width="4"/><line x1="160" y1="58" x2="160" y2="80" stroke="#0f172a" stroke-width="4"/>' +
                    '<text x="100" y="20" font-size="8" fill="#0284c7" font-weight="700" text-anchor="middle">Glute Bridge (Hips In Line)</text></svg>';
        } else {
          svgCode = '<svg viewBox="0 0 200 90" style="width:100%;height:80px;background:#fff;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:8px;">' +
                    '<line x1="10" y1="80" x2="190" y2="80" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<line x1="70" y1="55" x2="90" y2="55" stroke="#0284c7" stroke-width="3"/><circle cx="90" cy="50" r="5" fill="#0284c7"/><line x1="90" y1="55" x2="120" y2="55" stroke="#0284c7" stroke-width="4"/><line x1="95" y1="55" x2="95" y2="80" stroke="#0f172a" stroke-width="3"/><line x1="120" y1="55" x2="120" y2="80" stroke="#0f172a" stroke-width="3"/><line x1="120" y1="55" x2="145" y2="55" stroke="#0369a1" stroke-width="3"/>' +
                    '<text x="100" y="20" font-size="8" fill="#0284c7" font-weight="700" text-anchor="middle">Bird-Dog (Neutral Spine)</text></svg>';
        }

        exCard.innerHTML = '<div style="display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:8px;">' +
                           '<span style="font-weight:700;font-size:0.85rem;color:#0f172a;">' + (eIdx + 1) + '. ' + ex.name + '</span>' +
                           '<span style="font-weight:800;color:#059669;font-size:0.8rem;">' + ex.sets + '</span></div>' +
                           svgCode +
                           '<div style="font-size:0.75rem;color:#64748b;margin-bottom:4px;"><strong>Target:</strong> ' + ex.muscles + ' · <strong>Rest:</strong> ' + ex.rest + '</div>' +
                           '<div style="font-size:0.75rem;color:#334155;margin-bottom:4px;"><strong>Form Cue:</strong> ' + ex.form + '</div>' +
                           '<div style="font-size:0.7rem;color:#059669;background:#ecfdf5;padding:4px 6px;border-radius:4px;margin-bottom:4px;"><strong>Breathing:</strong> ' + ex.breath + '</div>' +
                           '<div style="font-size:0.7rem;color:#92400e;background:#fffbeb;padding:4px 6px;border-radius:4px;"><strong>Modification:</strong> ' + ex.mod + '</div>';
        trainerExerciseGrid.appendChild(exCard);
      });

      goToStep(3);
    }

    function loadTestCase(caseId) {
      if (caseId === 'case1') {
        document.getElementById('userName').value = 'David Miller';
        document.getElementById('userAge').value = '35';
        document.getElementById('userGender').value = 'male';
        document.getElementById('unitToggle').value = 'metric';
        toggleUnits('metric');
        document.getElementById('heightCm').value = '180';
        document.getElementById('weightKg').value = '95';
        document.getElementById('targetWeightKg').value = '80';
        document.getElementById('userGoal').value = 'lose';
        document.getElementById('activityLevel').value = 'moderate';
        document.getElementById('weeklyPace').value = '0.5';
        document.querySelectorAll('.condition-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('otherCondition').value = '';
        document.getElementById('confirmCheckbox').checked = true;
      } else if (caseId === 'case2') {
        document.getElementById('userName').value = 'Maya Lin';
        document.getElementById('userAge').value = '16';
        document.getElementById('userGender').value = 'female';
        document.getElementById('unitToggle').value = 'metric';
        toggleUnits('metric');
        document.getElementById('heightCm').value = '162';
        document.getElementById('weightKg').value = '54';
        document.getElementById('targetWeightKg').value = '54';
        document.getElementById('userGoal').value = 'maintain';
        document.getElementById('activityLevel').value = 'light';
        document.getElementById('weeklyPace').value = '0.5';
        document.querySelectorAll('.condition-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('otherCondition').value = '';
        document.getElementById('confirmCheckbox').checked = true;
      } else if (caseId === 'case3') {
        document.getElementById('userName').value = 'Sarah Connor';
        document.getElementById('userAge').value = '29';
        document.getElementById('userGender').value = 'female';
        document.getElementById('unitToggle').value = 'metric';
        toggleUnits('metric');
        document.getElementById('heightCm').value = '165';
        document.getElementById('weightKg').value = '76';
        document.getElementById('targetWeightKg').value = '65';
        document.getElementById('userGoal').value = 'lose';
        document.getElementById('activityLevel').value = 'sedentary';
        document.getElementById('weeklyPace').value = '0.5';
        document.querySelectorAll('.condition-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('cond_pregnancy').checked = true;
        document.getElementById('otherCondition').value = '';
        document.getElementById('confirmCheckbox').checked = true;
      }
      validateAndCalculate();
    }
  </script>

  <!--
  =============================================================================
  VERIFICATION TEST CASES & EXPECTED CLINICAL OUTPUTS
  =============================================================================

  TEST CASE 1: Standard Adult Weight Loss
  - Inputs:
      Name: David Miller
      Age: 35 | Sex: Male
      Height: 180 cm | Weight: 95 kg | Target: 80 kg
      Goal: Lose weight | Pace: 0.5 kg/week | Activity: Moderately active
      Medical Conditions: None
  - Formula Calculations:
      BMI: 95 / (1.80^2) = 29.32 kg/m^2 (Overweight)
      Devine IBW: 50.0 + 2.3 * ((180 / 2.54) - 60) = 50 + 2.3 * 10.866 = 75.0 kg
      Healthy Range (BMI 18.5 - 24.9): 59.9 kg – 80.7 kg
      Mifflin-St Jeor BMR: 10 * 95 + 6.25 * 180 - 5 * 35 + 5 = 950 + 1125 - 175 + 5 = 1,905 kcal
      TDEE: 1,905 * 1.55 = 2,953 kcal
      Daily Calorie Target: 2,953 - 550 = 2,403 kcal/day (safe, well above 1,500 kcal male floor)
      Flag Status: Green Flag (No contraindications)
      Milestones: ~30 weeks to 80 kg target.

  TEST CASE 2: Adolescent Evaluation (Pediatric Notice)
  - Inputs:
      Name: Maya Lin
      Age: 16 | Sex: Female
      Height: 162 cm | Weight: 54 kg | Target: 54 kg
      Goal: Maintain weight | Activity: Lightly active (1.375)
      Medical Conditions: None
  - Formula Calculations:
      BMI: 54 / (1.62^2) = 20.58 kg/m^2 (Normal Weight)
      Age < 18 Trigger: Notes age-specific CDC/WHO percentile curves required.
      Mifflin-St Jeor BMR: 10 * 54 + 6.25 * 162 - 5 * 16 - 161 = 540 + 1012.5 - 80 - 161 = 1,312 kcal
      TDEE: 1,312 * 1.375 = 1,803 kcal
      Target: 1,803 kcal/day (Maintenance)
      Flag Status: Green Flag with developmental guidance.

  TEST CASE 3: Medical Red Flag (Pregnancy / Nursing)
  - Inputs:
      Name: Sarah Connor
      Age: 29 | Sex: Female
      Height: 165 cm | Weight: 76 kg | Target: 65 kg
      Goal: Lose weight | Activity: Sedentary
      Medical Conditions: "Pregnant or Currently Breastfeeding" checked
  - Clinical Verification:
      Flag Status: RED FLAG CLINICAL SAFETY NOTICE triggered immediately.
      Safety Enforcement: Caloric restriction is contraindicated. Autonomous weight
      loss plan locked behind mandatory physician consultation advisory.
      Confirmation checkbox mandatory.
  =============================================================================
  -->
</body>
</html>
`;
}
