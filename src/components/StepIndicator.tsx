import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep,
}) => {
  const steps = [
    { number: 1, title: 'User Biometrics', description: 'Metrics & Targets' },
    { number: 2, title: 'Medical Screening', description: 'Clinical Contraindications' },
    { number: 3, title: 'Plan & Dashboard', description: 'Formulas & Safety Caps' },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-3 sm:p-4 mb-6 shadow-2xs">
      <div className="grid grid-cols-3 gap-2">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isClickable = canNavigateToStep(step.number);

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => isClickable && onStepClick(step.number)}
              disabled={!isClickable}
              className={`flex items-center gap-2.5 p-2 rounded-md transition-all text-left ${
                isActive
                  ? 'bg-sky-50/70 border border-sky-200'
                  : 'hover:bg-slate-50 border border-transparent'
              } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
              <div
                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-sky-700 text-white ring-2 ring-sky-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
              </div>
              <div className="min-w-0 hidden sm:block">
                <div
                  className={`text-xs font-semibold leading-tight truncate ${
                    isActive ? 'text-sky-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{step.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
