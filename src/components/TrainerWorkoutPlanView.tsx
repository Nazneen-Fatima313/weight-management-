import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Dumbbell,
  Eye,
  Film,
  Heart,
  Pause,
  Play,
  Repeat,
  Shield,
  ShieldAlert,
  Sparkles,
  Wind,
} from 'lucide-react';
import { HomeWorkoutRoutine } from '../types';
import { ExerciseIllustration } from './ExerciseIllustration';

interface TrainerWorkoutPlanViewProps {
  routine: HomeWorkoutRoutine;
}

export const TrainerWorkoutPlanView: React.FC<TrainerWorkoutPlanViewProps> = ({ routine }) => {
  // Global toggle for animated video/GIF-like CSS transitions
  const [isAnimatedGlobal, setIsAnimatedGlobal] = useState<boolean>(true);
  // Global toggle for Joint Condition Safety highlighting
  const [jointSafetyFocus, setJointSafetyFocus] = useState<boolean>(true);
  // Individual exercise play/pause state overrides
  const [pausedExercises, setPausedExercises] = useState<Record<string, boolean>>({});

  const toggleExercisePlay = (id: string) => {
    setPausedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Routine Overview Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Dumbbell className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {routine.routineTitle}
              </h3>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>{routine.targetAudience}</span>
              <span>·</span>
              <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {routine.clinicalTag}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Frequency
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1 justify-end">
                <Repeat className="w-3.5 h-3.5 text-sky-600" />
                <span>{routine.weeklyFrequency.split(' (')[0]}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Duration
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{routine.estimatedMinutes} mins / session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Precautions */}
        {routine.medicalPrecautions.length > 0 && (
          <div className="mt-4 p-3.5 bg-rose-50/80 border border-rose-200 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Personal Trainer Clinical Safety Rules:</span>
            </div>
            <ul className="space-y-1 text-xs text-rose-900/90 pl-6 list-disc">
              {routine.medicalPrecautions.map((prec, idx) => (
                <li key={idx}>{prec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warmup & Cooldown Protocols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Dynamic Warmup (5 mins)</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
              {routine.warmup.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cool-Down & Mobility (5 mins)</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
              {routine.cooldown.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Joint Condition & Animation Control Bar */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-emerald-50 border border-sky-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-sky-600 text-white">
              <Film className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              Interactive Motion Demonstrations & Joint Safety Engine
            </h4>
          </div>
          <p className="text-xs text-slate-600">
            Hardware-accelerated CSS animations demonstrate safe kinematics, tempo, and joint-sparing range of motion for patients with joint or spinal history.
          </p>
        </div>

        {/* Toggle Switches */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {/* Animation Toggle */}
          <button
            type="button"
            onClick={() => setIsAnimatedGlobal(!isAnimatedGlobal)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              isAnimatedGlobal
                ? 'bg-sky-700 text-white border-sky-800 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isAnimatedGlobal ? <Film className="w-3.5 h-3.5 text-sky-200" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isAnimatedGlobal ? '🎬 Animated Loops: ON' : 'Static Diagrams: ON'}</span>
          </button>

          {/* Joint Condition Safety Overlay Toggle */}
          <button
            type="button"
            onClick={() => setJointSafetyFocus(!jointSafetyFocus)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              jointSafetyFocus
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${jointSafetyFocus ? 'text-emerald-200' : 'text-slate-400'}`} />
            <span>{jointSafetyFocus ? '🛡️ Joint Protection Overlay: ON' : 'Joint Overlay: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Joint Protection Patient Guidance Callout Banner */}
      {jointSafetyFocus && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 leading-relaxed space-y-1">
            <div className="font-bold text-sm text-emerald-900">
              Joint Health Protocol: Calibrated Safe Range of Motion (ROM)
            </div>
            <p>
              For individuals with osteoarthritis, previous meniscus/ligament repair, knee stiffness, or spinal sensitivity, the animations highlight green halos at the joints. Movement ranges are strictly limited to joint-friendly envelopes (e.g. stopping squats at $90^\circ$ or chair height to prevent patellofemoral shear, maintaining a neutral lumbar spine during core work, and keeping elbows at $45^\circ$ during pressing).
            </p>
          </div>
        </div>
      )}

      {/* Exercise Cards with Embedded Video-Like CSS Animations & Joint Safety Analysis */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Prescribed Home Exercises ({routine.exercises.length} Movements)
          </h4>
          <span className="text-xs text-slate-500">
            {isAnimatedGlobal ? 'Running CSS video-like kinematic form loops' : 'Static diagram view'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {routine.exercises.map((ex, idx) => {
            const isPaused = pausedExercises[ex.id] ?? false;
            const isPlaying = isAnimatedGlobal && !isPaused;

            return (
              <div
                key={ex.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-sky-700 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>{ex.name}</span>
                        {isPlaying && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            ACTIVE LOOP
                          </span>
                        )}
                      </h5>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span>Targets:</span>
                        <strong className="text-slate-700">{ex.targetMuscles.join(', ')}</strong>
                        <span>·</span>
                        <span>Equipment: <strong>{ex.equipment}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Per-exercise Play/Pause toggle */}
                    <button
                      type="button"
                      onClick={() => toggleExercisePlay(ex.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                      title={isPlaying ? 'Pause Motion Animation' : 'Play Motion Animation'}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3 h-3 text-amber-600" />
                          <span>Pause Motion</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                          <span>Play Motion</span>
                        </>
                      )}
                    </button>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {ex.difficulty}
                    </span>
                  </div>
                </div>

                {/* Grid: Animated SVG Illustration + Prescription Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4 items-center">
                  {/* Pictorial Exercise Diagram / Video-Like CSS Canvas */}
                  <div className="md:col-span-5 flex flex-col items-center bg-slate-50 rounded-lg p-2 border border-slate-200/80 relative overflow-hidden">
                    <ExerciseIllustration
                      type={ex.illustration}
                      className="w-full h-44"
                      isAnimated={isPlaying}
                      jointSafetyFocus={jointSafetyFocus}
                    />

                    {/* Footer HUD inside canvas */}
                    <div className="w-full flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 mt-1 px-1">
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {isPlaying ? 'CSS Kinematic Repetition Loop' : 'Static Diagram'}
                      </span>
                      {jointSafetyFocus && (
                        <span className="text-emerald-700 font-bold">
                          ✓ Joint Protection Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prescription Parameters & Steps */}
                  <div className="md:col-span-7 space-y-3">
                    {/* Sets, Reps, Rest, Tempo Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 bg-sky-50/70 border border-sky-100 rounded-lg">
                        <div className="text-[10px] font-bold text-sky-800 uppercase">Sets</div>
                        <div className="text-base font-black text-sky-950">{ex.sets}</div>
                      </div>
                      <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                        <div className="text-[10px] font-bold text-emerald-800 uppercase">Reps / Time</div>
                        <div className="text-sm font-black text-emerald-950 truncate" title={ex.reps}>
                          {ex.reps}
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-600 uppercase">Rest</div>
                        <div className="text-sm font-black text-slate-900">{ex.restSeconds}s</div>
                      </div>
                      <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg">
                        <div className="text-[10px] font-bold text-amber-800 uppercase">Tempo</div>
                        <div className="text-xs font-bold text-amber-950 truncate" title={ex.tempo}>
                          {ex.tempo.split(' ')[0]}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Execution Steps:
                      </div>
                      <ol className="space-y-1 text-xs text-slate-600 pl-4 list-decimal">
                        {ex.executionSteps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Breathing Cue */}
                    <div className="flex items-start gap-2 p-2 bg-emerald-50/60 border border-emerald-200/80 rounded text-xs text-emerald-900">
                      <Wind className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Breathing Cue:</strong> {ex.breathingCue}
                      </span>
                    </div>

                    {/* Joint Condition Safety Focus Modification */}
                    <div className="flex items-start gap-2 p-2 bg-amber-50/80 border border-amber-200 rounded text-xs text-amber-900">
                      <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Joint Condition Safety Rule:</strong> {ex.safetyModification}
                      </span>
                    </div>
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
