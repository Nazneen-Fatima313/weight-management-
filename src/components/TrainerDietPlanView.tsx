import React, { useState } from 'react';
import {
  Apple,
  CheckCircle,
  Clock,
  Droplets,
  Flame,
  Info,
  ShieldAlert,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { PersonalDietPlan } from '../types';

interface TrainerDietPlanViewProps {
  plan: PersonalDietPlan;
}

export const TrainerDietPlanView: React.FC<TrainerDietPlanViewProps> = ({ plan }) => {
  // Store selected meal option index per slot
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  });

  const toggleOption = (slotIdx: number, optIdx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [slotIdx]: optIdx }));
  };

  return (
    <div className="space-y-6">
      {/* Trainer Strategy Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                <Utensils className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Personal Trainer Nutrition & Meal Plan
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {plan.trainerStrategy}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Calorie Pill */}
            <div className="bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-right">
              <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                Total Daily Intake
              </div>
              <div className="text-xl font-black text-sky-950 flex items-center gap-1 justify-end">
                <Flame className="w-4 h-4 text-sky-600" />
                <span>{plan.totalDailyCalories} kcal</span>
              </div>
            </div>

            {/* Hydration Target */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-right">
              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Daily Hydration
              </div>
              <div className="text-xl font-black text-emerald-950 flex items-center gap-1 justify-end">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>{(plan.dailyWaterMl / 1000).toFixed(1)} L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mt-4 pt-1">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Trainer Nutritional Execution Rules:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
            {plan.corePrinciples.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Diet Adjustments if any */}
        {plan.medicalDietAdjustments.length > 0 && (
          <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Clinical Medical History Diet Protocol:</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-900/90 pl-6 list-disc">
              {plan.medicalDietAdjustments.map((adj, idx) => (
                <li key={idx}>{adj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Meal Slots Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Meal-by-Meal Caloric Blueprint
          </h4>
          <span className="text-xs text-slate-500">
            Click Option A or B to customize each meal
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {plan.slots.map((slot, sIdx) => {
            const activeOptIdx = selectedOptions[sIdx] ?? 0;
            const currentOption = slot.options[activeOptIdx] || slot.options[0];

            return (
              <div
                key={sIdx}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Slot Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                      {sIdx + 1}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {slot.slotName}
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.timeGuidance}</span>
                        <span>·</span>
                        <span>{slot.caloriePercent}% of daily budget</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-sm font-extrabold text-sky-900 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                      Target: {slot.calorieTarget} kcal
                    </span>
                  </div>
                </div>

                {/* Option Selector Buttons */}
                <div className="flex items-center gap-2 mt-3 mb-4">
                  {slot.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => toggleOption(sIdx, oIdx)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        activeOptIdx === oIdx
                          ? 'bg-sky-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Option {oIdx + 1}: {opt.title.split(' with ')[0]}
                    </button>
                  ))}
                </div>

                {/* Active Meal Option Details */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="font-bold text-sm text-slate-900">
                      {currentOption.title}
                    </div>
                    {/* Exact Macros */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-800 font-semibold">
                        P: {currentOption.proteinGrams}g
                      </span>
                      <span className="text-sky-800 font-semibold">
                        C: {currentOption.carbGrams}g
                      </span>
                      <span className="text-amber-800 font-semibold">
                        F: {currentOption.fatGrams}g
                      </span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {currentOption.calories} kcal
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">
                    {currentOption.description}
                  </p>

                  {/* Ingredients & Portions */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Apple className="w-3 h-3 text-emerald-600" />
                      <span>Exact Measured Portions:</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                      {currentOption.ingredients.map((ing, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trainer Tip */}
                  <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60 text-xs text-sky-900 bg-sky-50/50 p-2.5 rounded">
                    <Info className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-sky-950">Trainer Insight:</strong>{' '}
                      {currentOption.trainerNote}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
