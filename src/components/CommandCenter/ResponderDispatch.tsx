import React from 'react';
import { 
  Truck, 
  Flame, 
  ShieldAlert, 
  Plane, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin 
} from 'lucide-react';
import { ResponderUnit, EvacuationZoneType } from '../../types';

interface ResponderDispatchProps {
  responders: ResponderUnit[];
  onDispatchUnit: (unitId: string, targetZone: EvacuationZoneType) => void;
}

export const ResponderDispatch: React.FC<ResponderDispatchProps> = ({
  responders,
  onDispatchUnit,
}) => {
  const getUnitIcon = (type: ResponderUnit['type']) => {
    switch (type) {
      case 'FIRE_RESCUE':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'POLICE_EVAC':
        return <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />;
      case 'AIR_RECON':
        return <Plane className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Truck className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  const activeCount = responders.filter((r) => r.status === 'DISPATCHED' || r.status === 'ON_SCENE').length;

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] shadow-xl flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-black text-blue-400 border border-[#27272A]">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-widest">
              Tactical Responder & Fleet
            </h3>
            <p className="text-sm font-extrabold text-white">
              Live Fleet Coordination & Corridor Clearance
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-black text-blue-400 px-2.5 py-1 rounded-lg border border-[#27272A]">
          {activeCount} / {responders.length} DEPLOYED
        </span>
      </div>

      {/* Responder Units Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {responders.map((unit) => {
          const isDispatched = unit.status === 'DISPATCHED' || unit.status === 'ON_SCENE';

          return (
            <div
              key={unit.id}
              className="bg-black p-4 rounded-xl border border-[#27272A] flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#18181B] border border-[#27272A]">
                    {getUnitIcon(unit.type)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white font-mono">{unit.callsign}</div>
                    <div className="text-[10px] text-[#71717A] font-mono uppercase">{unit.type.replace('_', ' ')}</div>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                    isDispatched
                      ? 'bg-orange-950 text-orange-400 border border-orange-800 animate-pulse'
                      : 'bg-[#18181B] text-[#71717A] border border-[#27272A]'
                  }`}
                >
                  {unit.status}
                </span>
              </div>

              <div className="text-[10px] font-mono text-[#71717A] flex items-center justify-between">
                <span>Sector: Zone {unit.assignedZone}</span>
                <span className="flex items-center gap-1 text-[#A1A1AA]">
                  <Clock className="w-2.5 h-2.5" />
                  ETA: {unit.etaMinutes}m
                </span>
              </div>

              {/* Action Button */}
              {!isDispatched ? (
                <button
                  id={`dispatch-${unit.id}-btn`}
                  onClick={() => onDispatchUnit(unit.id, 'ALPHA')}
                  className="w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Dispatch α</span>
                </button>
              ) : (
                <div className="w-full py-1.5 text-center bg-[#18181B] border border-[#27272A] text-green-400 text-[10px] font-mono font-bold uppercase rounded-lg flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span>Assigned</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
