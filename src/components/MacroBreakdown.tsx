import React from 'react';

interface MacroBreakdownProps {
  calories: number;
  preset: 'balanced' | 'high_protein' | 'low_carb';
  onPresetChange: (preset: 'balanced' | 'high_protein' | 'low_carb') => void;
  macros: {
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
}

export const MacroBreakdown: React.FC<MacroBreakdownProps> = ({
  preset,
  onPresetChange,
  macros,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Daily Macronutrient Partitioning
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard biological energetic conversions: 4 kcal/g protein & carbohydrates, 9 kcal/g lipids.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onPresetChange('balanced')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              preset === 'balanced'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Balanced (45/25/30)
          </button>
          <button
            type="button"
            onClick={() => onPresetChange('high_protein')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              preset === 'high_protein'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High Protein (35/35/30)
          </button>
          <button
            type="button"
            onClick={() => onPresetChange('low_carb')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              preset === 'low_carb'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Low Carb (25/35/40)
          </button>
        </div>
      </div>

      {/* Proportional Macro Color Bar */}
      <div className="h-3.5 w-full bg-slate-100 rounded-full flex overflow-hidden mb-4 shadow-inner">
        <div
          className="bg-sky-500 transition-all duration-300"
          style={{ width: `${macros.carbPct}%` }}
          title={`Carbohydrates: ${macros.carbPct}%`}
        />
        <div
          className="bg-emerald-500 transition-all duration-300"
          style={{ width: `${macros.proteinPct}%` }}
          title={`Protein: ${macros.proteinPct}%`}
        />
        <div
          className="bg-amber-500 transition-all duration-300"
          style={{ width: `${macros.fatPct}%` }}
          title={`Fats: ${macros.fatPct}%`}
        />
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg border border-sky-100 bg-sky-50/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-sky-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              Carbohydrates ({macros.carbPct}%)
            </span>
            <span className="text-sky-700">{macros.carbCalories} kcal</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {macros.carbGrams} <span className="text-xs font-medium text-slate-500">grams/day</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Protein ({macros.proteinPct}%)
            </span>
            <span className="text-emerald-700">{macros.proteinCalories} kcal</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {macros.proteinGrams} <span className="text-xs font-medium text-slate-500">grams/day</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-amber-100 bg-amber-50/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-amber-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Dietary Fats ({macros.fatPct}%)
            </span>
            <span className="text-amber-700">{macros.fatCalories} kcal</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {macros.fatGrams} <span className="text-xs font-medium text-slate-500">grams/day</span>
          </div>
        </div>
      </div>
    </div>
  );
};
