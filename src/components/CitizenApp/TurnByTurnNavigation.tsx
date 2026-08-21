import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Clock, 
  Volume2,
  VolumeX,
  PhoneCall
} from 'lucide-react';
import { EvacuationRoute, Shelter, SupportedLanguage } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { speakEmergencyText } from '../../utils/soundEffects';

interface TurnByTurnNavigationProps {
  route: EvacuationRoute;
  selectedLanguage: SupportedLanguage;
  onCompleteEvacuation: () => void;
}

export const TurnByTurnNavigation: React.FC<TurnByTurnNavigationProps> = ({
  route,
  selectedLanguage,
  onCompleteEvacuation,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const t = TRANSLATIONS[selectedLanguage];

  const currentStep = route.waypoints[currentStepIndex] || route.waypoints[0];
  const isLastStep = currentStepIndex >= route.waypoints.length - 1;

  const handleNextStep = () => {
    if (isLastStep) {
      onCompleteEvacuation();
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      speakEmergencyText(route.waypoints[nextIdx].instruction, selectedLanguage);
    }
  };

  const handleVoiceNarrate = () => {
    speakEmergencyText(currentStep.instruction, selectedLanguage);
  };

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-green-600/40 shadow-xl space-y-4 text-[#E4E4E7]">
      
      {/* Top Route Summary Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-black font-bold shadow-md shadow-green-500/20">
            <Navigation className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest">
              Tactical Route (Dijkstra)
            </div>
            <div className="text-sm font-extrabold text-white font-mono">
              {route.destinationShelter.name}
            </div>
          </div>
        </div>

        <button
          onClick={handleVoiceNarrate}
          title="Narrate Turn Instruction"
          className="p-2 rounded-xl bg-black text-green-400 border border-[#27272A] hover:border-green-600/60 transition"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Distance & ETA Badges */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        <div className="bg-black p-3 rounded-xl border border-[#27272A] flex items-center justify-between">
          <span className="text-[#71717A] text-[10px] uppercase">{t.distanceLabel}</span>
          <span className="text-sm font-bold text-white">{route.totalDistanceKm} km</span>
        </div>
        <div className="bg-black p-3 rounded-xl border border-[#27272A] flex items-center justify-between">
          <span className="text-[#71717A] text-[10px] uppercase">{t.etaLabel}</span>
          <span className="text-sm font-bold text-green-400">~{route.estTravelTimeMinutes} min</span>
        </div>
      </div>

      {/* Active Turn Step Card */}
      <div className="bg-black p-4 rounded-xl border border-[#27272A] space-y-2.5">
        <div className="flex items-center justify-between text-[10px] text-[#71717A] font-mono uppercase tracking-wider">
          <span>STEP {currentStepIndex + 1} OF {route.waypoints.length}</span>
          <span className="text-green-400 font-bold">
            {currentStep.distanceToNextMeters > 0 ? `${currentStep.distanceToNextMeters}m ahead` : 'Destination'}
          </span>
        </div>

        <div className="text-sm sm:text-base font-extrabold text-white leading-snug font-mono">
          {currentStep.instruction}
        </div>

        {/* Hazard Avoidance Callout */}
        {currentStep.hazardAvoided && (
          <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-800 text-xs text-orange-300 flex items-start gap-2 mt-2">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
            <div className="font-mono text-[11px]">
              <span className="font-bold uppercase tracking-wider">Hazard Bypass: </span>
              {currentStep.hazardAvoided}
            </div>
          </div>
        )}
      </div>

      {/* Route Step Progress Dots */}
      <div className="flex items-center justify-between gap-1.5 px-1">
        {route.waypoints.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              idx <= currentStepIndex ? 'bg-green-500' : 'bg-[#27272A]'
            }`}
          />
        ))}
      </div>

      {/* Action Next Step Button */}
      <button
        id="citizen-next-nav-step-btn"
        onClick={handleNextStep}
        className={`w-full py-3 rounded-xl font-mono font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
          isLastStep
            ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-950/50'
            : 'bg-green-600 hover:bg-green-500 text-white shadow-green-950/40'
        }`}
      >
        {isLastStep ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIRM ARRIVAL AT SHELTER</span>
          </>
        ) : (
          <>
            <span>Next Instruction ({currentStepIndex + 2}/{route.waypoints.length})</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Designated Shelter Helpline */}
      <div className="text-[10px] text-[#71717A] font-mono text-center flex items-center justify-center gap-1.5 pt-1">
        <PhoneCall className="w-3 h-3 text-green-400" />
        <span>Shelter Reception: {route.destinationShelter.contactNumber}</span>
      </div>

    </div>
  );
};
