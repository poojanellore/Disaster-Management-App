import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Zap, 
  Waves, 
  Mountain, 
  Wind, 
  Tornado,
  MapPin,
  Play,
  CheckCircle2
} from 'lucide-react';
import { DisasterType } from '../../types';
import { DEFAULT_EPICENTERS } from '../../utils/aiPredictor';

interface DisasterTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrigger: (type: DisasterType, customLocation?: string) => void;
}

export const DisasterTriggerModal: React.FC<DisasterTriggerModalProps> = ({
  isOpen,
  onClose,
  onTrigger,
}) => {
  if (!isOpen) return null;

  const [selectedType, setSelectedType] = useState<DisasterType>('earthquake');
  const [selectedLocation, setSelectedLocation] = useState<string>('San Francisco Metro Corridor');

  const disasterList: Array<{
    type: DisasterType;
    title: string;
    description: string;
    severity: string;
    icon: typeof Zap;
    accent: string;
  }> = [
    {
      type: 'earthquake',
      title: 'Magnitude 7.4 Earthquake',
      description: 'Strike-slip crustal rupture with pre-shock P-wave microtremors & radon spike.',
      severity: 'Mw 7.4 Megathrust',
      icon: Zap,
      accent: 'border-red-500/50 bg-red-950/20 text-red-400',
    },
    {
      type: 'wildfire',
      title: 'Cat-5 Fast-Moving Wildfire',
      description: 'Pyroconvective firestorm with 65 km/h Santa Ana gusts pushing toward urban fringe.',
      severity: 'Extreme Ember Spread',
      icon: Flame,
      accent: 'border-amber-500/50 bg-amber-950/20 text-amber-400',
    },
    {
      type: 'volcano',
      title: 'VEI-4 Volcanic Caldera Surge',
      description: 'Magma column expansion with 140 ppm SO2 flux and harmonic volcanic tremor.',
      severity: 'Pyroclastic Surge',
      icon: Mountain,
      accent: 'border-orange-500/50 bg-orange-950/20 text-orange-400',
    },
    {
      type: 'tsunami',
      title: '14.2m Coastal Tsunami Train',
      description: 'Offshore seabed displacement detected by DART pressure sensors with tidal recede.',
      severity: '14m Wave Inundation',
      icon: Waves,
      accent: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400',
    },
    {
      type: 'tornado',
      title: 'EF-4 Multi-Vortex Tornado',
      description: 'Doppler velocity shear 78 m/s with sudden 18 hPa barometric drop and debris ball.',
      severity: '280 km/h Rotational Core',
      icon: Tornado,
      accent: 'border-purple-500/50 bg-purple-950/20 text-purple-400',
    },
    {
      type: 'cyclone',
      title: 'Category 4 Super Cyclone',
      description: 'Central eye pressure 945 hPa with 185 km/h sustained eyewall winds & storm surge.',
      severity: 'Cat-4 Landfall Vector',
      icon: Wind,
      accent: 'border-rose-500/50 bg-rose-950/20 text-rose-400',
    },
  ];

  const handleLaunch = () => {
    onTrigger(selectedType, selectedLocation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-[#E4E4E7]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-black text-red-500 border border-[#27272A]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                Disaster Simulation Injector
              </h2>
              <p className="text-xs text-[#71717A] font-mono">
                Inject telemetry anomalies & trigger real-time AI risk computation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-white p-1.5 rounded-lg hover:bg-black transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hazard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {disasterList.map((d) => {
            const Icon = d.icon;
            const isSelected = selectedType === d.type;
            return (
              <div
                key={d.type}
                onClick={() => setSelectedType(d.type)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-red-500 bg-red-950/30'
                    : 'border-[#27272A] bg-black hover:border-[#3F3F46]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-[#18181B] border border-[#27272A]`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-xs text-white font-mono">{d.title}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  {d.description}
                </p>
                <div className="text-[10px] font-mono text-[#71717A] pt-2 border-t border-[#27272A]">
                  Severity: {d.severity}
                </div>
              </div>
            );
          })}
        </div>

        {/* Epicenter Target & Population Preview */}
        <div className="bg-black p-4 rounded-xl border border-[#27272A] text-xs font-mono">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#A1A1AA]">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Target Epicenter:
            </span>
            <span className="text-red-400 font-bold">
              {DEFAULT_EPICENTERS[selectedType].pop.toLocaleString()} Population at Risk
            </span>
          </div>
          <div className="text-white font-bold">
            {DEFAULT_EPICENTERS[selectedType].name}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#27272A]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#71717A] hover:text-white hover:bg-black transition"
          >
            Cancel
          </button>
          <button
            id="modal-confirm-trigger-btn"
            onClick={handleLaunch}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50 flex items-center gap-2 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Simulation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
