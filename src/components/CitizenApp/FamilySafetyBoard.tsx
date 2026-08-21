import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Send,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { FamilyContact, SupportedLanguage } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';
import { playSafeCheckinChime } from '../../utils/soundEffects';

interface FamilySafetyBoardProps {
  selectedLanguage: SupportedLanguage;
  onSendSos: () => void;
}

export const FamilySafetyBoard: React.FC<FamilySafetyBoardProps> = ({
  selectedLanguage,
  onSendSos,
}) => {
  const [isSelfSafe, setIsSelfSafe] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>([
    {
      id: 'fam-1',
      name: 'Elena Vance (Mother)',
      relation: 'Parent',
      phone: '+1 (555) 234-5678',
      status: 'SAFE',
      lastSeenTime: '2 mins ago',
      locationName: 'Northgate High Shelter',
    },
    {
      id: 'fam-2',
      name: 'Marcus Vance (Brother)',
      relation: 'Sibling',
      phone: '+1 (555) 876-5432',
      status: 'EVACUATING',
      lastSeenTime: '5 mins ago',
      locationName: 'Westside Transit Corridor',
    },
    {
      id: 'fam-3',
      name: 'Grandmother Rose',
      relation: 'Elderly Relative',
      phone: '+1 (555) 345-9876',
      status: 'SHELTERED',
      lastSeenTime: '10 mins ago',
      locationName: 'Highland Civic Dome',
    },
  ]);

  const t = TRANSLATIONS[selectedLanguage];

  const handleMarkSafe = () => {
    setIsSelfSafe(true);
    playSafeCheckinChime();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  const handleSosClick = () => {
    setSosSent(true);
    onSendSos();
    setTimeout(() => setSosSent(false), 5000);
  };

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] shadow-xl space-y-4 text-[#E4E4E7]">
      
      {/* Big 1-Tap "Mark Myself Safe" Action Button */}
      <div className="text-center space-y-2">
        <button
          id="citizen-mark-safe-btn"
          onClick={handleMarkSafe}
          className={`w-full py-4 rounded-xl font-mono font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
            isSelfSafe
              ? 'bg-green-600 text-white ring-4 ring-green-500/20'
              : 'bg-green-600 hover:bg-green-500 text-white shadow-green-950/50 active:scale-95'
          }`}
        >
          <ShieldCheck className="w-4 h-4 fill-current" />
          <span>{isSelfSafe ? 'STATUS: MARKED SAFE ✓' : t.safeStatusButton}</span>
        </button>

        {isSelfSafe && (
          <p className="text-xs text-green-400 font-mono font-medium animate-fadeIn">
            {t.markSafeSuccess}
          </p>
        )}
      </div>

      {/* Family Contacts Status Board */}
      <div className="space-y-3 pt-3 border-t border-[#27272A]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#71717A] uppercase tracking-wider font-mono flex items-center gap-1.5 text-[10px]">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            Family Safety Live Pings
          </span>
          <span className="text-[10px] font-mono text-green-400 font-bold bg-black px-2 py-0.5 rounded-md border border-[#27272A]">
            3/3 ACCOUNTED
          </span>
        </div>

        <div className="space-y-2">
          {familyContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-black p-3.5 rounded-xl border border-[#27272A] flex items-center justify-between gap-3 font-mono"
            >
              <div>
                <div className="font-bold text-xs text-white">{contact.name}</div>
                <div className="text-[10px] text-[#71717A] flex items-center gap-1.5 mt-0.5">
                  <span>{contact.locationName}</span>
                  <span>•</span>
                  <span>{contact.lastSeenTime}</span>
                </div>
              </div>

              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  contact.status === 'SAFE' || contact.status === 'SHELTERED'
                    ? 'bg-green-950 text-green-400 border border-green-800'
                    : 'bg-orange-950 text-orange-400 border border-orange-800'
                }`}
              >
                {contact.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency SOS Assistance Button */}
      <div className="pt-3 border-t border-[#27272A]">
        <button
          id="citizen-sos-btn"
          onClick={handleSosClick}
          className={`w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
            sosSent
              ? 'bg-red-600 text-white'
              : 'bg-red-950/50 hover:bg-red-900 text-red-300 border border-red-800'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{sosSent ? 'SOS BEACON TRANSMITTED' : t.sosButton}</span>
        </button>
      </div>

    </div>
  );
};
