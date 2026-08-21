import React, { useState } from 'react';
import { 
  Sparkles, 
  Radio, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  MessageSquare, 
  FileText,
  Volume2
} from 'lucide-react';
import { PredictionResult } from '../../types';

interface AiIncidentCommanderProps {
  prediction: PredictionResult;
  isDisasterActive: boolean;
  onBroadcastAlert: (channels: string[]) => void;
}

export const AiIncidentCommander: React.FC<AiIncidentCommanderProps> = ({
  prediction,
  isDisasterActive,
  onBroadcastAlert,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'APP_PUSH',
    'SMS_GATEWAY',
    'CELL_BROADCAST',
    'SIREN_SYSTEM',
  ]);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const generateAiBriefing = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disasterType: prediction.disasterType,
          severity: prediction.magnitudeOrSeverity,
          threatLevel: prediction.threatLevel,
          leadTimeMinutes: prediction.estimatedTimeToImpactMin,
          affectedPopulation: prediction.affectedPopulation,
        }),
      });
      const data = await res.json();
      if (data.advisory) {
        setAiReport(data.advisory);
      }
    } catch (e) {
      console.warn('Fallback local advisory:', e);
      setAiReport(
        `NDMA TACTICAL DIRECTIVE: Imminent ${prediction.disasterType.toUpperCase()} (${prediction.magnitudeOrSeverity}) detected. Priority 5km Zone Alpha evacuation active via Western Corridor. Hold Zone Beta 10km traffic buffer for 12 minutes to keep key arteries free from gridlock.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = () => {
    onBroadcastAlert(selectedChannels);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const toggleChannel = (ch: string) => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] shadow-xl flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-black text-purple-400 border border-[#27272A]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-widest">
              AI Incident Commander
            </h3>
            <p className="text-sm font-extrabold text-white">
              Automated NDMA Directives & Multi-Channel Alerting
            </p>
          </div>
        </div>

        <button
          id="generate-ai-brief-btn"
          onClick={generateAiBriefing}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synthesizing...' : 'Generate Directive'}</span>
        </button>
      </div>

      {/* AI Advisory Content Box */}
      <div className="bg-black p-4 rounded-xl border border-[#27272A] text-xs text-[#E4E4E7]">
        {aiReport ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-purple-400 font-bold text-[11px] pb-2 border-b border-[#27272A] font-mono">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                NDMA Tactical Incident Briefing
              </span>
              <span className="text-[10px] text-[#71717A]">Gemini 2.5 Flash</span>
            </div>
            <p className="text-[#E4E4E7] leading-relaxed whitespace-pre-line font-mono text-[11px]">{aiReport}</p>
          </div>
        ) : (
          <div className="text-[#71717A] py-1 flex items-center justify-between font-mono text-[11px]">
            <span>
              {isDisasterActive
                ? `Active ${prediction.disasterType} simulation detected. Click "Generate Directive" for tactical response protocol.`
                : 'IoT Mesh nominal. Incident Commander ready on standby.'}
            </span>
          </div>
        )}
      </div>

      {/* Multi-Channel Broadcast Selector */}
      <div className="bg-black p-4 rounded-xl border border-[#27272A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717A] mr-1">Channels:</span>
          {[
            { id: 'APP_PUSH', label: 'App Push' },
            { id: 'SMS_GATEWAY', label: 'SMS Gateway' },
            { id: 'CELL_BROADCAST', label: 'Cell-Broadcast' },
            { id: 'SIREN_SYSTEM', label: 'Siren Grid' },
          ].map((ch) => {
            const isChecked = selectedChannels.includes(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => toggleChannel(ch.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition border ${
                  isChecked
                    ? 'bg-purple-950 text-purple-300 border-purple-800'
                    : 'bg-[#18181B] text-[#71717A] border-[#27272A]'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {ch.label}
              </button>
            );
          })}
        </div>

        <button
          id="broadcast-alert-now-btn"
          onClick={handleSendBroadcast}
          disabled={!isDisasterActive}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md whitespace-nowrap ${
            broadcastSent
              ? 'bg-green-600 text-white'
              : isDisasterActive
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
              : 'bg-[#27272A] text-[#71717A] cursor-not-allowed'
          }`}
        >
          {broadcastSent ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Broadcast Dispatched (52k Recvd)</span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5" />
              <span>Transmit Alert</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
