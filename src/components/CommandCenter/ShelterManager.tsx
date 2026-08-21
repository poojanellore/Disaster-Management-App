import React from 'react';
import { 
  Building2, 
  Users, 
  Activity, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  PhoneCall,
  ShieldCheck
} from 'lucide-react';
import { Shelter } from '../../types';

interface ShelterManagerProps {
  shelters: Shelter[];
  onSelectShelter?: (shelter: Shelter) => void;
}

export const ShelterManager: React.FC<ShelterManagerProps> = ({
  shelters,
  onSelectShelter,
}) => {
  const totalCap = shelters.reduce((acc, s) => acc + s.capacityTotal, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.capacityOccupied, 0);
  const totalAvailable = totalCap - totalOccupied;

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] shadow-xl flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-black text-green-400 border border-[#27272A]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-widest">
              Safe Zone Reception & Shelter
            </h3>
            <p className="text-sm font-extrabold text-white">
              Capacity-Aware Dynamic Balancing
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-green-400 bg-black px-2.5 py-1 rounded-lg border border-[#27272A]">
            {totalAvailable.toLocaleString()} / {totalCap.toLocaleString()} Free
          </span>
        </div>
      </div>

      {/* Shelter Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shelters.map((shelter) => {
          const ratio = shelter.capacityOccupied / shelter.capacityTotal;
          const percent = Math.round(ratio * 100);
          const isCrowded = percent > 80;

          return (
            <div
              key={shelter.id}
              onClick={() => onSelectShelter && onSelectShelter(shelter)}
              className="bg-black p-4 rounded-xl border border-[#27272A] hover:border-[#3F3F46] transition cursor-pointer flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs text-white leading-snug">
                    {shelter.name}
                  </h4>
                  <p className="text-[10px] text-[#71717A] font-mono flex items-center gap-1 mt-0.5">
                    <PhoneCall className="w-2.5 h-2.5 text-[#71717A]" />
                    {shelter.contactNumber}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                    isCrowded
                      ? 'bg-orange-950 text-orange-400 border border-orange-800'
                      : 'bg-green-950 text-green-400 border border-green-800'
                  }`}
                >
                  {percent}% FULL
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A] mb-1.5">
                  <span className="uppercase text-[10px]">Occupancy</span>
                  <span className="text-white font-bold">
                    {shelter.capacityOccupied.toLocaleString()} / {shelter.capacityTotal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCrowded ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-[#A1A1AA] pt-2 border-t border-[#27272A]">
                <span className="flex items-center gap-1 bg-[#18181B] px-2 py-0.5 rounded-md border border-[#27272A] font-mono text-[9px]">
                  <Activity className="w-2.5 h-2.5 text-cyan-400" />
                  Med: {shelter.medicalSupport ? 'Active' : 'Standby'}
                </span>
                <span className="flex items-center gap-1 bg-[#18181B] px-2 py-0.5 rounded-md border border-[#27272A] font-mono text-[9px]">
                  <Zap className="w-2.5 h-2.5 text-orange-400" />
                  Power: {shelter.generatorBackup ? 'Online' : 'Off'}
                </span>
                <span className="flex items-center gap-1 bg-[#18181B] px-2 py-0.5 rounded-md border border-[#27272A] font-mono text-[9px]">
                  <ShieldCheck className="w-2.5 h-2.5 text-green-400" />
                  Supplies: {shelter.suppliesStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
