import React from 'react';
import { 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  Zap, 
  ArrowUpRight,
  ArrowDownRight,
  Layers
} from 'lucide-react';
import { PredictionResult, ThreatLevel } from '../../types';

interface ExplainableAiPanelProps {
  prediction: PredictionResult;
  isDisasterActive: boolean;
}

export const ExplainableAiPanel: React.FC<ExplainableAiPanelProps> = ({
  prediction,
  isDisasterActive,
}) => {
  const getThreatBadge = (level: ThreatLevel) => {
    switch (level) {
      case 'EXTREME':
        return 'bg-red-600 text-white shadow-lg shadow-red-950/60 ring-1 ring-red-400 font-black';
      case 'CRITICAL':
        return 'bg-rose-600 text-white shadow-lg shadow-rose-950/60 font-black';
      case 'ELEVATED':
        return 'bg-orange-600 text-white font-bold';
      default:
        return 'bg-green-600 text-white font-bold';
    }
  };

  return (
    <div className="bg-[#18181B] rounded-2xl p-5 border border-[#27272A] shadow-xl flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-black text-purple-400 border border-[#27272A]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-widest">
              AI Predictive Inference & XAI
            </h3>
            <p className="text-sm font-extrabold text-white">
              Ensemble XGBoost + Spatio-Temporal LSTM (SHAP)
            </p>
          </div>
        </div>

        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-mono uppercase tracking-widest ${getThreatBadge(prediction.threatLevel)}`}>
          {prediction.threatLevel}
        </span>
      </div>

      {/* Probability Gauge & Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Threat Likelihood Score */}
        <div className="bg-black p-4 rounded-xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-xs text-[#71717A] font-mono uppercase tracking-wider flex items-center justify-between">
            <span>Threat Likelihood</span>
            <span className="text-[9px] text-purple-400 font-mono">94.8% Conf</span>
          </div>
          <div className="flex items-baseline gap-1.5 my-2">
            <span className={`text-3xl font-black font-mono ${
              prediction.probabilityScore > 75
                ? 'text-red-400'
                : prediction.probabilityScore > 40
                ? 'text-orange-400'
                : 'text-green-400'
            }`}>
              {prediction.probabilityScore.toFixed(0)}%
            </span>
            <span className="text-xs text-[#71717A] font-mono">calculated risk</span>
          </div>
          <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                prediction.probabilityScore > 75
                  ? 'bg-red-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${prediction.probabilityScore}%` }}
            />
          </div>
        </div>

        {/* Lead Warning Window */}
        <div className="bg-black p-4 rounded-xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-xs text-[#71717A] font-mono uppercase tracking-wider">Impact Lead Time</div>
          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-black font-mono text-orange-400">
              {isDisasterActive ? `${prediction.estimatedTimeToImpactMin}m` : 'Nominal'}
            </span>
            {isDisasterActive && <span className="text-xs text-[#71717A] font-mono">warning buffer</span>}
          </div>
          <div className="text-[10px] text-[#71717A] font-mono">
            {isDisasterActive ? 'Pre-shock P-Wave vector' : '24/7 continuous sweep'}
          </div>
        </div>

        {/* Affected Population In Concentric Geofence */}
        <div className="bg-black p-4 rounded-xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-xs text-[#71717A] font-mono uppercase tracking-wider">Geofenced Citizens</div>
          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-black font-mono text-white">
              {isDisasterActive ? prediction.affectedPopulation.toLocaleString() : '0'}
            </span>
            <span className="text-xs text-[#71717A] font-mono">in Zones α+β</span>
          </div>
          <div className="text-[10px] text-[#71717A] font-mono">
            Alpha: 5km direct | Beta: 10km hold
          </div>
        </div>

      </div>

      {/* SHAP Feature Attribution (Explainable AI Chart) */}
      <div className="bg-black p-4 rounded-xl border border-[#27272A]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#27272A]">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Top SHAP Feature Attributions
          </div>
          <span className="text-[9px] text-[#71717A] font-mono uppercase">Weight Attribution</span>
        </div>

        <div className="space-y-3">
          {prediction.xaiAttribution.map((feat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#E4E4E7] font-semibold flex items-center gap-1">
                  {feat.direction === 'increase' ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-400 inline" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-purple-400 inline" />
                  )}
                  {feat.feature}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-orange-400">
                    {feat.currentValue}
                  </span>
                  <span className="text-xs font-mono font-bold text-white w-9 text-right">
                    +{feat.impactPercent}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, feat.impactPercent * 2)}%` }}
                />
              </div>
              <div className="text-[10px] text-[#71717A] font-mono">
                {feat.description} (Baseline: {feat.baselineValue})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tactical Directive */}
      {isDisasterActive && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-300 uppercase tracking-wider font-mono text-[10px] mb-0.5">Automated NDMA Directive Enacted:</div>
            <div className="text-[#E4E4E7]">{prediction.recommendedAction}</div>
          </div>
        </div>
      )}

    </div>
  );
};
