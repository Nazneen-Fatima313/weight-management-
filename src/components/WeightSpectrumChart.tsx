import React from 'react';
import { UnitSystem } from '../types';

interface WeightSpectrumProps {
  currentWeight: number;
  targetWeight: number;
  healthyMin: number;
  healthyMax: number;
  idealBodyWeight: number;
  unitSystem: UnitSystem;
}

export const WeightSpectrumChart: React.FC<WeightSpectrumProps> = ({
  currentWeight,
  targetWeight,
  healthyMin,
  healthyMax,
  idealBodyWeight,
  unitSystem,
}) => {
  const unitLabel = unitSystem === 'metric' ? 'kg' : 'lbs';

  // Find min and max for chart axis scale with padding
  const allValues = [currentWeight, targetWeight, healthyMin, healthyMax, idealBodyWeight];
  const axisMin = Math.max(20, Math.floor(Math.min(...allValues) * 0.85));
  const axisMax = Math.ceil(Math.max(...allValues) * 1.15);
  const range = axisMax - axisMin || 1;

  const toPercent = (val: number) => {
    const clamped = Math.max(axisMin, Math.min(axisMax, val));
    return ((clamped - axisMin) / range) * 100;
  };

  const healthyMinPct = toPercent(healthyMin);
  const healthyMaxPct = toPercent(healthyMax);
  const currentPct = toPercent(currentWeight);
  const targetPct = toPercent(targetWeight);
  const ibwPct = toPercent(idealBodyWeight);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center text-xs text-slate-600 gap-y-1">
        <div>
          <span className="font-semibold text-slate-900">Current:</span>{' '}
          {currentWeight.toFixed(1)} {unitLabel}
        </div>
        <div>
          <span className="font-semibold text-emerald-800">Healthy Range (BMI 18.5–24.9):</span>{' '}
          {healthyMin.toFixed(1)} – {healthyMax.toFixed(1)} {unitLabel}
        </div>
        <div>
          <span className="font-semibold text-blue-800">Devine IBW:</span>{' '}
          {idealBodyWeight.toFixed(1)} {unitLabel}
        </div>
      </div>

      {/* Visual Spectrum Track */}
      <div className="relative pt-6 pb-8">
        {/* Base Track */}
        <div className="h-4 bg-slate-100 rounded-full w-full relative border border-slate-200 overflow-visible">
          {/* Healthy Range Highlight Box */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-200/80 border-x border-emerald-400 z-10 transition-all duration-300"
            style={{
              left: `${healthyMinPct}%`,
              width: `${Math.max(2, healthyMaxPct - healthyMinPct)}%`,
            }}
            title={`Healthy Range: ${healthyMin.toFixed(1)} - ${healthyMax.toFixed(1)} ${unitLabel}`}
          />

          {/* Devine IBW Marker (Diamond/Tick) */}
          <div
            className="absolute top-[-14px] transform -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-300"
            style={{ left: `${ibwPct}%` }}
          >
            <span className="text-[10px] font-bold text-blue-700 whitespace-nowrap bg-blue-50 px-1 py-0.5 rounded border border-blue-200 shadow-2xs">
              IBW {idealBodyWeight.toFixed(1)}
            </span>
            <div className="w-0.5 h-3.5 bg-blue-600"></div>
          </div>

          {/* Current Weight Pin */}
          <div
            className="absolute bottom-[-24px] transform -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none transition-all duration-300"
            style={{ left: `${currentPct}%` }}
          >
            <div className="w-0.5 h-3 bg-slate-900"></div>
            <span className="text-[10px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
              Current: {currentWeight.toFixed(1)}
            </span>
          </div>

          {/* Target Weight Pin (if different from current) */}
          {Math.abs(targetWeight - currentWeight) > 0.5 && (
            <div
              className="absolute bottom-[-24px] transform -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none transition-all duration-300"
              style={{ left: `${targetPct}%` }}
            >
              <div className="w-0.5 h-3 bg-emerald-600"></div>
              <span className="text-[10px] font-bold text-emerald-950 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                Goal: {targetWeight.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-slate-600 px-1">
        <span>{axisMin} {unitLabel}</span>
        <span>Axis range: {axisMin} – {axisMax} {unitLabel}</span>
        <span>{axisMax} {unitLabel}</span>
      </div>
    </div>
  );
};
