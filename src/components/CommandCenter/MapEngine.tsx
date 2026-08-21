import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  MapPin, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Truck, 
  Navigation2, 
  AlertOctagon,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  Coordinates, 
  DisasterType, 
  EvacuationRoute, 
  PredictionResult, 
  ResponderUnit, 
  SensorStation, 
  Shelter,
  GroundTruthReport 
} from '../../types';

interface MapEngineProps {
  prediction: PredictionResult;
  isDisasterActive: boolean;
  sensorStations: SensorStation[];
  shelters: Shelter[];
  responders: ResponderUnit[];
  groundReports: GroundTruthReport[];
  activeRoutes: EvacuationRoute[];
  selectedZone: 'ALPHA' | 'BETA' | 'GAMMA' | 'ALL';
  onSelectZone: (zone: 'ALPHA' | 'BETA' | 'GAMMA' | 'ALL') => void;
  onSelectShelter?: (shelter: Shelter) => void;
}

export const MapEngine: React.FC<MapEngineProps> = ({
  prediction,
  isDisasterActive,
  sensorStations,
  shelters,
  responders,
  groundReports,
  activeRoutes,
  selectedZone,
  onSelectZone,
  onSelectShelter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Layer Visibility States
  const [showZones, setShowZones] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showGroundReports, setShowGroundReports] = useState(true);

  // Center coordinates mapping
  const centerLat = 37.7749;
  const centerLng = -122.4194;

  // Convert GPS (Lat, Lng) to Container SVG Coordinates (0..800, 0..550)
  const projectCoords = (coords: Coordinates) => {
    const scale = 2200 * zoom;
    const x = 400 + (coords.lng - centerLng) * scale + pan.x;
    const y = 275 - (coords.lat - centerLat) * scale + pan.y;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedEntity(null);
  };

  const epicPos = projectCoords(prediction.epicenter);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] bg-[#09090B] rounded-2xl overflow-hidden border border-[#27272A] shadow-2xl flex flex-col">
      
      {/* Top Map Action HUD Bar */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none flex-wrap gap-2">
        
        {/* Zone Filter Buttons */}
        <div className="flex items-center gap-1 bg-black/90 backdrop-blur-md p-1 rounded-xl border border-[#27272A] pointer-events-auto shadow-lg">
          <button
            onClick={() => onSelectZone('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition ${
              selectedZone === 'ALL'
                ? 'bg-[#27272A] text-white shadow-sm'
                : 'text-[#71717A] hover:text-[#E4E4E7]'
            }`}
          >
            All Zones
          </button>
          <button
            onClick={() => onSelectZone('ALPHA')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
              selectedZone === 'ALPHA'
                ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                : 'text-red-400 hover:bg-red-950/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            Alpha (5km)
          </button>
          <button
            onClick={() => onSelectZone('BETA')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
              selectedZone === 'BETA'
                ? 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-400'
                : 'text-orange-400 hover:bg-amber-950/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Beta (10km)
          </button>
          <button
            onClick={() => onSelectZone('GAMMA')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
              selectedZone === 'GAMMA'
                ? 'bg-green-600 text-white shadow-sm ring-1 ring-green-400'
                : 'text-green-400 hover:bg-emerald-950/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Gamma (Safe)
          </button>
        </div>

        {/* Zoom & View Reset HUD Controls */}
        <div className="flex items-center gap-1 bg-black/90 backdrop-blur-md p-1 rounded-xl border border-[#27272A] pointer-events-auto shadow-lg">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="p-1.5 text-[#A1A1AA] hover:text-white hover:bg-[#27272A] rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.25))}
            className="p-1.5 text-[#A1A1AA] hover:text-white hover:bg-[#27272A] rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-[#A1A1AA] hover:text-white hover:bg-[#27272A] rounded-lg transition"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Tactical Canvas Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden bg-[#09090B]`}
      >
        <svg className="w-full h-full absolute inset-0">
          <defs>
            {/* Grid Pattern */}
            <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272A" strokeWidth="0.8" opacity="0.6" />
              <circle cx="0" cy="0" r="1" fill="#3F3F46" opacity="0.8" />
            </pattern>

            {/* Pulsing Hazard Glow Filter */}
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Animated Evacuation Route Dash Marker */}
            <linearGradient id="route-gradient-alpha" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="route-gradient-beta" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#tactical-grid)" />

          {/* Stylized Coastal & Topographic Terrain Lines */}
          <g opacity="0.25" stroke="#334155" strokeWidth="1.2" fill="none">
            <path d="M 50 100 Q 200 180 350 120 T 700 220" />
            <path d="M 120 450 Q 300 380 480 420 T 780 340" />
            <path d="M 0 300 C 180 260 220 180 400 240 S 680 300 800 260" strokeDasharray="4,4" />
          </g>

          {/* Simulated Fault Line / Hazard Rift */}
          {isDisasterActive && (
            <g opacity="0.6">
              <path
                d={`M ${epicPos.x - 180} ${epicPos.y - 80} L ${epicPos.x - 60} ${epicPos.y - 20} L ${epicPos.x + 40} ${epicPos.y + 30} L ${epicPos.x + 190} ${epicPos.y + 110}`}
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6,3"
                fill="none"
              />
              <text x={epicPos.x - 140} y={epicPos.y - 90} fill="#f87171" fontSize="10" fontFamily="monospace">
                ACTIVE SEISMIC FAULT LINE RIFT A-4
              </text>
            </g>
          )}

          {/* Staggered Geofenced Concentric Zones */}
          {showZones && isDisasterActive && (
            <g>
              {/* Zone Gamma - Safe Buffer (18km radius) */}
              {(selectedZone === 'ALL' || selectedZone === 'GAMMA') && (
                <g>
                  <circle
                    cx={epicPos.x}
                    cy={epicPos.y}
                    r={220 * zoom}
                    fill="#059669"
                    fillOpacity="0.06"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                  />
                  <text
                    x={epicPos.x + 145 * zoom}
                    y={epicPos.y - 145 * zoom}
                    fill="#34d399"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ZONE GAMMA (18km Safe Buffer)
                  </text>
                </g>
              )}

              {/* Zone Beta - Staged Holding Corridor (10km radius) */}
              {(selectedZone === 'ALL' || selectedZone === 'BETA') && (
                <g>
                  <circle
                    cx={epicPos.x}
                    cy={epicPos.y}
                    r={140 * zoom}
                    fill="#d97706"
                    fillOpacity="0.12"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={epicPos.x + 95 * zoom}
                    y={epicPos.y - 95 * zoom}
                    fill="#fbbf24"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ZONE BETA (10km Staged Hold)
                  </text>
                </g>
              )}

              {/* Zone Alpha - Direct Impact Immediate Evacuation (5km radius) */}
              {(selectedZone === 'ALL' || selectedZone === 'ALPHA') && (
                <g>
                  <circle
                    cx={epicPos.x}
                    cy={epicPos.y}
                    r={75 * zoom}
                    fill="#dc2626"
                    fillOpacity="0.22"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    filter="url(#glow-red)"
                  />
                  <circle
                    cx={epicPos.x}
                    cy={epicPos.y}
                    r={75 * zoom}
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="1"
                    className="animate-ping"
                    style={{ transformOrigin: `${epicPos.x}px ${epicPos.y}px` }}
                  />
                  <text
                    x={epicPos.x + 40 * zoom}
                    y={epicPos.y - 50 * zoom}
                    fill="#fca5a5"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ZONE ALPHA (5km Immediate Evac)
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Dijkstra Evacuation Corridors & Polylines */}
          {showRoutes && isDisasterActive && (
            <g>
              {activeRoutes.map((route, idx) => {
                const pointsStr = route.waypoints
                  .map((wp) => {
                    const p = projectCoords(wp);
                    return `${p.x},${p.y}`;
                  })
                  .join(' ');

                const isAlpha = route.zone === 'ALPHA';
                const gradientId = isAlpha ? 'url(#route-gradient-alpha)' : 'url(#route-gradient-beta)';

                return (
                  <g key={route.id || idx}>
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={gradientId}
                      strokeWidth={isAlpha ? "3.5" : "2.5"}
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all"
                    />
                    {/* Intermediate Waypoint Nodes */}
                    {route.waypoints.map((wp, wIdx) => {
                      const wpPos = projectCoords(wp);
                      if (wp.isShelter) return null;
                      return (
                        <circle
                          key={wIdx}
                          cx={wpPos.x}
                          cy={wpPos.y}
                          r={3.5}
                          fill={isAlpha ? '#22c55e' : '#f59e0b'}
                          stroke="#0f172a"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}

          {/* Active Epicenter Hazard Beacon */}
          {isDisasterActive && (
            <g
              transform={`translate(${epicPos.x}, ${epicPos.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedEntity({ type: 'EPICENTER', data: prediction })}
            >
              <circle r="18" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
              <circle r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
              <Flame className="w-4 h-4 text-white -translate-x-2 -translate-y-2" />
            </g>
          )}

          {/* IoT Sensor Station Markers */}
          {showSensors &&
            sensorStations.map((station) => {
              const pos = projectCoords(station.location);
              const isAlert = station.status === 'CRITICAL';
              return (
                <g
                  key={station.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedEntity({ type: 'SENSOR', data: station })}
                >
                  <circle
                    r="6"
                    fill={isAlert ? '#ef4444' : '#38bdf8'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  {isAlert && (
                    <circle r="12" fill="none" stroke="#f87171" strokeWidth="1" className="animate-ping" />
                  )}
                  <text
                    x="9"
                    y="3"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {station.name.split(' ')[0]} ({station.readings.seismicAccelG.toFixed(2)}g)
                  </text>
                </g>
              );
            })}

          {/* Shelters */}
          {showShelters &&
            shelters.map((shelter) => {
              const pos = projectCoords(shelter.location);
              const occupancyRatio = shelter.capacityOccupied / shelter.capacityTotal;
              const isNearFull = occupancyRatio > 0.85;

              return (
                <g
                  key={shelter.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedEntity({ type: 'SHELTER', data: shelter });
                    if (onSelectShelter) onSelectShelter(shelter);
                  }}
                >
                  {/* Outer Ring */}
                  <circle
                    r="10"
                    fill="#0f172a"
                    stroke={isNearFull ? '#f59e0b' : '#10b981'}
                    strokeWidth="2.5"
                  />
                  <circle
                    r="5"
                    fill={isNearFull ? '#f59e0b' : '#10b981'}
                  />
                  <text
                    x="14"
                    y="4"
                    fill="#e2e8f0"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    className="drop-shadow"
                  >
                    {shelter.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

          {/* Emergency Responders */}
          {showResponders &&
            responders.map((resp) => {
              const pos = projectCoords(resp.location);
              return (
                <g
                  key={resp.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedEntity({ type: 'RESPONDER', data: resp })}
                >
                  <rect
                    x="-6"
                    y="-6"
                    width="12"
                    height="12"
                    rx="3"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="10"
                    y="3"
                    fill="#93c5fd"
                    fontSize="9"
                    fontFamily="monospace"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {resp.callsign} ({resp.status})
                  </text>
                </g>
              );
            })}

          {/* Crowdsourced Ground Truth Reports */}
          {showGroundReports &&
            groundReports.map((rpt) => {
              const pos = projectCoords(rpt.location);
              return (
                <g
                  key={rpt.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedEntity({ type: 'REPORT', data: rpt })}
                >
                  <polygon
                    points="0,-8 7,5 -7,5"
                    fill="#f59e0b"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
        </svg>

        {/* Selected Entity Mini Inspector Drawer */}
        {selectedEntity && (
          <div className="absolute bottom-3.5 left-3.5 bg-[#18181B]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#27272A] text-[#E4E4E7] text-xs max-w-xs shadow-2xl z-30">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#27272A]">
              <div className="font-bold uppercase tracking-widest text-red-400 font-mono text-[10px]">
                {selectedEntity.type} INSPECTOR
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-[#71717A] hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {selectedEntity.type === 'SHELTER' && (
              <div>
                <div className="font-bold text-white text-sm mb-1">{selectedEntity.data.name}</div>
                <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                  <span className="text-[#71717A]">Occupancy:</span>
                  <span className="font-bold text-white">
                    {selectedEntity.data.capacityOccupied} / {selectedEntity.data.capacityTotal}
                  </span>
                </div>
                <div className="w-full bg-black h-1.5 rounded-full overflow-hidden mb-2 border border-[#27272A]">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{
                      width: `${(selectedEntity.data.capacityOccupied / selectedEntity.data.capacityTotal) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] text-[#71717A] font-mono">
                  Medical: {selectedEntity.data.medicalSupport ? 'Available' : 'None'} | Supplies: {selectedEntity.data.suppliesStatus}
                </div>
              </div>
            )}

            {selectedEntity.type === 'SENSOR' && (
              <div>
                <div className="font-bold text-white mb-1">{selectedEntity.data.name}</div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <div className="bg-black/60 p-1.5 rounded border border-[#27272A]">Seismic: {selectedEntity.data.readings.seismicAccelG.toFixed(3)} g</div>
                  <div className="bg-black/60 p-1.5 rounded border border-[#27272A]">Gas: {selectedEntity.data.readings.gasConcentrationPpm.toFixed(1)} ppm</div>
                  <div className="bg-black/60 p-1.5 rounded border border-[#27272A]">Baro: {selectedEntity.data.readings.barometricHpa.toFixed(0)} hPa</div>
                  <div className="bg-black/60 p-1.5 rounded border border-[#27272A]">Wind: {selectedEntity.data.readings.windSpeedKmh.toFixed(0)} km/h</div>
                </div>
              </div>
            )}

            {selectedEntity.type === 'RESPONDER' && (
              <div>
                <div className="font-bold text-white mb-0.5">{selectedEntity.data.callsign}</div>
                <div className="text-[#71717A] text-[11px] mb-1 font-mono">Role: {selectedEntity.data.type}</div>
                <div className="text-green-400 font-mono text-[10px]">
                  Status: {selectedEntity.data.status} | ETA: {selectedEntity.data.etaMinutes} min
                </div>
              </div>
            )}

            {selectedEntity.type === 'REPORT' && (
              <div>
                <div className="font-bold text-orange-400 mb-0.5">Hazard Report: {selectedEntity.data.type}</div>
                <div className="text-[#E4E4E7] text-[11px] mb-1">{selectedEntity.data.description}</div>
                <div className="text-[10px] text-[#71717A] font-mono">Landmark: {selectedEntity.data.location.landmark}</div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Layer Toggle Pills */}
        <div className="absolute bottom-3.5 right-3.5 bg-black/90 backdrop-blur-md p-1.5 rounded-xl border border-[#27272A] flex items-center gap-1.5 text-[11px] text-[#E4E4E7] z-20 flex-wrap">
          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition ${
              showZones ? 'bg-red-950/80 text-red-300 border border-red-800' : 'text-[#71717A]'
            }`}
          >
            Zones
          </button>
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition ${
              showRoutes ? 'bg-green-950/80 text-green-300 border border-green-800' : 'text-[#71717A]'
            }`}
          >
            Corridors
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition ${
              showShelters ? 'bg-blue-950/80 text-blue-300 border border-blue-800' : 'text-[#71717A]'
            }`}
          >
            Shelters
          </button>
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition ${
              showSensors ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' : 'text-[#71717A]'
            }`}
          >
            Sensors
          </button>
          <button
            onClick={() => setShowResponders(!showResponders)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition ${
              showResponders ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800' : 'text-[#71717A]'
            }`}
          >
            Responders
          </button>
        </div>

      </div>
    </div>
  );
};
