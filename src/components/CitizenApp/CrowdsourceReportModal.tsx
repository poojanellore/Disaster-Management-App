import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Activity, 
  Ban, 
  Waves, 
  Building, 
  MapPin, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { GroundTruthReport } from '../../types';

interface CrowdsourceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: Partial<GroundTruthReport>) => void;
}

export const CrowdsourceReportModal: React.FC<CrowdsourceReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<GroundTruthReport['type']>('ROAD_BLOCK');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('Westside Expressway Overpass');
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = [
    { type: 'ROAD_BLOCK' as const, label: 'Road Blockage / Debris', icon: Ban, color: 'text-red-400' },
    { type: 'SMOKE_FIRE' as const, label: 'Smoke / Fire Spotting', icon: Flame, color: 'text-amber-400' },
    { type: 'GROUND_TREMOR' as const, label: 'Severe Ground Tremor', icon: Activity, color: 'text-purple-400' },
    { type: 'FLOOD_SURGE' as const, label: 'Water Surge / Flooding', icon: Waves, color: 'text-cyan-400' },
    { type: 'STRUCTURE_DAMAGE' as const, label: 'Bridge / Structure Damage', icon: Building, color: 'text-rose-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      type,
      description: description || `Reported ${type.toLowerCase().replace('_', ' ')} observed near ${landmark}`,
      location: {
        lat: 37.7780 + (Math.random() - 0.5) * 0.02,
        lng: -122.4150 + (Math.random() - 0.5) * 0.02,
        landmark,
      },
      severity: 'HIGH',
      verified: true,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 text-[#E4E4E7]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-black text-orange-400 border border-[#27272A]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider font-mono">
                Report Ground Hazard
              </h3>
              <p className="text-[10px] text-[#71717A] font-mono">
                Crowdsource ping for dynamic Dijkstra corridor rerouting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-white p-1.5 rounded-lg hover:bg-black transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2 font-mono">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-base text-white">Report Transmitted</h4>
            <p className="text-xs text-[#A1A1AA]">
              Corridor Dijkstra routing engine updated to bypass reported hazard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 font-mono">
            
            {/* Hazard Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Observed Hazard Type:</label>
              <div className="grid grid-cols-1 gap-1.5">
                {reportTypes.map((rt) => {
                  const Icon = rt.icon;
                  const isSelected = type === rt.type;
                  return (
                    <button
                      type="button"
                      key={rt.type}
                      onClick={() => setType(rt.type)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition text-xs ${
                        isSelected
                          ? 'bg-orange-950/50 border-orange-500 text-white font-bold'
                          : 'bg-black border-[#27272A] text-[#71717A] hover:border-[#3F3F46] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${rt.color}`} />
                      <span className="text-xs font-semibold">{rt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Landmark / Location input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Landmark / Street:</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-[#27272A] text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="e.g. Near 4th Street Underpass"
              />
            </div>

            {/* Notes description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Optional Details:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-black border border-[#27272A] text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="e.g. Fallen debris blocking right lanes."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Hazard Report</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
