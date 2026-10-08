import React from 'react';

interface BmiGaugeProps {
  bmi: number;
  category: string;
  isPediatric?: boolean;
}

export const BmiGauge: React.FC<BmiGaugeProps> = ({ bmi, category, isPediatric }) => {
  // Clamp BMI for display between 14 and 42
  const minBmi = 14;
  const maxBmi = 42;
  const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmi));

  // Map 14-42 to angle -90 to +90 degrees (180 deg sweep)
  const angleDeg = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 180 - 90;
  const angleRad = (angleDeg - 90) * (Math.PI / 180);

  // Needle tip coordinates: radius = 70, center = (100, 95)
  const cx = 100;
  const cy = 95;
  const needleLength = 65;
  const needleX = cx + needleLength * Math.cos(angleRad);
  const needleY = cy + needleLength * Math.sin(angleRad);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[280px]">
        <svg viewBox="0 0 200 120" className="w-full h-auto drop-shadow-xs">
          {/* Arc Background Track */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Underweight Arc (Blue): 14 to 18.5 -> (4.5 / 28) ≈ 16% */}
          <path
            d="M 20 95 A 80 80 0 0 1 48 48"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Normal Weight Arc (Emerald): 18.5 to 25 -> (6.5 / 28) ≈ 23% */}
          <path
            d="M 48 48 A 80 80 0 0 1 114 26"
            fill="none"
            stroke="#10b981"
            strokeWidth="14"
          />

          {/* Overweight Arc (Amber): 25 to 30 -> (5 / 28) ≈ 18% */}
          <path
            d="M 114 26 A 80 80 0 0 1 156 50"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
          />

          {/* Obese Arc (Red / Crimson): 30 to 42 */}
          <path
            d="M 156 50 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="#ef4444"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="6" fill="#0f172a" />
          <circle cx={cx} cy={cy} r="2.5" fill="#ffffff" />
        </svg>

        {/* Category Readout */}
        <div className="text-center mt-[-10px]">
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {bmi.toFixed(1)}
          </div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-0.5">
            {category}
          </div>
          {isPediatric && (
            <div className="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-0.5 mt-1 border border-amber-200 inline-block font-medium">
              Pediatric Growth Notice: CDC/WHO percentiles apply
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-[11px] text-slate-500 w-full pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>&lt;18.5 Under</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>18.5–24.9 Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>25.0–29.9 Over</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>&ge;30.0 Obese</span>
        </div>
      </div>
    </div>
  );
};
