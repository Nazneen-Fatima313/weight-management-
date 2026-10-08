import React from 'react';
import {
  CalculationResults,
  HomeWorkoutRoutine,
  PersonalDietPlan,
  UserFormData,
} from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';

interface PrintableReportViewProps {
  formData: UserFormData;
  results: CalculationResults;
  dietPlan: PersonalDietPlan;
  workoutRoutine: HomeWorkoutRoutine;
}

export const PrintableReportView: React.FC<PrintableReportViewProps> = ({
  formData,
  results,
  dietPlan,
  workoutRoutine,
}) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto text-slate-900 space-y-8 font-sans print:p-0">
      {/* Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            HEALTHY WEIGHT PLANNER
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5 font-semibold">
            Clinical Weight Management & Home Exercise Prescription
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Assessment Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
          <div>Execution: 100% In-Browser Private Calculation</div>
        </div>
      </div>

      {/* Patient Biometrics & Flag Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs">
        <div>
          <span className="text-slate-500 block font-medium">Patient Name:</span>
          <strong className="text-sm text-slate-900">{formData.name || 'Anonymous User'}</strong>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Age & Sex:</span>
          <strong className="text-sm text-slate-900">{formData.age} yrs · {formData.gender === 'male' ? 'Male' : 'Female'}</strong>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Current Biometrics:</span>
          <strong className="text-sm text-slate-900">
            {formData.unitSystem === 'metric'
              ? `${results.currentWeightKg} kg · ${formData.heightCm} cm`
              : `${results.currentWeightLbs} lbs · ${formData.heightFt}ft ${formData.heightIn}in`}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Target Weight:</span>
          <strong className="text-sm text-slate-900">
            {formData.unitSystem === 'metric'
              ? `${results.targetWeightKg} kg`
              : `${results.targetWeightLbs} lbs`}
          </strong>
        </div>
      </div>

      {/* Clinical Metrics Grid */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          1. Clinical Energy & Weight Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">BMI Score</div>
            <div className="text-xl font-black text-slate-900">{results.bmi.toFixed(1)}</div>
            <div className="text-[10px] text-slate-600 font-semibold">{results.bmiCategory}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">BMR (Mifflin-St Jeor)</div>
            <div className="text-xl font-black text-slate-900">{results.bmr}</div>
            <div className="text-[10px] text-slate-500">kcal / day</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">TDEE (Maintenance)</div>
            <div className="text-xl font-black text-slate-900">{results.tdee}</div>
            <div className="text-[10px] text-slate-500">kcal / day ({results.activityMultiplier}x)</div>
          </div>
          <div className="p-3 bg-sky-50 rounded border border-sky-300">
            <div className="text-[10px] text-sky-800 font-bold uppercase">Target Caloric Intake</div>
            <div className="text-xl font-black text-sky-950">{results.dailyCaloricTarget}</div>
            <div className="text-[10px] text-sky-800 font-semibold">kcal / day</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500">Devine Ideal Body Weight (IBW):</span>{' '}
            <strong className="text-slate-900">{results.idealBodyWeightKg} kg ({results.idealBodyWeightLbs} lbs)</strong>
          </div>
          <div>
            <span className="text-slate-500">Healthy Weight Range (BMI 18.5–24.9):</span>{' '}
            <strong className="text-slate-900">{results.healthyWeightMinKg} – {results.healthyWeightMaxKg} kg</strong>
          </div>
        </div>
      </div>

      {/* Medical Flag Status */}
      <div className={`p-4 rounded-lg border text-xs ${
        results.flagLevel === 'red'
          ? 'bg-rose-50 border-rose-300 text-rose-900'
          : results.flagLevel === 'amber'
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
      }`}>
        <div className="font-bold uppercase tracking-wider mb-1">
          Clinical Screening: {results.flagLevel.toUpperCase()} FLAG STATUS
        </div>
        {results.flagLevel === 'red' && (
          <p>
            <strong>MANDATORY PHYSICIAN SUPERVISION REQUIRED:</strong> High-risk medical contraindications detected. Caloric restriction is strictly contraindicated without direct physician clearance and clinical oversight.
          </p>
        )}
        {results.flagLevel === 'amber' && (
          <p>
            <strong>CLINICAL SUPERVISION ADVISORY:</strong> Health conditions noted. Coordinate diet progression with regular biochemical panels and blood pressure monitoring.
          </p>
        )}
        {results.flagLevel === 'green' && (
          <p>
            Standard clinical parameters applied. Deficit capped within safe metabolic boundaries.
          </p>
        )}
      </div>

      {/* Personal Trainer Diet Plan */}
      <div className="border border-slate-200 rounded-lg p-5 space-y-4 print-break-inside-avoid">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Personal Trainer Meal-By-Meal Nutrition Plan ({dietPlan.totalDailyCalories} kcal/day)
          </h2>
          <span className="text-xs font-semibold text-slate-600">
            Water Target: {(dietPlan.dailyWaterMl / 1000).toFixed(1)} L/day
          </span>
        </div>

        <p className="text-xs text-slate-600 italic">
          {dietPlan.trainerStrategy}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dietPlan.slots.map((slot, idx) => {
            const opt = slot.options[0];
            return (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-1">
                  <span>{slot.slotName}</span>
                  <span className="text-sky-800">{slot.calorieTarget} kcal</span>
                </div>
                <div className="font-semibold text-slate-800">{opt.title}</div>
                <div className="text-slate-500 text-[11px]">
                  Protein: {opt.proteinGrams}g · Carbs: {opt.carbGrams}g · Fats: {opt.fatGrams}g
                </div>
                <ul className="text-slate-600 pl-3 list-disc space-y-0.5 text-[11px]">
                  {opt.ingredients.slice(0, 3).map((ing, iIdx) => (
                    <li key={iIdx}>{ing}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Trainer Home Workout Routine */}
      <div className="border border-slate-200 rounded-lg p-5 space-y-4 print-break-inside-avoid">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Home Exercise Routine: {workoutRoutine.routineTitle}
          </h2>
          <span className="text-xs font-semibold text-slate-600">
            {workoutRoutine.weeklyFrequency} · {workoutRoutine.estimatedMinutes} mins
          </span>
        </div>

        <div className="text-xs text-slate-600 space-y-1">
          <p><strong>Clinical Protocol:</strong> {workoutRoutine.clinicalTag}</p>
          <p><strong>Warmup:</strong> {workoutRoutine.warmup.join('; ')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workoutRoutine.exercises.map((ex, idx) => (
            <div key={ex.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{idx + 1}. {ex.name}</span>
                <span className="text-emerald-800 font-extrabold">{ex.sets} sets × {ex.reps}</span>
              </div>
              
              <div className="w-full bg-white rounded p-1 border border-slate-200 flex justify-center">
                <ExerciseIllustration type={ex.illustration} className="w-full h-28" />
              </div>

              <div className="text-[11px] text-slate-500">
                <strong>Muscles:</strong> {ex.targetMuscles.join(', ')} · <strong>Rest:</strong> {ex.restSeconds}s
              </div>
              <div className="text-[11px] text-slate-700">
                <strong>Form:</strong> {ex.executionSteps[0]}
              </div>
              <div className="text-[11px] text-emerald-800 bg-emerald-50/50 p-1 rounded">
                <strong>Breathing:</strong> {ex.breathingCue}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Sign-Off & Disclaimer */}
      <div className="border-t border-slate-300 pt-6 text-[11px] text-slate-500 space-y-3">
        <p>
          <strong>Clinical Disclaimer:</strong> This document provides mathematical estimations (Mifflin-St Jeor, Devine) and standard home exercise prescriptions. It does not replace individualized clinical judgment, cardiology stress testing, or personalized dietitian prescription. Always obtain clinical clearance prior to initiating any new exercise regimen.
        </p>

        <div className="grid grid-cols-2 gap-8 pt-4">
          <div>
            <div className="border-b border-slate-400 h-8"></div>
            <span className="block mt-1 text-slate-600">Patient / User Acknowledgment Signature</span>
          </div>
          <div>
            <div className="border-b border-slate-400 h-8"></div>
            <span className="block mt-1 text-slate-600">Licensed Physician / Dietitian Review (Optional)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
