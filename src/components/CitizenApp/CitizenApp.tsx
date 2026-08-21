import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  MapPin, 
  ShieldAlert, 
  Volume2, 
  Layers, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Users, 
  Award,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { 
  DisasterType, 
  EvacuationRoute, 
  EvacuationZoneType, 
  PredictionResult, 
  Shelter, 
  SupportedLanguage 
} from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { TurnByTurnNavigation } from './TurnByTurnNavigation';
import { ZoneBetaCountdown } from './ZoneBetaCountdown';
import { FamilySafetyBoard } from './FamilySafetyBoard';
import { CrowdsourceReportModal } from './CrowdsourceReportModal';
import { PreparednessDrill } from './PreparednessDrill';
import { playEmergencySiren, speakEmergencyText } from '../../utils/soundEffects';

interface CitizenAppProps {
  prediction: PredictionResult;
  isDisasterActive: boolean;
  disasterType: DisasterType;
  selectedLanguage: SupportedLanguage;
  activeRoutes: EvacuationRoute[];
  shelters: Shelter[];
  onReportHazard: (report: any) => void;
  onTriggerSos: () => void;
}

export const CitizenApp: React.FC<CitizenAppProps> = ({
  prediction,
  isDisasterActive,
  disasterType,
  selectedLanguage,
  activeRoutes,
  shelters,
  onReportHazard,
  onTriggerSos,
}) => {
  const [residentZone, setResidentZone] = useState<EvacuationZoneType>('ALPHA');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'EVAC' | 'FAMILY' | 'DRILL'>('EVAC');
  const [betaWindowOverridden, setBetaWindowOverridden] = useState(false);
  const [evacuationCompleted, setEvacuationCompleted] = useState(false);

  const t = TRANSLATIONS[selectedLanguage];

  // Pick matching route for current resident zone
  const currentRoute = activeRoutes.find((r) => r.zone === residentZone) || activeRoutes[0];

  const handlePlayVoice = () => {
    const text = residentZone === 'ALPHA'
      ? `${t.zoneAlphaTitle}. ${t.zoneAlphaAlert}. ${t.zoneAlphaAction}`
      : residentZone === 'BETA'
      ? `${t.zoneBetaTitle}. ${t.zoneBetaAlert}. ${t.zoneBetaAction}`
      : `${t.zoneGammaTitle}. ${t.zoneGammaAlert}`;
    speakEmergencyText(text, selectedLanguage);
  };

  const handleSoundSiren = () => {
    playEmergencySiren(3);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 sm:py-4">
      
      {/* Simulation Selector Bar for Mobile View */}
      <div className="max-w-md w-full mb-3 flex items-center justify-between gap-2 px-1">
        <div className="text-xs text-[#A1A1AA] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>Simulate Resident Zone:</span>
        </div>
        <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-xl border border-[#27272A]">
          <button
            id="resident-zone-alpha-btn"
            onClick={() => {
              setResidentZone('ALPHA');
              setBetaWindowOverridden(false);
              setEvacuationCompleted(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition ${
              residentZone === 'ALPHA'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-400 hover:bg-red-950/40'
            }`}
          >
            Alpha (5km)
          </button>
          <button
            id="resident-zone-beta-btn"
            onClick={() => {
              setResidentZone('BETA');
              setBetaWindowOverridden(false);
              setEvacuationCompleted(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition ${
              residentZone === 'BETA'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-orange-400 hover:bg-amber-950/40'
            }`}
          >
            Beta (10km)
          </button>
          <button
            id="resident-zone-gamma-btn"
            onClick={() => {
              setResidentZone('GAMMA');
              setBetaWindowOverridden(false);
              setEvacuationCompleted(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition ${
              residentZone === 'GAMMA'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-green-400 hover:bg-emerald-950/40'
            }`}
          >
            Gamma
          </button>
        </div>
      </div>

      {/* Mobile Frame Container */}
      <div className="relative max-w-sm sm:max-w-md w-full bg-[#09090B] rounded-[36px] sm:rounded-[44px] p-3 sm:p-4 border-[6px] sm:border-[8px] border-[#27272A] shadow-2xl shadow-black flex flex-col min-h-[640px] text-[#E4E4E7]">
        
        {/* Mobile Device Speaker Notch & Status Bar */}
        <div className="w-full flex items-center justify-between px-3 pt-1 pb-2 border-b border-[#27272A]">
          <span className="text-xs font-mono font-bold text-[#71717A]">08:52</span>
          <div className="w-24 h-4 bg-[#18181B] rounded-full flex items-center justify-center border border-[#27272A]">
            <div className="w-2 h-2 rounded-full bg-[#27272A]" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <span className="text-[10px] font-bold text-green-400 font-mono">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Top App Header & Offline Status */}
        <div className="py-3 px-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-md">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xs tracking-tight text-white leading-tight font-mono uppercase">
                {t.appName}
              </h3>
              <p className="text-[9px] text-[#71717A] font-mono">
                {t.offlineReady} ✓
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayVoice}
              title={t.audioBroadcastPrompt}
              className="p-2 rounded-xl bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[#27272A] transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-orange-950/60 text-orange-400 border border-orange-800 text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-orange-900/50 transition"
            >
              + Report Hazard
            </button>
          </div>
        </div>

        {/* Inner Tab Switcher (Evac Guidance, Family Safety, Preparedness Drill) */}
        <div className="bg-[#18181B] p-1 rounded-2xl border border-[#27272A] grid grid-cols-3 gap-1 mb-3">
          <button
            onClick={() => setActiveTab('EVAC')}
            className={`py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
              activeTab === 'EVAC'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-[#71717A] hover:text-[#E4E4E7]'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Evac</span>
          </button>
          <button
            onClick={() => setActiveTab('FAMILY')}
            className={`py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
              activeTab === 'FAMILY'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-[#71717A] hover:text-[#E4E4E7]'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Family</span>
          </button>
          <button
            onClick={() => setActiveTab('DRILL')}
            className={`py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
              activeTab === 'DRILL'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-[#71717A] hover:text-[#E4E4E7]'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Drill</span>
          </button>
        </div>

        {/* Tab 1: Evacuation Guidance Content */}
        {activeTab === 'EVAC' && (
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            
            {!isDisasterActive ? (
              // Nominal / Safe State
              <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] text-center space-y-3 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-black text-green-400 flex items-center justify-center mx-auto border border-[#27272A]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white font-mono uppercase tracking-wider">All Sectors Nominal</h4>
                  <p className="text-xs text-[#71717A] mt-1 font-mono">
                    Sensors reporting baseline background values. Offline tactical evacuation route cached in memory.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-[#27272A] text-xs text-[#A1A1AA] font-mono">
                  Default Shelter: <span className="font-bold text-white">Highland Civic Dome (4.2 km)</span>
                </div>
              </div>
            ) : residentZone === 'ALPHA' ? (
              // Zone Alpha - Immediate Evacuation
              <div className="space-y-3">
                {/* Emergency Loud Header */}
                <div className="bg-red-950/60 p-4 rounded-2xl border border-red-600 text-white shadow-xl shadow-red-950/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black bg-red-600 text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                      IMMEDIATE ORDER
                    </span>
                    <button
                      onClick={handleSoundSiren}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5 hover:text-white"
                    >
                      <Volume2 className="w-3 h-3 text-red-400" />
                      Sound Siren
                    </button>
                  </div>
                  <h3 className="font-black text-sm sm:text-base leading-tight font-mono">
                    {t.zoneAlphaTitle}
                  </h3>
                  <p className="text-xs text-red-200 leading-snug">
                    {t.zoneAlphaAlert} {t.zoneAlphaAction}
                  </p>
                </div>

                {/* Turn-by-Turn Navigation */}
                {currentRoute && (
                  <TurnByTurnNavigation
                    route={currentRoute}
                    selectedLanguage={selectedLanguage}
                    onCompleteEvacuation={() => setEvacuationCompleted(true)}
                  />
                )}
              </div>
            ) : residentZone === 'BETA' ? (
              // Zone Beta - Staged Holding & Panic Prevention
              <div className="space-y-3">
                {!betaWindowOverridden ? (
                  <ZoneBetaCountdown
                    selectedLanguage={selectedLanguage}
                    onWindowOpen={() => setBetaWindowOverridden(true)}
                  />
                ) : (
                  currentRoute && (
                    <TurnByTurnNavigation
                      route={currentRoute}
                      selectedLanguage={selectedLanguage}
                      onCompleteEvacuation={() => setEvacuationCompleted(true)}
                    />
                  )
                )}
              </div>
            ) : (
              // Zone Gamma - Safe Buffer
              <div className="bg-[#18181B] rounded-2xl p-5 border border-green-600/40 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h4 className="font-extrabold text-sm text-green-300 font-mono uppercase tracking-wider">
                    {t.zoneGammaTitle}
                  </h4>
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  {t.zoneGammaAlert} Relief shelters in your perimeter are operating with active triage and emergency food/water supplies.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#27272A]">
                  {shelters.slice(0, 2).map((s) => (
                    <div key={s.id} className="p-3 rounded-xl bg-black border border-[#27272A] text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white font-mono">{s.name}</div>
                        <div className="text-[10px] text-[#71717A] font-mono">Capacity Free: {s.capacityTotal - s.capacityOccupied}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-green-400 uppercase">OPEN</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evacuation Confirmation Toast */}
            {evacuationCompleted && (
              <div className="p-3 rounded-xl bg-green-950 border border-green-600 text-xs font-mono text-green-200 text-center animate-fadeIn">
                ✓ Check-in Verified at Reception Shelter!
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Family Status */}
        {activeTab === 'FAMILY' && (
          <FamilySafetyBoard
            selectedLanguage={selectedLanguage}
            onSendSos={onTriggerSos}
          />
        )}

        {/* Tab 3: Preparedness Drill */}
        {activeTab === 'DRILL' && <PreparednessDrill />}

        {/* Crowdsource Report Modal */}
        <CrowdsourceReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmitReport={onReportHazard}
        />

        {/* Mobile Home Bar Indicator */}
        <div className="w-28 h-1 bg-[#27272A] rounded-full mx-auto mt-4" />

      </div>

    </div>
  );
};
