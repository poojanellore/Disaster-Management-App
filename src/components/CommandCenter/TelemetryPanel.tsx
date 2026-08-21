import React from 'react';
import { 
  Activity, 
  Wind, 
  Flame, 
  Compass, 
  Gauge, 
  Thermometer, 
  Radio,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { SensorStation, TelemetryPoint } from '../../types';

interface TelemetryPanelProps {
  telemetryHistory: TelemetryPoint[];
  stations: SensorStation[];
  isDisasterActive: boolean;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  telemetryHistory,
  stations,
  isDisasterActive,
}) => {
  const latest = telemetryHistory[telemetryHistory.length - 1] || {
    seismic: 0.012,
    pressure: 1013.2,
    gas: 8.4,
    wind: 16.0,
    temp: 19.8,
    strain: 34.0,
  };

  // Helper to draw clean SVG sparkline
  const renderSparkline = (
    data: number[],
    color: string,
    minVal: number,
    maxVal: number
  ) => {
    if (data.length < 2) return null;
    const width = 120;
    const height = 32;
    const range = maxVal - minVal || 1;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const normalized = (val - minVal) / range;
        const y = height - normalized * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Glowing latest point */}
        {data.length > 0 && (
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - minVal) / range) * (height - 6) - 3}
            r="3"
            fill={color}
          />
        )}
      </svg>
    );
  };

  const seismicPoints = telemetryHistory.map((p) => p.seismic);
  const gasPoints = telemetryHistory.map((p) => p.gas);
  const pressurePoints = telemetryHistory.map((p) => p.pressure);
  const windPoints = telemetryHistory.map((p) => p.wind);
  const strainPoints = telemetryHistory.map((p) => p.strain);

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-black text-blue-400 border border-[#27272A]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-widest flex items-center gap-2">
              Environmental Telemetry Mesh
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </h3>
            <p className="text-sm font-extrabold text-white">
              5 High-Frequency In-Situ Sensor Observatories (1.5s Polling)
            </p>
          </div>
        </div>
        <div className="text-[10px] font-mono tracking-widest uppercase text-[#71717A] bg-black px-2.5 py-1 rounded-lg border border-[#27272A]">
          STATUS: <span className={isDisasterActive ? 'text-red-400 font-bold' : 'text-green-400'}>{isDisasterActive ? 'ANOMALOUS' : 'NOMINAL'}</span>
        </div>
      </div>

      {/* Grid of Telemetry Sensors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* 1. Seismic Acceleration */}
        <div className={`p-4 rounded-xl border transition-all ${
          latest.seismic > 0.1
            ? 'bg-black border-red-800 ring-1 ring-red-500/50'
            : 'bg-black/60 border-[#27272A]'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-[10px]">
              <Activity className="w-3.5 h-3.5 text-red-500" />
              Seismic Accel
            </span>
            <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
              latest.seismic > 0.1 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-[#27272A]/50 text-[#71717A]'
            }`}>
              {latest.seismic > 0.1 ? 'SPIKE' : 'NOMINAL'}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black font-mono text-red-400">
              {latest.seismic.toFixed(3)}{' '}
              <span className="text-xs text-[#71717A] font-normal">g</span>
            </div>
            {renderSparkline(seismicPoints, latest.seismic > 0.1 ? '#ef4444' : '#3b82f6', 0, 0.5)}
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-2 pt-1 border-t border-[#27272A]/60">
            Baseline: &lt; 0.03 g | Threshold: 0.15 g
          </div>
        </div>

        {/* 2. Gas / VOC / SO2 Concentration */}
        <div className={`p-4 rounded-xl border transition-all ${
          latest.gas > 40
            ? 'bg-black border-orange-800 ring-1 ring-orange-500/50'
            : 'bg-black/60 border-[#27272A]'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-[10px]">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Gas Flux (SO₂/VOC)
            </span>
            <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
              latest.gas > 40 ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'bg-[#27272A]/50 text-[#71717A]'
            }`}>
              {latest.gas > 40 ? 'ELEVATED' : 'SAFE'}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black font-mono text-orange-400">
              {latest.gas.toFixed(1)}{' '}
              <span className="text-xs text-[#71717A] font-normal">ppm</span>
            </div>
            {renderSparkline(gasPoints, latest.gas > 40 ? '#f59e0b' : '#3b82f6', 0, 200)}
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-2 pt-1 border-t border-[#27272A]/60">
            Deep Borehole SO₂ & Radon monitoring
          </div>
        </div>

        {/* 3. Barometric Pressure */}
        <div className={`p-4 rounded-xl border transition-all ${
          latest.pressure < 990
            ? 'bg-black border-blue-800 ring-1 ring-blue-500/50'
            : 'bg-black/60 border-[#27272A]'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-[10px]">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              Baro Pressure
            </span>
            <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
              latest.pressure < 990 ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-[#27272A]/50 text-[#71717A]'
            }`}>
              {latest.pressure < 990 ? 'LOW EYE' : 'STABLE'}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black font-mono text-blue-400">
              {latest.pressure.toFixed(0)}{' '}
              <span className="text-xs text-[#71717A] font-normal">hPa</span>
            </div>
            {renderSparkline(pressurePoints, latest.pressure < 990 ? '#60a5fa' : '#3b82f6', 930, 1025)}
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-2 pt-1 border-t border-[#27272A]/60">
            Standard: 1013.2 hPa | Δ drop: 15 hPa/h
          </div>
        </div>

        {/* 4. Wind Velocity & Gusts */}
        <div className={`p-4 rounded-xl border transition-all ${
          latest.wind > 50
            ? 'bg-black border-rose-800'
            : 'bg-black/60 border-[#27272A]'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-[10px]">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Wind Speed & Gusts
            </span>
            <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-[#27272A]/50 text-[#71717A]">
              {latest.wind > 50 ? 'GALE' : 'BREEZE'}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black font-mono text-cyan-400">
              {latest.wind.toFixed(0)}{' '}
              <span className="text-xs text-[#71717A] font-normal">km/h</span>
            </div>
            {renderSparkline(windPoints, latest.wind > 50 ? '#06b6d4' : '#3b82f6', 0, 180)}
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-2 pt-1 border-t border-[#27272A]/60">
            Anemometer vector: SSW 214°
          </div>
        </div>

        {/* 5. Tectonic Microstrain */}
        <div className={`p-4 rounded-xl border transition-all ${
          latest.strain > 120
            ? 'bg-black border-purple-800'
            : 'bg-black/60 border-[#27272A]'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-[10px]">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              Tectonic Strain
            </span>
            <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-[#27272A]/50 text-purple-400">
              {latest.strain > 120 ? 'DILATANCY' : 'ELASTIC'}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black font-mono text-purple-400">
              {latest.strain.toFixed(0)}{' '}
              <span className="text-xs text-[#71717A] font-normal">με</span>
            </div>
            {renderSparkline(strainPoints, latest.strain > 120 ? '#a855f7' : '#3b82f6', 0, 400)}
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-2 pt-1 border-t border-[#27272A]/60">
            Sub-surface laser strainmeter array
          </div>
        </div>

        {/* 6. Ground Thermal Temperature */}
        <div className="p-4 rounded-xl border bg-black/60 border-[#27272A]">
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-[10px]">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              Ground Thermal Node
            </span>
            <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-[#27272A]/50 text-[#71717A]">
              {latest.temp > 40 ? 'HEAT SPIKE' : 'NOMINAL'}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-black font-mono text-orange-300">
              {latest.temp.toFixed(1)}{' '}
              <span className="text-xs text-[#71717A] font-normal">°C</span>
            </div>
            <div className="text-[9px] text-[#71717A] font-mono text-right">
              MODIS IR Probe<br />Subsoil Sync
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-2 pt-1 border-t border-[#27272A]/60">
            Satellite MODIS + ground RTD probe sync
          </div>
        </div>

      </div>
    </div>
  );
};
