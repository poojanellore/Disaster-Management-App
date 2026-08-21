import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Smartphone, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Globe, 
  Flame, 
  PlayCircle,
  RotateCcw
} from 'lucide-react';
import { SupportedLanguage, DisasterType, ThreatLevel } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  viewMode: 'COMMAND_CENTER' | 'CITIZEN' | 'DUAL';
  onViewModeChange: (mode: 'COMMAND_CENTER' | 'CITIZEN' | 'DUAL') => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDisasterActive: boolean;
  threatLevel: ThreatLevel;
  onOpenTriggerModal: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onViewModeChange,
  selectedLanguage,
  onLanguageChange,
  isDisasterActive,
  threatLevel,
  onOpenTriggerModal,
  onOpenReportModal,
}) => {
  const [isAudioMuted, setIsAudioMuted] = React.useState(false);
  const t = TRANSLATIONS[selectedLanguage];

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#18181B] border border-[#27272A] rounded-2xl px-4 sm:px-6 py-3.5 gap-4 shadow-xl">
      {/* Brand & Monogram */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-sm flex items-center justify-center font-black text-white italic text-base tracking-tighter shadow-md shadow-red-950/50 select-none">
            DG
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tighter uppercase text-white flex items-center gap-1.5 leading-none">
              DisasterGuard <span className="text-red-500 font-mono font-bold">//</span> <span className="text-[#A1A1AA] font-extrabold text-sm sm:text-base">Command Center</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A]">
                AI Multi-Hazard Prediction & Staggered Corridors
              </span>
            </div>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden flex items-center gap-1 bg-black p-1 rounded-lg border border-[#27272A]">
          <button
            onClick={() => onViewModeChange('COMMAND_CENTER')}
            className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition ${
              viewMode === 'COMMAND_CENTER' ? 'bg-red-600 text-white' : 'text-[#71717A]'
            }`}
          >
            Ops
          </button>
          <button
            onClick={() => onViewModeChange('CITIZEN')}
            className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition ${
              viewMode === 'CITIZEN' ? 'bg-green-600 text-white' : 'text-[#71717A]'
            }`}
          >
            Citizen
          </button>
        </div>
      </div>

      {/* Bento Status Bar Indicators */}
      <div className="hidden xl:flex items-center gap-6 text-[10px] font-mono tracking-widest uppercase">
        <div className="flex flex-col items-end">
          <span className="text-[#71717A]">System Status</span>
          <span className={`flex items-center gap-1.5 font-bold ${
            isDisasterActive ? 'text-red-400' : 'text-green-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isDisasterActive ? 'bg-red-500 animate-ping' : 'bg-green-500'
            }`} />
            {isDisasterActive ? 'ANOMALOUS THREAT' : 'LIVE TELEMETRY'}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#71717A]">Active Geofence</span>
          <span className="text-[#E4E4E7] font-semibold">Sub-Zone 42.1 (Metro Core)</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#71717A]">Uptime</span>
          <span className="text-[#A1A1AA]">184:12:09</span>
        </div>
      </div>

      {/* Controls & Role Selector */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        {/* Trigger Simulation Modal Button */}
        <button
          id="nav-trigger-simulation-btn"
          onClick={onOpenTriggerModal}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
            isDisasterActive
              ? 'bg-red-950/60 text-red-300 border-red-800 hover:bg-red-900'
              : 'bg-black border-[#27272A] text-red-400 hover:border-red-600/50 hover:bg-[#27272A]/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span>{isDisasterActive ? 'Hazard Active' : 'Inject Anomaly'}</span>
        </button>

        {isDisasterActive && (
          <button
            id="nav-post-report-btn"
            onClick={onOpenReportModal}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider bg-black border border-[#27272A] text-blue-400 hover:border-blue-500 transition flex items-center gap-1.5"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AAR Report</span>
          </button>
        )}

        {/* View Switcher: Command vs Citizen vs Dual */}
        <div className="hidden lg:flex bg-black p-1 rounded-xl border border-[#27272A] items-center">
          <button
            id="view-command-center-btn"
            onClick={() => onViewModeChange('COMMAND_CENTER')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              viewMode === 'COMMAND_CENTER'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-[#71717A] hover:text-[#E4E4E7]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Command Center</span>
          </button>
          <button
            id="view-citizen-app-btn"
            onClick={() => onViewModeChange('CITIZEN')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              viewMode === 'CITIZEN'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-[#71717A] hover:text-[#E4E4E7]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Citizen Mobile</span>
          </button>
          <button
            id="view-dual-mode-btn"
            onClick={() => onViewModeChange('DUAL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              viewMode === 'DUAL'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[#71717A] hover:text-[#E4E4E7]'
            }`}
          >
            <span>Split Dual</span>
          </button>
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-1.5 bg-black px-2.5 py-1.5 rounded-lg border border-[#27272A]">
          <Globe className="w-3.5 h-3.5 text-[#71717A]" />
          <select
            id="language-select-dropdown"
            value={selectedLanguage}
            aria-label="Language selection"
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-transparent text-[11px] font-mono text-[#E4E4E7] focus:outline-none cursor-pointer uppercase"
          >
            <option value="en" className="bg-[#18181B] text-[#E4E4E7]">EN</option>
            <option value="hi" className="bg-[#18181B] text-[#E4E4E7]">HI (हिन्दी)</option>
            <option value="ta" className="bg-[#18181B] text-[#E4E4E7]">TA (தமிழ்)</option>
            <option value="te" className="bg-[#18181B] text-[#E4E4E7]">TE (తెలుగు)</option>
            <option value="es" className="bg-[#18181B] text-[#E4E4E7]">ES</option>
          </select>
        </div>

        {/* Siren Audio Toggle */}
        <button
          id="audio-toggle-btn"
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          title={isAudioMuted ? 'Unmute Emergency Siren' : 'Mute Emergency Siren'}
          className={`p-2 rounded-lg border text-xs transition ${
            isAudioMuted
              ? 'bg-black text-[#71717A] border-[#27272A] hover:text-[#E4E4E7]'
              : 'bg-red-950 text-red-400 border-red-800 animate-pulse'
          }`}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
