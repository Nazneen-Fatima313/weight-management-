import React from 'react';
import { ExerciseIllustrationType } from '../types';

interface ExerciseIllustrationProps {
  type: ExerciseIllustrationType;
  className?: string;
  isAnimated?: boolean;
  jointSafetyFocus?: boolean;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  type,
  className = 'w-full h-44',
  isAnimated = false,
  jointSafetyFocus = true,
}) => {
  // Common joint safety colors
  const jointColor = jointSafetyFocus ? '#10b981' : '#0284c7'; // Emerald green for joint safety
  const safeHaloClass = isAnimated ? 'joint-halo-pulse' : '';
  const safeGlowClass = isAnimated ? 'joint-angle-glow' : '';

  switch (type) {
    case 'squat':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

          {/* Animated Demonstration Mode */}
          {isAnimated ? (
            <g>
              {/* Floor boundary & safe knee vertical line */}
              <line x1="160" y1="50" x2="160" y2="140" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="164" y="60" fontSize="8" fill="#64748b">Toe Plane Limit</text>

              {/* Bench / Chair safety depth cushion line */}
              <rect x="70" y="100" width="40" height="40" fill="#e2e8f0" rx="3" opacity="0.6" />
              <text x="90" y="125" fontSize="7.5" fill="#64748b" textAnchor="middle">Chair Safety Stop</text>

              {/* Dynamic Squatting Figure controlled by CSS keyframe */}
              <g className="animate-squat-torso" style={{ transformOrigin: '120px 140px' }}>
                {/* Head */}
                <circle cx="120" cy="42" r="8.5" fill="#0284c7" />
                {/* Torso with neutral spine */}
                <line x1="120" y1="50" x2="114" y2="92" stroke="#0284c7" strokeWidth="6.5" strokeLinecap="round" />
                {/* Neutral spine safety indicator */}
                {jointSafetyFocus && (
                  <line x1="117" y1="50" x2="111" y2="92" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" className={safeGlowClass} />
                )}
                {/* Counterbalance Arms */}
                <line x1="120" y1="62" x2="148" y2="60" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
                {/* Thigh (Femur) */}
                <line x1="114" y1="92" x2="146" y2="105" stroke="#0369a1" strokeWidth="6" strokeLinecap="round" />
                {/* Shin (Tibia) */}
                <line x1="146" y1="105" x2="144" y2="140" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" />
                {/* Foot */}
                <line x1="136" y1="140" x2="154" y2="140" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

                {/* Knee Joint Safety Halo & Protection Tag */}
                {jointSafetyFocus && (
                  <>
                    <circle cx="146" cy="105" r="7" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                    <circle cx="146" cy="105" r="3" fill={jointColor} />
                    <circle cx="114" cy="92" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                  </>
                )}
              </g>

              {/* Joint Protection HUD callout */}
              <g transform="translate(160, 85)">
                <rect x="0" y="0" width="108" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
                <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">PROTECTING KNEES & HIPS</text>
                <text x="6" y="24" fontSize="7" fill="#047857">• Knee stops &gt; 90° (Zero shear)</text>
                <text x="6" y="34" fontSize="7" fill="#047857">• Knees track inline with toes</text>
              </g>

              {/* Tempo indicator prompt */}
              <text x="140" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
                Smooth Tempo: 2s Down (Inhale) ➔ 1s Chair Pause ➔ 2s Drive (Exhale)
              </text>
            </g>
          ) : (
            // Static 2-Position Clinical View
            <g>
              {/* Position A: Setup */}
              <g opacity="0.45">
                <text x="65" y="24" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">1. Start / Setup</text>
                <circle cx="65" cy="40" r="8" fill="#64748b" />
                <line x1="65" y1="48" x2="65" y2="92" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                <line x1="65" y1="60" x2="88" y2="60" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                <line x1="65" y1="92" x2="60" y2="140" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                <line x1="65" y1="92" x2="70" y2="140" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* Arrow */}
              <path d="M 105 75 Q 130 65 150 75" fill="none" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
                </marker>
              </defs>

              {/* Position B: Safe Depth */}
              <g>
                <text x="200" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0369a1">2. Parallel Squat Depth</text>
                <circle cx="180" cy="58" r="8.5" fill="#0284c7" />
                <line x1="180" y1="66" x2="198" y2="98" stroke="#0284c7" strokeWidth="6.5" strokeLinecap="round" />
                <line x1="185" y1="74" x2="225" y2="70" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
                <line x1="198" y1="98" x2="232" y2="98" stroke="#0369a1" strokeWidth="6" strokeLinecap="round" />
                <line x1="232" y1="98" x2="228" y2="140" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
                <line x1="222" y1="140" x2="238" y2="140" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <circle cx="232" cy="98" r="3.5" fill="#10b981" />
                <text x="240" y="102" fontSize="8" fill="#059669" fontWeight="600">Knee &gt; 90°</text>
              </g>
            </g>
          )}
        </svg>
      );

    case 'pushup':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

          {/* Wall / Elevated Edge on Left */}
          <rect x="25" y="30" width="8" height="110" fill="#94a3b8" rx="2" />
          <text x="29" y="22" fontSize="8" fill="#64748b" textAnchor="middle">Wall</text>

          {isAnimated ? (
            <g>
              <g className="animate-pushup-plank" style={{ transformOrigin: '210px 140px' }}>
                {/* Head */}
                <circle cx="70" cy="62" r="7.5" fill="#0284c7" />
                {/* Plank Spine Line */}
                <line x1="76" y1="66" x2="210" y2="136" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
                {/* Neutral core vector */}
                <line x1="76" y1="72" x2="210" y2="142" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" className={safeGlowClass} />
                {/* Arm pushing against wall */}
                <line x1="88" y1="74" x2="33" y2="74" stroke="#0369a1" strokeWidth="4.5" strokeLinecap="round" />
                {/* Feet */}
                <circle cx="210" cy="138" r="4" fill="#0f172a" />

                {/* Shoulder & Elbow Joint Safety Halos */}
                {jointSafetyFocus && (
                  <>
                    <circle cx="88" cy="74" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                    <circle cx="88" cy="74" r="2.5" fill={jointColor} />
                  </>
                )}
              </g>

              {/* Joint Protection HUD callout */}
              <g transform="translate(150, 40)">
                <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
                <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">SHOULDER & WRIST SAFE</text>
                <text x="6" y="24" fontSize="7" fill="#047857">• Elbows tucked at 45° angle</text>
                <text x="6" y="34" fontSize="7" fill="#047857">• Zero neck dropping / sagging</text>
              </g>

              <text x="140" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
                Cadence: 2s Incline Lower (Inhale) ➔ 1s Hold ➔ 2s Push (Exhale)
              </text>
            </g>
          ) : (
            <g>
              <g opacity="0.45">
                <text x="80" y="24" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">1. High Plank</text>
                <circle cx="58" cy="75" r="7.5" fill="#64748b" />
                <line x1="65" y1="80" x2="135" y2="135" stroke="#64748b" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="75" y1="86" x2="33" y2="86" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g>
                <text x="210" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0369a1">2. Lower with Control</text>
                <circle cx="170" cy="112" r="7.5" fill="#0284c7" />
                <line x1="176" y1="116" x2="245" y2="136" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="184" y1="118" x2="194" y2="104" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" />
                <line x1="194" y1="104" x2="194" y2="140" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" />
                <circle cx="184" cy="118" r="3.5" fill="#10b981" />
                <text x="202" y="105" fontSize="8" fill="#10b981" fontWeight="600">Elbows 45° angle</text>
              </g>
            </g>
          )}
        </svg>
      );

    case 'bridge':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

          {isAnimated ? (
            <g>
              {/* Shoulders anchored on floor */}
              <circle cx="70" cy="134" r="7" fill="#0284c7" />
              <line x1="70" y1="136" x2="105" y2="136" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              {/* Feet anchored on floor */}
              <line x1="180" y1="136" x2="200" y2="136" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

              {/* Dynamic Hips Elevating controlled by CSS */}
              <g className="animate-glute-bridge">
                {/* Pelvis & Thigh connecting line */}
                <line x1="70" y1="134" x2="135" y2="120" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
                <line x1="135" y1="120" x2="185" y2="120" stroke="#0369a1" strokeWidth="6" strokeLinecap="round" />
                <line x1="185" y1="120" x2="185" y2="140" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

                {/* Lumbar Spine & Knee Joint Safety Halos */}
                {jointSafetyFocus && (
                  <>
                    <circle cx="135" cy="120" r="7" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                    <circle cx="135" cy="120" r="3" fill={jointColor} />
                    <circle cx="185" cy="120" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                  </>
                )}
              </g>

              {/* Joint Protection HUD callout */}
              <g transform="translate(150, 40)">
                <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
                <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">LUMBAR DISC SPARING</text>
                <text x="6" y="24" fontSize="7" fill="#047857">• Drive through heels only</text>
                <text x="6" y="34" fontSize="7" fill="#047857">• Zero low back hyperextension</text>
              </g>

              <text x="140" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
                Cadence: Lift Hips (Exhale 2s) ➔ Peak Glute Squeeze (2s) ➔ Lower (Inhale 2s)
              </text>
            </g>
          ) : (
            <g>
              <g opacity="0.45">
                <text x="65" y="24" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">1. Back Flat</text>
                <circle cx="35" cy="134" r="7" fill="#64748b" />
                <line x1="42" y1="135" x2="80" y2="135" stroke="#64748b" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="80" y1="135" x2="98" y2="110" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="98" y1="110" x2="98" y2="140" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
              </g>
              <g>
                <text x="200" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0369a1">2. Bridge Hips (Squeeze Glutes)</text>
                <circle cx="160" cy="134" r="7" fill="#0284c7" />
                <line x1="170" y1="134" x2="220" y2="105" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
                <line x1="220" y1="105" x2="220" y2="140" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
                <circle cx="195" cy="120" r="3.5" fill="#10b981" />
                <text x="180" y="98" fontSize="8" fill="#059669" fontWeight="600">Pelvis in line with knees</text>
              </g>
            </g>
          )}
        </svg>
      );

    case 'birddog':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

          {isAnimated ? (
            <g>
              {/* Supporting Arm and Supporting Knee anchored */}
              <line x1="140" y1="95" x2="140" y2="140" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="190" y1="95" x2="190" y2="140" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="140" cy="88" r="7" fill="#0284c7" />
              <line x1="140" y1="95" x2="190" y2="95" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />

              {/* Horizontal Reference Line for Spinal Safety */}
              <line x1="85" y1="90" x2="255" y2="90" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" className={safeGlowClass} />

              {/* Moving Opposing Arm and Leg */}
              <g className="animate-birddog">
                <line x1="140" y1="95" x2="95" y2="95" stroke="#0369a1" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="190" y1="95" x2="245" y2="95" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" />
                {jointSafetyFocus && (
                  <>
                    <circle cx="140" cy="95" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                    <circle cx="190" cy="95" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                  </>
                )}
              </g>

              {/* Joint Protection HUD callout */}
              <g transform="translate(150, 36)">
                <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
                <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">SPINAL VERTEBRAE SAFE</text>
                <text x="6" y="24" fontSize="7" fill="#047857">• Horizontal level (No arch)</text>
                <text x="6" y="34" fontSize="7" fill="#047857">• Hips remain strictly squared</text>
              </g>

              <text x="140" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
                Cadence: Extend (Exhale 2s) ➔ Pause (2s) ➔ Retract (Inhale 2s)
              </text>
            </g>
          ) : (
            <g>
              <g opacity="0.45">
                <text x="65" y="24" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">1. Tabletop</text>
                <circle cx="45" cy="95" r="7" fill="#64748b" />
                <line x1="50" y1="100" x2="90" y2="100" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                <line x1="56" y1="100" x2="56" y2="140" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                <line x1="90" y1="100" x2="90" y2="140" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g>
                <text x="200" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0369a1">2. Opposite Arm & Leg Extended</text>
                <line x1="145" y1="95" x2="180" y2="95" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
                <circle cx="178" cy="90" r="7" fill="#0284c7" />
                <line x1="180" y1="95" x2="225" y2="95" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
                <line x1="185" y1="95" x2="185" y2="140" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                <line x1="225" y1="95" x2="225" y2="140" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                <line x1="225" y1="95" x2="265" y2="95" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" />
                <circle cx="225" cy="95" r="3.5" fill="#10b981" />
                <text x="180" y="80" fontSize="8" fill="#059669" fontWeight="600">Horizontal spinal alignment</text>
              </g>
            </g>
          )}
        </svg>
      );

    case 'wallsit':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
          {/* Wall */}
          <rect x="70" y="25" width="10" height="115" fill="#64748b" rx="2" />

          <g>
            <circle cx="95" cy="45" r="8" fill="#0284c7" />
            <line x1="86" y1="53" x2="86" y2="96" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
            <line x1="86" y1="96" x2="128" y2="96" stroke="#0369a1" strokeWidth="6" strokeLinecap="round" />
            <line x1="128" y1="96" x2="128" y2="140" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="88" y1="68" x2="110" y2="80" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />

            {/* Knee Angle Safe Arc and Halos */}
            {jointSafetyFocus && (
              <>
                <circle cx="128" cy="96" r="8" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
                <circle cx="128" cy="96" r="3" fill={jointColor} />
                <path d="M 128 110 A 14 14 0 0 1 114 96" fill="none" stroke={jointColor} strokeWidth="2" className={safeGlowClass} />
                <text x="136" y="98" fontSize="8" fill="#059669" fontWeight="700">Safe 90° Stack</text>
              </>
            )}

            {/* Joint Protection HUD callout */}
            <g transform="translate(150, 40)">
              <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
              <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">ZERO CARTILAGE FRICTION</text>
              <text x="6" y="24" fontSize="7" fill="#047857">• Isometric static load</text>
              <text x="6" y="34" fontSize="7" fill="#047857">• Knees stay directly over ankles</text>
            </g>

            <text x="160" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
              {isAnimated ? 'Continuous Diaphragmatic Breathing · Steady Isometric Burn' : 'Wall Sit Isometric Hold'}
            </text>
          </g>
        </svg>
      );

    case 'chairmarch':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 90 60 L 90 140 M 90 100 L 120 100 M 120 100 L 120 140" stroke="#94a3b8" strokeWidth="3" fill="none" />

          <g>
            <circle cx="102" cy="50" r="8" fill="#0284c7" />
            <line x1="102" y1="58" x2="102" y2="98" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
            <line x1="102" y1="98" x2="125" y2="98" stroke="#64748b" strokeWidth="4.5" />
            <line x1="125" y1="98" x2="125" y2="140" stroke="#64748b" strokeWidth="4.5" />

            {/* Marching Knee with animated lift */}
            <g className={isAnimated ? 'animate-chairmarch' : ''} style={{ transformOrigin: '102px 98px' }}>
              <line x1="102" y1="98" x2="135" y2="80" stroke="#0369a1" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="135" y1="80" x2="145" y2="115" stroke="#0369a1" strokeWidth="5.5" strokeLinecap="round" />
              {jointSafetyFocus && (
                <circle cx="135" cy="80" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
              )}
            </g>

            {/* Joint Protection HUD callout */}
            <g transform="translate(150, 40)">
              <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
              <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">ZERO IMPACT MOBILITY</text>
              <text x="6" y="24" fontSize="7" fill="#047857">• Gentle synovial fluid flow</text>
              <text x="6" y="34" fontSize="7" fill="#047857">• Zero ground reaction force</text>
            </g>

            <text x="155" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
              {isAnimated ? 'Cadence: Smooth Alternating Rhythm · Never Hold Breath' : 'Seated Knee March'}
            </text>
          </g>
        </svg>
      );

    case 'deadbug':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

          <g>
            <circle cx="65" cy="132" r="7.5" fill="#0284c7" />
            <line x1="72" y1="134" x2="125" y2="134" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />

            {/* Lumbar anchor cue */}
            {jointSafetyFocus && (
              <line x1="72" y1="137" x2="125" y2="137" stroke="#10b981" strokeWidth="2.5" className={safeGlowClass} />
            )}

            <g className={isAnimated ? 'animate-deadbug' : ''} style={{ transformOrigin: '100px 130px' }}>
              <line x1="82" y1="130" x2="55" y2="105" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" />
              <line x1="82" y1="130" x2="82" y2="85" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="125" y1="134" x2="138" y2="100" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="138" y1="100" x2="165" y2="100" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="125" y1="134" x2="175" y2="120" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" />
            </g>

            {/* Joint Protection HUD callout */}
            <g transform="translate(150, 40)">
              <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
              <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">PELVIC & SACRAL LOCK</text>
              <text x="6" y="24" fontSize="7" fill="#047857">• Low back glued to ground</text>
              <text x="6" y="34" fontSize="7" fill="#047857">• Zero anterior pelvic tilt</text>
            </g>

            <text x="150" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
              {isAnimated ? 'Reach (Exhale through pursed lips) ➔ Return (Inhale)' : 'Dead Bug Pelvic Control'}
            </text>
          </g>
        </svg>
      );

    case 'calfraises':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="90" y1="50" x2="90" y2="140" stroke="#94a3b8" strokeWidth="3" />

          <g>
            <g className={isAnimated ? 'animate-calfraise' : ''} style={{ transformOrigin: '120px 140px' }}>
              <circle cx="120" cy="45" r="7.5" fill="#0284c7" />
              <line x1="120" y1="53" x2="120" y2="98" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="120" y1="65" x2="90" y2="65" stroke="#0284c7" strokeWidth="3" />
              <line x1="120" y1="98" x2="120" y2="132" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" />
              <line x1="120" y1="132" x2="120" y2="140" stroke="#0f172a" strokeWidth="4" />
              {jointSafetyFocus && (
                <circle cx="120" cy="115" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
              )}
            </g>

            {/* Joint Protection HUD callout */}
            <g transform="translate(150, 40)">
              <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
              <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">ACHILLES & ANKLE CARE</text>
              <text x="6" y="24" fontSize="7" fill="#047857">• Smooth vertical translation</text>
              <text x="6" y="34" fontSize="7" fill="#047857">• Zero ballistic bouncing</text>
            </g>

            <text x="150" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
              {isAnimated ? 'Elevate (1s) ➔ Peak Squeeze (2s) ➔ Controlled Descent (2s)' : 'Standing Calf Raise'}
            </text>
          </g>
        </svg>
      );

    case 'row':
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
          <rect x="75" y="25" width="8" height="115" fill="#94a3b8" rx="2" />

          <g>
            <g className={isAnimated ? 'animate-row' : ''} style={{ transformOrigin: '110px 140px' }}>
              <circle cx="110" cy="55" r="7" fill="#0284c7" />
              <line x1="110" y1="62" x2="118" y2="140" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="110" y1="72" x2="95" y2="76" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" />
              <line x1="95" y1="76" x2="75" y2="72" stroke="#0369a1" strokeWidth="3.5" strokeLinecap="round" />
              {jointSafetyFocus && (
                <circle cx="105" cy="72" r="6" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
              )}
            </g>

            {/* Joint Protection HUD callout */}
            <g transform="translate(150, 40)">
              <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
              <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">SCAPULAR & NECK SAFE</text>
              <text x="6" y="24" fontSize="7" fill="#047857">• Pinch shoulder blades back</text>
              <text x="6" y="34" fontSize="7" fill="#047857">• Avoid shrugging into neck</text>
            </g>

            <text x="150" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
              {isAnimated ? 'Pull Chest to Frame (Exhale) ➔ Retract Scapula ➔ Lower (Inhale)' : 'Doorway Isometric Row'}
            </text>
          </g>
        </svg>
      );

    case 'stepup':
    default:
      return (
        <svg viewBox="0 0 280 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" fill="#f8fafc" rx="8" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
          <rect x="120" y="105" width="55" height="35" fill="#94a3b8" rx="3" />

          <g>
            <g className={isAnimated ? 'animate-stepup' : ''} style={{ transformOrigin: '80px 140px' }}>
              <circle cx="85" cy="50" r="7.5" fill="#0284c7" />
              <line x1="85" y1="58" x2="90" y2="100" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="90" y1="100" x2="78" y2="140" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="90" y1="100" x2="130" y2="85" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" />
              <line x1="130" y1="85" x2="130" y2="105" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" />
              {jointSafetyFocus && (
                <circle cx="130" cy="85" r="7" fill="none" stroke={jointColor} strokeWidth="2" className={safeHaloClass} />
              )}
            </g>

            {/* Joint Protection HUD callout */}
            <g transform="translate(150, 40)">
              <rect x="0" y="0" width="118" height="42" rx="4" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1" />
              <text x="6" y="13" fontSize="8" fontWeight="700" fill="#065f46">UNILATERAL KNEE TRACK</text>
              <text x="6" y="24" fontSize="7" fill="#047857">• Knee aligned with second toe</text>
              <text x="6" y="34" fontSize="7" fill="#047857">• Zero inward knee collapse</text>
            </g>

            <text x="150" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1">
              {isAnimated ? 'Drive Through Heel (Exhale) ➔ Step Down Softly (Inhale)' : 'Step-Up Knee Alignment'}
            </text>
          </g>
        </svg>
      );
  }
};
