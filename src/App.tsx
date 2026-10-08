/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Dumbbell,
  FileText,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Lock,
  Printer,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  User,
  Utensils,
  Zap,
} from 'lucide-react';
import {
  Gender,
  UnitSystem,
  UserFormData,
  WeightGoal,
  ActivityLevel,
} from './types';
import {
  ACTIVITY_DESCRIPTIONS,
  MEDICAL_CONDITIONS,
  calculateFullPlan,
  cmToFtIn,
  ftInToCm,
  kgToLbs,
  lbsToKg,
} from './utils/calculations';
import {
  generatePersonalTrainerDietPlan,
  generateTrainerWorkoutPlan,
} from './utils/trainerPlans';
import { TEST_CASES } from './utils/testCases';
import { StepIndicator } from './components/StepIndicator';
import { BmiGauge } from './components/BmiGauge';
import { WeightSpectrumChart } from './components/WeightSpectrumChart';
import { MacroBreakdown } from './components/MacroBreakdown';
import { TrainerDietPlanView } from './components/TrainerDietPlanView';
import { TrainerWorkoutPlanView } from './components/TrainerWorkoutPlanView';
import { PrintableReportView } from './components/PrintableReportView';
import { ExportModal } from './components/ExportModal';

const initialFormData: UserFormData = {
  unitSystem: 'metric',
  name: 'David Miller',
  age: 35,
  gender: 'male',
  heightCm: 180,
  weightKg: 95,
  targetWeightKg: 80,
  heightFt: 5,
  heightIn: 11,
  weightLbs: 209.4,
  targetWeightLbs: 176.4,
  goal: 'lose',
  activityLevel: 'moderate',
  weeklyPaceKg: 0.5,
  selectedConditions: [],
  otherConditionText: '',
  confirmedRiskAcknowledgement: false,
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [macroPreset, setMacroPreset] = useState<'balanced' | 'high_protein' | 'low_carb'>('balanced');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [resultsTab, setResultsTab] = useState<'overview' | 'nutrition' | 'exercises' | 'pdf_report'>('overview');
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Synchronize unit toggle conversions
  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === formData.unitSystem) return;

    if (newUnit === 'imperial') {
      const cm = typeof formData.heightCm === 'number' ? formData.heightCm : 170;
      const kg = typeof formData.weightKg === 'number' ? formData.weightKg : 70;
      const targetKg = typeof formData.targetWeightKg === 'number' ? formData.targetWeightKg : 70;
      const { feet, inches } = cmToFtIn(cm);

      setFormData((prev) => ({
        ...prev,
        unitSystem: 'imperial',
        heightFt: feet,
        heightIn: inches,
        weightLbs: Number(kgToLbs(kg).toFixed(1)),
        targetWeightLbs: Number(kgToLbs(targetKg).toFixed(1)),
      }));
    } else {
      const ft = typeof formData.heightFt === 'number' ? formData.heightFt : 5;
      const inch = typeof formData.heightIn === 'number' ? formData.heightIn : 7;
      const lbs = typeof formData.weightLbs === 'number' ? formData.weightLbs : 154;
      const targetLbs = typeof formData.targetWeightLbs === 'number' ? formData.targetWeightLbs : 154;

      setFormData((prev) => ({
        ...prev,
        unitSystem: 'metric',
        heightCm: Math.round(ftInToCm(ft, inch)),
        weightKg: Number(lbsToKg(lbs).toFixed(1)),
        targetWeightKg: Number(lbsToKg(targetLbs).toFixed(1)),
      }));
    }
  };

  // Real-time validation checks for step 1
  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (typeof formData.age !== 'number' || formData.age < 2 || formData.age > 120) {
      errors.push('Age must be between 2 and 120 years.');
    }

    if (formData.unitSystem === 'metric') {
      if (typeof formData.heightCm !== 'number' || formData.heightCm < 50 || formData.heightCm > 250) {
        errors.push('Height must be between 50 cm and 250 cm.');
      }
      if (typeof formData.weightKg !== 'number' || formData.weightKg < 20 || formData.weightKg > 350) {
        errors.push('Current weight must be between 20 kg and 350 kg.');
      }
      if (
        formData.goal !== 'maintain' &&
        (typeof formData.targetWeightKg !== 'number' ||
          formData.targetWeightKg < 20 ||
          formData.targetWeightKg > 350)
      ) {
        errors.push('Target weight must be between 20 kg and 350 kg.');
      }
      if (
        formData.goal === 'lose' &&
        typeof formData.weightKg === 'number' &&
        typeof formData.targetWeightKg === 'number' &&
        formData.targetWeightKg >= formData.weightKg
      ) {
        errors.push('For weight loss, target weight should be less than current weight.');
      }
      if (
        formData.goal === 'gain' &&
        typeof formData.weightKg === 'number' &&
        typeof formData.targetWeightKg === 'number' &&
        formData.targetWeightKg <= formData.weightKg
      ) {
        errors.push('For weight gain, target weight should be higher than current weight.');
      }
    } else {
      const ft = typeof formData.heightFt === 'number' ? formData.heightFt : 0;
      const inch = typeof formData.heightIn === 'number' ? formData.heightIn : 0;
      const totalInches = ft * 12 + inch;
      if (totalInches < 20 || totalInches > 96) {
        errors.push('Height must be between 1 ft 8 in and 8 ft 0 in.');
      }
      if (typeof formData.weightLbs !== 'number' || formData.weightLbs < 44 || formData.weightLbs > 770) {
        errors.push('Current weight must be between 44 lbs and 770 lbs.');
      }
      if (
        formData.goal !== 'maintain' &&
        (typeof formData.targetWeightLbs !== 'number' ||
          formData.targetWeightLbs < 44 ||
          formData.targetWeightLbs > 770)
      ) {
        errors.push('Target weight must be between 44 lbs and 770 lbs.');
      }
      if (
        formData.goal === 'lose' &&
        typeof formData.weightLbs === 'number' &&
        typeof formData.targetWeightLbs === 'number' &&
        formData.targetWeightLbs >= formData.weightLbs
      ) {
        errors.push('For weight loss, target weight should be less than current weight.');
      }
      if (
        formData.goal === 'gain' &&
        typeof formData.weightLbs === 'number' &&
        typeof formData.targetWeightLbs === 'number' &&
        formData.targetWeightLbs <= formData.weightLbs
      ) {
        errors.push('For weight gain, target weight should be higher than current weight.');
      }
    }

    return errors;
  }, [formData]);

  const canProceedToStep2 = validationErrors.length === 0;

  // Compute full clinical plan
  const planResults = useMemo(() => {
    return calculateFullPlan(formData, macroPreset);
  }, [formData, macroPreset]);

  // Compute Personal Trainer Diet Plan
  const trainerDietPlan = useMemo(() => {
    return generatePersonalTrainerDietPlan(planResults, formData);
  }, [planResults, formData]);

  // Compute Personal Trainer Home Workout Routine
  const trainerWorkoutPlan = useMemo(() => {
    return generateTrainerWorkoutPlan(planResults, formData);
  }, [planResults, formData]);

  // Stepper navigation guards
  const canNavigateToStep = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return canProceedToStep2;
    if (step === 3) return canProceedToStep2 && formData.confirmedRiskAcknowledgement;
    return false;
  };

  const navigateToStep = (step: number) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle medical condition checkbox
  const toggleCondition = (conditionId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedConditions.includes(conditionId);
      const updated = exists
        ? prev.selectedConditions.filter((id) => id !== conditionId)
        : [...prev.selectedConditions, conditionId];
      return { ...prev, selectedConditions: updated };
    });
  };

  // Load sample test cases
  const applyTestCase = (caseId: string) => {
    const match = TEST_CASES.find((tc) => tc.id === caseId);
    if (!match) return;

    setFormData((prev) => ({
      ...prev,
      ...match.data,
      unitSystem: match.data.unitSystem || 'metric',
      confirmedRiskAcknowledgement: match.data.confirmedRiskAcknowledgement || false,
    }));

    if (match.data.confirmedRiskAcknowledgement) {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setResultsTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  Healthy Weight Planner
                </h1>
                <span className="hidden sm:inline-flex text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Personal Trainer & Clinical Diet Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Exact Calorie Meal Plans · Medical Screening · Pictorial Home Exercises with Sets & Reps
              </p>
            </div>
          </div>

          {/* Privacy Guarantee & Standalone HTML action */}
          <div className="flex items-center gap-2">
            <div
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded"
              title="All calculations execute locally via in-browser JavaScript. No telemetry, analytics, or external health API transmission."
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Local Browser Execution · Offline Capable</span>
            </div>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Single-File HTML</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Verification Test Cases Bar */}
        <div className="mb-6 p-3 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-slate-800">Quick Test Cases:</span>
            <span className="text-slate-500 hidden lg:inline">
              Load pre-configured patient profiles to test clinical logic and plans
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEST_CASES.map((tc) => (
              <button
                key={tc.id}
                type="button"
                onClick={() => applyTestCase(tc.id)}
                className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/60"
                title={tc.scenario}
              >
                {tc.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="no-print">
          <StepIndicator
            currentStep={currentStep}
            onStepClick={navigateToStep}
            canNavigateToStep={canNavigateToStep}
          />
        </div>

        {/* ========================================================= */}
        {/* STEP 1: USER DETAILS & BIOMETRICS                         */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-700" />
                  Step 1: Patient Biometrics & Management Goal
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter your physical metrics and targets. Formulas adapt automatically to age, biological sex, and height.
                </p>
              </div>

              {/* Unit Toggle */}
              <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleUnitChange('metric')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    formData.unitSystem === 'metric'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitChange('imperial')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    formData.unitSystem === 'imperial'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Imperial (lbs / ft-in)
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Row 1: Name, Age, Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name / Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. David Miller"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Age (Years: 2 – 120)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                  {typeof formData.age === 'number' && formData.age < 18 && (
                    <span className="text-[11px] text-amber-700 block mt-1">
                      Adolescent profile (&lt;18y): CDC/WHO growth chart percentile rules apply.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Biological Sex (Formula Baselines)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  >
                    <option value="male">Male (Mifflin +5 / Devine 50kg)</option>
                    <option value="female">Female (Mifflin -161 / Devine 45.5kg)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Heights & Weights according to Unit System */}
              {formData.unitSystem === 'metric' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="250"
                      value={formData.heightCm}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          heightCm: e.target.value === '' ? '' : parseFloat(e.target.value),
                        })
                      }
                      placeholder="e.g. 180"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="350"
                      step="0.1"
                      value={formData.weightKg}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weightKg: e.target.value === '' ? '' : parseFloat(e.target.value),
                        })
                      }
                      placeholder="e.g. 95"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Target Goal Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="350"
                      step="0.1"
                      value={formData.targetWeightKg}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetWeightKg: e.target.value === '' ? '' : parseFloat(e.target.value),
                        })
                      }
                      placeholder="e.g. 80"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/70 border border-slate-200/80 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Height (Feet & Inches)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={formData.heightFt}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              heightFt: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                            })
                          }
                          placeholder="ft"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                        <span className="absolute right-2.5 top-2 text-xs text-slate-400">ft</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={formData.heightIn}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              heightIn: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                            })
                          }
                          placeholder="in"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                        <span className="absolute right-2.5 top-2 text-xs text-slate-400">in</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Current Weight (lbs)
                    </label>
                    <input
                      type="number"
                      min="44"
                      max="770"
                      step="0.1"
                      value={formData.weightLbs}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weightLbs: e.target.value === '' ? '' : parseFloat(e.target.value),
                        })
                      }
                      placeholder="e.g. 209"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Target Goal Weight (lbs)
                    </label>
                    <input
                      type="number"
                      min="44"
                      max="770"
                      step="0.1"
                      value={formData.targetWeightLbs}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetWeightLbs: e.target.value === '' ? '' : parseFloat(e.target.value),
                        })
                      }
                      placeholder="e.g. 176"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* Row 3: Goal, Activity Level, Pace */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Goal
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value as WeightGoal })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  >
                    <option value="lose">Weight Loss (Caloric Deficit & Fat Burn)</option>
                    <option value="maintain">Weight Maintenance (TDEE Equilibrium)</option>
                    <option value="gain">Weight & Muscle Gain (Hypertrophy Surplus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Physical Activity Level
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  >
                    {Object.entries(ACTIVITY_DESCRIPTIONS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.title} ({item.multiplier}x)
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {ACTIVITY_DESCRIPTIONS[formData.activityLevel].subtitle}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Rate / Pace (Weekly)
                  </label>
                  <select
                    value={formData.weeklyPaceKg}
                    onChange={(e) =>
                      setFormData({ ...formData, weeklyPaceKg: parseFloat(e.target.value) })
                    }
                    disabled={formData.goal === 'maintain'}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="0.25">Gentle (0.25 kg / ~0.55 lbs per week)</option>
                    <option value="0.5">Standard Safe (0.5 kg / ~1.1 lbs per week)</option>
                    <option value="0.75">Accelerated (0.75 kg / ~1.65 lbs per week)</option>
                    <option value="1.0">Maximum Clinical Cap (1.0 kg / ~2.2 lbs per week)</option>
                  </select>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Deficits are strictly capped to ensure minimum caloric safety thresholds.
                  </span>
                </div>
              </div>

              {/* Live Validation Warnings */}
              {validationErrors.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Please verify the following input values:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-800 space-y-0.5 pl-1">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Values
              </button>

              <button
                type="button"
                disabled={!canProceedToStep2}
                onClick={() => navigateToStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
              >
                <span>Continue to Medical Screening</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: MEDICAL HISTORY CHECKLIST & RED/AMBER FLAGS       */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-700" />
                    Step 2: Medical History & Contraindication Screening
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Safety is paramount. Home exercise intensity and diet plans are customized to protect joints, heart health, and metabolic function.
                  </p>
                </div>
              </div>
            </div>

            {/* Screening Checklist */}
            <div className="space-y-3 mb-6">
              {MEDICAL_CONDITIONS.map((cond) => {
                const isSelected = formData.selectedConditions.includes(cond.id);
                return (
                  <label
                    key={cond.id}
                    className={`flex items-start gap-3.5 p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? cond.severity === 'red'
                          ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200'
                          : 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                        : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCondition(cond.id)}
                      className={`mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer ${
                        cond.severity === 'red' ? 'accent-rose-600' : 'accent-amber-600'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900">{cond.label}</span>
                        {cond.severity === 'red' ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                            RED FLAG · HIGH CLINICAL RISK
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                            AMBER FLAG · CLINICAL CONSIDERATION
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{cond.description}</p>
                      {isSelected && (
                        <div className="mt-2 text-xs p-2 rounded bg-white/80 border border-slate-200 text-slate-700">
                          <strong className="text-slate-900">Clinical Recommendation:</strong> {cond.recommendation}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Other Free-Text Medical Input */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Other Medical Conditions, Joint Pain, or Medications (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.otherConditionText}
                onChange={(e) => setFormData({ ...formData, otherConditionText: e.target.value })}
                placeholder="e.g. Knee osteoarthritis, lower back stiffness, asthma, beta-blockers, joint replacement..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Mentioning joint or knee concerns automatically prescribes low-impact joint-friendly home exercises.
              </span>
            </div>

            {/* Flag Preview Banner */}
            {planResults.flagLevel === 'red' && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-relaxed">
                  <div className="font-bold text-sm text-rose-950 mb-0.5">
                    RED FLAG: Direct Physician Clearance Required
                  </div>
                  One or more reported conditions carry acute medical risks with caloric deficits or intense exercise. Autonomous dieting is contraindicated. Your plan will generate with strict clinical guardrails and a mandatory doctor visit advisory.
                </div>
              </div>
            )}

            {planResults.flagLevel === 'amber' && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <div className="font-bold text-sm text-amber-950 mb-0.5">
                    AMBER FLAG: Clinical Supervision Recommended
                  </div>
                  Your reported conditions require routine biochemical monitoring (electrolytes, blood pressure, hormonal panels). Review this caloric output with your physician.
                </div>
              </div>
            )}

            {planResults.flagLevel === 'green' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <div className="font-bold text-sm text-emerald-950 mb-0.5">
                    GREEN STATUS: Standard Clinical Parameters
                  </div>
                  No acute medical contraindications were reported. Standard safe calorie floors, rate caps, and progressive exercise routines will apply.
                </div>
              </div>
            )}

            {/* Mandatory Confirmation Checkbox Gate */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.confirmedRiskAcknowledgement}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmedRiskAcknowledgement: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-sky-700 focus:ring-sky-600 cursor-pointer accent-sky-700"
                />
                <span className="text-xs sm:text-sm text-slate-800 leading-normal font-medium">
                  <strong>User Acknowledgment:</strong> I understand that this Healthy Weight Planner executes mathematical approximations (Mifflin-St Jeor, Devine IBW) and standard home exercise prescriptions for educational purposes and does not constitute medical diagnosis or individual clinical treatment. I agree to discuss all screened conditions with a physician before starting any diet or exercise change.
                </span>
              </label>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigateToStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Biometrics</span>
              </button>

              <button
                type="button"
                disabled={!formData.confirmedRiskAcknowledgement}
                onClick={() => navigateToStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
              >
                <span>Generate Plan & Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: RESULTS DASHBOARD WITH 4 COMPREHENSIVE TABS       */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Top Banner with Navigation & Download PDF Button */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Personalized Clinical & Coaching Plan: {formData.name || 'Patient'}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    · {formData.age}y {formData.gender === 'male' ? 'Male' : 'Female'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Target Daily Intake: <strong className="text-slate-900">{planResults.dailyCaloricTarget} kcal/day</strong> · Routine: <strong className="text-slate-900">{trainerWorkoutPlan.routineTitle}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setResultsTab('pdf_report');
                    setTimeout(() => window.print(), 100);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateToStep(1)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Edit Inputs
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start Over
                </button>
              </div>
            </div>

            {/* Medical Screening Flag Banner */}
            {planResults.flagLevel === 'red' && (
              <div className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-start gap-3.5 shadow-2xs no-print">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="text-sm font-bold text-rose-950 flex items-center gap-2">
                    <span>RED FLAG MEDICAL WARNING — Mandatory Physician Consultation Required</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    High-risk clinical criteria detected. Caloric restrictions or intense physiological changes carry significant risk of metabolic destabilization. You must have explicit medical clearance and oversight before beginning this plan.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    {planResults.flagItems.map((f) => (
                      <span
                        key={f.id}
                        className="bg-white/80 border border-rose-200 text-rose-900 px-2.5 py-1 rounded font-medium"
                      >
                        ⚠️ {f.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {planResults.flagLevel === 'amber' && (
              <div className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3.5 shadow-2xs no-print">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-amber-950">
                    AMBER FLAG CLINICAL ADVISORY
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Identified health conditions may interact with fluid dynamics, medication clearances, or metabolic rates. Regular physician check-ins and laboratory monitoring are strongly advised.
                  </p>
                </div>
              </div>
            )}

            {/* 4 Interactive Section Tabs */}
            <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs flex flex-wrap gap-1 no-print">
              <button
                type="button"
                onClick={() => setResultsTab('overview')}
                className={`flex-1 min-w-[150px] py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  resultsTab === 'overview'
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>1. Biometrics & Targets</span>
              </button>

              <button
                type="button"
                onClick={() => setResultsTab('nutrition')}
                className={`flex-1 min-w-[150px] py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  resultsTab === 'nutrition'
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>2. Trainer Meal Plan ({planResults.dailyCaloricTarget} kcal)</span>
              </button>

              <button
                type="button"
                onClick={() => setResultsTab('exercises')}
                className={`flex-1 min-w-[150px] py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  resultsTab === 'exercises'
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>3. Home Exercises & Form</span>
              </button>

              <button
                type="button"
                onClick={() => setResultsTab('pdf_report')}
                className={`flex-1 min-w-[150px] py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  resultsTab === 'pdf_report'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>4. Full Printable PDF Report</span>
              </button>
            </div>

            {/* TAB 1: BIOMETRICS & TARGETS */}
            {resultsTab === 'overview' && (
              <div className="space-y-6">
                {/* Pediatric Growth Advisory */}
                {planResults.isPediatric && (
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3">
                    <Heart className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-sky-900 leading-relaxed">
                      <strong>Pediatric / Adolescent Growth Protocol:</strong> {planResults.pediatricNote}
                    </div>
                  </div>
                )}

                {/* Safety Floor Enforced Notice */}
                {planResults.appliedCalorieFloor && (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong>Safety Floor Activated ({planResults.calorieFloorValue} kcal/day minimum):</strong>{' '}
                      Your requested pace would have dropped your daily intake below the biological safety threshold ({planResults.calorieFloorValue} kcal for {formData.gender}s). The system automatically clamped your target intake at {planResults.calorieFloorValue} kcal/day to preserve basal metabolic function and prevent malnutrition. Your effective safe rate of weight loss is {planResults.actualWeeklyPaceKg} kg/week.
                    </div>
                  </div>
                )}

                {/* Core Metric Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* BMI Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-medium">BMI Score</span>
                      <Scale className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">
                      {planResults.bmi.toFixed(1)}
                    </div>
                    <div
                      className="text-xs font-semibold mt-1"
                      style={{ color: planResults.bmiColor }}
                    >
                      {planResults.bmiCategory}
                    </div>
                  </div>

                  {/* BMR Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-medium">Basal Metabolic Rate</span>
                      <Activity className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">
                      {planResults.bmr.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      kcal / day (Mifflin-St Jeor)
                    </div>
                  </div>

                  {/* TDEE Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-medium">Total Daily Energy (TDEE)</span>
                      <Flame className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900">
                      {planResults.tdee.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      kcal / day ({planResults.activityMultiplier}x multiplier)
                    </div>
                  </div>

                  {/* Recommended Daily Intake Card */}
                  <div className="bg-sky-50 border-2 border-sky-300 rounded-xl p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-sky-800 mb-1">
                      <span className="font-bold">Recommended Daily Target</span>
                      <Zap className="w-4 h-4 text-sky-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-sky-950">
                      {planResults.dailyCaloricTarget.toLocaleString()}
                    </div>
                    <div className="text-xs font-semibold text-sky-800 mt-1 flex items-center gap-1">
                      {formData.goal === 'lose' && (
                        <>
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>Deficit: -{planResults.dailyDeficitSurplus} kcal/day</span>
                        </>
                      )}
                      {formData.goal === 'gain' && (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Surplus: +{planResults.dailyDeficitSurplus} kcal/day</span>
                        </>
                      )}
                      {formData.goal === 'maintain' && (
                        <span>Maintenance Equilibrium</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Diagnostics: BMI Gauge & Weight Spectrum Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* BMI Dial Visual */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                        WHO BMI Clinical Gauge
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Visual classification showing current index on the epidemiological risk arc.
                      </p>
                    </div>
                    <BmiGauge
                      bmi={planResults.bmi}
                      category={planResults.bmiCategory}
                      isPediatric={planResults.isPediatric}
                    />
                  </div>

                  {/* Weight Spectrum & Devine IBW */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                          Weight Spectrum & Devine IBW
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">
                        Comparison of current biometrics against the Devine Ideal Body Weight and normal BMI weight envelope.
                      </p>
                    </div>

                    <WeightSpectrumChart
                      currentWeight={
                        formData.unitSystem === 'metric'
                          ? planResults.currentWeightKg
                          : planResults.currentWeightLbs
                      }
                      targetWeight={
                        formData.unitSystem === 'metric'
                          ? planResults.targetWeightKg
                          : planResults.targetWeightLbs
                      }
                      healthyMin={
                        formData.unitSystem === 'metric'
                          ? planResults.healthyWeightMinKg
                          : planResults.healthyWeightMinLbs
                      }
                      healthyMax={
                        formData.unitSystem === 'metric'
                          ? planResults.healthyWeightMaxKg
                          : planResults.healthyWeightMaxLbs
                      }
                      idealBodyWeight={
                        formData.unitSystem === 'metric'
                          ? planResults.idealBodyWeightKg
                          : planResults.idealBodyWeightLbs
                      }
                      unitSystem={formData.unitSystem}
                    />

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                      <p>
                        <strong className="text-slate-700">Devine Formula (1974):</strong> Standard clinical baseline for drug clearance & physiological baselines.
                      </p>
                      <p>
                        <strong className="text-slate-700">Healthy BMI Range (18.5–24.9):</strong> {formData.unitSystem === 'metric'
                          ? `${planResults.healthyWeightMinKg} kg – ${planResults.healthyWeightMaxKg} kg`
                          : `${planResults.healthyWeightMinLbs} lbs – ${planResults.healthyWeightMaxLbs} lbs`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Macronutrient Distribution */}
                <MacroBreakdown
                  calories={planResults.dailyCaloricTarget}
                  preset={macroPreset}
                  onPresetChange={setMacroPreset}
                  macros={planResults.macros}
                />

                {/* Estimated Milestone Timeline */}
                {planResults.milestones.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-700" />
                          Projected Milestone Timeline
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Estimated schedule at safe pace of {planResults.actualWeeklyPaceKg} kg / week (~{planResults.weeksToGoal} total weeks).
                        </p>
                      </div>
                      <div className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded font-medium">
                        Target: {formData.unitSystem === 'metric' ? `${planResults.targetWeightKg} kg` : `${planResults.targetWeightLbs} lbs`}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {planResults.milestones.map((ms, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold text-sky-800">{ms.checkpoint}</span>
                            <span className="text-slate-500">Week {ms.weekNumber}</span>
                          </div>
                          <div className="text-lg font-black text-slate-900 mb-1">
                            {formData.unitSystem === 'metric' ? `${ms.weightKg} kg` : `${ms.weightLbs} lbs`}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200">
                            <span>{ms.projectedDate}</span>
                            <span className="text-slate-600 font-medium">
                              {formData.goal === 'lose' ? `-${ms.cumulativeChangeKg} kg` : `+${ms.cumulativeChangeKg} kg`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formula Explanation Collapsible Accordion */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs no-print">
                  <button
                    type="button"
                    onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-bold text-slate-900">
                        Clinical Mathematical Verification & Equations Used
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-sky-700">
                      {showFormulaDetails ? 'Hide Formulas' : 'View Formulas'}
                    </span>
                  </button>

                  {showFormulaDetails && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-3 font-mono leading-relaxed">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <strong className="text-slate-900 font-sans block mb-1">1. Mifflin-St Jeor Equation (BMR):</strong>
                        <div>Men: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5</div>
                        <div>Women: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161</div>
                        <div className="text-slate-500 mt-1 font-sans">
                          Calculation: (10 × {planResults.currentWeightKg}) + (6.25 × {formData.unitSystem === 'metric' ? formData.heightCm : Math.round(ftInToCm(Number(formData.heightFt), Number(formData.heightIn)))}) - (5 × {formData.age}) {formData.gender === 'male' ? '+ 5' : '- 161'} = <strong>{planResults.bmr} kcal</strong>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg">
                        <strong className="text-slate-900 font-sans block mb-1">2. Devine Formula for Ideal Body Weight (IBW):</strong>
                        <div>Men: 50.0 kg + 2.3 kg × (height_inches - 60)</div>
                        <div>Women: 45.5 kg + 2.3 kg × (height_inches - 60)</div>
                        <div className="text-slate-500 mt-1 font-sans">
                          Result: <strong>{planResults.idealBodyWeightKg} kg</strong> ({planResults.idealBodyWeightLbs} lbs)
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg">
                        <strong className="text-slate-900 font-sans block mb-1">3. Caloric Deficit & Safety Cap Rules:</strong>
                        <div>1 kg body fat tissue ≈ 7,700 kcal energy equivalent</div>
                        <div>Standard weekly deficit = (Target Pace kg × 7,700) ÷ 7</div>
                        <div>Safety floor enforcement: Minimum 1,200 kcal/day (female), 1,500 kcal/day (male)</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL TRAINER NUTRITION & MEAL PLAN */}
            {resultsTab === 'nutrition' && (
              <TrainerDietPlanView plan={trainerDietPlan} />
            )}

            {/* TAB 3: SAFE HOME EXERCISE ROUTINE & FORM */}
            {resultsTab === 'exercises' && (
              <TrainerWorkoutPlanView routine={trainerWorkoutPlan} />
            )}

            {/* TAB 4: FULL PRINTABLE PDF REPORT */}
            {resultsTab === 'pdf_report' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4 no-print">
                  <div className="flex items-center gap-3">
                    <Printer className="w-5 h-5 text-emerald-700" />
                    <div>
                      <strong className="text-sm text-emerald-950 block">Ready to Save as PDF</strong>
                      <span className="text-xs text-emerald-800">
                        This view is pre-formatted for clean printing and browser "Save as PDF" export.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
                  >
                    Trigger Print / Save PDF
                  </button>
                </div>

                <div className="border border-slate-300 rounded-xl bg-white shadow-sm overflow-hidden">
                  <PrintableReportView
                    formData={formData}
                    results={planResults}
                    dietPlan={trainerDietPlan}
                    workoutRoutine={trainerWorkoutPlan}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Standalone Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Prominent Permanent Medical Disclaimer Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-slate-500 text-xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Clinical Disclaimer:</strong> This Healthy Weight Planner tool is for general information and educational calculation only and is not medical advice. Caloric requirements, metabolic rates, and weight projections are mathematical models that do not account for individual medical pathology, endocrinological variations, or acute health conditions. Always consult a qualified physician or licensed healthcare provider before making significant changes to your diet, exercise routine, or weight management plan.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              Healthy Weight Planner · Personal Trainer & Clinical Nutrition Suite · Offline-First
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Server Transmission · In-Memory Privacy Execution</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
