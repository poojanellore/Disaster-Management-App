import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  ArrowRight,
  Luggage,
  BatteryCharging,
  FileCheck
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';

interface ZoneBetaCountdownProps {
  initialSeconds?: number;
  selectedLanguage: SupportedLanguage;
  onWindowOpen: () => void;
}

export const ZoneBetaCountdown: React.FC<ZoneBetaCountdownProps> = ({
  initialSeconds = 720, // 12 minutes
  selectedLanguage,
  onWindowOpen,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Pack emergency medication & prescriptions', checked: true },
    { id: 2, text: 'Keep smartphone charged & power bank ready', checked: true },
    { id: 3, text: 'Secure essential IDs, insurance & documents', checked: false },
    { id: 4, text: '1 Liter bottled water per person + dry snacks', checked: false },
    { id: 5, text: 'Keep footwear on & family members together', checked: false },
  ]);

  const t = TRANSLATIONS[selectedLanguage];

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onWindowOpen();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, onWindowOpen]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleItem = (id: number) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-orange-500/50 shadow-xl space-y-4 text-[#E4E4E7]">
      
      {/* Top Calm Guidance Header */}
      <div className="bg-orange-950/30 p-4 rounded-xl border border-orange-700/60 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-black text-orange-400 border border-orange-500/30 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-xs sm:text-sm text-orange-300 font-mono uppercase tracking-wider">
            {t.zoneBetaTitle}
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
            {t.zoneBetaAlert} {t.zoneBetaAction}
          </p>
        </div>
      </div>

      {/* Countdown Timer Block */}
      <div className="bg-black p-5 rounded-xl border border-[#27272A] text-center space-y-1.5">
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
          {t.countdownLabel}
        </div>
        <div className="text-4xl sm:text-5xl font-black font-mono text-orange-400 tracking-tight py-1">
          {formatTime(secondsRemaining)}
        </div>
        <div className="text-[11px] font-mono text-[#71717A]">
          Corridor cleared for Zone Alpha. Please hold position.
        </div>
      </div>

      {/* Panic Reduction Explanation */}
      <div className="bg-black p-4 rounded-xl border border-[#27272A] text-xs text-[#A1A1AA] space-y-2">
        <div className="font-bold text-white flex items-center gap-1.5 font-mono text-xs">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          Why Staggering Prevents Traffic Gridlock:
        </div>
        <p className="text-[11px] text-[#71717A] leading-relaxed font-mono">
          Simulations show simultaneous departure causes 3-hour highway deadlocks. By holding Zone Beta for 12 minutes, Zone Alpha clears safely and your route opens with smooth, unimpeded 40 km/h traffic flow.
        </p>
      </div>

      {/* Preparedness Checklist */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono font-bold text-[#71717A] uppercase tracking-wider flex items-center justify-between">
          <span>Pre-Departure Checklist</span>
          <span className="text-[10px] text-orange-400">
            {checklist.filter((c) => c.checked).length} / {checklist.length} Ready
          </span>
        </div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-3 p-3 rounded-xl bg-black border border-[#27272A] hover:border-[#3F3F46] cursor-pointer transition text-xs font-mono"
            >
              {item.checked ? (
                <CheckSquare className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-[#71717A] shrink-0" />
              )}
              <span className={item.checked ? 'text-[#71717A] line-through' : 'text-[#E4E4E7]'}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Emergency Bypass Button */}
      <button
        onClick={onWindowOpen}
        className="w-full py-2.5 rounded-xl border border-[#27272A] bg-black hover:bg-[#18181B] text-[#A1A1AA] hover:text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
      >
        <span>Skip Countdown & Open Route (Demo)</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

    </div>
  );
};
