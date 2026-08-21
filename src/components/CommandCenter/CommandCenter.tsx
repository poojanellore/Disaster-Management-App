import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Layers, 
  Flame, 
  Building2, 
  Truck, 
  Cpu, 
  Radio, 
  Clock, 
  Activity, 
  AlertTriangle,
  PlayCircle
} from 'lucide-react';
import { 
  DisasterType, 
  EvacuationRoute, 
  PredictionResult, 
  ResponderUnit, 
  SensorStation, 
  Shelter, 
  TelemetryPoint,
  GroundTruthReport,
  EvacuationZoneType
} from '../../types';
import { MapEngine } from './MapEngine';
import { TelemetryPanel } from './TelemetryPanel';
import { ExplainableAiPanel } from './ExplainableAiPanel';
import { ShelterManager } from './ShelterManager';
import { ResponderDispatch } from './ResponderDispatch';
import { AiIncidentCommander } from './AiIncidentCommander';

interface CommandCenterProps {
  prediction: PredictionResult;
  isDisasterActive: boolean;
  disasterType: DisasterType;
  sensorStations: SensorStation[];
  telemetryHistory: TelemetryPoint[];
  shelters: Shelter[];
  responders: ResponderUnit[];
  groundReports: GroundTruthReport[];
  activeRoutes: EvacuationRoute[];
  onDispatchUnit: (unitId: string, targetZone: EvacuationZoneType) => void;
  onBroadcastAlert: (channels: string[]) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  prediction,
  isDisasterActive,
  disasterType,
  sensorStations,
  telemetryHistory,
  shelters,
  responders,
  groundReports,
  activeRoutes,
  onDispatchUnit,
  onBroadcastAlert,
}) => {
  const [selectedZone, setSelectedZone] = useState<'ALPHA' | 'BETA' | 'GAMMA' | 'ALL'>('ALL');
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  return (
    <div className="w-full space-y-4">
      
      {/* Top Banner Alert (If Disaster Active) */}
      {isDisasterActive && (
        <div className="bg-[#18181B] border border-red-900/80 rounded-2xl p-4 sm:p-5 text-[#E4E4E7] shadow-2xl flex items-center justify-between gap-4 flex-wrap relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-950/60 font-black animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/80 font-bold">
                  LEVEL 4 EMERGENCY ALERT
                </span>
                <span className="text-[11px] font-mono text-orange-400 font-bold">
                  EST. LEAD TIME: {prediction.estimatedTimeToImpactMin} MIN
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black uppercase tracking-tight text-white mt-0.5">
                {prediction.magnitudeOrSeverity}
              </h2>
              <p className="text-xs text-[#71717A] font-mono">
                Epicenter: {prediction.epicenter.name} // Staggered Evacuation Protocol Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="text-right hidden sm:block bg-black/60 px-3.5 py-2 rounded-xl border border-[#27272A]">
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#71717A]">Zone Alpha Status:</div>
              <div className="text-sm font-mono font-black text-green-400">
                94% Clearance (No Jams)
              </div>
            </div>
            <div className="text-right hidden sm:block bg-black/60 px-3.5 py-2 rounded-xl border border-[#27272A]">
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#71717A]">Zone Beta Hold:</div>
              <div className="text-sm font-mono font-black text-orange-400">
                11:45 Stagger Timer
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Tactical Map & AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Interactive Map (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <MapEngine
            prediction={prediction}
            isDisasterActive={isDisasterActive}
            sensorStations={sensorStations}
            shelters={shelters}
            responders={responders}
            groundReports={groundReports}
            activeRoutes={activeRoutes}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            onSelectShelter={setSelectedShelter}
          />

          {/* Environmental Telemetry Mesh Panel */}
          <TelemetryPanel
            telemetryHistory={telemetryHistory}
            stations={sensorStations}
            isDisasterActive={isDisasterActive}
          />
        </div>

        {/* Right Column: AI Inference & Operational Panels (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Explainable AI Threat Assessment */}
          <ExplainableAiPanel
            prediction={prediction}
            isDisasterActive={isDisasterActive}
          />

          {/* AI Incident Commander Directive & Broadcast */}
          <AiIncidentCommander
            prediction={prediction}
            isDisasterActive={isDisasterActive}
            onBroadcastAlert={onBroadcastAlert}
          />

          {/* Shelter Capacity Management */}
          <ShelterManager
            shelters={shelters}
            onSelectShelter={setSelectedShelter}
          />

          {/* Responder Dispatch */}
          <ResponderDispatch
            responders={responders}
            onDispatchUnit={onDispatchUnit}
          />

        </div>

      </div>

    </div>
  );
};
