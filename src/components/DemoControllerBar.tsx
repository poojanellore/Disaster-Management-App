import React from 'react';
import { 
  Play, 
  Activity, 
  AlertTriangle, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Wind, 
  Waves, 
  Mountain, 
  Tornado,
  Zap
} from 'lucide-react';
import { DisasterType, DemoStep } from '../types';

interface DemoControllerBarProps {
  currentStep: DemoStep;
  onSelectStep: (step: DemoStep) => void;
  disasterType: DisasterType;
  onTriggerDisaster: (type: DisasterType) => void;
  onResetSimulation: () => void;
  isDisasterActive: boolean;
  onOpenTriggerModal: () => void;
}

export const DemoControllerBar: React.FC<DemoControllerBarProps> = ({
  currentStep,
  onSelectStep,
  disasterType,
  onTriggerDisaster,
  onResetSimulation,
  isDisasterActive,
  onOpenTriggerModal,
}) => {
  const steps: Array<{
    step: DemoStep;
    label: string;
    sub: string;
    icon: typeof Activity;
  }> = [
    {
      step: 'STEP_1_NORMAL',
      label: '1. Normal State',
      sub: 'Ambient IoT Mesh Nominal',
      icon: Activity,
    },
    {
      step: 'STEP_2_THREAT',
      label: '2. Threat Anomaly',
      sub: 'Anomalous Sensor Spike (ML)',
      icon: AlertTriangle,
    },
    {
      step: 'STEP_3_PREDICTION',
      label: '3. Prediction & Zones',
      sub: 'Alpha 5km & Beta 10km Concentric',
      icon: Layers,
    },
    {
      step: 'STEP_4_PANIC_PREVENTION',
      label: '4. Staggered Evac',
      sub: 'Alpha Clears, Beta Held (No Jam)',
      icon: Clock,
    },
  ];

  const disasterOptions: Array<{ type: DisasterType; label: string; icon: typeof Activity }> = [
    { type: 'earthquake', label: 'Mw 7.4 Earthquake', icon: Zap },
    { type: 'wildfire', label: 'Cat-5 Wildfire', icon: Flame },
    { type: 'volcano', label: 'VEI-4 Volcano', icon: Mountain },
    { type: 'tsunami', label: '14m Tsunami Wave', icon: Waves },
    { type: 'tornado', label: 'EF-4 Tornado', icon: Tornado },
    { type: 'cyclone', label: 'Super Cyclone Cat 4', icon: Wind },
  ];

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-3 sm:px-5 sm:py-3 shadow-lg">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Step Flow Bento Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] font-bold px-1 hidden 2xl:block">
            DEMO SEQUENCE:
          </span>
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            return (
              <button
                key={s.step}
                id={`demo-step-${s.step}-btn`}
                onClick={() => onSelectStep(s.step)}
                className={`px-3 py-2 rounded-xl text-left transition-all border flex items-center gap-2.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#27272A]/80 border-red-500/80 text-white shadow-md ring-1 ring-red-500/50'
                    : 'bg-black/60 border-[#27272A] text-[#71717A] hover:text-[#E4E4E7] hover:bg-[#27272A]/30'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-red-600 text-white' : 'bg-[#18181B] text-[#71717A] border border-[#27272A]'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold leading-tight uppercase tracking-wider">{s.label}</div>
                  <div className="text-[10px] text-[#71717A] leading-tight hidden sm:block">
                    {s.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hazard Selector & Trigger Action Button */}
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center gap-1.5 bg-black px-3 py-1.5 rounded-xl border border-[#27272A]">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#71717A] hidden sm:inline font-bold">
              Hazard:
            </span>
            <select
              id="hazard-selector-dropdown"
              value={disasterType}
              aria-label="Hazard scenario selection"
              onChange={(e) => onTriggerDisaster(e.target.value as DisasterType)}
              className="bg-transparent text-xs font-mono font-bold text-red-400 focus:outline-none cursor-pointer uppercase"
            >
              {disasterOptions.map((opt) => (
                <option key={opt.type} value={opt.type} className="bg-[#18181B] text-[#E4E4E7]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            id="bar-trigger-now-btn"
            onClick={isDisasterActive ? onResetSimulation : () => onTriggerDisaster(disasterType)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter flex items-center gap-1.5 transition-all shadow-md ${
              isDisasterActive
                ? 'bg-[#27272A] hover:bg-slate-700 text-white border border-[#3F3F46]'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-950/50'
            }`}
          >
            {isDisasterActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span>Reset Sims</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trigger Prediction</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
